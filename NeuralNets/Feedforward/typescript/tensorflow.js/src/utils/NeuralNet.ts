import * as tf from "@tensorflow/tfjs";

export class NeuralNet {
  NPL: number[];
  layers: number;
  learningRate: number;
  activations: tf.Tensor[];
  weights: tf.Tensor[];
  weightDerivatives: tf.Tensor[];
  biases: tf.Tensor[];
  biasDerivatives: tf.Tensor[];

  constructor(NPL: number[], learningRate: number = 0.01) {
    this.NPL = NPL;
    this.layers = NPL.length;
    this.learningRate = learningRate;
    this.activations = [];
    this.weights = [];
    this.weightDerivatives = [];
    this.biases = [];
    this.biasDerivatives = [];

    for (let currLayer = 0; currLayer < this.layers - 1; currLayer++) {
      this.activations.push(tf.zeros([this.NPL[currLayer]]));
      this.weights.push(
        tf.randomUniform(
          [this.NPL[currLayer], this.NPL[currLayer + 1]],
          -0.3,
          0.3
        )
      );
      this.weightDerivatives.push(
        tf.zeros([this.NPL[currLayer], this.NPL[currLayer + 1]])
      );
      this.biases.push(tf.zeros([this.NPL[currLayer + 1]]));
      this.biasDerivatives.push(tf.zeros([this.NPL[currLayer + 1]]));
    }

    this.activations.push(tf.zeros([this.NPL[this.layers - 1]]));
  }

  train(X: tf.Tensor[], Y: tf.Tensor[], epochs: number): void {
    const trainingData: [tf.Tensor, tf.Tensor][] = X.map((value, index) => [
      value,
      Y[index],
    ]);
    for (let epoch = 0; epoch < epochs; epoch++) {
      let meanLoss: number = 0;
      for (let [trainingInput, expectedOutput] of trainingData) {
        this.activations[0] = trainingInput;

        this.forwardprop();
        this.backprop(expectedOutput);
        this.updateNetwork();

        meanLoss += this.calculateLoss(expectedOutput);
      }

      meanLoss /= X.length;
      console.log(`Epoch[${epoch}]: Loss = ${meanLoss}`);
    }
  }

  forwardprop(): void {
    for (let currLayer = 0; currLayer < this.layers - 1; currLayer++) {
      this.activations[currLayer + 1] = tf.sigmoid(
        tf.add(
          tf.dot(this.activations[currLayer], this.weights[currLayer]),
          this.biases[currLayer]
        )
      );
    }
  }

  backprop(expectedOutput: tf.Tensor): void {
    let error: tf.Tensor = tf.sub(
      expectedOutput,
      this.activations[this.layers - 1]
    );

    for (let currLayer = this.layers - 1; currLayer > 0; currLayer--) {
      let delta: tf.Tensor = tf.mul(
        error,
        tf.mul(
          this.activations[currLayer],
          tf.sub(1, this.activations[currLayer])
        )
      );

      this.weightDerivatives[currLayer - 1] = tf.outerProduct(
        this.activations[currLayer - 1] as tf.Tensor1D,
        delta as tf.Tensor1D
      );
      this.biasDerivatives[currLayer - 1] = delta;

      error = tf.dot(delta, tf.transpose(this.weights[currLayer - 1]));
    }
  }

  updateNetwork(): void {
    for (let currLayer = 0; currLayer < this.layers - 1; currLayer++) {
      this.weights[currLayer] = tf.add(
        this.weights[currLayer],
        tf.mul(this.weightDerivatives[currLayer], this.learningRate)
      );

      this.biases[currLayer] = tf.add(
        this.biases[currLayer],
        tf.mul(this.biasDerivatives[currLayer], this.learningRate)
      );
    }
  }

  calculateLoss(expectedOutput: tf.Tensor): number {
    return tf.mean(
      tf.pow(tf.sub(expectedOutput, this.activations[this.layers - 1]), 2)
    ) as unknown as number;
  }
}

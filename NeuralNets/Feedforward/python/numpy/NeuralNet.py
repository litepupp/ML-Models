import numpy as np
import numpy.typing


class NeuralNet:
    def __init__(
        self,
        NPL: list[int],
        learning_rate: float = 0.01,
        activation_function: str = "sigmoid",
    ) -> None:
        if not NPL:
            return

        if activation_function == "sigmoid":
            self.activation_function = lambda x: 1.0 / (1.0 + np.exp(-x))
        elif activation_function == "relu":
            self.activation_function = lambda x: x if x > 0.0 else 0.0

        self.NPL: list[int] = NPL
        self.layers: int = len(self.NPL)
        self.learning_rate: float = learning_rate
        self.activations: list[numpy.typing.NDArray[np.float32]] = []
        self.weights: list[numpy.typing.NDArray[np.float32]] = []
        self.weight_derivatives: list[numpy.typing.NDArray[np.float32]] = []
        self.biases: list[numpy.typing.NDArray[np.float32]] = []
        self.bias_derivatives: list[numpy.typing.NDArray[np.float32]] = []

        for layer in range(self.layers - 1):
            self.activations.append(np.zeros(self.NPL[layer], dtype=np.float32))
            self.biases.append(np.zeros(self.NPL[layer + 1], dtype=np.float32))
            self.bias_derivatives.append(
                np.zeros(self.NPL[layer + 1], dtype=np.float32)
            )
            self.weights.append(
                np.random.uniform(
                    low=-0.3, high=0.3, size=(self.NPL[layer], self.NPL[layer + 1])
                ).astype(np.float32)
            )
            self.weight_derivatives.append(
                np.zeros((self.NPL[layer], self.NPL[layer + 1])).astype(np.float32)
            )

        self.activations.append(np.zeros(self.NPL[-1], dtype=np.float32))

    def train(
        self,
        X: numpy.typing.NDArray[np.float32],
        Y: numpy.typing.NDArray[np.float32],
        epochs: int,
    ) -> None:
        for epoch in range(epochs):
            mean_loss: float = 0.0
            for training_input, expected_output in zip(X, Y):
                self.activations[0] = training_input

                self.forward_prop()
                self.backpropagation(expected_output)

                self.update_network()
                mean_loss += self.calculate_loss(expected_output)

            mean_loss /= len(X)
            print(f"Epoch[{epoch}]: Loss = {mean_loss}")

    def forward_prop(self) -> None:
        for layer in range(self.layers - 1):
            self.activations[layer + 1] = self.activation_function(
                (self.activations[layer] @ self.weights[layer]) + self.biases[layer]
            )

    def backpropagation(self, expected: numpy.typing.NDArray[np.float32]) -> None:
        error: numpy.typing.NDArray[np.float32] = expected - self.activations[-1]

        for layer in range(self.layers - 1, 0, -1):
            delta: numpy.typing.NDArray[np.float32] = error * (
                self.activations[layer] * (1 - self.activations[layer])
            )

            self.weight_derivatives[layer - 1] = np.outer(
                self.activations[layer - 1], delta
            )
            self.bias_derivatives[layer - 1] = delta

            error = delta @ self.weights[layer - 1].T

    def update_network(self) -> None:
        for layer in range(self.layers - 1):
            self.weights[layer] += self.weight_derivatives[layer] * self.learning_rate
            self.biases[layer] += self.bias_derivatives[layer] * self.learning_rate

    def calculate_loss(self, expected: numpy.typing.NDArray[np.float32]) -> float:
        return np.mean((expected - self.activations[-1]) ** 2, dtype=float)

import { useEffect, useState } from "react";
import { DrawCanvas } from "./components/DrawCanvas/DrawCanvas";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [prediction, setPrediction] = useState();
  const [model, setModel] = useState<tf.LayersModel>();

  useEffect(() => {
    tf.loadLayersModel(process.env.PUBLIC_URL + "/models/model.json", {
      strict: true,
    }).then((value) => setModel(value));
  }, []);

  const handleOnSubmit = async (imageData: ImageData) => {
    const pixelData = [];
    for (let i = 3; i < imageData.data.length; i += 4) {
      pixelData.push(imageData.data[i] / 255);
    }
    const input: tf.Tensor1D = tf.tensor1d(pixelData).reshape([1, 784]);

    if (model === undefined) return;

    const modelPrediction: any = model.predict(input);
    console.log(modelPrediction.dataSync());
    setPrediction(modelPrediction);
  };

  return (
    <>
      <DrawCanvas onSubmit={handleOnSubmit} />
      <code>{prediction}</code>
    </>
  );
}

export default App;

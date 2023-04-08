import { useEffect, useState } from "react";
import { DrawCanvas } from "./components/DrawCanvas/DrawCanvas";
import * as tf from "@tensorflow/tfjs";
import "./model/model.json";

function App() {
  const [prediction, setPrediction] = useState<number[]>();
  const [model, setModel] = useState<tf.LayersModel>();

  useEffect(() => {
    setPrediction([]);
    tf.loadLayersModel("/oofdd").then((value) => setModel(value));
  }, []);

  const handleOnSubmit = async (imageData: ImageData) => {
    const pixelData = [];
    for (let i = 3; i < imageData.data.length; i += 4) {
      pixelData.push(imageData.data[i] / 255);
    }
    const input: tf.Tensor1D = tf.tensor1d(pixelData);

    if (model === undefined) return;

    const modelPrediction = model.predict(input);
    console.log(modelPrediction);

    setPrediction([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  return (
    <>
      <DrawCanvas onSubmit={handleOnSubmit} />
      <code>{prediction}</code>
    </>
  );
}

export default App;

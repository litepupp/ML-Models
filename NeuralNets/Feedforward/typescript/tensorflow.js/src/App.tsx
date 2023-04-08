import { useEffect, useState } from "react";
import { DrawCanvas } from "./components/DrawCanvas/DrawCanvas";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [prediction, setPrediction] = useState<number[]>();
  const [model, setModel] = useState<tf.LayersModel>();

  useEffect(() => {
    setPrediction([]);
    tf.loadLayersModel(process.env.PUBLIC_URL + "/models/model.json", {
      strict: true,
    }).then((value) => setModel(value));
  }, []);

  const handleOnSubmit = async (imageData: ImageData) => {
    const pixelData = [];
    for (let i = 3; i < imageData.data.length; i += 4) {
      pixelData.push(imageData.data[i] / 255);
    }
    const input: tf.Tensor1D = tf.tensor1d(pixelData);

    console.log(process.env.PUBLIC_URL);
    setPrediction([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    if (model === undefined) return;

    const modelPrediction = model.predict(input);
    console.log(modelPrediction);
  };

  return (
    <>
      <DrawCanvas onSubmit={handleOnSubmit} />
      <code>{prediction}</code>
    </>
  );
}

export default App;

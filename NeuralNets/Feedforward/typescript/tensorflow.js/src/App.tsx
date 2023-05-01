import { useEffect, useState } from "react";
import { DrawCanvas } from "./components/DrawCanvas/DrawCanvas";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [model, setModel] = useState<tf.LayersModel>();

  useEffect(() => {
    tf.loadLayersModel(process.env.PUBLIC_URL + "/models/model.json", {
      strict: true,
    }).then((value) => setModel(value));
  }, []);

  const handleOnSubmit = (imageData: ImageData) => {
    let pixelData = [];
    for (let i = 3; i < imageData.data.length; i += 4) {
      pixelData.push(imageData.data[i] / 255);
    }
    let input: tf.Tensor1D = tf.tensor1d(pixelData).reshape([1, 784]);

    console.log(input.dataSync());

    if (model === undefined) return;

    console.log(model.predict(input).dataSync());
  };

  return (
    <>
      <DrawCanvas onSubmit={handleOnSubmit} />
    </>
  );
}

export default App;

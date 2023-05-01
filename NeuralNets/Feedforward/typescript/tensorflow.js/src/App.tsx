import { useState } from "react";
import { DrawCanvas } from "./components/DrawCanvas/DrawCanvas";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [predictions, setPredictions] = useState<
    { name: number; value: number }[]
  >([]);

  const handleOnSubmit = async (imageData: ImageData) => {
    let model = await tf.loadLayersModel(
      process.env.PUBLIC_URL + "/models/model.json",
      {
        strict: true,
      }
    );

    let pixelData = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      pixelData.push(Math.abs(imageData.data[i] / 255 - 1));
    }
    let input: tf.Tensor1D = tf.tensor1d(pixelData).reshape([1, 784]);

    setPredictions(
      Array.from(
        (model.predict(input) as tf.Tensor).dataSync(),
        (value, index) => ({ name: index, value: value })
      )
    );
  };

  return (
    <>
      <DrawCanvas onSubmit={handleOnSubmit} />
      <LineChart
        width={600}
        height={300}
        data={predictions}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
}

export default App;

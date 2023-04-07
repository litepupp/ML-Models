import { DrawCanvas } from "./components/DrawCanvas/DrawCanvas";
import { NeuralNet } from "./utils/NeuralNet";
import * as tf from "@tensorflow/tfjs";

function App() {
  const handleOnSubmit = (imageData: ImageData) => {};

  return <DrawCanvas onSubmit={handleOnSubmit} />;
}

export default App;

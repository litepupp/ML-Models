import { useRef } from "react";
import { DrawCanvas } from "./components/DrawCanvas/DrawCanvas";
import * as tf from "@tensorflow/tfjs";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleOnSubmit = (imageData: ImageData) => {
    const tempImage: tf.Tensor3D = tf.div(
      tf.image.resizeBilinear(tf.browser.fromPixels(imageData, 4), [28, 28]),
      255
    );

    if (canvasRef.current !== null) {
      tf.browser.toPixels(tempImage, canvasRef.current);
    }

    const imageBuffer = tempImage.dataSync();
    const tempPixels: number[] = [];
    for (let i = 3; i < imageBuffer.length; i += 4) {
      tempPixels.push(imageBuffer[i]);
    }

    const drawnImage: tf.Tensor1D = tf.tensor(tempPixels);

    console.log(drawnImage.dataSync());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const context = canvas.getContext("2d");
      if (context !== null) {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <>
      <DrawCanvas onSubmit={handleOnSubmit} onClear={clearCanvas} />
      28 x 28 preview
      <br />
      <canvas
        width={28}
        height={28}
        ref={canvasRef}
        style={{
          border: "1px solid black",
          imageRendering: "pixelated",
          width: "500px",
          height: "500px",
        }}
      />
    </>
  );
}

export default App;

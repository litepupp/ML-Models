import { useEffect, useRef, useState, ChangeEvent, PointerEvent } from "react";

interface Props {
  onSubmit: (imageData: ImageData) => any;
}

const DrawCanvas = (props: Props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lineWidth, setLineWidth] = useState<number>(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      canvas.width = 500;
      canvas.height = 500;

      const context = canvas.getContext("2d");
      if (context !== null) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = ({ nativeEvent }: PointerEvent) => {
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const drawLine = ({ nativeEvent }: PointerEvent) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
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

  const handleWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLineWidth(Number(event.target.value));
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const context = canvas.getContext("2d");
      if (context !== null) {
        context.lineWidth = lineWidth;
      }
    }
  };

  const handleSubmitCallback = () => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const context = canvas.getContext("2d");
      if (context !== null) {
        props.onSubmit(context.getImageData(0, 0, canvas.width, canvas.height));
      }
    }
  };

  return (
    <div>
      <canvas
        style={{ border: "1px solid black", touchAction: "none" }}
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={drawLine}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
      />
      <br />
      <input type="reset" onClick={clearCanvas} />
      <input type="submit" onClick={handleSubmitCallback} />
      <br />
      <label>
        Line Width
        <input
          type="range"
          value={lineWidth}
          min={1}
          max={10}
          step={1}
          onChange={handleWidthChange}
        />
        {lineWidth} px
      </label>
    </div>
  );
};

export default DrawCanvas;

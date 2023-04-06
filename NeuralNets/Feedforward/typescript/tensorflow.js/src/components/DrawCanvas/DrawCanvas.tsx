import { useEffect, useRef, useState, MouseEvent, ChangeEvent } from "react";

const DrawCanvas = () => {
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
        context.lineWidth = lineWidth;
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = ({ nativeEvent }: MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const drawLine = ({ nativeEvent }: MouseEvent) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = ({ nativeEvent }: MouseEvent) => {
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

  return (
    <div>
      <canvas
        className="canvas-container"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={drawLine}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <br />
      <input type="reset" onClick={clearCanvas} />
      <br />
      <label>
        Set Line Width
        <input
          type="range"
          value={lineWidth}
          min={1}
          max={10}
          step={1}
          onChange={handleWidthChange}
        />
      </label>
    </div>
  );
};

export default DrawCanvas;

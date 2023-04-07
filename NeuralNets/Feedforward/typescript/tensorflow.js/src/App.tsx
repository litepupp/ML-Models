import DrawCanvas from "./components/DrawCanvas/DrawCanvas";
import predict from "./utils/predict";

function App() {
  const handleOnSubmit = (imageData: ImageData) => {
    const cleanedImage: number[] = Array.from(
      imageData.data.map((value) => {
        return value / 255;
      })
    );

    console.log(cleanedImage);
    console.log(predict());
  };

  return <DrawCanvas onSubmit={handleOnSubmit} />;
}

export default App;

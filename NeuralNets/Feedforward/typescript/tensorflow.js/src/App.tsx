import DrawCanvas from "./components/DrawCanvas/DrawCanvas";

function App() {
  const handleOnSubmit = (imageData: ImageData) => {
    const cleanedImage: number[] = Array.from(
      imageData.data.map((value) => {
        return value / 255;
      })
    );

    console.log(cleanedImage);
  };

  return <DrawCanvas onSubmit={handleOnSubmit} />;
}

export default App;

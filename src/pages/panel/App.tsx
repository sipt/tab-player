function App() {
  return (
    <button
      onClick={() => {
        window.postMessage("clicked");
      }}
    >
      Test Button
    </button>
  );
}

export default App;

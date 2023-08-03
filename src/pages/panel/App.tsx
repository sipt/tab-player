import { useEffect } from "react";

function App() {
  let port: MessagePort | null;

  useEffect(() => {
    window.addEventListener("message", (event) => {
      console.log(event);
      port = event.ports?.[0];
    });
  }, []);

  return (
    <div
      className="search-container w-full h-full flex flex-col backdrop-blur-sm"
      style={{ backgroundColor: "#0f172acc" }}
    >
      <div className="max-w-[48rem] w-full mx-auto min-h-0 flex flex-col rounded-md bg-slate-800 search-view">
        <div className="flex min-w-0 px-4 basis-auto items-center bg-slate-200/[0.05]">
          <div className="search-icon w-6 h-6"></div>
          <input
            className="text-slate-200 text-sm h-14 flex-grow flex-shrink basis-auto bg-transparent outline-0 ml-3 mr-4"
            aria-autocomplete="both"
            aria-labelledby="docsearch-label"
            id="docsearch-input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            enterKeyHint="go"
            spellCheck="false"
            placeholder="Search group"
            maxLength={64}
            type="search"
            value=""
            aria-activedescendant="docsearch-item-0"
            aria-controls="docsearch-list"
          />
          <button
            className="escape-icon bg-slate-600 w-7 h-6 bg-no-repeat bg-center bg-[length:50%] ring-0 rounded-md text-[0]"
            type="reset"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

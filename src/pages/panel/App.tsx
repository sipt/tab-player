import { useEffect, useRef, useState } from "react";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [port, setPort] = useState<MessagePort | null>(null);
  const [groups, setGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  useEffect(() => {
    window.addEventListener("message", (event) => {
      setPort(event.ports?.[0]);
    });
  }, []);

  useEffect(() => {
    inputRef.current.onkeydown = (e) => {
      if (e.key === "Escape") {
        port.postMessage("dismiss");
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (port) {
      port.onmessage = (e) => {
        switch (e.data) {
          case "redisplay":
            chrome.tabGroups
              .query({})
              .then((groups) => {
                setGroups(groups);
                console.log("groups", groups);
              })
              .catch((e) => {
                console.error(e);
              });
            break;
          default:
            break;
        }
      };
      window.onkeydown = (e) => {
        if (e.key === "Escape") {
          port.postMessage("dismiss");
        }
      };
    }
  }, [port, inputRef]);

  useEffect(() => {
    inputRef.current.value = "";
    inputRef.current.focus();
  }, [groups]);

  return (
    <div
      className="search-container w-full h-full flex flex-col backdrop-blur-sm"
      style={{ backgroundColor: "#0f172acc" }}
      onClick={(e) => {
        console.log(port);
        if (port) {
          port.postMessage("dismiss");
        }
      }}
    >
      <div
        className="max-w-[48rem] w-full mx-auto min-h-0 flex flex-col rounded-t-md bg-slate-800 search-view"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex min-w-0 px-4 basis-auto items-center rounded-t-md border-b border-slate-200/[0.05]">
          <div className="search-icon w-6 h-6"></div>
          <input
            ref={inputRef}
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
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
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
        <div className="pb-6">
          <div className="flex-auto overflow-auto"></div>
        </div>
        <div className="flex-none flex justify-end border-t border-slate-100 py-4 px-6 dark:border-slate-200/5;"></div>
      </div>
    </div>
  );
}

export default App;

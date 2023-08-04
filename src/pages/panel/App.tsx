import { useEffect, useRef, useState } from "react";
import Group from "./Group";

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
      className="w-screen h-screen fixed z-[2000] top-0 left-0 cursor-auto flex flex-col bg-black/20 backdrop-blur-sm p-4 sm:p-6 md:p-[10vh] lg:p-[12vh] dark:bg-slate-900/80"
      onClick={() => {
        if (port) {
          port.postMessage("dismiss");
        }
      }}
    >
      <div
        className="search-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="px-4 flex-none relative flex items-center border-b border-slate-100 dark:border-slate-200/5">
          <div className="flex-auto flex items-center min-w-0">
            <div className="search-icon w-6 h-6"></div>
            <input
              ref={inputRef}
              className="search-input"
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
          </div>
          <button
            className="escape-icon bg-slate-600 w-7 h-6 bg-no-repeat bg-center bg-[length:50%] ring-0 rounded-md text-[0]"
            type="reset"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
        <div className="p-6">
          <ul className="group-list flex-auto overflow-auto">
            {groups.map((group) => {
              return <Group key={group.id} group={group} />;
            })}
          </ul>
        </div>
        <div className="flex-none flex justify-end border-t border-slate-100 py-4 px-6 dark:border-slate-200/5;"></div>
      </div>
    </div>
  );
}

export default App;

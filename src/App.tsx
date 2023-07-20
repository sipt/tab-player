import { useEffect, useState } from "react";
import Window from "./Window";

function App() {
  const [windows, setWindows] = useState<chrome.windows.Window[]>([]);
  const [keyword, setKeyword] = useState("");
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    chrome.windows
      .getAll()
      .then((windows) => {
        // 以 windowid 为 key 生成一个 map
        const windowMap = new Map<number, chrome.windows.Window>();
        windows.forEach((window) => {
          windowMap.set(window.id!, window);
        });
        chrome.tabs.query({}).then((tabs) => {
          setTabs(tabs);
          const windowCounter = new Map<number, number>();
          tabs.forEach((tab) => {
            const windowId = tab.windowId!;
            const count = windowCounter.get(windowId) || 0;
            windowCounter.set(windowId, count + 1);
          });
          var windowCounts: { id: number; count: number }[] = [];
          windowCounter.forEach((count, windowId) => {
            windowCounts.push({ id: windowId, count: count });
          });
          // sort windowCounts by count
          windowCounts.sort((a, b) => {
            return b.count - a.count;
          });
          var windowsSorted: chrome.windows.Window[] = [];
          windowCounts.forEach((windowCount) => {
            const window = windowMap.get(windowCount.id);
            if (window) {
              windowsSorted.push(window);
            }
          });
          console.log(windowCounts);
          setWindows(windowsSorted);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  useEffect(() => {
    if (keyword) {
      const selectedIds: number[] = [];
      tabs.forEach((tab) => {
        if (
          tab.url!.toLocaleLowerCase().includes(keyword.toLowerCase()) ||
          tab.title!.toLocaleLowerCase().includes(keyword.toLowerCase())
        ) {
          selectedIds.push(tab.id!);
        }
      });
      setSelectedIds(selectedIds);
    } else {
      setSelectedIds([]);
    }
  }, [keyword]);

  const handleClose = () => {
    chrome.tabs.remove(selectedIds).then(() => {
      console.log("closed");
      setRefresh(!refresh);
    });
  };

  return (
    <div>
      <div className="w-800 h-600 p-6 bg-gradient-to-b from-gray-900 to-slate-800 flex flex-col text-white">
        <div className="flex">
          <label className="relative block grow">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="mr-3 flex-none"
              >
                <path
                  d="m19 19-3.5-3.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></circle>
              </svg>
            </span>
            <input
              className="placeholder:italic placeholder:text-slate-400 block bg-slate-900 w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search for tab..."
              type="text"
              name="search"
              autoComplete="off"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
          </label>
          <button
            type="button"
            className="flex items-center justify-center mx-3 w-10 h-10 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
            onClick={handleClose}
          >
            <img className="w-5 h-6" src="trash.png" />
          </button>
        </div>
        <div className="mt-6 overflow-auto flex flex-wrap gap-4 content-start items-start">
          {windows.map((window) => {
            return (
              <Window
                window={window}
                selectedIds={selectedIds}
                refresh={refresh}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

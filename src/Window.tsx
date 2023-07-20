import { useEffect, useState } from "react";

interface WindowProps {
  window: chrome.windows.Window;
  selectedIds: number[];
  refresh: boolean;
}

function Window(props: WindowProps) {
  const [width, setWidth] = useState(0);
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  useEffect(() => {
    console.log(props.window);
    chrome.tabs.query({ windowId: props.window.id }).then((tabs) => {
      setWidth(getWidth(tabs));
      setTabs(tabs);
      console.log(tabs);
    });
  }, [props.refresh]);
  useEffect(() => {}, [props.selectedIds]);
  return (
    <div className="shadow-xl min-h-36" style={{ width: `${width}px` }}>
      <div className="sm:rounded-lg ring-1 ring-slate-900/5">
        <div className="sm:rounded-t-xl bg-gradient-to-b from-white to-[#FBFBFB] dark:bg-none dark:bg-slate-700 dark:highlight-white/10">
          <div className="py-2.5 grid items-center px-4 gap-6">
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]"></div>
              <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]"></div>
              <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]"></div>
            </div>
          </div>
        </div>
        <div className="w-full select-none bg-slate-100 text-slate-400 flex items-center justify-center space-x-2 dark:bg-slate-900 dark:text-slate-500 rounded-b">
          <div className="w-full min-h-[100px] flex flex-wrap content-start gap-2 p-4">
            {tabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow text-slate-900 text-sm font-bold hover:scale-125 transition ${
                    props.selectedIds && props.selectedIds.includes(tab.id!)
                      ? "scale-125 border border-indigo-600"
                      : ""
                  }`}
                >
                  <img
                    className="w-5 h-5"
                    src={tab.favIconUrl || "/favicon.ico"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getWidth(tabs: chrome.tabs.Tab[]) {
  const len = tabs.length;
  if (len === 0) return 100;
  var cols = 3;
  if (len > 12) {
    for (let i = 1; true; i++) {
      const r = Math.ceil(len / i);
      if (r <= i + 1) {
        cols = i;
        break;
      }
    }
  }
  const width = 16 * 2 + cols * 32 + (cols - 1) * 8;
  console.log(width);
  return Math.max(width, 100);
}

export default Window;

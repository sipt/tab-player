import { useEffect, useState } from "react";

function Group(props: { group: chrome.tabGroups.TabGroup }) {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

  useEffect(() => {
    chrome.tabs
      .query({ groupId: props.group.id })
      .then((tabs) => {
        setTabs(tabs);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [props.group]);
  return (
    <li
      className="group-item py-3 px-4 border-t-0 bg-slate-50 rounded-lg dark:bg-slate-700/30"
      aria-selected="false"
    >
      <div className="group-item-container flex items-center">
        <div className="flex flex-auto flex-col min-w-0 z-[1]">
          <div className="group-title border-0">{props.group.title}</div>
          <div className="group-tabs text-slate-700 leading-6 truncate dark:text-slate-400 mb-1 flex flex-wrap p-1 gap-1">
            {tabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow text-slate-900 text-sm font-bold hover:scale-125 transition"
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
        <div className="flex-none ml-3.5 w-6 h-6 rounded-full bg-red-400"></div>
      </div>
    </li>
  );
}

export default Group;

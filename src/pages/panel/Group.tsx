import { useEffect, useState } from "react";
import { colorMap } from "./Common";

function Group(props: {
  group: chrome.tabGroups.TabGroup;
  selectGroupId: number;
  focusOnGroupId: number;
}) {
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
      className="group-item border-t-0 rounded-lg bg-slate-50  dark:bg-slate-700/30"
      aria-selected={`${props.selectGroupId === props.group.id}`}
    >
      <div className="group-item-container flex items-center">
        <div className="flex flex-auto flex-col min-w-0 z-[1] gap-1">
          <div className="flex justify-between px-3 py-2">
            <div
              className={`group-title border-0 ${
                colorMap[props.group.color]
              } text-slate-800 dark:text-slate-100`}
            >
              {props.group.title || "(No Title)"}
            </div>
            {props.focusOnGroupId === props.group.id ? (
              <div className="flex-none ml-3.5 w-3 h-3 rounded-full bg-green-400"></div>
            ) : null}
          </div>
          <div className="group-tabs text-slate-700 truncate dark:text-slate-400 mb-1 flex flex-wrap gap-1 px-3 pb-2">
            {tabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow text-sm font-bold"
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
    </li>
  );
}

export default Group;

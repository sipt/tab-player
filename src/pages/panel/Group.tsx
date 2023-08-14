import { useEffect, useState, useRef } from "react";
import { colorMap } from "./Common";
import defaultIcon from "@assets/img/default-image.png";
import activeGroup from "@assets/img/active-group.png";

interface GroupEvent {
  type: "group.select" | "group.focus";
  group: chrome.tabGroups.TabGroup;
}

function Group(props: {
  group: chrome.tabGroups.TabGroup;
  selectGroupId: number;
  focusOnGroupId: number;
  callback: (event: GroupEvent) => void;
}) {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const groupItem = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (props.group.id === 0) {
      return;
    }
    chrome.tabs
      .query({ groupId: props.group.id })
      .then((tabs) => {
        setTabs(tabs);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [props.group]);

  useEffect(() => {
    if (props.selectGroupId === props.group.id) {
      groupItem.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [props.selectGroupId]);

  function tabsView() {
    let els = [];
    if (tabs.length > 0) {
      els.push(
        ...tabs.map((tab, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow text-sm font-bold"
            >
              <img
                className="w-5 h-5 tab-icon"
                src={tab.favIconUrl || defaultIcon}
                onError={(e) => {
                  e.currentTarget.src = defaultIcon;
                }}
              />
            </div>
          );
        })
      );
    } else {
      els.push(<div>{`Press "Enter" to create the group.`}</div>);
    }
    return els;
  }
  return (
    <li
      ref={groupItem}
      className="group-item border-t-0 rounded-lg bg-slate-50  dark:bg-slate-700/30"
      aria-selected={`${props.selectGroupId === props.group.id}`}
      onMouseEnter={() => {
        props.callback({
          type: "group.focus",
          group: props.group,
        });
      }}
      onClick={() => {
        props.callback({
          type: "group.select",
          group: props.group,
        });
      }}
    >
      <div className="group-item-container flex items-center">
        <div className="flex flex-auto flex-col min-w-0 z-[1] gap-1">
          <div className="flex justify-between px-3 py-2">
            <div
              className={`group-title border-0 ${
                colorMap[props.group.color.toLowerCase()]
              } text-slate-800 dark:text-slate-100`}
            >
              {props.group.title || "(No Title)"}
            </div>
            {props.focusOnGroupId != 0 &&
            props.focusOnGroupId === props.group.id ? (
              <div className="flex-none ml-3.5 w-5 h-5 rounded-full">
                <img className="w-5 h-5" src={activeGroup} />
              </div>
            ) : null}
          </div>
          <div className="group-tabs text-slate-700 truncate dark:text-slate-400 mb-1 flex flex-wrap gap-1 px-3 pb-2">
            {tabsView()}
          </div>
        </div>
      </div>
    </li>
  );
}

export { Group, GroupEvent };

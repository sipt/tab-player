import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import Group from "./Group";
import NewGroup from "./NewGroup";
import { colorFix } from "./Common";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [port, setPort] = useState<MessagePort | null>(null);
  const [groups, setGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<
    chrome.tabGroups.TabGroup[]
  >([]);
  const [selectGroupId, setSelectGroupId] = useState<number>(0);
  const [focusOnGroupId, setFocusOnGroupId] = useState<number>(0);
  useEffect(() => {
    window.addEventListener("message", (event) => {
      setPort(event.ports?.[0]);
    });
  }, []);

  useEffect(() => {
    inputRef.current.onkeydown = (e) => {
      if (e.key === "Escape") {
        setInputValue("");
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
              })
              .catch((e) => {
                console.error(e);
              });
            chrome.storage.local.get("focusOnGroupId", (items) => {
              console.log(items);
              setFocusOnGroupId(items.focusOnGroupId || 0);
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

  useEffect(() => {
    if (inputValue === "") {
      setFilteredGroups(groups);
    } else {
      setFilteredGroups(
        groups.filter((group) => {
          return group.title.toLowerCase().includes(inputValue.toLowerCase());
        })
      );
    }
  }, [inputValue, groups]);

  useEffect(() => {
    setSelectGroupId(filteredGroups[0]?.id || 0);
  }, [filteredGroups]);

  function groupsView() {
    if (filteredGroups.length === 0) {
      return <NewGroup title={inputValue} />;
    } else {
      return filteredGroups.map((group) => {
        return (
          <Group
            key={group.id}
            group={group}
            selectGroupId={selectGroupId}
            focusOnGroupId={focusOnGroupId}
          />
        );
      });
    }
  }

  const keydownEventHandler: KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    switch (e.key) {
      case "ArrowUp":
        const index = filteredGroups.findIndex(
          (group) => group.id === selectGroupId
        );
        if (index > 0) {
          setSelectGroupId(filteredGroups[index - 1].id);
        }
        e.preventDefault();
        break;
      case "ArrowDown":
        const index2 = filteredGroups.findIndex(
          (group) => group.id === selectGroupId
        );
        if (index2 < filteredGroups.length - 1) {
          setSelectGroupId(filteredGroups[index2 + 1].id);
        }
        e.preventDefault();
        break;
      case "Enter":
        groups.forEach((group) => {
          if (group.id !== selectGroupId) {
            chrome.tabGroups.update(group.id, { collapsed: true });
          }
        });
        try {
          if (selectGroupId !== 0) {
            const tabs = await chrome.tabs.query({ groupId: selectGroupId });
            const tab = tabs.at(-1);
            await chrome.tabs.update(tab.id!, { active: true });
            await chrome.storage.local.set({ focusOnGroupId: selectGroupId });
          } else {
            const newTab = await chrome.tabs.create({});
            const groupId = await chrome.tabs.group({
              tabIds: newTab.id!,
            });
            const [title, color] = inputValue.split("[[");
            await chrome.tabGroups.update(groupId!, {
              title: title.trim(),
              color: colorFix(color),
            });
            await chrome.storage.local.set({ focusOnGroupId: groupId });
          }
          port.postMessage("dismiss");
        } catch (err) {
          console.error(err);
        }
        break;
      default:
        break;
    }
  };

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
              onKeyDown={keydownEventHandler}
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
        <div className="p-3">
          <ul className="group-list flex flex-col overflow-auto gap-2">
            {groupsView()}
          </ul>
        </div>
        <div className="flex-none flex justify-end border-t border-slate-100 py-4 px-6 dark:border-slate-200/5"></div>
      </div>
    </div>
  );
}

export default App;

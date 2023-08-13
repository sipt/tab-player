import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { Group, GroupEvent } from "./Group";
import { colorFix, colorMap, colors } from "./Common";
import { lockTabs, unlockTabs } from "@src/common/lock";
import { loadOptionsConfig } from "@src/common/optionsConfig";

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
  const [refresh, setRefresh] = useState(0);
  const [colorSeparator, setColorSeparator] = useState<string>("[[");
  const [defaultNames, setDefaultNames] = useState<string[]>([]);
  let randomGroup: { name: string; color: string } = { name: "", color: "" };
  useEffect(() => {
    window.addEventListener("message", (event) => {
      setPort(event.ports?.[0]);
    });
    loadOptionsConfig()
      .then((optionsConfig) => {
        setColorSeparator(optionsConfig.colorSeparator || "[[");
        setDefaultNames(optionsConfig.defaultNames);
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(optionsConfig.theme || "dark");
        document.documentElement.setAttribute(
          "data-theme",
          optionsConfig.theme || "dark"
        );
      })
      .catch((e) => {
        console.error(e);
      });
    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes.optionsConfig) {
        setColorSeparator(
          changes.optionsConfig.newValue.colorSeparator || "[["
        );
        setDefaultNames(changes.optionsConfig.newValue.defaultNames);
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(
          changes.optionsConfig.newValue.theme || "dark"
        );
        document.documentElement.setAttribute(
          "data-theme",
          changes.optionsConfig.newValue.theme || "dark"
        );
      }
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
    chrome.tabGroups
      .query({})
      .then((groups) => {
        setGroups(groups);
      })
      .catch((e) => {
        console.error(e);
      });
    chrome.storage.local.get("focusOnGroupId", (items) => {
      setFocusOnGroupId(items.focusOnGroupId || 0);
    });
  }, [refresh]);

  useEffect(() => {
    inputRef.current.value = "";
    inputRef.current.focus();
  }, [groups]);

  useEffect(() => {
    let fg = groups;
    let found = false;
    if (inputValue !== "") {
      fg = fg.filter((group) => {
        if (group.title === inputValue) {
          found = true;
        }
        return group.title.toLowerCase().includes(inputValue.toLowerCase());
      });
    }
    if (inputValue !== "") {
      fg = fg.sort((a, b) => {
        return a.title.length - b.title.length;
      });
    }
    // 有 focusOnGroupId 时，将其放在第一位
    if (focusOnGroupId !== 0) {
      const index = fg.findIndex((group) => group.id === focusOnGroupId);
      if (index !== -1) {
        fg = [fg[index], ...fg.slice(0, index), ...fg.slice(index + 1)];
      }
    }
    if (inputValue !== "" && !found) {
      const cell = inputValue.split(colorSeparator);
      let color = "grey";
      if (cell.length > 1) {
        color = colorFix(cell[1]);
      }
      fg = [
        { id: 0, title: cell[0], color: color } as chrome.tabGroups.TabGroup,
        ...fg,
      ];
    } else if (inputValue === "") {
      randomGroup.name =
        defaultNames[Math.floor(Math.random() * defaultNames.length)];
      randomGroup.color = colors[Math.floor(Math.random() * colors.length)];
      console.log(randomGroup);
      fg = [
        {
          id: 0,
          title: randomGroup.name,
          color: randomGroup.color,
        } as chrome.tabGroups.TabGroup,
        ...fg,
      ];
    }
    setFilteredGroups(fg);
  }, [inputValue, groups, focusOnGroupId]);

  useEffect(() => {
    let groupId = 0;
    if (inputValue.length > 0) {
      filteredGroups.forEach((group) => {
        if (group.title === inputValue) {
          groupId = group.id;
        }
      });
    } else if (filteredGroups.length > 0) {
      groupId = filteredGroups[0].id;
    }
    setSelectGroupId(groupId);
  }, [filteredGroups]);

  async function groupCallback(event: GroupEvent) {
    try {
      switch (event.type) {
        case "group.select":
          const tabs = await chrome.tabs.query({ groupId: event.group.id });
          const tab = tabs.at(-1);
          await chrome.tabs.update(tab.id!, { active: true });
          await chrome.storage.local.set({ focusOnGroupId: event.group.id });
          break;
        case "group.focus":
          setSelectGroupId(event.group.id);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  function groupsView() {
    return filteredGroups.map((group) => {
      return (
        <Group
          key={group.id}
          group={group}
          selectGroupId={selectGroupId}
          focusOnGroupId={focusOnGroupId}
          callback={groupCallback}
        />
      );
    });
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
        try {
          if (e.metaKey) {
            let allTabs = await chrome.tabs.query({});
            const tabs = allTabs.filter((tab) => tab.groupId === selectGroupId);
            if (tabs.length === 0) {
              e.preventDefault();
              return;
            }
            const windowId = tabs[0].windowId;
            allTabs = allTabs.filter((tab) => tab.windowId !== windowId);
            try {
              await lockTabs();
              if (tabs.length === allTabs.length) {
                await chrome.tabs.create({});
              }
              const tabids = tabs.map((tab) => tab.id);
              await chrome.tabs.remove(tabids);
              setRefresh(refresh + 1);
            } catch (err) {
              console.error(err);
            } finally {
              await unlockTabs();
            }
            e.preventDefault();
            return;
          }
          if (selectGroupId !== 0 && focusOnGroupId === selectGroupId) {
            await chrome.storage.local.set({ focusOnGroupId: 0 });
            setInputValue("");
            port.postMessage("dismiss");
            return;
          }
          groups.forEach((group) => {
            if (group.id !== selectGroupId) {
              chrome.tabGroups.update(group.id, { collapsed: true });
            }
          });
        } catch (err) {
          console.error(err);
        }
        try {
          await lockTabs();
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
            const [title, color] = inputValue.split(colorSeparator);
            await chrome.tabGroups.update(groupId!, {
              title: title.trim(),
              color: colorFix(color),
            });
            await chrome.storage.local.set({ focusOnGroupId: groupId });
          }
          setInputValue("");
          port.postMessage("dismiss");
        } catch (err) {
          console.error(err);
        } finally {
          await unlockTabs();
        }
        e.preventDefault();
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
        </div>
        <div className="p-3 overflow-auto">
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

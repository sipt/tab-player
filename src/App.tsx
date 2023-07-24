import { useEffect, useState, useRef } from "react";
import Window from "./Window";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface AppEvent {
  type: string;
  window?: chrome.windows.Window;
  tab?: chrome.tabs.Tab;
}

function App() {
  const [windows, setWindows] = useState<chrome.windows.Window[]>([]);
  const [selectWindowId, setSelectWindowId] = useState(0); // windows[0].id
  const [keyword, setKeyword] = useState("");
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const channel = new BroadcastChannel("event_channel");
  const inputRef = useRef<HTMLInputElement>(null);
  const [statusBarTitle, setStatusBarTitle] = useState("");

  useEffect(() => {
    channel.onmessage = (event) => {
      const appEvent = event.data as AppEvent;
      switch (appEvent.type) {
        case "window.close":
          console.log("window.close", appEvent.window);
          chrome.windows
            .remove(appEvent.window!.id!)
            .then(() => {
              setRefresh((prevRefresh) => !prevRefresh);
            })
            .catch((err) => {
              console.error(err);
            });
          break;
        case "window.select":
          setSelectWindowId(appEvent.window!.id!);
          break;
        case "window.unselect":
          setSelectWindowId(0);
          break;
        case "tab.select":
          toggleTabSelected(appEvent.tab!.id!);
          break;
        case "tab.hover":
          setStatusBarTitle(appEvent.tab!.title!);
          break;
        case "tab.unhover":
          setStatusBarTitle((prevStatusBarTitle) => {
            if (prevStatusBarTitle === appEvent.tab!.title!) {
              return "";
            } else {
              return prevStatusBarTitle;
            }
          });
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
    chrome.windows
      .getAll()
      .then((windows) => {
        // 以 windowid 为 key 生成一个 map
        const windowMap = new Map<number, chrome.windows.Window>();
        windows.forEach((window) => {
          windowMap.set(window.id!, window);
        });
        chrome.tabs
          .query({})
          .then((tabs) => {
            setTabs(tabs);
            const windowCounter = new Map<number, number>();
            tabs.forEach((tab) => {
              const windowId = tab.windowId;
              const count = windowCounter.get(windowId) || 0;
              windowCounter.set(windowId, count + 1);
            });
            const windowCounts: { id: number; count: number }[] = [];
            windowCounter.forEach((count, windowId) => {
              windowCounts.push({ id: windowId, count: count });
            });
            // sort windowCounts by count
            windowCounts.sort((a, b) => {
              return b.count - a.count;
            });
            const windowsSorted: chrome.windows.Window[] = [];
            windowCounts.forEach((windowCount) => {
              const window = windowMap.get(windowCount.id);
              if (window) {
                windowsSorted.push(window);
              }
            });
            setWindows(windowsSorted);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  useEffect(() => {
    if (keyword) {
      let searchKeyword = keyword;
      let statusKey = "";
      // 判断 keyword 是否以 @ 开头，如果是截取出 @ 后面的内容直到 @ 或者空格, 并替换 keyword
      if (keyword.startsWith("@")) {
        const index = keyword.indexOf(" ");
        if (index === -1) {
          statusKey = keyword.slice(1);
          searchKeyword = "";
        } else {
          statusKey = keyword.slice(1, index);
          searchKeyword = keyword.slice(index + 1);
        }
      }
      const selectedIds: number[] = [];
      tabs.forEach((tab) => {
        if (statusKey) {
          switch (statusKey) {
            case "pinned":
              if (!tab.pinned) {
                return;
              }
              break;
            case "unpinned":
              if (tab.pinned) {
                return;
              }
              break;
            case "audible":
              if (!tab.audible) {
                return;
              }
              break;
            case "muted":
              if (!tab.mutedInfo?.muted) {
                return;
              }
              break;
            case "unmuted":
              if (tab.mutedInfo?.muted) {
                return;
              }
              break;
            case "active":
              if (!tab.active) {
                return;
              }
              break;
            case "inactive":
              if (tab.active) {
                return;
              }
              break;
            case "highlighted":
              if (!tab.highlighted) {
                return;
              }
              break;
            case "unhighlighted":
              if (tab.highlighted) {
                return;
              }
              break;
            case "current":
              if (!tab.active || !tab.highlighted) {
                return;
              }
              break;
            case "uncurrent":
              if (tab.active && tab.highlighted) {
                return;
              }
              break;
            case "loading":
              if (!tab.status || tab.status !== "loading") {
                return;
              }
              break;
            case "complete":
              if (!tab.status || tab.status !== "complete") {
                return;
              }
              break;
            case "unloaded":
              if (!tab.status || tab.status !== "unloaded") {
                return;
              }
              break;
            default:
              statusKey = "";
              break;
          }
        }
        if (selectWindowId !== 0 && selectWindowId !== tab.windowId) {
          return;
        }
        if (searchKeyword) {
          if (
            tab
              .url!.toLocaleLowerCase()
              .includes(searchKeyword.toLowerCase()) ||
            tab.title!.toLocaleLowerCase().includes(searchKeyword.toLowerCase())
          ) {
            selectedIds.push(tab.id!);
          }
        } else if (statusKey) {
          selectedIds.push(tab.id!);
        }
      });
      setSelectedIds(selectedIds);
    } else {
      setSelectedIds([]);
    }
  }, [keyword, selectWindowId, tabs]);

  useEffect(() => {
    if (!openDialog) {
      inputRef.current?.focus();
    }
  }, [openDialog]);

  const handleClose = () => {
    chrome.tabs
      .remove(selectedIds)
      .then(() => {
        setRefresh((prevRefresh) => !prevRefresh);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handlePin = () => {
    selectedIds.forEach((tabId) => {
      chrome.tabs
        .update(tabId, { pinned: true })
        .then(() => {
          setRefresh((prevRefresh) => !prevRefresh);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const toggleTabSelected = (tabId: number) => {
    setSelectedIds((prevSelectedIds) => {
      const index = prevSelectedIds.indexOf(tabId);
      if (index === -1) {
        return [...prevSelectedIds, tabId];
      } else {
        return [
          ...prevSelectedIds.slice(0, index),
          ...prevSelectedIds.slice(index + 1),
        ];
      }
    });
  };

  function dialogContent() {
    if (selectedIds.length === 0) {
      return (
        <div className="h-full flex justify-center gap-6 text-lg items-center">
          <span>No tab selected</span>
        </div>
      );
    } else {
      return (
        <div className="mt-[25px] flex justify-center gap-6 ">
          <button
            className="w-16 h-16 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 ring-1 ring-slate-900/10 flex justify-center flex-wrap items-center"
            onClick={() => {
              handleClose();
              closeDialog();
            }}
          >
            <img className="w-6 h-7" src="trash.png" />
          </button>
          <button
            className="w-16 h-16 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 ring-1 ring-slate-900/10 flex justify-center flex-wrap items-center"
            onClick={() => {
              handlePin();
              closeDialog();
            }}
          >
            <img className="w-5 h-7" src="pin.png" />
          </button>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="w-800 h-600 bg-gradient-to-b from-white to-white dark:from-gray-900 dark:to-slate-800 flex flex-col text-black dark:text-white">
        <div className="flex m-5">
          <label className="relative block grow">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <MagnifyingGlassIcon />
            </span>
            <input
              className="placeholder:italic placeholder:text-slate-400 block bg-white dark:bg-slate-900 w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search for tab..."
              type="text"
              name="search"
              autoComplete="off"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setOpenDialog(true);
                }
              }}
            />
          </label>
          <button
            type="button"
            className="flex items-center justify-center ml-3 w-10 h-10 shadow-sm rounded-lg text-slate-400 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <img className="w-6 h-6" src="wand.and.stars.png" />
          </button>
        </div>
        <div className="overflow-auto mx-3 flex flex-wrap gap-3 content-start items-start grow">
          {windows.map((window) => {
            return (
              <Window
                window={window}
                selectedIds={selectedIds}
                channel={channel}
                selectedWindowId={selectWindowId}
              />
            );
          })}
        </div>
        <div className="w-full h-6 bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 px-3 text-xs flex items-center shadow-md justify-between">
          <div className="w-9/12 truncate">
            <span>{statusBarTitle}</span>
          </div>
          <div className="w-20">
            <span className="mr-2">{`selected: ${selectedIds.length}`}</span>
          </div>
        </div>
        <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/20 dark:bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] w-[250px] h-[150px] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-slate-900 highlight-white/5 rounded-[6px] p-[25px] shadow-xl shadow-slate-900/50 shadow-highlight focus:outline-none ring-1 ring-slate-900/10">
              {dialogContent()}
              <Dialog.Close asChild>
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                  aria-label="Close"
                  onClick={() => {
                    closeDialog();
                  }}
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

export default App;

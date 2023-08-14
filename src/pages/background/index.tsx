import { lockTabs, unlockTabs } from "@src/common/lock";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { colorFix } from "@src/pages/panel/Common";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");

chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.groupId !== -1) {
    return;
  }
  try {
    const locked = await lockTabs();
    if (!locked) {
      return;
    }
    const items = await chrome.storage.local.get("focusOnGroupId");
    const focusOnGroupId = items.focusOnGroupId || 0;
    const groups = await chrome.tabGroups.query({});
    const group = groups.find((group) => group.id === focusOnGroupId);
    if (group && group.windowId === tab.windowId) {
      await chrome.tabs.group({ groupId: group.id, tabIds: tab.id });
    }
  } catch (err) {
    console.error(err);
  } finally {
    await unlockTabs();
  }
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  let fg = await chrome.tabGroups.query({});
  if (text !== "") {
    fg = fg.filter((group) => {
      return group.title.toLowerCase().includes(text.toLowerCase());
    });
  }
  const { focusOnGroupId } = await chrome.storage.local.get("focusOnGroupId");
  // 有 focusOnGroupId 时，将其放在第一位
  if (focusOnGroupId !== 0) {
    const index = fg.findIndex((group) => group.id === focusOnGroupId);
    if (index !== -1) {
      fg = [fg[index], ...fg.slice(0, index), ...fg.slice(index + 1)];
    }
  }
  const suggestions = fg.map((group) => {
    return {
      content: group.title,
      description: `<match>${group.title}</match> ${
        group.id === focusOnGroupId ? "<dim>(Focusing)</dim>" : ""
      }`,
    };
  });
  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  const groups = await chrome.tabGroups.query({});
  const group = groups.find((group) => group.title === text);
  const groupId = group?.id || 0;

  try {
    await lockTabs();
    if (groupId !== 0) {
      const tabs = await chrome.tabs.query({ groupId: groupId });
      const tab = tabs.at(-1);
      await chrome.tabs.update(tab.id!, { active: true });
      await chrome.storage.local.set({ focusOnGroupId: groupId });
    } else {
      let tabId = 0;
      const currentWindow = await chrome.windows.getCurrent();
      const currentTab = await chrome.tabs.query({ active: true });
      currentTab.forEach((tab) => {
        if (
          tab.windowId === currentWindow.id &&
          tab.url.startsWith("chrome://newtab/")
        ) {
          tabId = tab.id!;
        }
      });

      if (tabId === 0) {
        const newTab = await chrome.tabs.create({});
        tabId = newTab.id!;
      }
      const groupId = await chrome.tabs.group({
        tabIds: tabId,
      });
      const [title, color] = text.split("[[");
      await chrome.tabGroups.update(groupId, {
        title: title.trim(),
        color: colorFix(color),
      });
      await chrome.storage.local.set({ focusOnGroupId: groupId });
    }
  } catch (err) {
    console.error(err);
  } finally {
    await unlockTabs();
  }
});

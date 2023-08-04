import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded 1111");

chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.groupId !== -1) {
    return;
  }
  const items = await chrome.storage.local.get("focusOnGroupId");
  const focusOnGroupId = items.focusOnGroupId || 0;
  console.log(focusOnGroupId);
  const groups = await chrome.tabGroups.query({});
  console.log(groups);
  const group = groups.find((group) => group.id === focusOnGroupId);
  if (group) {
    await chrome.tabs.group({ groupId: group.id, tabIds: tab.id });
  }
  console.log(group);
});

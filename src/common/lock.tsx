async function lockTabs(): Promise<boolean> {
  const { tabsLock } = await chrome.storage.local.get("tabsLock");
  if (tabsLock) {
    return false;
  }
  await chrome.storage.local.set({ tabsLock: true });
  return true;
}

async function unlockTabs(): Promise<boolean> {
  const { tabsLock } = await chrome.storage.local.get("tabsLock");
  if (!tabsLock) {
    return false;
  }
  await chrome.storage.local.set({ tabsLock: false });
  return true;
}

export { lockTabs, unlockTabs };

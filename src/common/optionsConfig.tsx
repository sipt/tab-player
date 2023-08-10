import { Hotkey } from "./keymap";

interface OptionsConfig {
  // GeneralConfig
  theme?: string;

  // TabGroupsConfig
  hotkey?: Hotkey;
  colorSeparator?: string;
}

const defaultOptionsConfig: OptionsConfig = {
  theme: "dark",
  hotkey: {
    altKey: false,
    code: "KeyO",
    ctrlKey: false,
    key: "o",
    metaKey: true,
    shiftKey: true,
  },
  colorSeparator: "[[",
};

async function loadOptionsConfig(): Promise<OptionsConfig> {
  try {
    let { optionsConfig } = await chrome.storage.local.get("optionsConfig");
    if (!optionsConfig) {
      optionsConfig = defaultOptionsConfig;
      await chrome.storage.local.set({ optionsConfig: optionsConfig });
    }
    return optionsConfig;
  } catch (err) {
    console.error(err);
    return defaultOptionsConfig;
  }
}

async function saveOptionsConfig(optionsConfig: OptionsConfig) {
  try {
    await chrome.storage.local.set({ optionsConfig: optionsConfig });
  } catch (err) {
    console.error(err);
  }
}

export { OptionsConfig, loadOptionsConfig, saveOptionsConfig };

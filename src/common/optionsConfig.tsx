import { Hotkey } from "./keymap";

interface TabGroupsConfig {
  hotkey: Hotkey;
  colorSeparator: string;
}

interface GeneralConfig {
  theme: string;
}

interface OptionsConfig {
  tabGroups: TabGroupsConfig;
  general: GeneralConfig;
}

export { OptionsConfig };

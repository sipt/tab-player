import { useState, useEffect } from "react";
import "@pages/options/Options.css";
import icon from "@assets/img/icon-128.png";
import { Hotkey, HotkeyManager } from "@src/common/keymap";
import {
  loadOptionsConfig,
  saveOptionsConfig,
} from "@src/common/optionsConfig";

function Options() {
  const [hotkey, setHotkey] = useState<Hotkey>({} as Hotkey);
  const [colorSeparator, setColorSeparator] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const hotkeyManager = new HotkeyManager({
    set(Hotkey) {
      setHotkey(Hotkey);
    },
    get() {
      return hotkey;
    },
  });

  useEffect(() => {
    loadOptionsConfig().then((optionsConfig) => {
      setHotkey(optionsConfig.hotkey);
      setColorSeparator(optionsConfig.colorSeparator);
      setTheme(optionsConfig.theme);
    });
  }, []);

  useEffect(() => {
    saveOptionsConfig({
      hotkey: hotkey,
      colorSeparator: colorSeparator,
      theme: theme,
    })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }, [hotkey, colorSeparator, theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="container items-start">
      <div className="flex flex-col w-1/2 min-w-[550px]">
        <div className="flex items-end my-6">
          <img src={icon} className="w-12 h-12" />
          <span className="text-2xl font-bold ml-4 mr-2">Tab Player</span>
          <span className="text-3xl font-thin text-slate-500">Options</span>
        </div>
        <div className="flex flex-col text-base gap-3" id="general">
          <div className="text-xl font-bold mt-2">
            <a className="opacity-20 hover:opacity-60" href="#general">
              #
            </a>{" "}
            <span>General</span>
          </div>
          <div className="flex flex-nowrap justify-between items-center">
            <label>Theme</label>
            <div className="flex flex-wrap justify-center content-center w-64 h-8 max-w-xs">
              <div className="form-control w-52">
                <label className="cursor-pointer label">
                  <span>􀆭</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={theme === "dark"}
                    onChange={(e) => {
                      setTheme(e.target.checked ? "dark" : "light");
                    }}
                  />
                  <span>􀆹</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col text-base gap-3" id="tabGroups">
          <div className="text-xl font-bold mt-4">
            <a className="opacity-20 hover:opacity-60" href="#tabGroups">
              #
            </a>{" "}
            <span>Tab Groups</span>
          </div>
          <div className="flex flex-nowrap justify-between items-center">
            <label>Panel Hotkey</label>
            <div className="w-64 h-8 max-w-xs static">
              <div className="flex flex-wrap content-center justify-center gap-2 w-full h-full">
                {hotkeyManager.Symbols().map((symbol, index) => {
                  return (
                    <span
                      key={index}
                      className="h-6 w-8 text-sm inline-flex flex-wrap content-center justify-center rounded-md bg-slate-400 dark:bg-slate-700"
                    >
                      {symbol}
                    </span>
                  );
                })}
              </div>
              <div
                id="hotkey-input"
                className="relative top-[-100%] w-full h-full input input-bordered focus:outline-indigo-500 focusable bg-transparent cursor-pointer"
                tabIndex={0}
                onKeyDown={(e) => {
                  hotkeyManager.handle(e.nativeEvent);
                  e.preventDefault();
                }}
                onKeyUp={(e) => {
                  hotkeyManager.handle(e.nativeEvent);
                  e.preventDefault();
                }}
              ></div>
            </div>
          </div>
          <div className="flex flex-nowrap justify-between items-center">
            <label>Color Separator</label>
            <input
              type="text"
              placeholder="eg. [["
              value={colorSeparator}
              onChange={(e) => {
                setColorSeparator(e.target.value);
              }}
              className="input input-bordered w-64 h-8 max-w-xs dark:placeholder:text-slate-600 placeholder:text-slate-400 focus:outline-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Options;

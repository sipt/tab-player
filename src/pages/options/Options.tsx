import React from "react";
import "@pages/options/Options.css";
import icon from "@assets/img/icon-128.png";

function isComposing(e: KeyboardEvent) {}

const Options: React.FC = () => {
  const panleHotkey = {};

  return (
    <div className="container items-start">
      <div className="flex flex-col w-1/2 min-w-[550px]">
        <div className="flex items-end my-6">
          <img src={icon} className="w-12 h-12" />
          <span className="text-2xl font-bold ml-4 mr-2">Tab Player</span>
          <span className="text-3xl font-thin text-slate-500">Options</span>
        </div>
        <div className="flex flex-col text-base gap-3">
          <div className="text-xl font-bold mt-2">
            <a
              className="opacity-20 hover:opacity-60"
              href="#component-preview-title"
            >
              #
            </a>{" "}
            <span className="component-preview-title">Tab Groups</span>
          </div>
          <div className="flex flex-nowrap justify-between items-center">
            <label>Panel Hotkey</label>
            <div className="w-64 h-8 max-w-xs static">
              <div className="flex flex-wrap content-center justify-center gap-2 w-full h-full">
                <span className="h-6 w-8 text-sm inline-flex flex-wrap content-center justify-center rounded-md bg-slate-400 dark:bg-slate-700">
                  􀆔
                </span>
                <span className="h-6  w-8 text-sm inline-flex flex-wrap content-center justify-center rounded-md bg-slate-700">
                  􀆝
                </span>
                <span className="h-6  w-8 text-sm inline-flex flex-wrap content-center justify-center rounded-md bg-slate-700">
                  0
                </span>
              </div>
              <div
                className="relative top-[-100%] w-full h-full input input-bordered focus:outline-indigo-500 focusable bg-transparent cursor-pointer"
                tabIndex={0}
                onKeyDown={(e) => {
                  console.log(e);
                  e.preventDefault();
                }}
                onKeyUp={(e) => {
                  console.log(e.code);
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
              className="input input-bordered w-64 h-8 max-w-xs dark:placeholder:text-slate-600 placeholder:text-slate-400 focus:outline-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;

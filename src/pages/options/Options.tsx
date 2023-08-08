import React from "react";
import "@pages/options/Options.css";
import icon from "@assets/img/icon-128.png";

const Options: React.FC = () => {
  return (
    <div className="container items-start">
      <div className="flex flex-col w-1/2 min-w-[550px] prose">
        <h2 className="flex items-end gap-4 my-6">
          <img src={icon} className="w-12 h-12" />
          <span className="">Tab Player</span>
          <span className="text-l font-thin text-slate-500">Options</span>
        </h2>
        <div className="flex flex-col text-base gap-4">
          <h3 className="">
            <a
              className="opacity-20 hover:opacity-60"
              href="#component-preview-title"
            >
              #
            </a>{" "}
            <span className="component-preview-title">Tab Groups</span>
          </h3>
          <div className="flex flex-nowrap justify-between items-center">
            <label>Panel Hotkey</label>
            <div className="input input-bordered w-64 h-8 max-w-xs">
              <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">shift</kbd>+
              <kbd className="kbd">del</kbd>
            </div>
          </div>
          <div className="flex flex-nowrap justify-between items-center">
            <label>Color Separator</label>
            <input
              type="text"
              placeholder="eg. [["
              className="input input-bordered w-64 h-8 max-w-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;

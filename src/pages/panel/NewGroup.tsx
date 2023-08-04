import { useEffect, useState } from "react";
import { colorMap } from "./Common";

function NewGroup(props: { title: string }) {
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>("grey");

  useEffect(() => {
    const cell = props.title.split("[[");
    setTitle(cell[0]);
    if (cell.length > 1) {
      setColor(cell[1].split("]]")[0]);
    }
  });

  return (
    <li
      className="group-item border-t-0 rounded-lg bg-slate-50  dark:bg-slate-700/30"
      aria-selected="true"
    >
      <div className="group-item-container flex items-center">
        <div className="flex flex-auto flex-col min-w-0 z-[1] gap-1">
          <div className="flex justify-start px-3 py-2">
            <div
              className={`group-title border-0 ${
                colorMap[color] || colorMap["grey"]
              } text-slate-800 dark:text-slate-100`}
            >
              {title}
            </div>
          </div>
          <div className="group-tabs text-slate-700 truncate dark:text-slate-400 mb-1 flex flex-wrap gap-1 px-3 pb-2">
            <div>Typing "Enter" to create group.</div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default NewGroup;

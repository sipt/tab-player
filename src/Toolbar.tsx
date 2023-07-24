import { useState, useEffect } from "react";

function Toolbar() {
  const [theme, setTheme] = useState("");
  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.sync.get(
        ["theme"],
        (result: { [key: string]: string }) => {
          if (result.theme) {
            setTheme(result.theme);
          } else {
            setTheme("dark");
          }
        },
      );
    } else {
      setTheme((localStorage.theme as string) || "dark");
    }
  }, []);

  useEffect(() => {
    if (!theme) return;
    if (chrome.storage) {
      chrome.storage.sync.set({ theme: theme }).catch((err) => {
        console.error(err);
      });
    } else {
      localStorage.theme = theme;
    }
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="w-full h-6 flex flex-wrap justify-end content-center">
      <div className="w-7 h-5 flex flex-wrap justify-center content-center hover:bg-slate-900/10 dark:hover:bg-slate-700 rounded-md">
        {theme === "dark" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTheme("light");
            }}
          >
            <img className="w-4 h-4" src="moon.png" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTheme("dark");
            }}
          >
            <img className="w-4 h-4" src="sun.png" />
          </button>
        )}
      </div>
      <div className="w-7 h-5 flex flex-wrap justify-center content-center hover:bg-slate-900/10 dark:hover:bg-slate-700 rounded">
        <a
          href="#"
          title="请我喝杯咖啡 Donate"
          onClick={(e) => {
            e.stopPropagation();
            chrome.tabs
              .create({
                url: "https://github.com/sipt/tab-player",
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          <img className="w-5 h-4" src="cup.png" />
        </a>
      </div>
      <div className="w-7 h-5 flex flex-wrap justify-center content-center me-2 hover:bg-slate-900/10 dark:hover:bg-slate-700 rounded">
        <a
          href="#"
          title="Github"
          onClick={(e) => {
            e.stopPropagation();
            chrome.tabs
              .create({
                url: "https://github.com/sipt/tab-player",
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          <img className="w-4 h-4" src="thumb.png" />
        </a>
      </div>
    </div>
  );
}
export default Toolbar;

let iframe: HTMLIFrameElement | null = null;
let channel: MessageChannel | null = new MessageChannel();

interface Hotkey {
  altKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/code) */
  code: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/ctrlKey) */
  ctrlKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key) */
  key: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/metaKey) */
  metaKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/shiftKey) */
  shiftKey: boolean;
}
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

let optionsConfig = {} as OptionsConfig;
function init() {
  loadOptionsConfig().then((opc) => {
    optionsConfig = opc;
    window.onkeydown = (e) => {
      if (
        optionsConfig.hotkey.altKey === e.altKey &&
        optionsConfig.hotkey.code === e.code &&
        optionsConfig.hotkey.ctrlKey === e.ctrlKey &&
        optionsConfig.hotkey.metaKey === e.metaKey &&
        optionsConfig.hotkey.shiftKey === e.shiftKey
      ) {
        toggle();
      } else if (e.key === "Escape") {
        if (iframe) {
          iframe.style.display = "none";
        }
      }
    };
  });
}
function mount() {
  // 创建一个MutationObserver实例
  const observer = new MutationObserver(function (mutationsList) {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        if (iframe.style.display === "block") {
          iframe.contentWindow.focus();
          channel.port1.postMessage("redisplay");
        } else {
          window.focus();
        }
        break;
      }
    }
  });
  const root = document.createElement("div");
  root.id = "tab-player-root";
  iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("src/pages/panel/index.html");
  iframe.id = "tab-player-iframe";
  iframe.style.width = "100vw";
  iframe.style.height = "100vh";
  iframe.style.colorScheme = "none";
  root.appendChild(iframe);
  document.documentElement.appendChild(root);
  observer.observe(iframe, { attributes: true });
  window.onclose = () => {
    observer.disconnect();
  };
  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.optionsConfig) {
      optionsConfig = changes.optionsConfig.newValue;
    }
  });
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.postMessage("init-tab-player-panel", "*", [
        channel.port2,
      ]);
      channel.port1.onmessage = (e) => {
        if (e.data === "dismiss") {
          toggle();
        }
      };
      iframe.contentWindow.focus();
      channel.port1.postMessage("redisplay");
    }, 200);
  };
}

init();
function toggle() {
  if (iframe) {
    iframe.style.display = iframe.style.display === "none" ? "block" : "none";
  } else {
    mount();
  }
}

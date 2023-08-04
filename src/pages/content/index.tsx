let iframe: HTMLIFrameElement | null = null;
let channel: MessageChannel | null = null;

console.log("content script loaded");
// 创建一个MutationObserver实例
const observer = new MutationObserver(function (mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "style") {
      console.log(iframe.style.display);
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
mount();
window.onkeydown = (e) => {
  if (e.key === "o" && e.metaKey && e.shiftKey) {
    if (iframe) {
      toggle();
    }
  } else if (e.key === "Escape") {
    if (iframe) {
      iframe.style.display = "none";
    }
  }
};

function mount() {
  const root = document.createElement("div");
  root.id = "tab-player-root";
  iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("src/pages/panel/index.html");
  iframe.id = "tab-player-iframe";
  iframe.style.width = "100vw";
  iframe.style.height = "100vh";
  iframe.style.display = "none";
  iframe.style.colorScheme = "none";
  root.appendChild(iframe);
  document.body.appendChild(root);
  observer.observe(iframe, { attributes: true });
}

window.onclose = () => {
  observer.disconnect();
};

function toggle() {
  iframe.style.display = iframe.style.display === "none" ? "block" : "none";
  if (!channel) {
    channel = new MessageChannel();
    iframe.contentWindow.postMessage("init-tab-player-panel", "*", [
      channel.port2,
    ]);
    channel.port1.onmessage = (e) => {
      if (e.data === "dismiss") {
        toggle();
      }
    };
  }
}

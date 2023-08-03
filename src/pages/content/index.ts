let iframe: HTMLIFrameElement | null = null;

console.log("content script loaded");
window.onkeydown = (e) => {
  if (e.key === "o" && e.metaKey && e.shiftKey) {
    if (iframe) {
      toggle();
    } else {
      mount();
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
  root.appendChild(iframe);
  document.body.appendChild(root);
  const channel = new MessageChannel();
  iframe.onload = () => {
    iframe?.contentWindow?.postMessage("init-tab-player-panel", "*", [
      channel.port2,
    ]);
    channel.port1.onmessage = (e) => {
      if (e.data === "dismiss") {
        toggle();
      }
    };
  };
}

function toggle() {
  if (iframe) {
    iframe.style.display = iframe.style.display === "none" ? "block" : "none";
    if (iframe.style.display === "none") {
      window.focus();
    }
  } else {
    mount();
  }
}

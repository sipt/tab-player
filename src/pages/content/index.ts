const root = document.createElement("div");
root.id = "tab-player-root";
const iframe = document.createElement("iframe");
iframe.src = chrome.runtime.getURL("src/pages/panel/index.html");
iframe.id = "tab-player-iframe";
root.appendChild(iframe);
document.body.appendChild(root);
window.onmessage = (event) => {
  console.log(event);
};

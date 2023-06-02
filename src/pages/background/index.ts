import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

//TODO: try this listener
// chrome.runtime.onMessage.addListener((request) => {
//   if (request.action === "open_options_page") {
//     chrome.runtime.openOptionsPage();
//   }
// });

//TODO: try this listener
// chrome.runtime.onMessage.addListener((request, sender) => {
//   if (request.action === "removeInjectedState") {
//     const tabId = sender.tab.id;
//     chrome.storage.local.remove(`injected_${tabId}`);
//   }
// });

//TODO: after installed extension
// chrome.runtime.onInstalled.addListener((details) => {
//   if (details.reason === "install") {
//     chrome.runtime.openOptionsPage();
//   }
// });

function sendMessageToActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "greets",
      });
    }
  });
}

setInterval(sendMessageToActiveTab, 2000);

console.log("background loaded");

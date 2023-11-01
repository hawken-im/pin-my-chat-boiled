import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

//TODO: try this listener
// chrome.runtime.onMessage.addListener((request) => {
//   if (request.action === "title_changed") {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       if (tabs[0]) {
//         chrome.tabs.sendMessage(tabs[0].id, {
//           action: "chage_title",
//         });
//       }
//     });
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

// function sendMessageToActiveTab() {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     if (tabs[0]) {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         action: "greets",
//       });
//     }
//   });
// }

// setInterval(sendMessageToActiveTab, 5000);

console.log("background loaded");

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.message === "get_tab_title") {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentTab = tabs[0];
//       if (currentTab) {
//         sendResponse({ title: currentTab.title || "No title" });
//       } else {
//         sendResponse({ title: "No active tab" });
//       }
//     });
//     return true; // This is important to make async sendResponse work.
//   }
// });

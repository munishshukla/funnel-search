/**
 * @description Background script for chrome extension
 * @author kodebroz
 * @contributor Munish shukla
 */

"use strict";
/**
 * @description listen for tab opening, it will open the a new tab with query string in it, if current tab is not containing google.com else reload the current tab with new query string.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: request.url });
      sendResponse({ data: "create new tab" });
    } else {
      var tab = tabs[0];
      if (tab.url && tab.url.includes("google.com")) {
        chrome.tabs.update(tab.id, { url: request.url });
      } else {
        chrome.tabs.create({ url: request.url });
      }
      sendResponse({ data: tab.url });
    }
  });
  return true;
});

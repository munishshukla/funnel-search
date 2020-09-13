// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

chrome.runtime.onInstalled.addListener(function () {
  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log('The color is green.');
  // });
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  //   chrome.declarativeContent.onPageChanged.addRules([{
  //     conditions: [new chrome.declarativeContent.PageStateMatcher()],

  //     actions: [new chrome.declarativeContent.ShowPageAction()]
  //   }]);
  // });
  console.log("onInstalled");
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.runtime.sendMessage({
    msg: "something_completed"
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.tabs.query({ active: true }, function (tabs) {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: request.url});
      sendResponse({ data: "if case" });
      //return;
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

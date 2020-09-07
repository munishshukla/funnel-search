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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("In the Listener Function");
  chrome.tabs.query({ active: true }, function (tabs) {
    console.log(tabs);
    if (tabs.length === 0) {
      sendResponse({ data: "if case" });
      //return;
    } else {
      sendResponse({ data: "else case" });
    }
  });
  return true;
  // console.log(request);
  // console.log(sender);
  // console.log(sendResponse);
});
// {
//   pageUrl: {hostEquals: 'developer.chrome.com'},
// }

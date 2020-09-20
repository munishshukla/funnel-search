// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";
let menu = [];
let query = document.getElementById("query");
menu.push(query);
let country = document.getElementById("country");
menu.push(country);
let domain = document.getElementById("domain");
menu.push(domain);
let language = document.getElementById("language");
menu.push(language);
let file = document.getElementById("file");
menu.push(file);
let time = document.getElementById("time");
menu.push(time);


for (let index = 0; index < menu.length; index++) {
  const element = menu[index];
  element.onclick = function (event) {
    removeActiveClassFromMenu();
    event.target.parentElement.classList.add("active");
    document.getElementById(
      event.target.parentElement.id + "Heading"
    ).style.display = "block";
    document.getElementById(
      event.target.parentElement.id + "Content"
    ).style.display = "block";
  };
}

function removeActiveClassFromMenu() {
  for (let index = 0; index < menu.length; index++) {
    const element = menu[index];
    element.classList.remove("active");
    document.getElementById(element.id + "Heading").style.display = "none";
    document.getElementById(element.id + "Content").style.display = "none";
  }
}

var removeElement = document.getElementsByClassName("removeData");
for (let index = 0; index < removeElement.length; index++) {
  const element = removeElement[index];
  element.onclick = function (event) {
    console.log("event", event.target);
    console.log(event.target.previousElementSibling);
    event.target.previousElementSibling.value = "";
    let chipId = event.target.previousElementSibling.id;
    removeChip(chipId);
  };
}

function removeChip(id) {
  let doc = document.getElementById(id + "chip");
  if (doc) {
    let key = id;
    chrome.storage.sync.remove(key, function (item) {
      console.log("Remove from storage", item);
    });
    doc.remove();
  }
}

var textField = document.getElementsByClassName("textfield");
for (let itr = 0; itr < textField.length; itr++) {
  const element = textField[itr];
  element.onblur = function (event) {
    console.log("on blur function");
    console.log(event);
    let id = event.target.id;
    let value = event.target.value;
    let target = event.target.getAttribute("activate");
    let arg = event.target.getAttribute("arg");
    let heading = event.target.getAttribute("heading");

    if (value && value.trim() !== "") {
      addClip(id, value, target, arg, heading, value);
    } else {
      removeChip(id);
    }
  };
}

var selectbox = document.getElementsByClassName("selectbox");
for (let itr = 0; itr < selectbox.length; itr++) {
  const element = selectbox[itr];
  element.onchange = function (event) {
    let id = event.target.id;
    let target = event.target.getAttribute("activate");
    let arg = event.target.getAttribute("arg");
    let heading = event.target.getAttribute("heading");
    let index = event.target.selectedIndex;
    console.log("id", id);
    console.log("target", target);
    if (index === 0) {
      // remove if exist
      removeChip(id);
    } else {
      let value = event.target.options[index].text;
      let label = event.target.options[index].value;
      console.log("valuelabel", value, label);
      addClip(id, value, target, arg, heading, label);
    }
  };
}

function addClip(id, value, target, arg, heading, label) {
  if (value && value.trim() !== "") {
    value = value.trim();

    let doc = document.getElementById(id + "chip");
    if (doc) {
      doc.lastChild.data = value;
      doc.setAttribute("search", label);
    } else {
      var badge = document.createElement("div");
      var figure = document.createElement("FIGURE");
      figure.classList.add("avatar");
      figure.classList.add("avatar-sm");
      figure.setAttribute("data-initial", heading);
      var textnode = document.createTextNode(value);
      badge.appendChild(figure);
      badge.appendChild(textnode);
      // badge.classList.add("label");
      // badge.classList.add("label-error");
      // badge.classList.add("label-rounded");

      badge.classList.add("chip");
      badge.classList.add("chipAction");
      badge.setAttribute("activate", target); // use for navigation
      badge.setAttribute("id", id + "chip"); //use to remove chip
      badge.setAttribute("arg", arg);
      badge.setAttribute("search", label);
      document.getElementById("badgeLocation").appendChild(badge);
    }
    let save = {};
    save[id] = value;
    chrome.storage.sync.set(save, function () {
      console.log("Value Saved!");
    });
    registerClip();
  }
}

function registerClip() {
  var clipBadge = document.getElementsByClassName("chipAction");
  for (let i = 0; i < clipBadge.length; i++) {
    clipBadge[i].onclick = function (event) {
      let classPointer = event.target.getAttribute("activate");
      document.getElementById(classPointer).firstElementChild.click();
    };
  }
}

document.getElementById("initiateSearch").onclick = function () {
  console.log("-----------initiateSearch----------");
  var clipBadge = document.getElementsByClassName("chipAction");
  var query = [];
  var timeRange = [];
  var flag = 0;
  for (let i = 0; i < clipBadge.length; i++) {
    let element = clipBadge[i];
    let id = element.getAttribute("id");
    let arg = element.getAttribute("arg");
    let search = element.getAttribute("search");
    if (id == "queryIncludechip") {
      flag = 1;
    }
    if (id == "timeFromchip" || id == "timeTochip") {
      timeRange.push(arg + ":" + search);
    } else {
      query.push(arg + "=" + search);
    }
  }

  if (flag == 0) {
    document.getElementById("query").firstElementChild.click();
    document.getElementById("queryInclude").style.borderColor = "#e85600";
  } else {
    document.getElementById("queryInclude").style.borderColor = "#bcc3ce";
    let finalQuery = "https://www.google.com/search?" + query.join("&");
    // tbs=cdr:1,cd_min:9/2/2020,cd_max:9/12/2020
    if (timeRange.length > 0) {
      finalQuery += "&tbs=cdr:1," + timeRange.join(",");
    }
    console.log("Final Query", finalQuery);
    chrome.runtime.sendMessage({ url: encodeURI(finalQuery) }, function (
      response
    ) {
      console.log("Waiting for response", response);
    });
  }
};

document.getElementById("initiateReset").onclick = function () {
  
  document.getElementById('queryInclude').nextElementSibling.click();
  document.getElementById('queryExclude').nextElementSibling.click();
  document.getElementById('queryExact').nextElementSibling.click();
  document.getElementById('domainInput').nextElementSibling.click();


  document.getElementById('timeFrom').value = '';
  removeChip('timeFrom');
  document.getElementById('timeTo').value = '';
  removeChip('timeTo');

  document.getElementById('countryId').selectedIndex = 0;
  removeChip('countryId');
  document.getElementById('languageId').selectedIndex = 0;
  removeChip('languageId');
  document.getElementById('lastupdate').selectedIndex = 0;
  removeChip('lastupdate');
  document.getElementById('fileId').selectedIndex = 0;
  removeChip('fileId');
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.msg);
});

console.log("load");
chrome.storage.sync.get("queryInclude", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    let ele = document.getElementById(key);
    ele.value = items[key];
    ele.dispatchEvent(new Event("blur"));
  }
});
chrome.storage.sync.get("queryExclude", function (items) {
  console.log("-------------------Exclude---------------", items);
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let ele = document.getElementById(key);
      ele.value = items[key];
      ele.dispatchEvent(new Event("blur"));
    }
  }
});
chrome.storage.sync.get("queryExact", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let ele = document.getElementById(key);
      ele.value = items[key];
      ele.dispatchEvent(new Event("blur"));
    }
  }
});
chrome.storage.sync.get("domainInput", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let ele = document.getElementById(key);
      ele.value = items[key];
      ele.dispatchEvent(new Event("blur"));
    }
  }
});
chrome.storage.sync.get("countryId", function (items) {
  console.log("countryId", items);
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let sel = document.getElementById(key);

      for (var i = 0, j = sel.options.length; i < j; ++i) {
        if (sel.options[i].text === items[key]) {
          sel.selectedIndex = i;
          break;
        }
      }
      sel.dispatchEvent(new Event("change"));
    }
  }
});
chrome.storage.sync.get("languageId", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let sel = document.getElementById(key);

      for (var i = 0, j = sel.options.length; i < j; ++i) {
        if (sel.options[i].text === items[key]) {
          sel.selectedIndex = i;
          break;
        }
      }
      sel.dispatchEvent(new Event("change"));
    }
  }
});

chrome.storage.sync.get("lastupdate", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let sel = document.getElementById(key);

      for (var i = 0, j = sel.options.length; i < j; ++i) {
        if (sel.options[i].text === items[key]) {
          sel.selectedIndex = i;
          break;
        }
      }
      sel.dispatchEvent(new Event("change"));
    }
  }
});
chrome.storage.sync.get("fileId", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let sel = document.getElementById(key);

      for (var i = 0, j = sel.options.length; i < j; ++i) {
        if (sel.options[i].text === items[key]) {
          sel.selectedIndex = i;
          break;
        }
      }
      sel.dispatchEvent(new Event("change"));
    }
  }
});

chrome.storage.sync.get("timeFrom", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let ele = document.getElementById(key);
      ele.value = items[key];
      ele.dispatchEvent(new Event("blur"));
    }
  }
});

chrome.storage.sync.get("timeTo", function (items) {
  if (items) {
    let key = Object.keys(items)[0];
    if (key) {
      let ele = document.getElementById(key);
      ele.value = items[key];
      ele.dispatchEvent(new Event("blur"));
    }
  }
});

// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";
var storage = 'funnel_search';
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
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };
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
  }
}

function removeChip(id) {
  let doc = document.getElementById(id + 'chip');
  if(doc){
    doc.remove();
  }
}

var textField = document.getElementsByClassName("textfield");
for (let itr = 0; itr < textField.length; itr++) {
  const element = textField[itr];
  element.onblur = function (event) {
    let id = event.target.id;
    let value = event.target.value;
    let target = event.target.getAttribute('activate');
    if (value && value.trim() !== '') {
      addClip(id, value, target);
    }else{
      removeChip(id);
    }
  }
}

var selectbox = document.getElementsByClassName("selectbox");
for (let itr = 0; itr < selectbox.length; itr++) {
  const element = selectbox[itr];
  element.onchange = function (event) {
    let id = event.target.id;
    let target = event.target.getAttribute('activate');
    let index = event.target.selectedIndex;
    console.log('id', id);
    console.log('target', this.target);
    if(index===0){
      // remove if exist
      removeChip(id);
    }else{
      let value = event.target.options[index].text;
      console.log('value',value);
      addClip(id, value, target);
    }
  }
}

function addClip(id, value, target) {
  if (value && value.trim() !== '') {
    value = value.trim();
    var badge = document.createElement('span');
    var textnode = document.createTextNode(value);
    badge.appendChild(textnode);
    // badge.classList.add("label");
    // badge.classList.add("label-error");
    // badge.classList.add("label-rounded");
    badge.classList.add('chip');
    badge.classList.add("chipAction");
    
    badge.setAttribute('activate', target); // use for navigation
    badge.setAttribute('id', id + 'chip'); //use to remove chip
    badge.setAttribute('targetKey', id);
    let key = storage+'_'+id;
    chrome.storage.sync.set({key: value}, function() {
      console.log('chrome.storage.sync.set', key, value);
      chrome.storage.sync.get(key, function(result) {
        console.log('Value currently is ');
        console.log(result.key);
      });
    });
    document.getElementById("badgeLocation").appendChild(badge);
    registerClip();
  }
}

function registerClip() {
  var clipBadge = document.getElementsByClassName("chipAction");
  for (let i = 0; i < clipBadge.length; i++) {
    clipBadge[i].onclick = function (event) {
      let classPointer = event.target.getAttribute('activate');
      document.getElementById(classPointer).firstElementChild.click()
    }
  }
} 


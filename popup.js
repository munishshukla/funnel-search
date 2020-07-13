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

// function clearInput(event) {
//   console.log(event.target.parentElement);
// }

var removeElement = document.getElementsByClassName("icon-cross");
for (let index = 0; index < removeElement.length; index++) {
  const element = removeElement[index];
  element.onclick = function (event) {
    event.target.previousElementSibling.value = "";
  }
}

//Load County array 

// document.getElementById("countryId").selectedIndex = 0;
// document.getElementById("timeFrom").value = ""


// query.onclick = function(event) {
//   console.log("query onclick");
//   console.log(event.target.parentElement);
// };

// country.onclick = function(event) {

// };

// domain.onclick = function(event) {

// };

// language.onclick = function(event) {

// };

// file.onclick = function(event) {

// };

// time.onclick = function(event) {

// };

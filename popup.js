/**
 * @description Background script for chrome extension
 * @author kodebroz
 * @contributor Munish shukla
 */
"use strict";

/**
 * @description menu for advance options, displayed on the popup.html
 */
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

/**
 * @description Register onclick event on menu item, it will remove active class and add action to the current element, apart from that it will also the correct section on the click.
 */
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

/**
 * @description Removes active on all the elements and convert all the crossponding section hidden.
 */
function removeActiveClassFromMenu() {
  for (let index = 0; index < menu.length; index++) {
    const element = menu[index];
    element.classList.remove("active");
    document.getElementById(element.id + "Heading").style.display = "none";
    document.getElementById(element.id + "Content").style.display = "none";
  }
}

/**
 * @description Register remove content from text fields element. when click on this class wit will set text filed value to empty and remove the respective badge/chip from the bottom section.
 */
var removeElement = document.getElementsByClassName("removeData");
for (let index = 0; index < removeElement.length; index++) {
  const element = removeElement[index];
  element.onclick = function (event) {
    event.target.previousElementSibling.value = "";
    let chipId = event.target.previousElementSibling.id;
    removeChip(chipId);
  };
}

/**
 * @description Function remove the chip/badge from bottom section and remove the corrosponding key from local storage.
 * @param {string} id - id of the element to remove e.g queryInclude, unique id is assign to every textfield/ selectbox, according to that a chip element is create at the bottom footer.
 */
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

/**
 * @description Convert date format to mm/dd/yyyy
 * @param {string} value - date object from input type date
 * @returns {string} new date format mm/dd/yyyy
 */
function formatDate(value) {
  let date = new Date(value);
  return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/");
}

/**
 * @description Register onblur event textfield element and call add/remove chip from the bottom function
 * @var {id} - id of the text field
 * @var {value} - value of the textfield
 * @var {arg} - search query parameter from google search
 * @var {activate} - navigation from textfield belongs, e.g. query
 * @var {heading} - Initials to append on the chip/badge
 */
var textField = document.getElementsByClassName("textfield");
for (let itr = 0; itr < textField.length; itr++) {
  const element = textField[itr];
  element.onblur = function (event) {
    console.log("on blur function");
    console.log(event);

    let id = event.target.id;
    let value = event.target.value;
    let label = value;
    if (id == "timeFrom" || id == "timeTo") {
      label = formatDate(value);
    }
    let target = event.target.getAttribute("activate");
    let arg = event.target.getAttribute("arg");
    let heading = event.target.getAttribute("heading");

    if (value && value.trim() !== "") {
      addClip(id, value, target, arg, heading, label);
    } else {
      removeChip(id);
    }
  };
}

/**
 * @description register event on selectbox, and call add/remove chip from the bottom function
 * @var {id} - id of the text field
 * @var {index} - selected index from option, 0 for the first option
 * @var {arg} - search query parameter from google search
 * @var {activate} - navigation from selectbox belongs, e.g. query
 * @var {heading} - Initials to append on the chip/badge
 */
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

/**
 *
 * @param {string} id Id of a textfield or slectbox element, e.g queryInclude etc.
 * @param {string} value data to display inside chip/badge
 * @param {string} target nativage to given id section, e.g. query
 * @param {string} arg query string parameter for google search
 * @param {string} heading header to append in the chip/badge section
 * @param {string} label value used for search in querystring
 */
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

/**
 * @description Register all the clip/badge to natigate to provided section e.g. query
 */
function registerClip() {
  var clipBadge = document.getElementsByClassName("chipAction");
  for (let i = 0; i < clipBadge.length; i++) {
    clipBadge[i].onclick = function (event) {
      let classPointer = event.target.getAttribute("activate");
      document.getElementById(classPointer).firstElementChild.click();
    };
  }
}

/**
 * @description function for initiate search based on the chip/badge value, it will form the query and request to the background to initiate the search
 */
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

/**
 * @description Reset all the value
 */
document.getElementById("initiateReset").onclick = function () {
  document.getElementById("queryInclude").nextElementSibling.click();
  document.getElementById("queryExclude").nextElementSibling.click();
  document.getElementById("queryExact").nextElementSibling.click();
  document.getElementById("domainInput").nextElementSibling.click();

  document.getElementById("timeFrom").value = "";
  removeChip("timeFrom");
  document.getElementById("timeTo").value = "";
  removeChip("timeTo");

  document.getElementById("countryId").selectedIndex = 0;
  removeChip("countryId");
  document.getElementById("languageId").selectedIndex = 0;
  removeChip("languageId");
  document.getElementById("lastupdate").selectedIndex = 0;
  removeChip("lastupdate");
  document.getElementById("fileId").selectedIndex = 0;
  removeChip("fileId");
};

/**
 * @description Load previous saved query from local storage
 */
(function () {
  chrome.storage.sync.get("queryInclude", function (items) {
    if (items) {
      let key = Object.keys(items)[0];
      if (key) {
        let ele = document.getElementById(key);
        ele.value = items[key];
        ele.dispatchEvent(new Event("blur"));
      }
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
})();

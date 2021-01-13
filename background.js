let db = null;

chrome.runtime.onInstalled.addListener((details) => {
  let request = indexedDB.open("KeepinExtension", 1);

  // request.onerror = function (event) {
  //     alert("reload your page again");
  // };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("MessagesInformation", { autoIncrement: true });
  };

  request.onsuccess = function (event) {
    db = event.target.result;
  };
})

function add(new_message) {
  let objStore = db.transaction("MessagesInformation", "readwrite").objectStore("MessagesInformation");
  objStore.add(new_message);
}

function read(tabId, sendto) {
  let objStore = db.transaction("MessagesInformation", "readonly").objectStore("MessagesInformation");
  let fulldb = [];
  objStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let curr_message = {
        "key": cursor.key,
        "name": cursor.value.name,
        "text": cursor.value.text,
        "time_of_message": cursor.value.time_of_message,
        "date_of_message": cursor.value.date_of_message,
        "message_thread": cursor.value.message_thread,
        "list_number": cursor.value.list_number,
        "extra_text": cursor.value.extra_text
      }
      fulldb.push(curr_message);
      cursor.continue();
    }
    else {
      if (sendto === "message_page") {
        chrome.tabs.sendMessage(tabId, {
          type: "call_everything_from_message_page",
          fulldb: fulldb
        });
      }
      else if (sendto === "main_page") {
        chrome.tabs.sendMessage(tabId, {
          type: "call_everything_from_main_page",
          fulldb: fulldb
        });
      }
      else if (sendto === "popup") {
        chrome.runtime.sendMessage({
          type: "send_data_to_pop_up",
          fulldb: fulldb
        });
      }
    }
  }
}

function update(final_value) {
  let objStore = db.transaction("MessagesInformation", "readwrite").objectStore("MessagesInformation");

  objStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      if(cursor.value.name == final_value.name && cursor.value.text == final_value.text && cursor.value.time_of_message == final_value.time_of_message && cursor.value.date_of_message == final_value.date_of_message){  
        let update_data = cursor.value;
        update_data.extra_text = final_value.extra_text;
        cursor.update(update_data);
      }
      else{
        cursor.continue();
      }
    }
  }
}

function deleted(key) {
  let objStore = db.transaction("MessagesInformation", "readwrite").objectStore("MessagesInformation");
  objStore.delete(key);
}

chrome.runtime.onMessage.addListener((request, sender) => {

  if (request.type === "add") {
    add(request.new_message);
  }
  else if (request.type === "read") {
    if (request.come_from === "popup") {
      read(request.tabId, request.come_from);
    }
  }
  else if (request.type === "update") {
    update(request.final_value);
  }
  else if (request.type === "delete") {
    deleted(request.key);
  }
})


chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    if (tab.url.includes("https://www.linkedin.com/messaging/")) {
      read(tabId, "message_page");
    }
  });


chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    if (tab.url.includes("https://www.linkedin.com/")) {
      read(tabId, "main_page");
    }
  });


function add(db, new_message, fulldb) {
  let objStore = db.transaction("MessagesInformation", "readwrite").objectStore("MessagesInformation");
  objStore.add(new_message);
  chrome.runtime.sendMessage({
    type: "main_page",
    fulldb: fulldb
  });
}

function read(db, tabId, sendto) {

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
      if (sendto === "main_page") {
        chrome.tabs.sendMessage(tabId, {
          type: "main_page",
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

function update(db, final_value) {
  let objStore = db.transaction("MessagesInformation", "readwrite").objectStore("MessagesInformation");

  objStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      if (cursor.value.name == final_value.name && cursor.value.text == final_value.text && cursor.value.time_of_message == final_value.time_of_message && cursor.value.date_of_message == final_value.date_of_message) {
        let update_data = cursor.value;
        update_data.extra_text = final_value.extra_text;
        cursor.update(update_data);
      }
      else {
        cursor.continue();
      }
    }
  }
}

function deleted(db, key) {
  let objStore = db.transaction("MessagesInformation", "readwrite").objectStore("MessagesInformation");
  objStore.delete(key);
}

chrome.runtime.onMessage.addListener((request, sender) => {

  let db = null;
  let database = indexedDB.open("KeepinExtension", 1);

  database.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("MessagesInformation", { autoIncrement: true });
  };

  database.onsuccess = function (event) {
    db = event.target.result;

    if (request.type === "add") {
      add(db, request.new_message, request.fulldb);
    }
    else if (request.type === "read") {
      if (request.come_from === "popup") {
        read(db, request.tabId, request.come_from);
      }
    }
    else if (request.type === "update") {
      update(db, request.final_value);
    }
    else if (request.type === "delete") {
      deleted(db, request.key);
    }
  };
})


chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    if (tab.url.includes("https://www.linkedin.com/")) {
      let db = null;
      let database = indexedDB.open("KeepinExtension", 1);

      database.onupgradeneeded = function (event) {
        db = event.target.result;
        db.createObjectStore("MessagesInformation", { autoIncrement: true });
      };

      database.onsuccess = function (event) {
        db = event.target.result;
        read(db, tabId, "main_page");
      }
    }
  });

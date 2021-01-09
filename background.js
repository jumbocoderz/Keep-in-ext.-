
chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    if (tab.url.includes("https://www.linkedin.com/messaging/")) {
      chrome.tabs.executeScript({
        file: 'message_page.js'
      });
    }
  });


chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    if (tab.url.includes("https://www.linkedin.com/feed/") || tab.url.includes("https://www.linkedin.com/messaging/")) {
      chrome.tabs.executeScript({
        file: 'main_page.js'
      });
    }
  });

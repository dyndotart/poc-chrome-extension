chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'callFunction') {
    // Do something with the data
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    chrome.runtime.sendMessage({
      message: 'Hello from the service worker',
      url: changeInfo.url,
    });
    console.log('Tab with ID: ' + tabId + ' has a new URL: ' + changeInfo.url);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('You just installed physical.art');
});

export {};

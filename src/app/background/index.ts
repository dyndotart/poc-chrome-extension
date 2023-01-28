chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Only send event to 'contentScript' if the url matches the url the 'contentScript'
  // is actually active. Otherwise it will result in an error
  if (tab.url?.match(/https:\/\/.*\.etsy\.com\/.*/) && changeInfo.url != null) {
    chrome.tabs.sendMessage(tabId, {
      event: 'URL_CHANGE',
      data: {
        url: changeInfo.url,
      },
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('You just installed the physical.art Chrome Extension!');
});

export {};

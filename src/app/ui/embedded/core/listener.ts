chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Debug: Message from Background Script', request);
});

export function onLoad() {
  const url = location.href;
}

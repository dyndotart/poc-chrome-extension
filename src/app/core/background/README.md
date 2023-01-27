# Background Chunk
> Script that runs in the background of this Chrome Extension (Chrome Browser) and is used to listen on Chrome related events like bookmarks.

- [Docs](https://developer.chrome.com/docs/extensions/mv3/service_workers/)

Events are browser triggers, such as navigating to a new page, removing a bookmark, or closing a tab. Extensions monitor these events using scripts in an extension service worker (previously called a background script), which then executes specified instructions.
# Etsy Scrapper


# 🔴 Issues

### `Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.`
- [Stackoverflow](https://stackoverflow.com/questions/71848934/uncaught-in-promise-error-could-not-establish-connection-receiving-end-does)

---


# 👨‍🏫 Learnings

## Chrome

### Manifest V3
- [Docs](https://developer.chrome.com/docs/extensions/mv3/intro/)

### Permissions
- [Docs](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)

### Service Worker
- [Docs](https://developer.chrome.com/docs/workbox/service-worker-overview/)

Events are browser triggers, such as navigating to a new page, removing a bookmark, or closing a tab. Extensions monitor these events using scripts in an extension service worker (previously called a background script), which then executes specified instructions.

### Content Scripts
- [Docs](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

Content scripts are files that run in the context of web pages. By using the standard Document Object Model (DOM), they are able to read details of the web pages the browser visits, make changes to them, and pass information to their parent extension.

### Share Code between different parts of Chrome Extension
- [Stackoverflow](https://stackoverflow.com/questions/24227874/can-i-share-code-between-different-parts-of-chrome-extension)

### Storage
- [Tutorial](https://www.youtube.com/watch?v=XIyTH5Z_xy8&list=PLBS1L3Ug2VVods9GnWbJc__STt9VnrJ9Z&index=11)
- [SQLite in Chrome](https://developer.chrome.com/blog/sqlite-wasm-in-the-browser-backed-by-the-origin-private-file-system/)
- [IndexDB](https://www.youtube.com/watch?v=bUSDQLEjW_M)

### Add custom extensions to Browser
- First open `brave://extensions`
- Click `Load unpacked`
- Open this project (root is `manifest.json`)

### Can the background script only run for specific urls
- [Stackoverflow](https://stackoverflow.com/questions/58649967/how-to-run-background-js-only-on-specific-links)
- No it can't as it runs in a separate hidden background page

## Webpack
- [Website](https://webpack.js.org/)
- Webpack is a JavaScript module bundler.
- It takes multiple JavaScript files and modules and bundles them into a single file (or a few files) that can be loaded by a web browser.
- It also allows you to use other assets in your application, such as CSS, images, and fonts and process them as well.
- It provides a development server with features such as hot module replacement.
- It can be configured with plugins and loaders to transpile, minify and optimize your code.
- It is commonly used in modern JavaScript frameworks and libraries such as React, Angular, and Vue.js.

## TailwindCSS
- [Docs](https://tailwindcss.com)
- [Setup with PostCSS](https://tailwindcss.com/docs/installation/using-postcss)

## React Router
- [Docs](https://reactrouter.com/en/main)

### Hash Router
- [Docs](https://reactrouter.com/en/main/routers/create-hash-router)

Instead of using normal URLs, the `HashRouter` uses the hash (`#`) portion of the URL to manage the "application URL". This is necessary as a Chrome Extension as no actual URLs to navigate to.

## Etsy
- https://www.youtube.com/watch?v=mzyiqXiscfU

---

# Resources
- [ReactJS Chrome Extension using ReactJS 18 & Webpack 5](https://www.youtube.com/watch?v=rAZXWkVhCgg&list=PLBS1L3Ug2VVods9GnWbJc__STt9VnrJ9Z)
- [NextJs Chrome Extension with Notion API](https://birdeatsbug.com/blog/build-a-chrome-extension-in-next-js-and-notion-api)
- [Chrome Extension Boilerplate ReactJs](https://github.com/lxieyang/chrome-extension-boilerplate-react)
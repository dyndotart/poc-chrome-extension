import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';
import './core';
import $ from 'jquery';

// Styles
import '../../styles/tailwind.css';

function initReact() {
  const appContainer = document.createElement('div');
  document.body.appendChild(appContainer);
  if (!appContainer) {
    throw new Error('Can not find AppContainer');
  }
  const root = createRoot(appContainer);
  root.render(
    <HashRouter>
      <Routes />
    </HashRouter>
  );
}

function initReactSearch() {
  let observer: MutationObserver | null = null;

  // Inject HTML into Search Suggestions
  $('#global-enhancements-search-query').on('input', async function () {
    const searchTerm = $(this).val();

    if (searchTerm != null) {
      const suggestionNode = document.querySelector(
        '#global-enhancements-search-suggestions'
      );
      if (suggestionNode != null) {
        // Disconnect old Suggestions Element Observer
        if (observer != null) {
          observer.disconnect();
          observer = null;
        }

        // Create new Observer to listen on Suggestion changes
        // so the HTML can be injected on the new Suggestion Elements
        observer = new MutationObserver(function () {
          console.log('Debug: Init Search Elements for Term: ', searchTerm);
          const suggestionContainer = $(
            '#global-enhancements-search-suggestions'
          );
          let divElements = suggestionContainer.find('.as-entry');
          divElements.each(function () {
            $(this).append('<p>Test</p>');
          });

          // Disconnect Observer as soon as Elements of Suggestion Container have changed once
          // -> New Suggestions were loaded
          if (observer != null) {
            observer.disconnect();
            observer = null;
          }
        });

        // Register Suggestion Element Observer
        observer.observe(suggestionNode, { childList: true });
      }
    }
  });
}

function init() {
  initReactSearch();
  initReact();
}

init();

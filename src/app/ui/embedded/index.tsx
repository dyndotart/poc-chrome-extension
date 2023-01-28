import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';
import './core';

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

function init() {
  initReact();
}

init();

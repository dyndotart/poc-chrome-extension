import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';

// Styles
import '../../styles/tailwind.css';

function init() {
  const appContainer = document.createElement('div');
  document.body.appendChild(appContainer);
  if (!appContainer) {
    throw new Error('Can not find AppContainer');
  }
  const root = createRoot(appContainer);
  console.log(appContainer);
  root.render(
    <HashRouter>
      <Routes />
    </HashRouter>
  );
}

init();

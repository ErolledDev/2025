import { renderHomePage } from './pages/home.js';
import { renderRedirectPage } from './pages/redirect.js';

function router() {
  const path = window.location.pathname;
  const app = document.getElementById('app');

  switch (path) {
    case '/':
      renderHomePage(app);
      break;
    case '/u':
      renderRedirectPage(app);
      break;
    default:
      renderHomePage(app);
  }
}

window.addEventListener('popstate', router);
router();
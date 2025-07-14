import { showLanding } from '../views/landing.js';
import { showLogin } from '../views/login.js';
import { showRegister } from '../views/register.js';
import { showDashboard } from '../views/dashboard.js';
import { showNotFound } from '../views/404.js';

export function router() {
  const routes = {
    '': showLanding,
    '#/': showLanding,
    '#/login': showLogin,
    '#/register': showRegister,
    '#/dashboard': showDashboard,
  };

  const path = location.hash || '#/';
  const app = document.getElementById('app');

  // Protection redirect if there is no active session
  if (path === '#/dashboard' && !localStorage.getItem('currentUser')) {
    location.hash = '#/login';
    return;
  }

  app.innerHTML = '';
  const render = routes[path] || showNotFound;
  render(app);

  updateHeader(path);
}

// Function to update header buttons depending on path and session
function updateHeader(path) {
  const navContainer = document.getElementById('nav-buttons');
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!navContainer) return;

  if (path === '#/' || path === '#/login' || path === '#/register') {
    // Show buttons only if user is NOT logged in
    if (!user) {
      navContainer.innerHTML = `
        <button onclick="location.hash='#/login'">Iniciar Sesión</button>
        <button onclick="location.hash='#/register'">Registrarse</button>
      `;
    } else {
      navContainer.innerHTML = `
        <button id="logout-btn">Cerrar sesión</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        location.hash = '#/';
      });
    }
  }
}

import { showLanding } from '../views/landing.js';
import { showLogin } from '../views/login.js';
import { showRegister } from '../views/register.js';
import { showDashboard } from '../views/dashboard.js';
import { showNotFound } from '../views/404.js';


  const routes = {
    '': showLanding,
    '#/': showLanding,
    '#/login': showLogin,
    '#/register': showRegister,
    '#/dashboard': showDashboard,
    '#/not-found': showNotFound
  };

  // Implementation the guard

  export function router() {

  const path = location.hash || '#/';
  const currentUser = localStorage.getItem('currentUser');

  // If user is logged in, redirect from landing to dashboard
  if (currentUser && (path === '#/' || path === '')) {
    location.hash = '#/dashboard';
    return;
  }

  // Protect dashboard route, redirect to login if not logged in
  if (path === '#/dashboard' && !currentUser) {
    location.hash = '#/login';
    return;
  } else {
    // If route doesn't exist, show 404 page
    window.location.hash = '#/not-found';
  }

  const app = document.getElementById('app');
  app.innerHTML = '';

  // Render the view corresponding to the route or 404 if none matches
  const render = routes[path] || showNotFound;
  render(app);

  actualizarHeader(path);
}

function actualizarHeader(path) {
  const navContainer = document.getElementById('nav-buttons');
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!navContainer) return;

  // Show login/register buttons only when NOT logged in and on auth or landing pages
  if (path === '#/' || path === '#/login' || path === '#/register') {
    if (!user) {
      navContainer.innerHTML = `
        <button onclick="location.hash='#/login'">Iniciar Sesión</button>
        <button onclick="location.hash='#/register'">Registrarse</button>
      `;
    } else {
      // Show logout button when user is logged in
      navContainer.innerHTML = `
        <button id="logout-btn">Cerrar sesión</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');  // Clear session
        location.hash = '#/';                    // Redirect to landing
      });
    }
  }
}

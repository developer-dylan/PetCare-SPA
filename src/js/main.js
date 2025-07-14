import { router } from './router.js';

// On page load, redirect if session exists, then run router
window.addEventListener('load', () => {
  if (localStorage.getItem('currentUser')) {
    location.hash = '#/dashboard';
  }
  router();
});

// Listen hash changes to update views
window.addEventListener('hashchange', router);

import { router } from './router.js';

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// Espera a que todo el HTML esté disponible
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado ');

  const loginBtn = document.getElementById('go-to-login');
  const registerBtn = document.getElementById('go-to-register');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      console.log('Ir a login');
      location.hash = '#/login';
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      console.log('Ir a register');
      location.hash = '#/register';
    });
  }
});

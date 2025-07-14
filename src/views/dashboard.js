import { showDashboardWorker } from './dashboardWorker.js';
import { showDashboardCustomer } from './dashboardCustomer.js';

export function showDashboard(container) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    location.hash = '#/login';
    return;
  }

  if (currentUser.rolId === 1) {
    showDashboardWorker(container, currentUser);
  } else if (currentUser.rolId === 2) {
    showDashboardCustomer(container, currentUser);
  }
}

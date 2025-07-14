// Import worker and customer dashboard views
import { showDashboardWorker } from "./dashboardWorker.js";
import { showDashboardCustomer } from "./dashboardCustomer.js";

// Function to determine which dashboard to show based on user role
export function showDashboard(container) {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If no user is logged in, redirect to login page
  if (!currentUser) {
    location.hash = "#/login";
    return;
  }

  // Show the appropriate dashboard based on role
  if (currentUser.rolId === 1) {
    showDashboardWorker(container, currentUser);
  } else if (currentUser.rolId === 2) {
    showDashboardCustomer(container, currentUser);
  }
}

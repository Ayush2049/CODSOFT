import { isAuthenticated } from '../../frontend/js/util.js';

// Simple router
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('login.html') || path === '/') {
    if (isAuthenticated()) {
      window.location.href = '/views/dashboard.html';
    }
  } else if (path.endsWith('dashboard.html')) {
    if (!isAuthenticated()) {
      window.location.href = '/views/login.html';
    }
  }
});
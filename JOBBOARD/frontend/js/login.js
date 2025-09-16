import { AuthService } from '../../frontend/js/auth.js';
import { clearError, showError, redirectTo } from '../../frontend/js/util.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userType = document.getElementById('userType').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Clear previous errors
      clearError('emailError');
      clearError('passwordError');

      try {
        if (userType === 'user') {
          await AuthService.loginUser({ email, password });
        } else {
          await AuthService.loginCompany({ email, password });
        }

        // Redirect to dashboard after successful login
        redirectTo('/frontend/views/dashboard.html'); // Or './dashboard.html' if in same directory
      } catch (error) {
        showError('passwordError', error.message || 'Login failed. Please try again.');
      }
    });
  }
});
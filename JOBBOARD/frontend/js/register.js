import { AuthService } from '../../frontend/js/auth.js';
import { clearError, showError, redirectTo } from '../../frontend/js/util.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userType = document.getElementById('registerUserType').value;
      const name = document.getElementById('name').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      // Clear previous errors
      clearError('nameError');
      clearError('registerEmailError');
      clearError('registerPasswordError');

      try {
        if (userType === 'user') {
          await AuthService.registerUser({ name, email, password });
        } else {
          await AuthService.registerCompany({ name, email, password });
        }

        // Redirect to dashboard after successful registration
        redirectTo('/frontend/views/dashboard.html');
      } catch (error) {
        showError('registerPasswordError', error.message || 'Registration failed. Please try again.');
      }
    });
  }
});
// Helper functions
export const showError = (elementId, message) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
};

export const clearError = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
  }
};

export const storeAuthToken = (token, userType) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userType', userType);
};

export const getAuthToken = () => localStorage.getItem('token');
export const getUserType = () => localStorage.getItem('userType');

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
};

export const isAuthenticated = () => !!getAuthToken();

export const redirectTo = (path) => {
  window.location.href = path;
};
import { apiRequest } from '../../frontend/js/api.js';
import { storeAuthToken, getAuthToken, getUserType, clearError, showError, redirectTo } from '../../frontend/js/util.js';

export const AuthService = {
  // User registration
  async registerUser(userData) {
    try {
      const data = await apiRequest('/auth/user/register', 'POST', userData);
      storeAuthToken(data.token, data.userType);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Company registration
  async registerCompany(companyData) {
    try {
      const data = await apiRequest('/auth/company/register', 'POST', companyData);
      storeAuthToken(data.token, data.userType);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // User login
  async loginUser(credentials) {
    try {
      const data = await apiRequest('/auth/user/login', 'POST', credentials);
      storeAuthToken(data.token, data.userType);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Company login
  async loginCompany(credentials) {
    try {
      const data = await apiRequest('/auth/company/login', 'POST', credentials);
      storeAuthToken(data.token, data.userType);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const userType = getUserType(); // Get from localStorage
      const endpoint = `/auth/${userType}`; // Will be /auth/user or /auth/company
      const data = await apiRequest(endpoint);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.clear();
    redirectTo('/frontend/views/login.html');
  }
};
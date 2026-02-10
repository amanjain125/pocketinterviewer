const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to include auth header
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// User Authentication API
export const authService = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error during registration' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error during login' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        // Token might be invalid, remove it
        localStorage.removeItem('token');
        return null;
      }
    } catch (error) {
      console.error('Get user error:', error);
      localStorage.removeItem('token');
      return null;
    }
  }
};

// Interview API
export const interviewService = {
  saveInterview: async (interviewData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(interviewData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, interview: data.interview };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error('Save interview error:', error);
      return { success: false, message: 'Network error saving interview' };
    }
  },

  getUserInterviewHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/history/${userId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, interviews: data.interviews };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error('Get interview history error:', error);
      return { success: false, message: 'Network error getting interview history' };
    }
  },

  getInterview: async (interviewId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/${interviewId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, interview: data.interview };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error('Get interview error:', error);
      return { success: false, message: 'Network error getting interview' };
    }
  }
};
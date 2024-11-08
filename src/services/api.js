import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api/university';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const chatApi = {
  sendMessage: (message) => api.post('/chat/query', { question: message }),
  getFAQs: () => api.get('/faqs'),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
  createFAQ: (faq) => api.post('/admin/faqs', faq),
  updateFAQ: (id, faq) => api.put(`/admin/faqs/${id}`, faq),
  deleteFAQ: (id) => api.delete(`/admin/faqs/${id}`),
};

export const faqApi = {
  getAllFAQs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  getFAQById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      throw error;
    }
  },

  createFAQ: async (faq) => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faq),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  },

  updateFAQ: async (id, faq) => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faq),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  },

  deleteFAQ: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  },
};

export default api;
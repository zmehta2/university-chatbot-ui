import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';

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
  sendMessage: (message) => api.post('/api/university/chat/query', { question: message }),
  getFAQs: () => api.get('/api/university/faqs'),
  getUserHistory: (userId)=> api.get(`/api/chat-history/user/${userId}`),
  getPopularQuestions: () => api.get('/api/chat-history/analytics/popular-questions'),
  submitFeedback: (chatLogId) => api.get(`/api/chat-history/feedback/${chatLogId}`)

};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

export const adminApi = {
  getAnalytics: () => api.get('/api/university/admin/analytics'),
  createFAQ: (faq) => api.post('/api/university/admin/faqs', faq),
  updateFAQ: (id, faq) => api.put(`/api/university/admin/faqs/${id}`, faq),
  deleteFAQ: (id) => api.delete(`/api/university/admin/faqs/${id}`),
};

export const faqApi = {
  getAllFAQs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/university/faqs`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  getFAQById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/university/faqs/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      throw error;
    }
  },

  createFAQ: async (faq) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/university/faqs`, {
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
      const response = await fetch(`${API_BASE_URL}/api/university/faqs/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/university/faqs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  },


  getUserHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-history/user/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw error;
    }
  },

  submitFeedback: async (chatLogId, feedback) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-history/feedback/${chatLogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  getPopularQuestions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-history/analytics/popular-questions`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular questions:', error);
      throw error;
    }
  }

};
export default api;
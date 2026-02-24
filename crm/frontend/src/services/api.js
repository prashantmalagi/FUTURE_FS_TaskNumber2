import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('crm_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  register: (data) => API.post('/auth/register', data),
  getUsers: () => API.get('/auth/users'),
};

export const leadsAPI = {
  getAll: (params) => API.get('/leads', { params }),
  getOne: (id) => API.get(`/leads/${id}`),
  create: (data) => API.post('/leads', data),
  update: (id, data) => API.put(`/leads/${id}`, data),
  delete: (id) => API.delete(`/leads/${id}`),
  addNote: (id, content) => API.post(`/leads/${id}/notes`, { content }),
  deleteNote: (id, noteId) => API.delete(`/leads/${id}/notes/${noteId}`),
  addFollowUp: (id, data) => API.post(`/leads/${id}/followups`, data),
  updateFollowUp: (id, followUpId, data) => API.patch(`/leads/${id}/followups/${followUpId}`, data),
};

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

export default API;

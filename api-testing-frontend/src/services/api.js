import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const collectionService = {
  getAll: () => api.get('/collections').then(res => res.data),
  getById: (id) => api.get(`/collections/${id}`).then(res => res.data),
  create: (data) => api.post('/collections', data).then(res => res.data),
  update: (id, data) => api.put(`/collections/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/collections/${id}`).then(res => res.data),
};

export const requestService = {
  getByCollectionId: (collectionId) => api.get(`/requests`, { params: { collectionId } }).then(res => res.data),
  getById: (id) => api.get(`/requests/${id}`).then(res => res.data),
  create: (data) => api.post('/requests', data).then(res => res.data),
  update: (id, data) => api.put(`/requests/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/requests/${id}`).then(res => res.data),
  execute: (data) => api.post('/execute', data).then(res => res.data),
};

export default api;

import api from './axiosConfig';

export const queryApi = {
  // Student
  raiseQuery: (data) => api.post('/queries', data),
  getMyQueries: () => api.get('/queries/my'),
  closeQuery: (id) => api.put(`/queries/${id}/close`),

  // Counsellor
  getAssignedQueries: () => api.get('/queries/assigned'),
  respondToQuery: (id, response) => api.put(`/queries/${id}/respond`, { response }),

  // Common
  getQueryById: (id) => api.get(`/queries/${id}`),
};
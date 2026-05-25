import api from './axiosConfig';

export const applicationApi = {
  // Student
  submitApplication: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),

  // Admin
  getApplicationsByCollege: (collegeId) => api.get(`/applications/college/${collegeId}`),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};
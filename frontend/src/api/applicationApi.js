import api from './axiosConfig';

export const applicationApi = {
  // Student
  submitApplication: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),

  // Admin
  getApplicationsByCollege: (collegeId) => api.get(`/applications/college/${collegeId}`),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  // Get all applications across admin's colleges, with optional college filter
  getAllForAdmin: (collegeId) => {
    const url = collegeId ? `/applications/all?collegeId=${collegeId}` : '/applications/all';
    return api.get(url);
  },
};
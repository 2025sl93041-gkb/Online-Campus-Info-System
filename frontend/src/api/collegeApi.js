import api from './axiosConfig';

export const collegeApi = {
  // Public
  getAllColleges: () => api.get('/colleges'),
  getCollegeById: (id) => api.get(`/colleges/${id}`),
  searchColleges: (query) => api.get(`/colleges/search?q=${query}`),
  getCourses: (collegeId) => api.get(`/colleges/${collegeId}/courses`),
  getFacilities: (collegeId) => api.get(`/colleges/${collegeId}/facilities`),

  // Admin
  getMyColleges: () => api.get('/colleges/my'),
  createCollege: (data) => api.post('/colleges', data),
  updateCollege: (id, data) => api.put(`/colleges/${id}`, data),
  deleteCollege: (id) => api.delete(`/colleges/${id}`),

  // Courses (Admin)
  addCourse: (collegeId, data) => api.post(`/colleges/${collegeId}/courses`, data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Facilities (Admin)
  addFacility: (collegeId, data) => api.post(`/colleges/${collegeId}/facilities`, data),
  deleteFacility: (id) => api.delete(`/facilities/${id}`),
};
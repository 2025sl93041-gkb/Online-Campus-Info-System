import api from './axiosConfig';

export const feedbackApi = {
  submitFeedback: (data) => api.post('/feedbacks', data),
  getCollegeFeedbacks: (collegeId) => api.get(`/feedbacks/college/${collegeId}`),
  getCounsellorFeedbacks: (counsellorId) => api.get(`/feedbacks/counsellor/${counsellorId}`),
  getMyFeedbacks: () => api.get('/feedbacks/my'),
};
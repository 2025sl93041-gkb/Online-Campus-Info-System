import api from './axiosConfig';

export const reportApi = {
  getCollegeComparison: () => api.get('/reports/college-comparison'),
  getCollegeFeedbacksDetailed: () => api.get('/reports/college-feedbacks'),
  getCounsellorPerformance: () => api.get('/reports/counsellor-performance'),
  getMyPerformance: (counsellorId) => api.get(`/reports/my-performance?counsellorId=${counsellorId}`),
  getApplicationStats: () => api.get('/reports/application-stats'),
};
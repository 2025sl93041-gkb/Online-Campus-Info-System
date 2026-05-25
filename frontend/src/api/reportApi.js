import api from './axiosConfig';

export const reportApi = {
  getCollegeComparison: () => api.get('/reports/college-comparison'),
  getCounsellorPerformance: () => api.get('/reports/counsellor-performance'),
  getApplicationStats: () => api.get('/reports/application-stats'),
};
import api from './axiosConfig';

export const fileApi = {
  uploadImage: (file, collegeId, caption, facilityType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collegeId', collegeId);
    if (caption) formData.append('caption', caption);
    if (facilityType) formData.append('facilityType', facilityType);

    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
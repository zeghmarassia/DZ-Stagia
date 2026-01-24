import axiosInstance from '../config/axios';

export const getStudentProfile = () => {
  return axiosInstance.get('/student/profile');
};

export const getStudentDashboardStats = () => {
  return axiosInstance.get('/student/dashboard/stats');
};

export const getStudentApplications = (params) => {
  return axiosInstance.get('/student/applications', { params });
};

export const updateStudentProfile = (profileData) => {
  return axiosInstance.put('/student/profile', profileData);
};

export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/student/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createStudentProfile = (formData) => {
  return axiosInstance.post('/student/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Admin functions
export const getPendingStudents = () => axiosInstance.get('/admin/students/pending');
export const approveStudent = (studentId) => axiosInstance.put(`/admin/students/${studentId}/approve`);
export const rejectStudent = (studentId) => axiosInstance.put(`/admin/students/${studentId}/reject`);
export const getStudents = () => axiosInstance.get('/admin/students');
export const deleteStudent = (studentId) => axiosInstance.delete(`/admin/students/${studentId}`);

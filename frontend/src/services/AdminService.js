import axiosInstance from '../config/axios';

/**
 * Service to fetch admin dashboard statistics.
 * This function is ready to connect to the real backend once merged.
 */
export const loginAdmin = (credentials) => {
  const formData = new URLSearchParams();
  formData.append('email', credentials.email);
  formData.append('password', credentials.password);

  return axiosInstance.post('/auth/admin/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const getAdmins = () => axiosInstance.get('/admin/admin/admins');

export const getAdminStats = () => axiosInstance.get('/admin/stats');

export const getPendingUsers = () => axiosInstance.get('/admin/pending-users');

export const approveUser = (userId) => axiosInstance.post(`/admin/users/${userId}/approve`);

export const rejectUser = (userId) => axiosInstance.post(`/admin/users/${userId}/reject`);

export const getStudents = () => axiosInstance.get('/admin/students');

export const deleteStudent = (studentId) => axiosInstance.delete(`/admin/students/${studentId}`);

export const getCompanies = () => axiosInstance.get('/admin/companies');

export const deleteCompany = (companyId) => axiosInstance.delete(`/admin/companies/${companyId}`);
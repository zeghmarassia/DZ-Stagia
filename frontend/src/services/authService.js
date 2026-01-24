import axiosInstance from '../config/axios';

export const login = (credentials) => {
  const formData = new URLSearchParams();
  formData.append('email', credentials.email);
  formData.append('password', credentials.password);

  return axiosInstance.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const logout = () => {
  return axiosInstance.post('/auth/logout');
};

export const studentRegister = (formData) => {
  return axiosInstance.post('/auth/student/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const companyRegister = (formData) => {
  return axiosInstance.post('/auth/company/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const verifyEmail = (data) => {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('otp_code', data.otp_code);
  return axiosInstance.post('/auth/verify-email', formData);
};

export const forgotPassword = (email) => {
  return axiosInstance.post('/auth/forgot-password', { email });
};

export const resetPassword = (data) => {
  return axiosInstance.post('/auth/reset-password', data);
};

// Admin functions
export const getAdminStats = () => axiosInstance.get('/admin/stats');
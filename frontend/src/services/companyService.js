import axiosInstance from '../config/axios';

export const getCompanyProfile = () => {
  return axiosInstance.get('/company/profile');
};

export const uploadCompanyLogo = (logoFile) => {
  const formData = new FormData();
  formData.append('logo', logoFile);
  return axiosInstance.post('/company/upload-logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCompanyProfile = (formData) => {
  return axiosInstance.put('/company/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCompanyOfferStats = () => {
  return axiosInstance.get('/offers/my-offers/statistics');
};

export const getCompanyApplicationStats = () => {
  return axiosInstance.get('/applications/company/statistics');
};

export const getCompanyApplications = (params) => {
  return axiosInstance.get('/applications/company/all', { params });
};

export const getApplicationsForOffer = (offerId) => {
  return axiosInstance.get(`/applications/offer/${offerId}`);
};

export const getAllCompanies = (params) => {
  return axiosInstance.get('/company/all', { params });
};

// Admin functions
export const getPendingCompanies = () => axiosInstance.get('/admin/companies/pending');
export const approveCompany = (companyId) => axiosInstance.put(`/admin/companies/${companyId}/approve`);
export const rejectCompany = (companyId) => axiosInstance.put(`/admin/companies/${companyId}/reject`);
export const getCompanies = () => axiosInstance.get('/admin/companies');
export const deleteCompany = (companyId) => axiosInstance.delete(`/admin/companies/${companyId}`);

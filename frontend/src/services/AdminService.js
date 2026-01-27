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

// Get all admins with pagination
export const getAdmins = (params) => {
  return axiosInstance.get('/admin/admin/admins', { params });
};

export const getAdminStats = () => {
  return axiosInstance.get('/admin/admin/stats', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 

// Get pending students
export const getPendingStudents = (params) => {
  return axiosInstance.get('/admin/admin/students/pending', { 
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Get all/approved students
export const getApprovedStudents = (params) => {
  return axiosInstance.get('/admin/admin/students', { 
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Approve a student
export const approveStudent = (studentId) => {
  return axiosInstance.put(`/admin/admin/students/${studentId}/approve`, {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Reject a student
export const rejectStudent = (studentId) => {
  return axiosInstance.put(`/admin/admin/students/${studentId}/reject`, {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Get pending companies
export const getPendingCompanies = (params) => {
  return axiosInstance.get('/admin/admin/companies/pending', { 
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Get all/approved companies
export const getApprovedCompanies = (params) => {
  return axiosInstance.get('/admin/admin/companies', { 
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Approve a company
export const approveCompany = (companyId) => {
  return axiosInstance.put(`/admin/admin/companies/${companyId}/approve`, {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Reject a company
export const rejectCompany = (companyId) => {
  return axiosInstance.put(`/admin/admin/companies/${companyId}/reject`, {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const deleteStudent = (studentId) => axiosInstance.delete(`/admin/admin/students/${studentId}`);
export const deleteCompany = (companyId) => axiosInstance.delete(`/admin/companies/${companyId}`);

// Get all offers
export const getOffers = (params) => {
  return axiosInstance.get('/admin/admin/offers', { 
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Delete an offer
export const deleteOffer = (offerId) => {
  return axiosInstance.delete(`/admin/admin/offers/${offerId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
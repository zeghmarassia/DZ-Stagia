import axiosInstance from '../config/axios';

/**
 * Main Page Services - Public endpoints for fetching offers and companies
 * These endpoints don't require authentication
 */

export const getPublicOffers = (params) => {
  return axiosInstance.get('/main/public-offers', { params, headers: {
      'Content-Type': 'application/json',
    }, });
};

export const getPublicCompanies = (params) => {
  return axiosInstance.get('/main/public-companies', { params, headers: {
      'Content-Type': 'application/json',
    }, });
};

export const getPublicOfferDetails = (offerId) => {
  return axiosInstance.get(`/main/public-offers/${offerId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const getMainStats = () => {
  return axiosInstance.get('/main/stats');
};

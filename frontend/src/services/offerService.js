import axiosInstance from '../config/axios';

export const getOffers = (params) => {
  return axiosInstance.get('/api/v1/offers', { params });
};

export const getOfferById = (id) => {
  return axiosInstance.get(`/offers/${id}`);
};

export const postOffer = (data) => {
  return axiosInstance.post('/offers', data);
};

export const deleteOffer = (id) => {
  return axiosInstance.delete(`/admin/offers/${id}`);
};

import axios from 'axios';

// The API URL will be taken from your .env file later
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/admin';

/**
 * Service to fetch admin dashboard statistics.
 * This function is ready to connect to the real backend once merged.
 */
export const getAdminStats = async () => {
    try {
        // This is a real request that will work once the backend is ready
        const response = await axios.get(`${API_URL}/stats`);
        return response.data;
    } catch (error) {
        // We log the error in English for professional debugging
        console.error("Backend not reached yet, using local logic:", error);
        throw error;
    }
};
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifikasi';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getNotifikasi = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error getting notifikasi", error);
    throw error;
  }
};

export const markNotifAsRead = async (notifId) => {
  try {
    const response = await axios.put(`${API_URL}/${notifId}/read`, {}, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error marking notifikasi read", error);
    throw error;
  }
};

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profile';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error getting profile", error);
    throw error;
  }
};

export const updateProfile = async (userId, data) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export const uploadProfilePicture = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/${userId}/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture", error);
    throw error;
  }
};

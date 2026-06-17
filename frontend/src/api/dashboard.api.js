import axios from 'axios';

const API_URL = 'http://localhost:8080/api/dashboard';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getDashboardMahasiswa = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/mahasiswa/${userId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("Error fetching dashboard", err);
    return null;
  }
};

export const getDashboardDosen = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/dosen/${userId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("Error fetching dosen dashboard", err);
    return null;
  }
};

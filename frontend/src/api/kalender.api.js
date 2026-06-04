import axios from 'axios';

const API_URL = 'http://localhost:8080/api/kalender';

export const getKalenderEvents = async (userId, role) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${userId}?role=${role}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

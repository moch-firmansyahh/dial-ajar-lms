import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getMataKuliah = async (userId, role) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/courses/user/${userId}?role=${role}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // Map data to match frontend format
    const mapped = response.data.map(mk => ({
      id: mk.id,
      kode: mk.kodeKelas,
      nama: mk.nama,
      sks: 3,
      dosen: "Dosen" // Simplified
    }));
    return { data: mapped };
  } catch (err) {
    console.error("Error fetching courses", err);
    return { data: [] };
  }
};

export const getMataKuliahById = async (id) => {
  // We'll just fetch content here if needed, but for now dummy fallback or fetch from API
  return { data: { id, kode: 'IFX', nama: 'Mata Kuliah API', sks: 3 } };
};

export const getCourseContent = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/courses/${courseId}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data; // { modules: [], videos: [], tugas: [] }
  } catch (err) {
    console.error("Error fetching content", err);
    return { modules: [], videos: [], tugas: [] };
  }
};

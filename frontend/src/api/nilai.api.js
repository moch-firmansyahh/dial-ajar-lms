import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getNilaiMahasiswa = async (mahasiswaId) => {
  try {
    const response = await axios.get(`${API_URL}/nilai/mahasiswa/${mahasiswaId}`, { headers: getAuthHeaders() });
    const mapped = response.data.map(n => ({
      id: n.id,
      mataKuliah: n.mataKuliahNama || 'Unknown',
      nilaiTugas: n.nilaiTugas,
      nilaiKuis: n.nilaiKuis,
      nilaiAkhir: n.nilaiAkhir,
      updatedAt: n.updatedAt
    }));
    return { data: mapped };
  } catch (err) {
    console.error("Error fetching nilai", err);
    return { data: [] };
  }
};

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const login = async ({ nomorInduk, password, role }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      nomorInduk,
      password,
      role
    });
    
    // Spring Boot returns: token, role, nama, nomorInduk
    const data = response.data;
    
    return {
      data: {
        token: data.token,
        user: {
          id: data.id,
          nama: data.nama,
          nomorInduk: data.nomorInduk,
          role: data.role
        }
      }
    };
  } catch (error) {
    console.error("Login Error:", error);
    if (error.response) {
      // Jika backend merespon dengan pesan error custom kita (String)
      if (typeof error.response.data === 'string') {
        throw new Error(error.response.data);
      }
      // Jika backend merespon dengan JSON error default Spring Boot
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Server merespon dengan status: ${error.response.status}`);
    }
    // Jika tidak ada response sama sekali (contoh: server mati atau kena blokir CORS)
    throw new Error('Gagal terhubung ke server. Pastikan backend sudah menyala (Port 8080) atau cek masalah CORS di Console browser.');
  }
};


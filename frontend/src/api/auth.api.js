// Mock API for Auth
export const login = async ({ nomorInduk, password, role }) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (password === 'password') {
    // Return dummy token and user data
    return {
      data: {
        token: 'dummy-jwt-token-12345',
        user: {
          id: role === 'DOSEN' ? 1 : 101,
          nama: role === 'DOSEN' ? 'Budi Dosen, M.Kom' : 'Andi Mahasiswa',
          nomorInduk: nomorInduk,
          role: role
        }
      }
    };
  }
  
  throw new Error('Nomor Induk atau Password salah');
};

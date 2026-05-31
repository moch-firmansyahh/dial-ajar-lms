// Mock API
const dummyMatkul = [
  { id: 1, kode: 'IF3110', nama: 'Pengembangan Aplikasi Berbasis Web', sks: 3, dosen: 'Budi Dosen, M.Kom' },
  { id: 2, kode: 'IF3111', nama: 'Pemrograman Berorientasi Objek', sks: 4, dosen: 'Siti Aminah, M.T.' },
  { id: 3, kode: 'IF3112', nama: 'Kecerdasan Buatan', sks: 3, dosen: 'Dr. Ahmad Fauzi' }
];

export const getMataKuliah = async () => {
  await new Promise(r => setTimeout(r, 400));
  return { data: dummyMatkul };
};

export const getMataKuliahById = async (id) => {
  await new Promise(r => setTimeout(r, 200));
  const matkul = dummyMatkul.find(m => m.id === parseInt(id));
  return { data: matkul };
};

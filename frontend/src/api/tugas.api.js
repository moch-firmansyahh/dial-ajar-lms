const dummyTugas = [
  { id: 1, matkulId: 1, judul: 'Tugas 1: HTML & CSS', deskripsi: 'Buat halaman statis', deadline: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'Belum Dinilai' },
  { id: 2, matkulId: 1, judul: 'Tugas 2: React JS', deskripsi: 'Buat SPA dengan React', deadline: new Date(Date.now() - 86400000).toISOString(), status: 'Sudah Dinilai', nilai: 85 }
];

export const getTugasByMatkul = async (matkulId) => {
  await new Promise(r => setTimeout(r, 400));
  return { data: dummyTugas.filter(t => t.matkulId === parseInt(matkulId)) };
};

export const getTugasById = async (tugasId) => {
  await new Promise(r => setTimeout(r, 200));
  return { data: dummyTugas.find(t => t.id === parseInt(tugasId)) };
};

export const submitTugas = async (tugasId, formData) => {
  await new Promise(r => setTimeout(r, 800));
  return { data: { message: 'Berhasil dikumpulkan' } };
};

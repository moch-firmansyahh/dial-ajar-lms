const dummyKuis = [
  { id: 1, matkulId: 1, judul: 'Kuis 1: Basic HTML', durasi: 60, status: 'Belum Dikerjakan' },
  { id: 2, matkulId: 1, judul: 'Kuis 2: React Component', durasi: 45, status: 'Sudah Dikerjakan', nilai: 90 }
];

export const getKuisByMatkul = async (matkulId) => {
  await new Promise(r => setTimeout(r, 400));
  return { data: dummyKuis.filter(k => k.matkulId === parseInt(matkulId)) };
};

export const submitKuis = async (kuisId, jawaban) => {
  await new Promise(r => setTimeout(r, 600));
  return { data: { nilai: 85, message: 'Berhasil disubmit' } };
};

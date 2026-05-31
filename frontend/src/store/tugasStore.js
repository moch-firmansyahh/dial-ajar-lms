import { create } from 'zustand';

export const useTugasStore = create((set) => ({
  submissions: [
    { nim: '13521001', nama: 'Budi Mahasiswa', waktu: '15 Jun 2026, 14:30', status: 'dinilai', nilai: 85, file: 'jawaban_budi.pdf', id_tugas: '1' },
    { nim: '13521002', nama: 'Andi P.', waktu: '14 Jun 2026, 09:15', status: 'belum_dinilai', nilai: null, file: 'tugas_andi.docx', id_tugas: '1' },
    { nim: '13521003', nama: 'Cici L.', waktu: '15 Jun 2026, 23:50', status: 'dinilai', nilai: 92, file: 'tugas_cici.zip', id_tugas: '1' },
    
    // Data Dummy Kuis (id_tugas: '2')
    { nim: '13521004', nama: 'Dewi S.', waktu: '17 Jun 2026, 10:15', status: 'belum_dinilai', nilai: null, file: 'Kuis telah dikerjakan', id_tugas: '2' },
    { nim: '13521005', nama: 'Eka T.', waktu: '17 Jun 2026, 11:20', status: 'dinilai', nilai: 90, file: 'Kuis telah dikerjakan', id_tugas: '2' },
  ],

  // Mahasiswa mengumpulkan tugas
  submitTugas: (nim, nama, file, id_tugas) => set((state) => {
    const existing = state.submissions.find(s => s.nim === nim && s.id_tugas === id_tugas);
    if (existing) {
      return {
        submissions: state.submissions.map(s => 
          (s.nim === nim && s.id_tugas === id_tugas) 
            ? { ...s, file, waktu: new Date().toLocaleString('id-ID'), status: 'belum_dinilai' } 
            : s
        )
      };
    }
    return {
      submissions: [...state.submissions, { nim, nama, waktu: new Date().toLocaleString('id-ID'), status: 'belum_dinilai', nilai: null, file, id_tugas }]
    };
  }),

  // Mahasiswa membatalkan pengumpulan
  cancelSubmit: (nim, id_tugas) => set((state) => ({
    submissions: state.submissions.filter(s => !(s.nim === nim && s.id_tugas === id_tugas))
  })),

  // Dosen memberikan nilai
  gradeTugas: (nim, id_tugas, nilai) => set((state) => ({
    submissions: state.submissions.map(s => 
      (s.nim === nim && s.id_tugas === id_tugas)
        ? { ...s, nilai: parseInt(nilai), status: 'dinilai' }
        : s
    )
  })),
  
  // Mendapatkan submission mahasiswa tertentu
  getSubmission: (nim, id_tugas) => {
    return useTugasStore.getState().submissions.find(s => s.nim === nim && s.id_tugas === id_tugas) || null;
  }
}));

import axios from "axios";

const API_URL = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getTugasByMatkul = async (courseId, userId) => {
  try {
    const url = userId
      ? `${API_URL}/tugas/course/${courseId}?userId=${userId}`
      : `${API_URL}/tugas/course/${courseId}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });

    const mapped = response.data.map((t) => ({
      id: t.id,
      judul: t.judul,
      deskripsi: t.detailTugas,
      type: t.tipe,
      deadline: t.deadline ? new Date(t.deadline) : null,
      durasiMenit: t.durasiMenit,
      totalSoal: t.totalSoal,
      jenisSoal: t.jenisSoal,
      poin: 100,
      fileUrl: t.fileSoal,
      status: t.status || "belum",
      nilai: t.nilai,
      detailNilai: t.detailNilai,
      fileJawaban: t.fileJawaban,
    }));

    return { data: mapped };
  } catch (err) {
    console.error("Error fetching tasks", err);
    return { data: [] };
  }
};

export const getTugasDetail = async (courseId, taskId, userId, type) => {
  try {
    const res = await getTugasByMatkul(courseId, userId);
    if (res.data) {
      const tugas = res.data.find((t) => String(t.id) === String(taskId) && (!type || t.type === type));
      if (tugas) {
        return { data: tugas };
      }
    }
    return { data: null };
  } catch (err) {
    console.error("Error fetching task detail", err);
    return { data: null };
  }
};

export const getKuisDetail = async (kuisId) => {
  try {
    const response = await axios.get(`${API_URL}/kuis/${kuisId}`, {
      headers: getAuthHeaders(),
    });
    return { data: response.data };
  } catch (err) {
    console.error("Error fetching kuis detail", err);
    return { data: null };
  }
};

export const submitTugas = async (tugasId, userId, file, catatan) => {
  try {
    const formData = new FormData();
    formData.append("tugasId", tugasId);
    formData.append("mahasiswaId", userId);
    if (file) {
      formData.append("file", file);
    }
    if (catatan) {
      formData.append("catatan", catatan);
    }

    const response = await axios.post(`${API_URL}/tugas/submit`, formData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (err) {
    console.error("Error submitting task", err);
    throw err;
  }
};

export const addTugas = async (courseId, payload) => {
  try {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("judul", payload.judul);
    formData.append("detailTugas", payload.deskripsi);
    formData.append("deadline", payload.deadline);
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const response = await axios.post(`${API_URL}/tugas`, formData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (err) {
    console.error("Error adding task", err);
    throw err;
  }
};

export const addKuis = async (courseId, payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/kuis`,
      {
        courseId,
        judul: payload.judul,
        deskripsi: payload.deskripsi,
        deadline: payload.deadline,
        durasiMenit: payload.durasiMenit,
        soalList: payload.soalList,
      },
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (err) {
    console.error("Error adding kuis", err);
    throw err;
  }
};

export const getSoalKuis = async (kuisId) => {
  try {
    const response = await axios.get(`${API_URL}/kuis/${kuisId}/soal`, {
      headers: getAuthHeaders(),
    });
    return { data: response.data };
  } catch (err) {
    console.error("Error fetching soal", err);
    return { data: [] };
  }
};

export const submitKuis = async (
  tugasId,
  mahasiswaId,
  jawabanJson,
  nilaiPg,
) => {
  try {
    const formData = new FormData();
    formData.append("tugasId", tugasId);
    formData.append("mahasiswaId", mahasiswaId);
    formData.append("jawaban", JSON.stringify(jawabanJson));
    formData.append("nilaiPg", nilaiPg);

    const response = await axios.post(`${API_URL}/tugas/submitKuis`, formData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (err) {
    console.error("Error submitting kuis", err);
    throw err;
  }
};

export const getSubmissionsByTugas = async (tugasId) => {
  try {
    const response = await axios.get(
      `${API_URL}/tugas/submissions/${tugasId}`,
      {
        headers: getAuthHeaders(),
      },
    );
    const mapped = response.data.map((sub) => ({
      id: sub.id,
      id_tugas: sub.tugas.id,
      nim: sub.mahasiswa.nim,
      nama: sub.mahasiswa.nama,
      waktu: sub.dikumpulkan ? new Date(sub.dikumpulkan).toLocaleString() : "-",
      file: sub.fileJawaban,
      status: sub.status === "SUDAH_DINILAI" ? "dinilai" : "belum",
      nilai: sub.nilai,
      detailNilai: sub.detailNilai,
    }));
    return { data: mapped };
  } catch (err) {
    console.error("Error fetching submissions", err);
    return { data: [] };
  }
};

export const getSubmissionsByKuis = async (kuisId) => {
  try {
    const response = await axios.get(
      `${API_URL}/kuis/submissions/${kuisId}`,
      {
        headers: getAuthHeaders(),
      },
    );
    const mapped = response.data.map((sub) => ({
      id: sub.id,
      id_tugas: sub.tugas.id,
      nim: sub.mahasiswa.nim,
      nama: sub.mahasiswa.nama,
      waktu: sub.dikumpulkan ? new Date(sub.dikumpulkan).toLocaleString() : "-",
      file: sub.fileJawaban,
      status: sub.status === "SUDAH_DINILAI" ? "dinilai" : "belum",
      nilai: sub.nilai,
      detailNilai: sub.detailNilai,
    }));
    return { data: mapped };
  } catch (err) {
    console.error("Error fetching kuis submissions", err);
    return { data: [] };
  }
};

export const gradeTugas = async (submissionId, nilai, detailNilai = null) => {
  try {
    const payload = { submissionId: submissionId.toString(), nilai: nilai.toString() };
    if (detailNilai) {
      payload.detailNilai = JSON.stringify(detailNilai);
    }
    const response = await axios.post(
      `${API_URL}/tugas/grade`,
      payload,
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (err) {
    console.error("Error grading task", err);
    throw err;
  }
};

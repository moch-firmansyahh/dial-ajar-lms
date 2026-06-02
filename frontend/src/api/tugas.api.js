import axios from "axios";

const API_URL = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getTugasByMatkul = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/tugas/course/${courseId}`, {
      headers: getAuthHeaders(),
    });

    const mapped = response.data.map((t) => ({
      id: t.id,
      judul: t.judul,
      deskripsi: t.detailTugas,
      type: t.tipe,
      deadline: t.deadline ? new Date(t.deadline) : null,
      poin: 100,
      fileUrl: t.fileSoal,
      status: "belum",
    }));

    return { data: mapped };
  } catch (err) {
    console.error("Error fetching tasks", err);
    return { data: [] };
  }
};

export const getTugasDetail = async (taskId) => {
  try {
    return {
      data: {
        id: taskId,
        judul: "Tugas Detail",
        deskripsi: "Detail deskripsi tugas",
        fileUrl: "#",
        deadline: new Date().toISOString(),
      },
    };
  } catch (err) {
    return { data: null };
  }
};

export const submitTugas = async (tugasId, userId, fileUrl) => {
  try {
    const response = await axios.post(
      `${API_URL}/tugas/submit`,
      {
        tugasId: tugasId,
        mahasiswaId: userId,
        fileJawaban: fileUrl || "dummy-file.pdf",
      },
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (err) {
    console.error("Error submitting task", err);
    throw err;
  }
};

export const addTugas = async (courseId, payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/tugas`,
      {
        courseId,
        judul: payload.judul,
        detailTugas: payload.deskripsi,
        deadline: payload.deadline,
        fileSoal: payload.fileUrl || "dummy-soal.pdf",
      },
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (err) {
    console.error("Error adding task", err);
    throw err;
  }
};

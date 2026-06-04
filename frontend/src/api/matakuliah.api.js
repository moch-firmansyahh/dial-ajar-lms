import axiosInstance from "../utils/axiosInstance";

export const getMataKuliah = async (userId, role) => {
  if (!userId || !role) {
    throw new Error("userId dan role diperlukan");
  }

  const response = await axiosInstance.get(`/courses/user/${userId}`, {
    params: { role },
  });

  const mapped = response.data.map((mk) => ({
    id: mk.id,
    kode: mk.kodeKelas,
    nama: mk.nama,
    sks: 3,
    dosen: "Dosen",
  }));

  return { data: mapped };
};

export const getMataKuliahById = async (id) => {
  const response = await axiosInstance.get(`/courses/${id}`);
  return { data: response.data };
};

export const getCourseContent = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}/content`);
    return response.data;
  } catch (err) {
    console.error("Error fetching content", err);
    return { modules: [], videos: [], tugas: [] };
  }
};

export const createMataKuliah = async (data) => {
  const response = await axiosInstance.post('/courses', data);
  return response.data;
};

export const joinMataKuliah = async (data) => {
  const response = await axiosInstance.post('/courses/join', data);
  return response.data;
};

export const getCourseStudents = async (courseId) => {
  const response = await axiosInstance.get(`/courses/${courseId}/students`);
  return response.data;
};


import axiosInstance from "../utils/axiosInstance";

// Upload a document file (PDF/DOCX) for a course
export const uploadModul = async (courseId, judul, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("judul", judul);
  formData.append("courseId", courseId);

  const response = await axiosInstance.post(`/modules/upload`, formData);
  return response;
};

// Add a video link (YouTube/external URL) for a course
export const addVideo = async (courseId, judul, linkVideo) => {
  const response = await axiosInstance.post(`/modules/video`, {
    courseId: String(courseId),
    judul,
    linkVideo,
  });
  return response;
};

// Delete a modul
export const deleteModul = async (id) => {
  const response = await axiosInstance.delete(`/modules/${id}`);
  return response;
};

// Delete a video
export const deleteVideo = async (id) => {
  const response = await axiosInstance.delete(`/modules/video/${id}`);
  return response;
};

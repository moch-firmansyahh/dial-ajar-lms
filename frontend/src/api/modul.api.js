import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// Upload a document file (PDF/DOCX) for a course
export const uploadModul = async (courseId, judul, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('judul', judul);
  formData.append('courseId', courseId);

  const response = await axios.post(`${API_URL}/modules/upload`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Add a video link (YouTube/external URL) for a course
export const addVideo = async (courseId, judul, linkVideo) => {
  const response = await axios.post(`${API_URL}/modules/video`, {
    courseId: String(courseId),
    judul,
    linkVideo
  }, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Delete a modul
export const deleteModul = async (id) => {
  const response = await axios.delete(`${API_URL}/modules/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Delete a video
export const deleteVideo = async (id) => {
  const response = await axios.delete(`${API_URL}/modules/video/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

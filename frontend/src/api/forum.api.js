import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getForumByMatkul = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/forum/course/${courseId}`, { headers: getAuthHeaders() });
    const mapped = response.data.map(f => ({
      id: f.id,
      title: f.judul,
      author: f.pembuat?.nama || "User",
      authorRole: f.pembuat?.role?.toLowerCase() || "mahasiswa",
      date: new Date(f.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}),
      replies: f.repliesCount || 0,
      isNew: false
    }));
    return { data: mapped };
  } catch (err) {
    console.error("Error fetching forums", err);
    return { data: [] };
  }
};

export const getForumDetail = async (forumId) => {
  try {
    const response = await axios.get(`${API_URL}/forum/${forumId}`, { headers: getAuthHeaders() });
    const forum = response.data.forum;
    const comments = response.data.comments;
    
    return {
      data: {
        id: forum.id,
        judul: forum.judul,
        content: forum.isiForum,
        author: forum.pembuat?.nama,
        authorRole: forum.pembuat?.role?.toLowerCase(),
        date: forum.createdAt,
        replies: comments.map(c => ({
          id: c.id,
          content: c.isi,
          author: c.penulis?.nama,
          authorRole: c.penulis?.role?.toLowerCase(),
          date: c.createdAt
        }))
      }
    };
  } catch (err) {
    console.error("Error fetching forum details", err);
    return { data: null };
  }
};

export const createForum = async (courseId, userId, payload) => {
  try {
    const response = await axios.post(`${API_URL}/forum`, {
      courseId,
      userId,
      judul: payload.judul,
      isiForum: payload.content
    }, { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("Error creating forum", err);
    throw err;
  }
};

export const replyForum = async (forumId, userId, content) => {
  try {
    const response = await axios.post(`${API_URL}/forum/comment`, {
      forumId,
      userId,
      isi: content
    }, { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("Error replying to forum", err);
    throw err;
  }
};

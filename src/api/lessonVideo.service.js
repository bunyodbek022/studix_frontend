import { api } from "./axios";

export const lessonVideoService = {
  createLessonVideo(data) {
    const formData = new FormData();
    formData.append("lessonId", String(data.lessonId));
    formData.append("title", data.title);
    formData.append("file", data.file);

    return api.post("/lesson-videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // LessonDetailsPage.jsx da ishlatiladi - createLessonVideo bilan bir xil
  uploadVideo(data) {
    const formData = new FormData();
    formData.append("lessonId", String(data.lessonId));
    formData.append("title", data.title);
    formData.append("file", data.file);

    return api.post("/lesson-videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deleteVideo(id) {
    const { data } = await api.delete(`/lesson-videos/${id}`);
    return data;
  },
};
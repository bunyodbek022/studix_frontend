import { api } from "./axios";

export const lessonVideoService = {
  createLessonVideo(data) {
    const formData = new FormData();

    formData.append("lessonId", String(data.lessonId));
    formData.append("title", data.title);
    formData.append("file", data.file);

    return api.post("/lesson-videos", formData); // 🔥 FIX
  },

  async deleteVideo(id) {
    const { data } = await api.delete(`/lesson-videos/${id}`);
    return data;
  },
};
import { api } from "./axios";

export const lessonVideoService = {
  async uploadVideo(payload) {
    const formData = new FormData();
    formData.append("lessonId", payload.lessonId);
    formData.append("title", payload.title);
    formData.append("file", payload.file);

    const { data } = await api.post("/lesson-videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async deleteVideo(id) {
    const { data } = await api.delete(`/lesson-videos/${id}`);
    return data;
  },
};

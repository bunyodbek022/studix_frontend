import { api } from "./axios";

export const lessonService = {
  async getLessonById(id) {
    const { data } = await api.get(`/lessons/${id}`);
    return data;
  },

  async createLesson(payload) {
    const { data } = await api.post("/lessons", payload);
    return data;
  },

  async updateLesson(id, payload) {
    const { data } = await api.patch(`/lessons/${id}`, payload);
    return data;
  },

  async deleteLesson(id) {
    const { data } = await api.delete(`/lessons/${id}`);
    return data;
  },
};

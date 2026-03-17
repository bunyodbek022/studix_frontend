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
  
  async getLessonAttendance(lessonId) {
    const { data } = await api.get(`/lessons/${lessonId}/attendance`);
    return data;
    },
  
  async saveAttendance(lessonId, attendance) {
    const items = Object.entries(attendance).map(([studentId, isPresent]) => ({
        studentId: Number(studentId),
        isPresent,
    }));
    const { data } = await api.post(`/lessons/${lessonId}/attendance`, { items });
    return data;
},
};

import { api } from "./axios";

export const teacherService = {
  async getTeachers(params) {
    const { data } = await api.get("/teachers", { params });
    return data;
  },

  async getTeacherById(id) {
    const { data } = await api.get(`/teachers/${id}`);
    return data;
  },

  async getTeacherGroups(id) {
    const { data } = await api.get(`/teachers/${id}/groups`);
    return data;
  },

  async createTeacher(payload) {
    const formData = new FormData();

    formData.append("fullName", payload.fullName);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("position", payload.position);
    formData.append("experience", payload.experience);

    if (payload.photo) {
      formData.append("photo", payload.photo);
    }

    const { data } = await api.post("/teachers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async updateTeacher(id, payload) {
    const { data } = await api.patch(`/teachers/${id}`, payload);
    return data;
  },

  async deleteTeacher(id) {
    const { data } = await api.delete(`/teachers/${id}`);
    return data;
  },
};

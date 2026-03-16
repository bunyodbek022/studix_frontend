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

    if (payload.phone) {
        formData.append("phone", payload.phone);
    }
    if (payload.birth_date) {
        formData.append("birth_date", payload.birth_date);
    }
    if (payload.photo) {
        formData.append("photo", payload.photo);
    }

    const { data } = await api.post("/teachers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
},

  async updateTeacher(id, payload) {
    const formData = new FormData();

    if (payload.fullName) formData.append("fullName", payload.fullName);
    if (payload.email) formData.append("email", payload.email);
    if (payload.password) formData.append("password", payload.password);
    if (payload.position) formData.append("position", payload.position);
    if (payload.experience) formData.append("experience", payload.experience);
    if (payload.phone) formData.append("phone", payload.phone);
    if (payload.birth_date) formData.append("birth_date", payload.birth_date);
    if (payload.photo) formData.append("photo", payload.photo);

    const { data } = await api.patch(`/teachers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
    },
  
    async archiveTeacher(id) {
    const { data } = await api.patch(`/teachers/${id}/archive`);
    return data;
    },
    
    async restoreTeacher(id) {
    const { data } = await api.patch(`/teachers/${id}/restore`);
    return data;
    },
    

  async deleteTeacher(id) {
    const { data } = await api.delete(`/teachers/${id}`);
    return data;
  },
};

import { api } from "./axios";

export const groupService = {
  async getAllGroups() {
    const { data } = await api.get("/groups/all");
    return data;
  },

  async getGroupById(id) {
    const { data } = await api.get(`/groups/${id}`);
    return data;
  },

  async getGroupStudents(id, params) {
    const { data } = await api.get(`/groups/${id}/students`, { params });
    return data;
  },

  async getGroupLessons(id, params) {
    const { data } = await api.get(`/groups/${id}/lessons`, { params });
    return data;
  },

  async addStudentToGroup(payload) {
    // Uses student-group module
    const { data } = await api.post("/student-groups", payload);
    return data;
  },

  async removeStudentFromGroup(studentGroupId) {
    const { data } = await api.delete(`/student-groups/${studentGroupId}`);
    return data;
  }
};

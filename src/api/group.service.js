import { api } from "./axios";

export const groupService = {
    async getAllGroups() {
        const { data } = await api.get("/groups");
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

    async getGroupSchedule(id) {
        const { data } = await api.get(`/groups/${id}/schedule`);
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
    },

    async archiveGroup(id) {
        const { data } = await api.patch(`/groups/${id}/archive`);
        return data;
    },

    async restoreGroup(id) {
        const { data } = await api.patch(`/groups/${id}/restore`);
        return data;
    },

    async deleteGroup(id) {
        const { data } = await api.delete(`/groups/${id}`);
        return data;
    },

    async createGroup(payload) {
        const { data } = await api.post("/groups", payload);
        return data;
    },

    async updateGroup(id, payload) {
        const { data } = await api.patch(`/groups/${id}`, payload);
        return data;
    },

    async getRooms() {
        const { data } = await api.get("/rooms");
        return data;
    },
};

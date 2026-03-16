import { api } from "./axios";

export const courseService = {
    async getCourses(params) {
        const { data } = await api.get("/courses", { params });
        return data;
    },

    async getCourseById(id) {
        const { data } = await api.get(`/courses/${id}`);
        return data;
    },

    async createCourse(payload) {
        const { data } = await api.post("/courses", payload);
        return data;
    },

    async updateCourse(id, payload) {
        const { data } = await api.patch(`/courses/${id}`, payload);
        return data;
    },

    async archiveCourse(id) {
        const { data } = await api.delete(`/courses/${id}`);
        return data;
    },

    async restoreCourse(id) {
    const { data } = await api.patch(`/courses/${id}/restore`);
    return data;
},

async deleteCourse(id) {
    const { data } = await api.delete(`/courses/${id}/delete`);
    return data;
    },


   

};

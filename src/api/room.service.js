import { api } from "./axios";

export const roomService = {
    async getRooms(params) {
        const { data } = await api.get("/rooms", { params });
        return data;
    },

    async getRoomById(id) {
        const { data } = await api.get(`/rooms/${id}`);
        return data;
    },

    async createRoom(payload) {
        const { data } = await api.post("/rooms", payload);
        return data;
    },

    async updateRoom(id, payload) {
        const { data } = await api.patch(`/rooms/${id}`, payload);
        return data;
    },

    async archiveRoom(id) {
        const { data } = await api.patch(`/rooms/${id}/archive`);
        return data;
    },

    async restoreRoom(id) {
        const { data } = await api.patch(`/rooms/${id}/restore`);
        return data;
    },

    async deleteRoom(id) {
        const { data } = await api.delete(`/rooms/${id}`);
        return data;
    },
};
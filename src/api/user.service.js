import { api } from "./axios";

export const userService = {
    async getUsers(params) {
        const { data } = await api.get("/users", { params });
        return data;
    },

    async getUserById(id) {
        const { data } = await api.get(`/users/${id}`);
        return data;
    },

    async createUser(payload) {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            if (payload[key] !== undefined && payload[key] !== null) {
                formData.append(key, payload[key]);
            }
        });

        const { data } = await api.post("/users", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return data;
    },

    async updateUser(id, payload) {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            if (payload[key] !== undefined && payload[key] !== null) {
                formData.append(key, payload[key]);
            }
        });

        const { data } = await api.patch(`/users/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return data;
    },

    async deleteUser(id) {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    }
};

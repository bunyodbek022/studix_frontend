import { api } from "./axios";

export const studentService = {
  async getStudents() {
    const { data } = await api.get("/students");
    return data;
  },

  async getStudentById(id) {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },

  async createStudent(payload) {
    const formData = new FormData();

    formData.append("fullName", payload.fullName);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("birth_date", payload.birth_date);

    if (payload.photo) {
      formData.append("photo", payload.photo);
    }

    const { data } = await api.post("/students", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async updateStudent(id, payload) {
    const formData = new FormData();

    if (payload.fullName !== undefined) formData.append("fullName", payload.fullName);
    if (payload.email !== undefined) formData.append("email", payload.email);
    if (payload.password) formData.append("password", payload.password);
    if (payload.birth_date !== undefined) formData.append("birth_date", payload.birth_date);
    if (payload.photo) formData.append("photo", payload.photo);

    const { data } = await api.patch(`/students/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async attachGroup(payload) {
    const { data } = await api.post("/student-group", payload);
    return data;
  },

  async deleteStudent(id) {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  },

  async getStudentGroupSummary(id) {
    const { data } = await api.get(`/students/${id}/group-summary`);
    return data;
  },

  async getAttendanceDetails(studentId, groupId) {
    const { data } = await api.get(
      `/students/${studentId}/groups/${groupId}/attendance-details`
    );
    return data;
  },

  async getStudentGroupHomeworks(studentId, groupId) {
    const { data } = await api.get(
      `/students/${studentId}/groups/${groupId}/homeworks`
    );
    return data;
  },
};
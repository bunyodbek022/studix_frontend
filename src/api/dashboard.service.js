import { api } from "./axios";

export const dashboardService = {
  getUsers: () => api.get("/users"),
  getStudents: () => api.get("/students"),
  getTeachers: () => api.get("/teachers"),
  getCourses: () => api.get("/courses"),
  getGroups: () => api.get("/groups"),
  getRooms: () => api.get("/rooms"),
};
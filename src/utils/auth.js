import Cookies from "js-cookie";

export const authStorage = {
  setAuth(data) {
    Cookies.set("role", data.role, { expires: 7, sameSite: "Lax" });

    if (data.user) {
      Cookies.set("user", JSON.stringify(data.user), {
        expires: 7,
        sameSite: "Lax",
      });
    }
  },

  getRole() {
    return Cookies.get("role") || null;
  },

  getUser() {
    const user = Cookies.get("user");
    return user ? JSON.parse(user) : null;
  },

  clear() {
    Cookies.remove("role");
    Cookies.remove("user");
  },

  isAuthenticated() {
    return !!Cookies.get("role");
  },
};
import Cookies from "js-cookie"

export const authStorage = {
  setAuth(data) {
    Cookies.set("token", data.token, { expires: 7 })
    Cookies.set("role", data.role, { expires: 7 })

    if (data.user) {
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 })
    }
  },

  getToken() {
    return Cookies.get("token")
  },

  getRole() {
    return Cookies.get("role")
  },

  getUser() {
    const user = Cookies.get("user")
    return user ? JSON.parse(user) : null
  },

  clear() {
    Cookies.remove("token")
    Cookies.remove("role")
    Cookies.remove("user")
  },

  isAuthenticated() {
    return !!Cookies.get("token")
  },
}
export function getDashboardByRole(role) {
  switch (role) {
    case "STUDENT":
    case "student":
      return "/student/dashboard"

    case "TEACHER":
    case "teacher":
      return "/teacher/dashboard"

    case "SUPERADMIN":
    case "ADMIN":
    case "MANAGEMENT":
    case "ADMINISTRATOR":
      return "/staff/dashboard"

    default:
      return "/student/login"
  }
}
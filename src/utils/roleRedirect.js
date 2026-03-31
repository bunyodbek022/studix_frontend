export function getDashboardByRole(role) {
  switch (role?.toUpperCase()) {
    case "STUDENT":
      return "/student/dashboard";

    case "TEACHER":
      return "/teacher/dashboard";

    case "SUPERADMIN":
    case "SUPER_ADMIN":
    case "ADMIN":
    case "MANAGEMENT":
    case "ADMINISTRATOR":
    case "ADMINSTRATOR":
    case "STAFF":
    case "CREATOR":
      return "/staff/dashboard";

    default:
      return "/student/login";
  }
}
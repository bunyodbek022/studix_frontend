import { Navigate, Outlet } from "react-router-dom"
import { getDashboardByRole } from "../../utils/roleRedirect"
import { authStorage } from "../../utils/auth"

export default function RoleRoute({ allowedRoles = [] }) {
  const role = authStorage.getRole()

  if (!role) {
    return <Navigate to="/student/login" replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getDashboardByRole(role)} replace />
  }

  return <Outlet />
}
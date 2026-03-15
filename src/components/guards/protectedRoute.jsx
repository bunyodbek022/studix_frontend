import { Navigate, Outlet } from "react-router-dom"
import { authStorage } from "../../utils/auth"

export default function ProtectedRoute() {
  const isAuthenticated = authStorage.isAuthenticated()

  return isAuthenticated ? <Outlet /> : <Navigate to="/student/login" replace />
}
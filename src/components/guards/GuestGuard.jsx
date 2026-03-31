import { Navigate } from "react-router-dom";
import { authStorage } from "../../utils/auth";
import { getDashboardByRole } from "../../utils/roleRedirect";

export default function GuestGuard({ children }) {
  const isAuthenticated = authStorage.isAuthenticated();
  const role = authStorage.getRole();

  if (isAuthenticated && role) {
    return <Navigate to={getDashboardByRole(role)} replace />;
  }

  return children;
}
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../application/context/AuthContext";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

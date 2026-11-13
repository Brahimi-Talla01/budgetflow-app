import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../application/context/authContext";

export default function PrivateRoute() {
      const { isAuthenticated, isInitializing } = useAuth();

      if (isInitializing) {
            return (
                  <div className="flex h-screen items-center justify-center bg-[#F4F7FB]">
                        <span className="w-10 h-10 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                  </div>
            );
      }

      if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
      }

      return <Outlet />;
}

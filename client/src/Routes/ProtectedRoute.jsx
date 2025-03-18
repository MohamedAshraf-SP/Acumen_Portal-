import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const ProtectedRoute = ({ allowedTo }) => {
  const { user, loading } = useAuth();

  if (!user?.role && !loading) {
    return <Navigate to="/auth/login" replace />;
  }
  if (!allowedTo.includes(user?.role)) {
    return <Navigate to="/auth/unauthorized" replace />;
  }

  return <Outlet />; // Render child routes if role is allowed
};

export default ProtectedRoute;

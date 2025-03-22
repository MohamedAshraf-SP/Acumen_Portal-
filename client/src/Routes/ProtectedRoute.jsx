import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import Loader from "../component/Loader";

const ProtectedRoute = ({ allowedTo }) => {
  const { user, loading } = useAuth();

  // Ensure authentication has finished loading
  // if (loading) {
  //   return <Loader />;
  // }

  // Redirect to login if no user is found
  if (!user || !user?.role) {
    return <Navigate to="/auth/login" replace />;
  }

  // Allow access if at least one of the roles is allowed
  if (Array.isArray(allowedTo) && allowedTo.includes(user.role)) {
    return <Outlet />;
  }

  // Redirect to unauthorized if no matching role is found
  return <Navigate to="/auth/unauthorized" replace />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import Loader from "../component/Loader";

const ProtectedRoute = ({ allowedTo }) => {
  const { user, loading } = useAuth();
  console.log(user)
  if (loading) {
    return <Loader />;
  }
  //console.log(user?.role, allowedTo?.includes(user?.role));
  if (!user?.role) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedTo.includes(user?.role)) {
    return <Navigate to="/auth/unauthorized" replace />;
  }

  return <Outlet />; // Render child routes if role is allowed
};

export default ProtectedRoute;

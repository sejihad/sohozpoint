import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

/**
 * roles: Array of allowed roles for this route
 * children: JSX element(s) to render if allowed
 */
const ProtectedRoute = ({ roles = [], children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.status === "suspended") {
    return <Navigate to="/suspended" replace />;
  }
  if (roles.length && !roles.includes(user?.role)) {
    // User's role is not allowed
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

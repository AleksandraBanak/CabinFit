import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

export default function DriverRoute({ children }) {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  const roles = user?.roles || user?.Roles || [];
  const isDriver = roles.some((r) => r.toLowerCase() === "driver");

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isDriver) {
    return <Navigate to="/" replace />;
  }

  return children;
}
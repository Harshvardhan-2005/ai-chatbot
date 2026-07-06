import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/assistants" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;

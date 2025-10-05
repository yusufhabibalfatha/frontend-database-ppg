import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PublicOnlyRoute({ children }) {
  const { auth } = useAuth();

  return !auth ? children : <Navigate to="/" replace />;
}

export default PublicOnlyRoute;

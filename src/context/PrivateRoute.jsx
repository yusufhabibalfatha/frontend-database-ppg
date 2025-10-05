// src/context/PrivateRoute.js (atau sesuai struktur foldermu)
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ children }) {
  const { auth } = useAuth();

  return auth ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;

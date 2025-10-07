import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ButtonLogout.css"; // Import CSS

function ButtonLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      🚪 Logout
    </button>
  );
}

export default ButtonLogout;
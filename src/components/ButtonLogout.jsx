import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ButtonLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const goToLogout = () => {
    logout();
    navigate("login");
  };
  return (
    <div className="bg-blue-300 h-16 w-32 flex justify-center items-center border-l-4 border-black hover:bg-blue-400">
      <button className="text-sm font-bold" onClick={goToLogout}>
        Logout
      </button>
    </div>
  );
};

export default ButtonLogout;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css"; // ✅ Import CSS

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Login gagal: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        <h2>Login</h2>
        <p>🔒 Akses data hanya tersedia untuk pengguna terdaftar. Silahkan Login</p>
      </div>

      {error && <p className="error">{error}</p>}

      <div>
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          type="text"
          required
          placeholder="Alamat email"
          disabled={isLoading}
          autoComplete="nope"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type={showPassword ? "text" : "password"}
          required
          placeholder="Kata sandi"
          disabled={isLoading}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={isLoading}
        >
          {showPassword ? "🙈 Sembunyikan" : "👁️ Tampilkan"}
        </button>
      </div>

      <button type="submit" disabled={isLoading}>
        <p>
          {isLoading ? "Memproses..." : "Login"}
        </p>
      </button>
    </form>
  );
}
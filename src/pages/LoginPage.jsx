import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

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
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">
          <div className="login-icon">🕌</div>
          <h2 className="login-title">Login PPG Generus</h2>
          <p className="login-subtitle">🔒 Akses data hanya tersedia untuk pengguna terdaftar</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <div className="input-field">
            <span className="input-icon">👤</span>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              required
              placeholder="Alamat email atau username"
              disabled={isLoading}
              autoComplete="nope"
              className="login-input"
            />
          </div>

          <div className="input-field">
            <span className="input-icon">🔒</span>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              required
              placeholder="Kata sandi"
              disabled={isLoading}
              className="login-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              className="password-toggle"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="login-button"
        >
          {/* {isLoading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            "🚪 Masuk"
          )} */}
          {isLoading ? "Memproses..." : "🚪 Login"}
        </button>

        <div className="login-footer">
          <p>📋 Sistem Management Generus PPG</p>
        </div>
      </form>
    </div>
  );
}
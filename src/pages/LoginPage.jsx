
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Login gagal: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Login</h2>
        <p>🔒 Akses data hanya tersedia untuk pengguna terdaftar.</p>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          type="text"
          required
          placeholder="Alamat email"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          required
          placeholder="Kata sandi"
        />
      </div>

      <button type="submit">
        <p>Masuk ke Dashboard</p>
      </button>
    </form>
  );
}

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// fungsi untuk decode JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Gagal decode JWT:', e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userInfo = localStorage.getItem("adminUser");

    if (token && userInfo) {
      const parsedUser = JSON.parse(userInfo);
      const decoded = decodeJWT(token);
      
      if (decoded && decoded.exp > Date.now() / 1000) {
        setAuth({ token, ...parsedUser });
      } else {
        // token expired / tidak valid
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setAuth(null);
      }
    }
  }, []);

  const login = async (username, password) => {
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }/jwt-auth/v1/token?_=${new Date().getTime()}`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login gagal");

    const data = await res.json();

    const userData = {
      email: data.user_email,
      name: data.user_display_name,
      role: data.role,
      kelompok: data.kelompok,
      desa: data.desa,
    };

    // simpan token ke localStorage
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(userData));

    const decoded = decodeJWT(data.token);
    if (decoded && decoded.exp > Date.now() / 1000) {
      // setAuth(decoded);
      setAuth({ token: data.token, ...userData });
    } else {
      throw new Error("Token tidak valid atau kadaluarsa");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

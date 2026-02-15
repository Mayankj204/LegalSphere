import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===========================
     RESTORE SESSION ON REFRESH
  =========================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /* ===========================
     LOGIN
  =========================== */
  const login = async (data) => {
    try {
      const res = await loginUser(data);

      if (res?.token) {
        localStorage.setItem("token", res.token);

        const userData = {
          name: res.name,
          email: res.email,
          role: res.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        return res;
      }

      return null;
    } catch (err) {
      console.error("Login error:", err);
      return null;
    }
  };

  /* ===========================
     REGISTER
  =========================== */
  const register = async (data) => {
    try {
      const res = await registerUser(data);

      if (res?.token) {
        localStorage.setItem("token", res.token);

        const userData = {
          name: res.name,
          email: res.email,
          role: res.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        return res;
      }

      return null;
    } catch (err) {
      console.error("Register error:", err);
      return null;
    }
  };

  /* ===========================
     LOGOUT
  =========================== */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

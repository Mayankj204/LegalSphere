import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);

    if (res?.token) {
      // ✅ Store token separately
      localStorage.setItem("token", res.token);

      // ✅ Store user data without token duplication
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
  };

  const register = async (data) => {
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
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

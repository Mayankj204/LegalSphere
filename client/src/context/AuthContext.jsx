import { createContext, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (data) => {
    const res = await loginUser(data);

    if (res?.token) {
      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);
      return res;   // ✅ IMPORTANT
    }

    return null;
  };

  const register = async (data) => {
    const res = await registerUser(data);

    if (res?.token) {
      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);
      return res;   // ✅ IMPORTANT
    }

    return null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

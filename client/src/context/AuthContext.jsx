import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (_error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncUser();
  }, []);

  const login = (token, profile) => {
    localStorage.setItem("token", token);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

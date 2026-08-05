import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  // "checking" until we know one way or the other whether a session
  // cookie is already valid (e.g. on page refresh) - ProtectedRoute
  // waits for this before deciding whether to redirect to /login, so
  // a logged-in admin never sees a flash-redirect on reload.
  const [status, setStatus] = useState("checking");

  const checkSession = useCallback(async () => {
    try {
      const data = await api.get("/auth/me");
      setAdmin(data.admin);
      setStatus("authenticated");
    } catch {
      setAdmin(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    setAdmin(data.admin);
    setStatus("authenticated");
    return data.admin;
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {}); // log out locally either way, even if the request itself fails
    setAdmin(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ admin, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}

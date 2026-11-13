import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const login = (userData: any, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(userData)); 
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../domain/entities/User";
import { setUnauthorizedHandler } from "../../infrastructure/api/apiClient";
import { tokenStorage } from "../../infrastructure/storage/TokenStorageService";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
      const navigate = useNavigate();
      const [token, setToken] = useState<string | null>(() => tokenStorage.getToken());
      const [user, setUser] = useState<User | null>(() => tokenStorage.getUser());

      const login = useCallback((nextUser: User, nextToken: string) => {
            tokenStorage.setToken(nextToken);
            tokenStorage.setUser(nextUser);
            setUser(nextUser);
            setToken(nextToken);
      }, []);

      const logout = useCallback(() => {
            tokenStorage.clearSession();
            setUser(null);
            setToken(null);
            navigate("/");
      }, [navigate]);

      // Une réponse 401 ferme la session et renvoie l'utilisateur à l'accueil.
      useEffect(() => {
            setUnauthorizedHandler(logout);
            return () => setUnauthorizedHandler(null);
      }, [logout]);

      const value = useMemo(
            () => ({ user, token, login, logout, isAuthenticated: Boolean(token) }),
            [user, token, login, logout]
      );

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

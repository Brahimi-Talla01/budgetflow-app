import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../domain/entities/User";
import { setUnauthorizedHandler } from "../../infrastructure/api/apiClient";
import { repositories } from "../di/container";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
      const navigate = useNavigate();
      const [user, setUser] = useState<User | null>(null);
      const [isInitializing, setIsInitializing] = useState(true);

      const login = useCallback((nextUser: User) => {
            setUser(nextUser);
      }, []);

      const logout = useCallback(() => {
            setUser(null);
            // Ferme aussi la session côté serveur (suppression du cookie).
            void repositories.auth.logout().catch(() => undefined);
            navigate("/");
      }, [navigate]);

      // Restauration de la session : le cookie httpOnly est envoyé automatiquement.
      useEffect(() => {
            let cancelled = false;

            const restoreSession = async () => {
                  try {
                        const currentUser = await repositories.auth.me();
                        if (!cancelled) setUser(currentUser);
                  } catch {
                        if (!cancelled) setUser(null);
                  } finally {
                        if (!cancelled) setIsInitializing(false);
                  }
            };

            void restoreSession();

            return () => {
                  cancelled = true;
            };
      }, []);

      // Une réponse 401 (hors restauration de session) ferme la session.
      useEffect(() => {
            setUnauthorizedHandler(logout);
            return () => setUnauthorizedHandler(null);
      }, [logout]);

      const value = useMemo(
            () => ({
                  user,
                  isAuthenticated: Boolean(user),
                  isInitializing,
                  login,
                  logout,
            }),
            [user, isInitializing, login, logout]
      );

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

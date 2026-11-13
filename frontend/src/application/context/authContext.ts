import { createContext, useContext } from "react";
import type { User } from "../../domain/entities/User";

export interface AuthContextType {
      user: User | null;
      isAuthenticated: boolean;
      /** Vrai tant que la session en cours n'a pas été restaurée. */
      isInitializing: boolean;
      login: (user: User) => void;
      logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
      const context = useContext(AuthContext);

      if (!context) {
            throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
      }

      return context;
};

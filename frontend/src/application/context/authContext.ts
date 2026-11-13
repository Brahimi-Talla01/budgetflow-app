import { createContext, useContext } from "react";
import type { User } from "../../domain/entities/User";

export interface AuthContextType {
      user: User | null;
      token: string | null;
      login: (user: User, token: string) => void;
      logout: () => void;
      isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
      const context = useContext(AuthContext);

      if (!context) {
            throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
      }

      return context;
};

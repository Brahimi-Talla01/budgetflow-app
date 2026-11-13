import { createContext, useContext } from "react";

export interface LoadingContextType {
      isLoading: boolean;
      startLoading: () => void;
      stopLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = (): LoadingContextType => {
      const context = useContext(LoadingContext);

      if (!context) {
            throw new Error("useLoading doit être utilisé à l'intérieur de <LoadingProvider>");
      }

      return context;
};

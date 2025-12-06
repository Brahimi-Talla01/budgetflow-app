import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';


// Type du contexte
interface LoadingContextType {
      isLoading: boolean;
      startLoading: () => void;
      stopLoading: () => void;
}

// Contexte 
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);


// Hook 
export const useLoading = (): LoadingContextType => {

      const context = useContext(LoadingContext);

      if (!context) {
            throw new Error('useLoading doit être utilisé à l\'intérieur d\'un LoadingProvider');
      }

      return context;
};


// Props du Provider
interface LoadingProviderProps {
      children: ReactNode;
}

// Provider
export const LoadingProvider = ({ children }: LoadingProviderProps) => {
      
      const [isLoading, setIsLoading] = useState<boolean>(false);

      const startLoading = useCallback(() => {
            setIsLoading(true);
      }, []);

      const stopLoading = useCallback(() => {
            setIsLoading(false);
      }, []);

      const value: LoadingContextType = {
            isLoading,
            startLoading,
            stopLoading,
      };

      return (
            <LoadingContext.Provider value={value}>
                  {children}
            </LoadingContext.Provider>
      );
};
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { LoadingContext } from "./loadingContext";

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
      const [isLoading, setIsLoading] = useState(false);

      const startLoading = useCallback(() => setIsLoading(true), []);
      const stopLoading = useCallback(() => setIsLoading(false), []);

      const value = useMemo(
            () => ({ isLoading, startLoading, stopLoading }),
            [isLoading, startLoading, stopLoading]
      );

      return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

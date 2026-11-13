import React from 'react';
import { useLoading } from '../../../application/context/LoadingContext';


const GlobalLoadingIndicator: React.FC = () => {
    const { isLoading } = useLoading();

    return (
        <div
            className={`
                fixed top-0 left-0 z-50 h-1
                bg-primary
                transition-all duration-700 ease-out
                pointer-events-none
                ${isLoading ? 'w-[95%] opacity-100' : 'w-0 opacity-0'}
            `}
            aria-live="polite"
            aria-label={isLoading ? "Chargement en cours" : ""}
        />
    );
};

export default GlobalLoadingIndicator;
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Button({
      children,
      onClick,
      variant = 'primary',
      size = 'md',
      disabled = false,
      type = 'button',
      className = '',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
}: ButtonProps) {
      // Styles de base 
      const baseStyles = `
            font-outfit font-medium rounded-md 
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-1 focus:ring-offset-2
            active:scale-95
            disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none
            inline-flex items-center justify-center gap-2
            relative overflow-hidden
            hover:cursor-pointer
            ${fullWidth ? 'w-full' : ''}
      `;
      
      // Styles par variant 
      const variantStyles = {
            primary: 'bg-primary hover:bg-primary-hover text-white focus:ring-primary/30 shadow-primary/20 hover:shadow-primary/30 border-2 border-transparent z-0',
            secondary: 'bg-dark hover:bg-dark/90 text-white focus:ring-dark/30 shadow-dark/20 hover:shadow-dark/30 border-2 border-transparent',
            danger: 'bg-error hover:bg-error/90 text-white focus:ring-error/30 shadow-error/20 hover:shadow-error/30 border-2 border-transparent',
            success: 'bg-success hover:bg-success/90 text-white focus:ring-success/30 shadow-success/20 hover:shadow-success/30 border-2 border-transparent',
            warning: 'bg-warning hover:bg-warning/90 text-white focus:ring-warning/30 shadow-warning/20 hover:shadow-warning/30 border-2 border-transparent',
            ghost: 'bg-transparent hover:bg-light focus:ring-dark/10 border-2 border-light hover:border-light/80 shadow-none z-0',
      };
  
      // Styles de taille
      const sizeStyles = {
            sm: 'px-4 py-2 text-sm min-h-[36px]',
            md: 'px-6 py-3 text-base min-h-[44px]',
            lg: 'px-8 py-4 text-lg min-h-[52px]',
      };

      // Styles pour l'icône
      const iconStyles = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6',
      };

      const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
            if (loading || disabled) return;
            
            if (onClick) {
                  await onClick(e);
            }
      };

      return (
            <button
                  type={type}
                  onClick={handleClick}
                  disabled={disabled || loading}
                  className={`
                  ${baseStyles} 
                  ${variantStyles[variant]} 
                  ${sizeStyles[size]} 
                  ${className}
                  `.trim().replace(/\s+/g, ' ')}
            >
                  {/* Loading Spinner */}
                  {loading && (
                        <svg 
                              className={`animate-spin ${iconStyles[size]}`}
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                        >
                              <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4"
                              />
                              <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                        </svg>
                  )}

                  {/* Icon Left */}
                  {icon && !loading && iconPosition === 'left' && (
                        <span className={iconStyles[size]}>{icon}</span>
                  )}
                  
                  {/* Button Content */}
                  <span className="relative z-10">
                        {children}
                  </span>

                  {/* Icon Right */}
                  {icon && !loading && iconPosition === 'right' && (
                        <span className={iconStyles[size]}>{icon}</span>
                  )}

                  {/* Hover Effect Overlay */}
                  <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
      );
}
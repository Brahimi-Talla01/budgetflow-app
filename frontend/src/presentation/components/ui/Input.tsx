import React from "react";
import { type InputHTMLAttributes } from "react";
import { type ClassValue } from "clsx"; 
import { cn } from "../../../shared/utils/cn"; 

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
    className?: ClassValue; 
    label?: string;
    description?: string;
    error?: string; 
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = "text",
            label,
            description,
            error,
            required = false,
            id,
            ...props
        },
        ref 
    ) => {
        const inputId = id || React.useId(); 


        const baseInputClasses = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50";


        if (type === "checkbox") {
            return (
                <input
                    type="checkbox"
                    className={cn(
                        "h-4 w-4 rounded border border-gray-300 text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    {...props}
                />
            );
        }

        if (type === "radio") {
            return (
                <input
                    type="radio"
                    className={cn(
                        "h-4 w-4 rounded-full border border-gray-300 text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    {...props}
                />
            );
        }

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "text-sm font-medium leading-none",
                            error ? "text-error" : "text-gray-700"
                        )}
                    >
                        {label}
                        {required && <span className="text-error ml-1">*</span>}
                    </label>
                )}

                <input
                    type={type}
                    className={cn(
                        baseInputClasses,
                        error && "border-error focus-visible:ring-red-500", 
                        className 
                    )}
                    ref={ref}
                    id={inputId}
                    aria-invalid={!!error} 
                    {...props}
                />

                {description && !error && (
                    <p className="text-xs text-gray-500">
                        {description}
                    </p>
                )}

                {error && (
                    <p className="text-xs text-error">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
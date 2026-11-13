import React from "react";
import { type InputHTMLAttributes, type HTMLAttributes } from "react";
import { type ClassValue } from "clsx"; 
import { cn } from "../../../shared/utils/cn";
import { Check, Minus } from "lucide-react";



type CheckboxSize = "sm" | "default" | "lg";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
    className?: ClassValue;
    label?: React.ReactNode;
    description?: string;
    error?: string;
    indeterminate?: boolean;
    size?: CheckboxSize;
}

interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'className' | 'disabled'> {
    className?: ClassValue;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
    className,
    id,
    checked,
    indeterminate = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    size = "default",
    ...props
}, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses: Record<CheckboxSize, string> = { 
        sm: "h-4 w-4",
        default: "h-4 w-4",
        lg: "h-5 w-5"
    };

    return (
        <div className={cn("flex items-start space-x-2", className)}> 
            <div className="relative flex items-center pt-1"> 
                <input
                    type="checkbox"
                    ref={ref}
                    id={checkboxId}
                    checked={checked}
                    disabled={disabled}
                    required={required}
                    className="sr-only peer" 
                    {...props}
                />

                <label
                    htmlFor={checkboxId}
                    className={cn(
                        "shrink-0 rounded-sm border border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed transition-colors",
                        sizeClasses[size],
                        "peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary",
                        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                        error && "border-error",
                        (checked || indeterminate) && "bg-primary text-white border-primary",
                        
                    )}
                >
                    {/* Icônes */}
                    {checked && !indeterminate && (
                        <Check className={cn("w-3 h-3 text-white flex items-center justify-center")} />
                    )}
                    {indeterminate && (
                        <Minus className={cn("w-3 h-3 text-white flex items-center justify-center")} />
                    )}
                    
                    {!checked && !indeterminate && <span className={cn(sizeClasses[size], "block")} />}
                </label>
            </div>
            {(label || description || error) && (
                <div className="flex-1 space-y-1">
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                "text-lg font-medium leading-none cursor-pointer",
                                "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                error ? "text-error" : "text-gray-700"
                            )}
                        >
                            {label}
                            {required && <span className="text-error ml-1">*</span>}
                        </label>
                    )}

                    {description && !error && (
                        <p className="text-sm text-gray-500">
                            {description}
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-error">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

Checkbox.displayName = "Checkbox";

const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(({
    className,
    children,
    label,
    description,
    error,
    required = false,
    disabled = false,
    ...props
}, ref) => {
    return (
        <fieldset
            ref={ref}
            disabled={disabled}
            className={cn("space-y-3", className)}
            {...props}
        >
            {label && (
                <legend className={cn(
                    "text-sm font-medium pb-2", 
                    error ? "text-error" : "text-gray-700"
                )}>
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </legend>
            )}

            {description && !error && (
                <p className="text-sm text-gray-500">
                    {description}
                </p>
            )}

            <div className="space-y-2">
                {children}
            </div>

            {error && (
                <p className="text-sm text-error pt-1">
                    {error}
                </p>
            )}
        </fieldset>
    );
});

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = "primary",
        size = "md",
        loading = false,
        icon,
        iconPosition = "left",
        children,
        disabled,
        ...props
    }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center font-bold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full gap-2 touch-target";

        const variants = {
            primary: "bg-gradient-to-r from-[var(--primary-electric)] to-[var(--primary-deep)] text-white hover:shadow-[var(--glow-primary)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[var(--primary-electric)]",
            secondary: "bg-gradient-to-r from-[var(--secondary-pop)] to-[var(--secondary-warm)] text-gray-900 hover:shadow-[var(--glow-secondary)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[var(--secondary-pop)]",
            outline: "border-2 border-[var(--primary-electric)] text-[var(--primary-electric)] hover:bg-[var(--primary-electric)] hover:text-white hover:shadow-[var(--shadow-glow-primary)] focus-visible:ring-[var(--primary-electric)]",
            ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500",
            danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg focus-visible:ring-red-600",
        };

        const sizes = {
            sm: "h-9 px-4 text-sm min-h-[36px]",
            md: "h-11 px-6 text-base min-h-[44px]",
            lg: "h-13 px-8 text-lg min-h-[52px]",
        };

        const LoadingSpinner = () => (
            <svg
                className="animate-spin h-4 w-4"
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
        );

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <LoadingSpinner />}
                {!loading && icon && iconPosition === "left" && icon}
                {children}
                {!loading && icon && iconPosition === "right" && icon}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;

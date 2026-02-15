import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "primary" | "secondary" | "success" | "action" | "neutral" | "warning" | "error";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "neutral", children, ...props }, ref) => {
        const variants = {
            primary: "bg-[var(--primary-50)] text-[var(--primary-electric)]",
            secondary: "bg-[var(--secondary-light)] text-[var(--secondary-pop)]",
            success: "bg-[var(--success-light)] text-[var(--success)]",
            action: "bg-[var(--action-light)] text-[var(--action)] animate-pulse-subtle",
            neutral: "bg-gray-100 text-gray-700",
            warning: "bg-amber-50 text-amber-700 border border-amber-200",
            error: "bg-red-50 text-red-700 border border-red-200",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Badge.displayName = "Badge";

export default Badge;

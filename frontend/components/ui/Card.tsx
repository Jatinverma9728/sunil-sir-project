import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "elevated";
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "bg-white border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800",
        glass: "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        elevated: "bg-white border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "rounded-[1.25rem]",
                variants[variant],
                className
            )}
            {...props}
        />
    );
});

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return <div ref={ref} className={cn("p-6", className)} {...props} />;
    }
);

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn("text-2xl font-semibold leading-none tracking-tight text-gray-900", className)}
                {...props}
            />
        );
    }
);

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        return (
            <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
        );
    }
);

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
    }
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />;
    }
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

import React from "react";

interface VerifiedBadgeProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
    size = "md",
    showText = true,
    className = "",
}) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const textSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className={`${sizeClasses[size]} text-green-600 flex-shrink-0`}>
                <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            {showText && (
                <span className={`${textSizeClasses[size]} font-medium text-green-600`}>
                    Verified
                </span>
            )}
        </div>
    );
};

export default VerifiedBadge;

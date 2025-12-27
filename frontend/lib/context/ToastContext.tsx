"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType = "info", duration: number = 3000) => {
            const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newToast: Toast = { id, message, type, duration };

            setToasts((prev) => [...prev, newToast]);

            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const success = useCallback((message: string) => addToast(message, "success"), [addToast]);
    const error = useCallback((message: string) => addToast(message, "error", 5000), [addToast]);
    const info = useCallback((message: string) => addToast(message, "info"), [addToast]);
    const warning = useCallback((message: string) => addToast(message, "warning", 4000), [addToast]);

    // Listen for custom events from CartContext
    useEffect(() => {
        const handleShowToast = (event: CustomEvent<{ message: string; type: ToastType }>) => {
            addToast(event.detail.message, event.detail.type);
        };

        window.addEventListener('show-toast', handleShowToast as EventListener);
        return () => {
            window.removeEventListener('show-toast', handleShowToast as EventListener);
        };
    }, [addToast]);

    return (
        <ToastContext.Provider
            value={{ toasts, addToast, removeToast, success, error, info, warning }}
        >
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

// Samsung-style Toast Container - Top Center
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
            {toasts.map((toast, index) => (
                <SamsungToast key={toast.id} toast={toast} onRemove={onRemove} index={index} />
            ))}
        </div>
    );
}

// Samsung-style Individual Toast
function SamsungToast({ toast, onRemove, index }: { toast: Toast; onRemove: (id: string) => void; index: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 200);
    };

    const icons: Record<ToastType, string> = {
        success: "✓",
        error: "✕",
        warning: "!",
        info: "i",
    };

    const iconColors: Record<ToastType, string> = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-amber-500",
        info: "bg-blue-500",
    };

    return (
        <div
            onClick={handleRemove}
            className={`
                pointer-events-auto cursor-pointer
                flex items-center gap-3 px-5 py-3
                bg-gray-900/90 backdrop-blur-xl
                rounded-full shadow-2xl
                border border-white/10
                transition-all duration-300 ease-out
                hover:bg-gray-800/95 hover:scale-[1.02]
                ${isVisible && !isExiting
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4'
                }
            `}
            style={{
                transitionDelay: `${index * 50}ms`,
            }}
        >
            {/* Minimal Icon */}
            <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${iconColors[toast.type]}`}
            >
                {icons[toast.type]}
            </div>

            {/* Message */}
            <p className="text-white text-sm font-medium max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis">
                {toast.message}
            </p>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full ${iconColors[toast.type]} rounded-full`}
                    style={{
                        animation: `shrink ${(toast.duration || 3000) / 1000}s linear forwards`,
                    }}
                />
            </div>
        </div>
    );
}


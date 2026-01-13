"use client";

import { useEffect, useState } from "react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayScriptProps {
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * Razorpay Script Loader Component
 * Loads the Razorpay checkout.js script dynamically
 */
export default function RazorpayScript({ onLoad, onError }: RazorpayScriptProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Check if already loaded
        if (window.Razorpay) {
            setLoaded(true);
            onLoad?.();
            return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
            existingScript.addEventListener("load", () => {
                setLoaded(true);
                onLoad?.();
            });
            return;
        }

        // Create and load script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            setLoaded(true);
            onLoad?.();
        };

        script.onerror = () => {
            setError(true);
            onError?.();
            console.error("Failed to load Razorpay script");
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup is optional - script can remain loaded
        };
    }, [onLoad, onError]);

    // Return null - this component doesn't render anything visible
    return null;
}

/**
 * Hook to check if Razorpay is loaded
 */
export function useRazorpay() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if already loaded
        if (window.Razorpay) {
            setIsLoaded(true);
            setIsLoading(false);
            return;
        }

        // Wait for script to load
        const checkRazorpay = setInterval(() => {
            if (window.Razorpay) {
                setIsLoaded(true);
                setIsLoading(false);
                clearInterval(checkRazorpay);
            }
        }, 100);

        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
            clearInterval(checkRazorpay);
            setIsLoading(false);
        }, 10000);

        return () => {
            clearInterval(checkRazorpay);
            clearTimeout(timeout);
        };
    }, []);

    return { isLoaded, isLoading };
}

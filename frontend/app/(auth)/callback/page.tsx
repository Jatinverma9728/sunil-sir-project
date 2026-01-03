"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import * as authAPI from "@/lib/api/auth";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loadUser } = useAuth();
    const toast = useToast();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                console.log('🔐 OAuth callback started');
                // Get token from query parameter
                const token = searchParams.get("token");
                const error = searchParams.get("error");

                if (error) {
                    throw new Error(
                        error === "oauth_failed"
                            ? "Google sign-in failed. Please try again."
                            : "Authentication error occurred."
                    );
                }

                if (!token) {
                    throw new Error("No authentication token received.");
                }

                console.log('✅ Token received:', token.substring(0, 20) + '...');

                // CRITICAL: Set token in cookie AND API client
                authAPI.setAuthToken(token, true); // Store in cookie

                // ALSO set in API client for immediate use
                const { apiClient } = await import("@/lib/api/client");
                apiClient.setAuthToken(token);

                console.log('✅ Token stored in cookie and API client');

                // Load user profile (will now use the token)
                await loadUser();

                console.log('✅ User loaded successfully');

                setStatus("success");
                toast.success("Successfully signed in with Google!");

                // Redirect to homepage or original destination
                const redirectTo = searchParams.get("redirect") || "/";

                console.log('✅ Redirecting to:', redirectTo);

                setTimeout(() => router.push(redirectTo), 1500);
            } catch (err: any) {
                console.error("❌ OAuth callback error:", err);
                setError(err.message || "Failed to complete sign in");
                setStatus("error");
                toast.error(err.message || "Failed to complete sign in");

                // Redirect to login after showing error
                setTimeout(() => router.push("/login"), 2000);
            }
        };

        handleOAuthCallback();
    }, [searchParams, loadUser, router, toast]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
            <div className="w-full max-w-md text-center">
                {status === "loading" && (
                    <div className="space-y-4">
                        <div className="relative mx-auto w-16 h-16">
                            {/* Animated spinner */}
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-gray-900 rounded-full animate-spin"></div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">
                                Completing sign in...
                            </h2>
                            <p className="text-gray-500">Please wait while we verify your account</p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">
                                Success!
                            </h2>
                            <p className="text-gray-500">Redirecting you now...</p>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">
                                Sign in failed
                            </h2>
                            <p className="text-red-600">{error}</p>
                            <p className="text-sm text-gray-500">Redirecting to login...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper with Suspense for useSearchParams
export default function CallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            }
        >
            <CallbackContent />
        </Suspense>
    );
}

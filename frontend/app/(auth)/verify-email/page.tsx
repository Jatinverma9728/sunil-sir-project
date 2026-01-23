"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { apiClient } from "@/lib/api/client";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const toast = useToast();
    const api = apiClient;

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "error">("pending");
    const [message, setMessage] = useState("");

    // Check if already verified
    useEffect(() => {
        if (user?.isEmailVerified) {
            setVerificationStatus("verified");
            const timer = setTimeout(() => router.push("/dashboard"), 2000);
            return () => clearTimeout(timer);
        }
    }, [user, router]);

    // Get verification status on load
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const response = await api.get<{ isEmailVerified: boolean; email: string }>("/verification/status");
                setVerificationStatus(response.data?.isEmailVerified ? "verified" : "pending");
                setMessage(response.data?.email || "");
            } catch (error: any) {
                setVerificationStatus("pending");
                setMessage(user?.email || "");
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchStatus();
        }
    }, [user, token, api]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);


    const handleResend = async () => {
        if (resendCooldown > 0 || !user || !token) return;

        setResendLoading(true);

        try {
            const response = await api.post("/verification/resend-verification-email", {});
            setResendCooldown(3600); // 1 hour rate limit
            toast.success("Verification email sent! Check your inbox.");
            setVerificationStatus("pending");
            setMessage("Check your email for the verification link");
        } catch (error: any) {
            if (error.response?.status === 429) {
                toast.error("Too many resend attempts. Try again in 1 hour.");
                setResendCooldown(3600);
            } else {
                toast.error(error.message || "Failed to resend verification email");
            }
        } finally {
            setResendLoading(false);
        }
    };

    // Redirect if not authenticated
    if (!user || !token) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h2.586a1 1 0 00-.707-1.707h-3.172a1 1 0 00-.707.293l-.828.828A1 1 0 009 5.586V7a2 2 0 012 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Not Authenticated</h2>
                    <p className="text-gray-600 mb-6">Please log in to verify your email</p>
                    <Link href="/login" className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // If already verified
    if (verificationStatus === "verified") {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
                    <p className="text-gray-600 mb-6">Your email has been successfully verified.</p>
                    <Link href="/dashboard" className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Pending verification - show resend page
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-10">
                        <Link href="/" className="text-2xl font-semibold text-gray-900 tracking-tight">
                            Flash<span className="text-gray-300">.</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-medium text-gray-900 mb-2 tracking-tight">
                            Verify your email
                        </h1>
                        <p className="text-gray-500">
                            We've sent a verification link to{" "}
                            <span className="font-medium text-gray-700">{user?.email}</span>
                        </p>
                    </div>

                    {/* Status Messages */}
                    <div className="mb-6 space-y-4">
                        {/* Pending State */}
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                            <p className="text-sm text-blue-600 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Check your inbox and click the verification link in the email.</span>
                            </p>
                        </div>

                        {/* Checklist */}
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-3">What to do:</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Check your email inbox
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Look for email from "noreply@flash.com"
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Click the verification link (valid for 24 hours)
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Check spam folder if not found
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Resend Section */}
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-6">
                        <p className="text-sm text-amber-700 mb-3">Didn't receive an email?</p>
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || resendCooldown > 0}
                            className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {resendLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : resendCooldown > 0 ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Resend in {resendCooldown}s
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Resend Verification Email
                                </>
                            )}
                        </button>
                        {resendCooldown > 0 && (
                            <p className="text-xs text-amber-600 mt-2">Rate limited. Try again after {Math.floor(resendCooldown / 60)} minutes.</p>
                        )}
                    </div>

                    {/* Help Section */}
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Still having trouble?</p>
                        <ul className="space-y-2 text-xs text-gray-600">
                            <li>• Check your spam or promotions folder</li>
                            <li>• Make sure you entered the correct email</li>
                            <li>• Verification link expires after 24 hours</li>
                        </ul>
                    </div>

                    {/* Support Link */}
                    <div className="text-center space-y-3">
                        <p className="text-sm text-gray-500">
                            <a href="mailto:support@flash.com" className="text-gray-900 hover:underline font-medium">
                                Contact Support
                            </a>
                            {" if you need help"}
                        </p>
                        <Link href="/dashboard" className="block text-sm text-gray-500 hover:underline">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-medium text-white mb-4 tracking-tight">
                        Email verification
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md">
                        Verify your email address to unlock all features and secure your account. The verification link is valid for 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { apiClient } from "@/lib/api/client";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, token, refreshUser } = useAuth();
    const toast = useToast();
    const api = apiClient;

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "error">("pending");
    const [message, setMessage] = useState("");

    // OTP State
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [emailInput, setEmailInput] = useState<string>("");

    // Check if already verified
    useEffect(() => {
        if (user?.isEmailVerified) {
            setVerificationStatus("verified");
            const timer = setTimeout(() => router.push("/profile"), 2000);
            return () => clearTimeout(timer);
        }
    }, [user, router]);

    // Get verification status on load
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const response = await api.get<{ isEmailVerified: boolean; email: string }>("/verification/status", true);
                setVerificationStatus(response.data?.isEmailVerified ? "verified" : "pending");
                // For OTP flow, we might not need to display the email directly here,
                // but keep it for consistency if needed elsewhere.
                setMessage(response.data?.email || "");
                if (!response.data?.isEmailVerified && response.data?.email) {
                    // If not verified, and we have an email, pre-fill emailInput if user is null
                    if (!user) setEmailInput(response.data.email);

                    // Auto-trigger OTP send if we just landed here
                    try {
                        await api.post("/verification/resend-verification-email", { email: response.data.email });
                        toast.success("Verification OTP sent! Check your inbox.");
                        setResendCooldown(60);
                    } catch (e: any) {
                        // If rate limited, just start the cooldown visually
                        if (e.response?.status === 429) setResendCooldown(60);
                    }
                }
            } catch (error: any) {
                setVerificationStatus("pending");
                setMessage((user as any)?.email || "");
                if (!user) setEmailInput((user as any)?.email || ""); // Fallback if user is null
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchStatus();
        } else if (!user && !emailInput) {
            // If no user and no email input, prompt for email
            // This case is handled by the UI showing the email input field
        }
    }, [user, token, api, emailInput]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);


    const handleResend = async () => {
        const targetEmail = user?.email || emailInput;

        if (resendCooldown > 0 || !targetEmail) {
            if (!targetEmail) toast.error("Please enter your email address");
            return;
        }

        setResendLoading(true);

        try {
            await api.post("/verification/resend-verification-email", { email: targetEmail });
            setResendCooldown(60); // 1 minute rate limit
            toast.success("Verification OTP sent! Check your inbox.");
            setVerificationStatus("pending");
            setMessage("Check your email for the verification code");
        } catch (error: any) {
            if (error.response?.status === 429) {
                toast.error("Too many resend attempts. Try again in 1 hour.");
                setResendCooldown(60); // Use 60 on the frontend display instead of a full hour
            } else {
                toast.error(error.message || "Failed to resend verification OTP");
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);

            // Focus on next empty input or the last one
            const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const otpString = otp.join("");
        const targetEmail = user?.email || emailInput;

        if (otpString.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        if (!targetEmail) {
            toast.error("Please enter your email address first");
            return;
        }

        setVerifyingOtp(true);

        try {
            const response = await api.post("/verification/verify-otp", {
                email: targetEmail.toLowerCase(),
                otp: otpString
            });

            toast.success("Email verified successfully!");
            setVerificationStatus("verified");

            // Refresh user state to reflect verified status
            await refreshUser();

            setTimeout(() => {
                router.push("/profile");
            }, 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Invalid or expired OTP");
            // Clear OTP inputs on error
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setVerifyingOtp(false);
        }
    };

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
                    <button
                        onClick={() => router.push("/profile")}
                        className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Go to Profile
                    </button>
                </div>
            </div>
        );
    }

    // Pending verification - show OTP form
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-10">
                        <Link href="/" className="text-2xl font-semibold text-gray-900 tracking-tight">
                            North Tech Hub<span className="text-gray-300">.</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-medium text-gray-900 mb-2 tracking-tight">
                            Verify your email
                        </h1>
                        <p className="text-gray-500 text-sm">
                            We've sent a 6-digit verification code to{" "}
                            <span className="font-medium text-gray-700">{user?.email || "your email"}</span>
                        </p>
                    </div>

                    {/* Email Input (If not logged in) */}
                    {!user && (
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Confirm your email</label>
                            <input
                                type="email"
                                id="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                    )}

                    {/* OTP Input Form */}
                    <form onSubmit={handleVerifyOtp} className="mb-8">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                Enter Verification Code
                            </label>
                            <div className="flex justify-between gap-2 sm:gap-4" onPaste={handleOtpPaste}>
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => { inputRefs.current[idx] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all shadow-sm"
                                        placeholder="-"
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={verifyingOtp || otp.join("").length !== 6 || (!user && !emailInput)}
                            className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                        >
                            {verifyingOtp ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                "Verify Email"
                            )}
                        </button>
                    </form>

                    {/* Resend Section */}
                    <div className="text-center mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || resendCooldown > 0}
                            className="text-gray-900 font-medium hover:underline disabled:text-gray-400 disabled:no-underline transition-all flex items-center justify-center gap-2 mx-auto"
                        >
                            {resendCooldown > 0 ? (
                                `Resend code in ${resendCooldown} s`
                            ) : resendLoading ? (
                                "Sending..."
                            ) : (
                                "Resend OTP Code"
                            )}
                        </button>
                    </div>

                    {/* Support Link */}
                    <div className="text-center mt-10 space-y-3">
                        <p className="text-sm text-gray-500">
                            <a href="mailto:support@northtechhub.com" className="text-gray-900 hover:underline font-medium">
                                Contact Support
                            </a>
                            {" if you need help"}
                        </p>
                        <Link href="/login" className="block text-sm text-gray-500 hover:underline">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right - Image/Banner */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="relative z-10 max-w-lg p-12 text-center text-white">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-light mb-4 text-white">Secure Your Account</h2>
                    <p className="text-gray-300 font-light leading-relaxed">
                        Email verification helps us keep your account safe and ensures you can always recover your access if needed.
                    </p>
                </div>
            </div>
        </div>
    );
}

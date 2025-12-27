"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";

export default function ResetPasswordPage() {
    const router = useRouter();
    const toast = useToast();

    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{
        email?: string;
        otp?: string;
        password?: string;
        confirmPassword?: string;
        general?: string
    }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Step 1: Request OTP
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setErrors({ email: "Email is required" });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep('otp');
                toast.success("OTP sent to your email. Valid for 10 minutes");

                // In development, show OTP
                if (data.otp) {
                    console.log('OTP (Dev):', data.otp);
                    toast.info(`Dev OTP: ${data.otp}`);
                }
            } else {
                throw new Error(data.message || "Failed to send OTP");
            }
        } catch (error: any) {
            setErrors({ general: error.message });
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: typeof errors = {};

        if (!otp || otp.length !== 6) {
            newErrors.otp = "OTP must be 6 digits";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password reset successful! Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                throw new Error(data.message || "Failed to reset password");
            }
        } catch (error: any) {
            setErrors({ general: error.message });
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
                        </h1>
                        <p className="text-gray-600">
                            {step === 'email'
                                ? 'Enter your email to receive a reset OTP'
                                : 'Enter the OTP sent to your email'}
                        </p>
                    </div>

                    {/* Error Alert */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center gap-2">
                                <span>⚠️</span>
                                {errors.general}
                            </p>
                        </div>
                    )}

                    {/* Step 1: Email Input */}
                    {step === 'email' && (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors({ ...errors, email: undefined, general: undefined });
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent transition-colors ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="you@example.com"
                                    disabled={loading}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP and Password Input */}
                    {step === 'otp' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {/* Email Display */}
                            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                OTP sent to: <strong>{email}</strong>
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="ml-2 text-blue-600 hover:underline"
                                >
                                    Change
                                </button>
                            </div>

                            {/* OTP Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter 6-Digit OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtp(value);
                                        setErrors({ ...errors, otp: undefined, general: undefined });
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent transition-colors ${errors.otp ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="000000"
                                    maxLength={6}
                                    disabled={loading}
                                />
                                {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            setErrors({ ...errors, password: undefined, general: undefined });
                                        }}
                                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent transition-colors ${errors.password ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="••••••••"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => {
                                        setFormData({ ...formData, confirmPassword: e.target.value });
                                        setErrors({ ...errors, confirmPassword: undefined, general: undefined });
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent transition-colors ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Resetting Password...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleRequestOTP}
                                    disabled={loading}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
                                >
                                    Didn't receive OTP? Resend
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";
import { Mail, ArrowRight, CheckCircle, AlertCircle, KeyRound, Lock, Eye, EyeOff, ChevronLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
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
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [success, setSuccess] = useState(false);

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
            // Step 2a: Verify OTP first to get reset token
            const verifyResponse = await fetch(`${API_URL}/auth/verify-reset-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                throw new Error(verifyData.message || "Invalid OTP");
            }

            // Step 2b: Reset password with the token
            const resetResponse = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resetToken: verifyData.resetToken,
                    newPassword: formData.password
                }),
            });

            const data = await resetResponse.json();

            if (resetResponse.ok) {
                setSuccess(true);
                toast.success("Password reset successful! Redirecting to login...");
                setTimeout(() => router.push("/login"), 3000);
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
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4 relative overflow-hidden font-sans text-gray-900 selection:bg-indigo-500/30">
            {/* Dot Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-gray-200/50 overflow-hidden">
                    {success ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Successful!</h2>
                            <p className="text-gray-600 mb-8">
                                Your password has been updated. You will be redirected to the login page shortly.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-8 py-3 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Brand Header */}
                            <div className="px-8 pt-8 pb-4 text-center">
                                <Link href="/" className="inline-block mb-6 group">
                                    <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        North Tech Hub<span className="text-indigo-600">.</span>
                                    </span>
                                </Link>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                            {step === 'email' ? 'Forgot password?' : 'Reset Password'}
                                        </h1>
                                        <p className="text-gray-500 text-sm">
                                            {step === 'email'
                                                ? "Don't worry, we'll send you reset instructions."
                                                : "Enter the code sent to your email."}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Content */}
                            <div className="p-8 pt-2">
                                {/* Global Error */}
                                <AnimatePresence>
                                    {errors.general && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-6 overflow-hidden"
                                        >
                                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                                <p className="text-sm text-red-600 font-medium">{errors.general}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence mode="wait">
                                    {step === 'email' ? (
                                        <motion.form
                                            key="email-form"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleRequestOTP}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5 ">Email</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value);
                                                            setErrors({ ...errors, email: undefined, general: undefined });
                                                        }}
                                                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                                        placeholder="Enter your email"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.email}</p>}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-3.5 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/20 group"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send Reset Code</span>
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.form
                                            key="otp-form"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleResetPassword}
                                            className="space-y-5"
                                        >
                                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-sm">
                                                        <p className="text-gray-500">Sent to</p>
                                                        <p className="font-medium text-gray-900">{email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep('email')}
                                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm hover:shadow transition-all"
                                                >
                                                    Change
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
                                                <div className="relative group">
                                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={otp}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                            setOtp(value);
                                                            setErrors({ ...errors, otp: undefined, general: undefined });
                                                        }}
                                                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 font-mono tracking-widest text-lg disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.otp ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                                        placeholder="000000"
                                                        maxLength={6}
                                                        disabled={loading}
                                                    />
                                                </div>
                                                {errors.otp && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.otp}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            value={formData.password}
                                                            onChange={(e) => {
                                                                setFormData({ ...formData, password: e.target.value });
                                                                setErrors({ ...errors, password: undefined, general: undefined });
                                                            }}
                                                            className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                                            placeholder="••••••"
                                                            disabled={loading}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={formData.confirmPassword}
                                                            onChange={(e) => {
                                                                setFormData({ ...formData, confirmPassword: e.target.value });
                                                                setErrors({ ...errors, confirmPassword: undefined, general: undefined });
                                                            }}
                                                            className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                                            placeholder="••••••"
                                                            disabled={loading}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {(errors.password || errors.confirmPassword) && (
                                                <p className="text-xs text-red-500 font-medium ml-1">
                                                    {errors.password || errors.confirmPassword}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-3.5 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/20"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Resetting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-5 h-5" />
                                                        <span>Reset Password</span>
                                                    </>
                                                )}
                                            </button>

                                            <div className="text-center pt-2">
                                                <button
                                                    type="button"
                                                    onClick={handleRequestOTP}
                                                    disabled={loading}
                                                    className="text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium hover:underline"
                                                >
                                                    Didn't receive code? Resend
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>

                                {/* Footer */}
                                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group font-medium"
                                    >
                                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        Back to log in
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

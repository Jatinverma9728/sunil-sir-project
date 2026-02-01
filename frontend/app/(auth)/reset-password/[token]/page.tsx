"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ChevronLeft } from "lucide-react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const toast = useToast();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${API_URL}/auth/reset-password/${resolvedParams.token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: formData.password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                toast.success("Password reset successful!");
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

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: "", color: "" };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        const labels = ["", "Weak", "Fair", "Good", "Strong"];
        const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

        return { strength, label: labels[strength] || "", color: colors[strength] || "" };
    };

    const passwordStrength = getPasswordStrength();

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
                                Your password has been updated. You can now log in with your new credentials.
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
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                                <p className="text-gray-500 text-sm">
                                    Create a strong password for your account
                                </p>
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

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* New Password */}
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
                                                className={`w-full pl-10 pr-10 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                                placeholder="••••••••"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Password Strength Meter */}
                                        {formData.password && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-3 space-y-1.5"
                                            >
                                                <div className="flex gap-1 h-1.5">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex-1 rounded-full transition-colors duration-300 ${i <= passwordStrength.strength ? passwordStrength.color : "bg-gray-100"}`}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-xs text-gray-400">Strength check</span>
                                                    <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                                        {passwordStrength.label}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                                    setErrors({ ...errors, confirmPassword: undefined, general: undefined });
                                                }}
                                                className={`w-full pl-10 pr-10 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                                placeholder="••••••••"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.confirmPassword}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/20"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Resetting Password...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Reset Password</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Footer Link */}
                                    <div className="text-center pt-2">
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group font-medium"
                                        >
                                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            Back to log in
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

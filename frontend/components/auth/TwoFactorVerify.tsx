"use client";

import { useState } from "react";

interface TwoFactorVerifyProps {
    email: string;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function TwoFactorVerify({
    email,
    onVerify,
    onResend,
    onCancel,
    loading = false
}: TwoFactorVerifyProps) {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [resending, setResending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        try {
            await onVerify(otp);
        } catch (err: any) {
            setError(err.message || "Invalid verification code");
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");
        try {
            await onResend();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
                    <p className="text-gray-600 text-sm">
                        Enter the 6-digit code sent to
                    </p>
                    <p className="text-gray-900 font-medium text-sm mt-1">{email}</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <span>⚠️</span>
                            {error}
                        </p>
                    </div>
                )}

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtp(value);
                                setError("");
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="000000"
                            maxLength={6}
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                "Verify Code"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Resend */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending || loading}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
                        >
                            {resending ? "Sending..." : "Didn't receive the code? Resend"}
                        </button>
                    </div>
                </form>

                {/* Info */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800">
                        💡 Your verification code will expire in 5 minutes
                    </p>
                </div>
            </div>
        </div>
    );
}

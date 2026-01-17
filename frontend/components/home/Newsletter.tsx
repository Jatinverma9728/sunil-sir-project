"use client";

import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus("error");
            setMessage("Please enter a valid email address");
            return;
        }

        setStatus("loading");

        setTimeout(() => {
            setStatus("success");
            setMessage("Thank you for subscribing!");
            setEmail("");

            setTimeout(() => {
                setStatus("idle");
                setMessage("");
            }, 3000);
        }, 1000);
    };

    return (
        <section className="py-24">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-[3rem] p-12 md:p-20 overflow-hidden text-center border border-indigo-100/50 shadow-[0_20px_40px_-15px_rgba(99,102,241,0.05)]">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                Newsletter
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                                Stay in the loop
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl">
                                Join our community to get the latest updates on new products and exclusive offers.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
                            <div className="relative flex-1 group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
                                    disabled={status === "loading"}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="px-8 py-4 bg-gray-900 text-white text-base font-semibold rounded-2xl hover:bg-indigo-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                            >
                                {status === "loading" ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Joining...
                                    </span>
                                ) : "Subscribe"}
                            </button>
                        </form>

                        {message && (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${status === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"} mb-8 animate-fade-in`}>
                                {status === "success" && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                )}
                                {message}
                            </div>
                        )}

                        {/* Features */}
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-gray-500">
                            {["Exclusive Deals", "Early Access", "No Spam"].map((feature) => (
                                <span key={feature} className="flex items-center gap-2 text-sm font-medium">
                                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

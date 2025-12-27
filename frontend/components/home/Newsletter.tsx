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
        <section className="py-24 lg:py-32">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2.5rem] p-12 md:p-20 overflow-hidden">
                    {/* Premium decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></div>

                    <div className="relative z-10 max-w-2xl mx-auto text-center">
                        {/* Header */}
                        <span className="inline-block text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-6 border border-gray-700 px-4 py-2 rounded-full">
                            ✦ Newsletter
                        </span>
                        <h2 className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight">
                            Stay Updated
                        </h2>
                        <p className="text-gray-400 text-lg mb-10">
                            Get the latest updates on new products and exclusive offers
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
                            <div className="relative flex-1 group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-6 py-4 bg-white/10 border border-gray-700 rounded-2xl text-white placeholder:text-gray-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-300"
                                    disabled={status === "loading"}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="px-8 py-4 bg-white text-gray-900 text-base font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                {status === "loading" ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Subscribing
                                    </span>
                                ) : "Subscribe"}
                            </button>
                        </form>

                        {message && (
                            <p className={`text-base font-medium ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                                {message}
                            </p>
                        )}

                        {/* Features */}
                        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-gray-400">
                            {["Exclusive Deals", "Early Access", "No Spam"].map((feature) => (
                                <span key={feature} className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
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

"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/api/newsletter";

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
        setMessage("");

        try {
            const response = await subscribeToNewsletter(email);

            if (response.success) {
                setStatus("success");
                // Backend returns message at root level, not in data
                setMessage(response.message || response.data?.message || "Thank you for subscribing!");
                setEmail("");

                // Reset after 5 seconds
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 5000);
            } else {
                setStatus("error");
                setMessage(response.message || response.error || "Subscription failed. Please try again.");
            }
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <section className="py-24">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <span className="mb-6 inline-flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase text-[var(--primary-electric)]">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                Newsletter
                            </span>
                            <h2 className="mb-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
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
                                    className="w-full rounded-lg border border-gray-200 bg-white px-6 py-4 text-gray-900 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-[var(--primary-electric)] focus:outline-none focus:ring-4 focus:ring-[var(--primary-electric)]/10"
                                    disabled={status === "loading"}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="whitespace-nowrap rounded-lg bg-gradient-to-r from-[var(--primary-electric)] to-[var(--primary-deep)] px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--glow-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-electric)] focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
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
                            <div className={`mb-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${status === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"} animate-fade-in`}>
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
                                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-[var(--primary-electric)]">
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

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
                setMessage(response.message || "Welcome! Use code NORTH500 for ₹500 off your order.");
                setEmail("");
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 6000);
            } else {
                setStatus("error");
                setMessage(response.message || "Subscription failed. Please try again.");
            }
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <section className="py-12 bg-white" aria-label="VIP Newsletter">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-xl bg-slate-50 text-slate-900 p-8 sm:p-12 md:p-14 border border-slate-200">
                    <div className="relative z-10 max-w-2xl mx-auto text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#028eff] text-xs font-bold uppercase tracking-wider mb-3">
                            Member Privilege
                        </span>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
                            Get ₹500 OFF Your First Order
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                            Subscribe for exclusive member deals on certified refurbished laptops, hardware upgrades, and free course modules.
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 mb-6">
                            <span>Voucher Code:</span>
                            <span className="bg-amber-200/60 px-2 py-0.5 rounded font-mono text-amber-950 font-black">NORTH500</span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address..."
                                className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-[#028eff] focus:ring-2 focus:ring-blue-500/20 font-medium"
                                disabled={status === "loading"}
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="px-6 py-2.5 rounded-lg bg-[#028eff] hover:bg-[#0070d6] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 shrink-0"
                            >
                                {status === "loading" ? "Joining..." : "Get Voucher"}
                            </button>
                        </form>

                        {message && (
                            <p className={`mt-3 text-xs font-semibold ${status === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500));
        setSending(false);
        setSent(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const contactMethods = [
        {
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
            title: "Visit Us",
            subtitle: "Nalka Chowk, 12 Quarter, Near Sector 1-4, Hisar, Haryana",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            title: "Email Us",
            subtitle: "northtechhub2003@gmail.com",
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
            title: "Call Us",
            subtitle: "+91 93553-86007",
            color: "bg-green-100 text-green-600"
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 lg:flex">
            {/* Left Side: Content & Info */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center relative bg-white"
            >
                <div className="max-w-xl mx-auto w-full">
                    <span className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-4 block">Here to help</span>
                    <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                        Let's Talk.
                    </h1>
                    <p className="text-xl text-gray-500 mb-12 leading-relaxed">
                        Have a project in mind or just want to explore what's possible?
                        We're all ears.
                    </p>

                    <div className="space-y-8">
                        {contactMethods.map((method, i) => (
                            <div key={i} className="flex items-center gap-6 group cursor-pointer">
                                <div className={`w-14 h-14 rounded-2xl ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{method.title}</h3>
                                    <p className="text-gray-500">{method.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <p className="text-sm text-gray-400 font-medium">
                            Looking for quick answers? <a href="/faq" className="text-gray-900 underline underline-offset-4 hover:text-blue-600 transition-colors">Check our FAQ</a>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:w-1/2 p-4 lg:p-12 flex items-center justify-center bg-gray-50"
            >
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 lg:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>

                    {sent ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                            <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                            <button
                                onClick={() => setSent(false)}
                                className="mt-8 text-sm font-bold text-gray-900 underline hover:text-blue-600"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all font-medium"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all font-medium"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Subject</label>
                                <select
                                    name="subject"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all font-medium appearance-none"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select a topic</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Support</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all font-medium resize-none"
                                    placeholder="How can we help?"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

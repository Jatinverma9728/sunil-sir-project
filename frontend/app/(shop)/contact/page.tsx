"use client";

import { useState } from "react";

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

        await new Promise((r) => setTimeout(r, 1500));

        setSending(false);
        setSent(true);
        setFormData({ name: "", email: "", subject: "", message: "" });

        setTimeout(() => setSent(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const contactInfo = [
        {
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
            title: "Visit Us",
            details: ["123 Tech Street", "Silicon Valley, CA 94025"],
        },
        {
            icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            title: "Email Us",
            details: ["support@flash.com", "business@flash.com"],
        },
        {
            icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
            title: "Call Us",
            details: ["+1 (555) 123-4567", "Mon-Fri 9am-6pm PST"],
        },
    ];

    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.",
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day hassle-free return policy. Items must be unused and in original packaging.",
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes! We ship to over 50 countries. Shipping times and costs vary by location.",
        },
        {
            question: "How do I access my courses?",
            answer: "Once purchased, courses are available in your account under 'My Courses' with lifetime access.",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-6 border border-gray-200 px-4 py-2 rounded-full">
                            Get in Touch
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-6 tracking-tight">
                            We'd Love to Hear From You
                        </h1>
                        <p className="text-xl text-gray-500">
                            Have a question, suggestion, or just want to say hello?
                            Our team is here to help and we typically respond within 24 hours.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 -mt-8 relative z-10">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-6">
                        {contactInfo.map((info, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl p-8 border border-gray-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-gray-900 transition-colors">
                                    <svg className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={info.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{info.title}</h3>
                                {info.details.map((detail, j) => (
                                    <p key={j} className="text-gray-500">{detail}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white rounded-3xl p-10 border border-gray-100">
                            <h2 className="text-2xl font-medium text-gray-900 mb-2">Send Us a Message</h2>
                            <p className="text-gray-500 mb-8">Fill out the form and we'll get back to you shortly.</p>

                            {sent && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-800">Message sent successfully!</p>
                                        <p className="text-sm text-green-600">We'll respond within 24 hours.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 focus:bg-white transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 focus:bg-white transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 focus:bg-white transition-all"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="orders">Order Status</option>
                                        <option value="returns">Returns & Refunds</option>
                                        <option value="courses">Course Questions</option>
                                        <option value="business">Business Partnership</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 focus:bg-white transition-all resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Map Placeholder */}
                            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl h-72 flex items-center justify-center border border-gray-100">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">123 Tech Street</p>
                                    <p className="text-sm text-gray-400">Silicon Valley, CA</p>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100">
                                <h3 className="text-lg font-medium text-gray-900 mb-5">Business Hours</h3>
                                <div className="space-y-3 text-gray-600">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span>Monday - Friday</span>
                                        <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span>Saturday</span>
                                        <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span>Sunday</span>
                                        <span className="text-gray-400">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">FAQ</p>
                        <h2 className="text-3xl font-medium text-gray-900 tracking-tight">
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors group"
                            >
                                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-3">
                                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500 group-hover:bg-gray-900 group-hover:text-white transition-colors">?</span>
                                    {faq.question}
                                </h3>
                                <p className="text-gray-500 pl-9">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

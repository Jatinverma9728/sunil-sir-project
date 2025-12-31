"use client";

import { useState } from "react";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                            <svg className="w-4 h-4 text-[#C1FF72]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-white">Support Center</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            How Can We <span className="text-[#C1FF72]">Help You?</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Find answers to commonly asked questions about our products and services
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="space-y-12">
                    {/* Orders & Shipping */}
                    <Section icon="📦" title="Orders & Shipping" color="blue">
                        <FAQ
                            isOpen={openIndex === 0}
                            onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}
                            question="How long does shipping take?"
                            answer="Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery. We also offer free shipping on all orders over $50. You'll receive tracking information via email once your order ships."
                        />
                        <FAQ
                            isOpen={openIndex === 1}
                            onClick={() => setOpenIndex(openIndex === 1 ? null : 1)}
                            question="Do you ship internationally?"
                            answer="Yes! We ship to over 100 countries worldwide. International shipping times vary by location but typically take 10-15 business days. Customs fees and import taxes may apply depending on your country."
                        />
                        <FAQ
                            isOpen={openIndex === 2}
                            onClick={() => setOpenIndex(openIndex === 2 ? null : 2)}
                            question="How can I track my order?"
                            answer="Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and viewing your order history. Real-time updates will show your package's journey."
                        />
                    </Section>

                    {/* Returns & Refunds */}
                    <Section icon="🔄" title="Returns & Refunds" color="green">
                        <FAQ
                            isOpen={openIndex === 3}
                            onClick={() => setOpenIndex(openIndex === 3 ? null : 3)}
                            question="What is your return policy?"
                            answer="We offer a 30-day return policy on most items. Products must be unused, in original packaging, and in the same condition you received them. Electronics have a 14-day return window. Return shipping labels are provided for your convenience."
                        />
                        <FAQ
                            isOpen={openIndex === 4}
                            onClick={() => setOpenIndex(openIndex === 4 ? null : 4)}
                            question="How do I initiate a return?"
                            answer="Simply log into your account, navigate to your order history, and select the order you'd like to return. Follow the step-by-step process to generate a prepaid return label. Pack the item securely and drop it off at any authorized carrier location."
                        />
                        <FAQ
                            isOpen={openIndex === 5}
                            onClick={() => setOpenIndex(openIndex === 5 ? null : 5)}
                            question="When will I receive my refund?"
                            answer="Refunds are processed within 5-7 business days after we receive and inspect your return. The funds will appear in your original payment method within 3-5 business days depending on your bank."
                        />
                    </Section>

                    {/* Account & Security */}
                    <Section icon="🔐" title="Account & Security" color="purple">
                        <FAQ
                            isOpen={openIndex === 6}
                            onClick={() => setOpenIndex(openIndex === 6 ? null : 6)}
                            question="Is my payment information secure?"
                            answer="Absolutely! We use industry-standard SSL encryption to protect all transactions. We never store your complete credit card details on our servers. All payments are processed through PCI-compliant payment gateways for maximum security."
                        />
                        <FAQ
                            isOpen={openIndex === 7}
                            onClick={() => setOpenIndex(openIndex === 7 ? null : 7)}
                            question="How do I reset my password?"
                            answer="Click 'Forgot Password' on the login page and enter your email address. You'll receive a secure password reset link within minutes. The link expires after 24 hours for security purposes."
                        />
                    </Section>

                    {/* Products */}
                    <Section icon="✨" title="Products & Quality" color="orange">
                        <FAQ
                            isOpen={openIndex === 8}
                            onClick={() => setOpenIndex(openIndex === 8 ? null : 8)}
                            question="Are your products authentic?"
                            answer="Yes! We only sell 100% authentic products sourced directly from authorized distributors and manufacturers. Every item comes with original packaging, warranty cards, and authenticity certificates where applicable."
                        />
                        <FAQ
                            isOpen={openIndex === 9}
                            onClick={() => setOpenIndex(openIndex === 9 ? null : 9)}
                            question="Do products come with warranties?"
                            answer="All electronics come with manufacturer warranties ranging from 1-3 years depending on the product. Extended warranty options are available at checkout for additional coverage and peace of mind."
                        />
                    </Section>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-gray-900 to-black py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Our support team is here to help you 24/7
                    </p>
                    <button className="px-8 py-4 bg-[#C1FF72] text-gray-900 rounded-full font-semibold hover:bg-[#b3f064] transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, color, children }: { icon: string; title: string; color: string; children: React.ReactNode }) {
    const colorClasses = {
        blue: "from-blue-500/10 to-transparent border-blue-500/20",
        green: "from-green-500/10 to-transparent border-green-500/20",
        purple: "from-purple-500/10 to-transparent border-purple-500/20",
        orange: "from-orange-500/10 to-transparent border-orange-500/20",
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

function FAQ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
    return (
        <div
            className={`group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isOpen ? 'border-gray-900 shadow-xl' : 'border-gray-100 hover:border-gray-300'
                }`}
        >
            <button
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
                <span className={`text-lg font-semibold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                    {question}
                </span>
                <svg
                    className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gray-900' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-600 leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
}

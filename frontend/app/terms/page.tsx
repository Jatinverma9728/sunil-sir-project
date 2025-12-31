export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                        <svg className="w-5 h-5 text-[#C1FF72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-white">Legal</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-gray-300">
                        Last updated: December 31, 2025
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="prose prose-lg max-w-none">
                    <Section number="1" title="Agreement to Terms">
                        <p>
                            By accessing and using Flash, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please discontinue use of our services immediately.
                        </p>
                    </Section>

                    <Section number="2" title="Use License">
                        <p>
                            Permission is granted to temporarily download materials on Flash for personal, non-commercial use only. This is a license, not a transfer of title. Under this license, you may not:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <ListItem>Modify or copy the materials</ListItem>
                            <ListItem>Use materials for commercial purposes</ListItem>
                            <ListItem>Attempt to decompile or reverse engineer software</ListItem>
                            <ListItem>Remove copyright or proprietary notations</ListItem>
                            <ListItem>Transfer materials to another person</ListItem>
                        </ul>
                    </Section>

                    <Section number="3" title="Product Information">
                        <p>
                            We strive to ensure all product information is accurate and up-to-date. However, we do not warrant that descriptions, pricing, or other content is complete, reliable, current, or error-free. Your sole remedy for products not as described is to return them in unused condition.
                        </p>
                    </Section>

                    <Section number="4" title="Pricing and Payment">
                        <p>
                            All prices are in USD and subject to change without notice. Payment must be received before order dispatch. We accept major credit cards and secure payment methods displayed at checkout. We reserve the right to modify or discontinue products at any time.
                        </p>
                    </Section>

                    <Section number="5" title="User Accounts">
                        <p>
                            When creating an account, you must provide accurate and complete information. You are responsible for:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <ListItem>Safeguarding your password</ListItem>
                            <ListItem>All activities under your account</ListItem>
                            <ListItem>Notifying us of unauthorized use immediately</ListItem>
                        </ul>
                    </Section>

                    <Section number="6" title="Intellectual Property">
                        <p>
                            All content, features, and functionality are the exclusive property of Flash and its licensors. This includes but is not limited to text, graphics, logos, and software, protected by copyright, trademark, and other laws.
                        </p>
                    </Section>

                    <Section number="7" title="Limitation of Liability">
                        <p>
                            Flash and its suppliers shall not be liable for any damages arising from use or inability to use our services, including but not limited to loss of data, profits, or business interruption.
                        </p>
                    </Section>

                    <Section number="8" title="Governing Law">
                        <p>
                            These terms are governed by applicable laws without regard to conflict of law provisions. Any disputes shall be resolved in the courts of our operating jurisdiction.
                        </p>
                    </Section>

                    <Section number="9" title="Changes to Terms">
                        <p>
                            We reserve the right to modify these terms at any time. Significant changes will be communicated by posting updated terms on this page with a new "Last updated" date.
                        </p>
                    </Section>

                    <Section number="10" title="Contact Information">
                        <p className="mb-6">
                            For questions about these Terms of Service, please contact us:
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Email Support</p>
                                    <p className="text-gray-600">legal@flash.com</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">Response time: 24-48 hours</p>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
    return (
        <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{number}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">{title}</h2>
            </div>
            <div className="ml-16 text-gray-600 leading-relaxed space-y-4">
                {children}
            </div>
        </section>
    );
}

function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-3">
            <span className="text-[#C1FF72] mt-1">→</span>
            <span>{children}</span>
        </li>
    );
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                        <svg className="w-5 h-5 text-[#C1FF72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm font-medium text-white">Your Data, Protected</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-gray-300">
                        Last updated: December 31, 2025
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="prose prose-lg max-w-none">
                    <Section icon="📊" title="Information We Collect">
                        <p>
                            We collect information you provide directly, including:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <ListItem>Name, email, and contact information</ListItem>
                            <ListItem>Billing and shipping addresses</ListItem>
                            <ListItem>Payment information (processed securely)</ListItem>
                            <ListItem>Order history and shopping preferences</ListItem>
                            <ListItem>Communications with customer service</ListItem>
                        </ul>
                    </Section>

                    <Section icon="🎯" title="How We Use Your Information">
                        <p>
                            We use collected information to:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <ListItem>Process and fulfill your orders</ListItem>
                            <ListItem>Send order confirmations and shipping updates</ListItem>
                            <ListItem>Respond to your inquiries and support requests</ListItem>
                            <ListItem>Improve our website and user experience</ListItem>
                            <ListItem>Send marketing communications (with consent)</ListItem>
                            <ListItem>Prevent fraud and maintain security</ListItem>
                        </ul>
                    </Section>

                    <Section icon="🔒" title="Data Security">
                        <p>
                            We implement robust security measures to protect your personal information:
                        </p>
                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <SecurityFeature icon="🛡️" title="SSL Encryption" desc="All data transmitted securely" />
                            <SecurityFeature icon="🔐" title="Secure Storage" desc="Encrypted databases" />
                            <SecurityFeature icon="👁️" title="Access Control" desc="Limited employee access" />
                            <SecurityFeature icon="🔄" title="Regular Audits" desc="Security reviews" />
                        </div>
                        <p className="mt-6 text-sm text-gray-500">
                            However, no Internet transmission is 100% secure. We cannot guarantee absolute security.
                        </p>
                    </Section>

                    <Section icon="🔗" title="Information Sharing">
                        <p className="mb-4">
                            We do not sell your personal data. We may share information with:
                        </p>
                        <ul className="space-y-2">
                            <ListItem>Service providers assisting our operations</ListItem>
                            <ListItem>Payment processors for transactions</ListItem>
                            <ListItem>Shipping carriers for deliveries</ListItem>
                            <ListItem>Law enforcement when legally required</ListItem>
                        </ul>
                    </Section>

                    <Section icon="🍪" title="Cookies and Tracking">
                        <p>
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <ListItem>Remember your preferences and settings</ListItem>
                            <ListItem>Keep you signed into your account</ListItem>
                            <ListItem>Understand how you interact with our site</ListItem>
                            <ListItem>Personalize content and recommendations</ListItem>
                        </ul>
                        <p className="mt-4">
                            You can manage cookies through your browser settings. See our{" "}
                            <a href="/cookies" className="text-gray-900 underline hover:text-gray-700">Cookie Policy</a> for details.
                        </p>
                    </Section>

                    <Section icon="✋" title="Your Rights">
                        <p>
                            You have the right to:
                        </p>
                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <RightCard title="Access" desc="Request your data" />
                            <RightCard title="Correct" desc="Update inaccurate info" />
                            <RightCard title="Delete" desc="Request data removal" />
                            <RightCard title="Export" desc="Download your data" />
                            <RightCard title="Opt-Out" desc="Unsubscribe from emails" />
                            <RightCard title="Object" desc="Challenge processing" />
                        </div>
                    </Section>

                    <Section icon="👶" title="Children's Privacy">
                        <p>
                            Our services are not intended for children under 13. We do not knowingly collect information from children. If you believe a child has provided us with personal data, please contact us immediately.
                        </p>
                    </Section>

                    <Section icon="📧" title="Contact Us">
                        <p className="mb-6">
                            For privacy-related questions or to exercise your rights:
                        </p>
                        <div className="bg-gray-900 rounded-2xl p-8 text-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-[#C1FF72] rounded-full flex items-center justify-center">
                                    <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Privacy Team</p>
                                    <p className="text-gray-300">privacy@flash.com</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400">
                                We take privacy seriously and respond to all inquiries within 48 hours.
                            </p>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
    return (
        <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{icon}</span>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="ml-14 text-gray-600 leading-relaxed space-y-4">
                {children}
            </div>
        </section>
    );
}

function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-3">
            <span className="text-[#C1FF72] mt-1 font-bold">✓</span>
            <span>{children}</span>
        </li>
    );
}

function SecurityFeature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                    <p className="font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                </div>
            </div>
        </div>
    );
}

function RightCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-gray-900 transition-colors">
            <p className="font-bold text-gray-900 mb-1">{title}</p>
            <p className="text-sm text-gray-600">{desc}</p>
        </div>
    );
}

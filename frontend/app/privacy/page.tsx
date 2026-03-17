
export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-800 font-sans selection:bg-blue-100">
            {/* Legal Header */}
            <div className="bg-[#0f172a] text-white pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Legally Binding Document
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        This document details how North Tech Hub ("we", "us", "our") collects, processes, and safeguards your personal data. It is drafted in compliance with applicable data protection laws, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.
                    </p>
                    <p className="mt-4 text-sm text-slate-500">
                        Last Updated: February 5, 2026
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar Navigation (Sticky) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contents</h3>
                                </div>
                                <nav className="p-2">
                                    <SideLink href="#introduction">1. Introduction</SideLink>
                                    <SideLink href="#data-collection">2. Data Collection</SideLink>
                                    <SideLink href="#usage">3. Usage of Data</SideLink>
                                    <SideLink href="#cookies">4. Cookies & Tracking</SideLink>
                                    <SideLink href="#sharing">5. Data Sharing</SideLink>
                                    <SideLink href="#security">6. Data Security</SideLink>
                                    <SideLink href="#rights">7. Your Rights</SideLink>
                                    <SideLink href="#children">8. Children's Privacy</SideLink>
                                    <SideLink href="#changes">9. Policy Changes</SideLink>
                                    <SideLink href="#contact">10. Contact Us</SideLink>
                                </nav>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                <h4 className="font-bold text-blue-900 mb-2">Data Protection Officer</h4>
                                <p className="text-sm text-blue-800 mb-4 leading-relaxed">
                                    For formal grievances or legal inquiries regarding your personal data.
                                </p>
                                <a href="mailto:northtechhub2003@gmail.com" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                    Contact DPO &rarr;
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Legal Text Content */}
                    <div className="col-span-1 lg:col-span-9 space-y-16">

                        <Section id="introduction" title="1. Introduction">
                            <p>
                                North Tech Hub respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and legally obligates us to transparently disclose our data processing practices.
                            </p>
                            <p>
                                This Privacy Policy specifically governs your use of the North Tech Hub platform (including both our E-commerce Electronics division and our Ed-Tech Learning Management System). It does not apply to third-party websites linked from our platform, which adhere to their own privacy policies.
                            </p>
                        </Section>

                        <Section id="data-collection" title="2. The Data We Collect About You">
                            <p className="mb-6">
                                Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data). We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <div className="space-y-4">
                                <DataCard title="Identity Data" items={["First name", "Last name", "Username or identifier", "Title/Honorific", "Date of birth"]} />
                                <DataCard title="Contact Data" items={["Billing address", "Delivery address", "Email address", "Telephone numbers"]} />
                                <DataCard title="Financial Data" items={["Bank account details (for refunds)", "Payment card details (masked/tokenized)", "Transaction history"]} />
                                <DataCard title="Technical & Usage Data" items={["Internet Protocol (IP) address", "Login data", "Browser type and version", "Time zone setting", "Operating system and platform", "Clickstream data", "Course progress logs"]} />
                            </div>
                            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-sm">
                                <strong>Aggregated Data:</strong> We may also collect, use, and share Aggregated Data such as statistical or demographic data for any purpose. Aggregated Data could be derived from your personal data but is not considered personal data in law as this data will <strong>not details</strong> directly or indirectly reveal your identity.
                            </div>
                        </Section>

                        <Section id="usage" title="3. How We Use Your Personal Data">
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-5 mt-4 space-y-3 text-slate-600 marker:text-blue-500">
                                <li><strong>Performance of Contract:</strong> Where we need to perform the contract we are about to enter into or have entered into with you (e.g., delivering a laptop, providing access to a coding course).</li>
                                <li><strong>Legitimate Interests:</strong> Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li><strong>Legal Compliance:</strong> Where we need to comply with a legal or regulatory obligation (e.g., GST filings, fraud prevention).</li>
                            </ul>
                            <p className="mt-6">Specific use cases include:</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <UsageCard icon="📦" title="Order Fulfillment" desc="Processing payments and delivering products." />
                                <UsageCard icon="🎓" title="Course Administration" desc="Tracking progress, issuing certificates, and managing access." />
                                <UsageCard icon="🛡️" title="Fraud Prevention" desc="Detecting and preventing unauthorized transactions." />
                                <UsageCard icon="📢" title="Marketing (Opt-in)" desc="Sending newsletters and offers you have specifically requested." />
                            </div>
                        </Section>

                        <Section id="cookies" title="4. Cookies and Tracking Technologies">
                            <p>
                                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
                            </p>
                            <p className="mt-4">
                                <strong>Essential Cookies:</strong> strictly necessary for the operation of our website (e.g., cart contents, session login).<br />
                                <strong>Analytical/Performance Cookies:</strong> allow us to recognize and count the number of visitors and to see how visitors move around our website.<br />
                                <strong>Functionality Cookies:</strong> used to recognize you when you return to our website.
                            </p>
                            <p className="mt-4 text-sm text-slate-500">
                                <em>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</em>
                            </p>
                        </Section>

                        <Section id="sharing" title="5. Disclosures of Your Personal Data">
                            <p>
                                We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                            </p>
                            <p className="mt-4 font-semibold">We may disclose your personal data to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                                <li><strong>Service Providers:</strong> IT support, payment processors (e.g., Razorpay, Stripe), logistics partners (e.g., FedEx, Delhivery).</li>
                                <li><strong>Professional Advisers:</strong> Lawyers, auditors, bankers, and insurers.</li>
                                <li><strong>Legal Authorities:</strong> If required by law, court order, or government regulation, or if such disclosure is necessary in support of any criminal or other legal investigation or proceeding.</li>
                                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                            </ul>
                        </Section>

                        <Section id="security" title="6. Data Security">
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered, or disclosed. Access to your personal data is limited to those employees, agents, contractors, and other third parties who have a business need to know.
                            </p>
                            <div className="mt-6 bg-green-50 rounded-xl p-6 border border-green-100">
                                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Security Protocols Include:
                                </h4>
                                <ul className="grid md:grid-cols-2 gap-3 text-sm text-green-800">
                                    <li>• SSL/TLS Encryption for all data in transit</li>
                                    <li>• SHA-256 Hashing for sensitive credentials</li>
                                    <li>• Regular vulnerability scanning and penetration testing</li>
                                    <li>• Strict role-based access control (RBAC)</li>
                                    <li>• PCI-DSS compliant payment processing</li>
                                </ul>
                            </div>
                        </Section>

                        <Section id="rights" title="7. Your Legal Rights">
                            <p>
                                Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to:
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <RightDetail title="Request Access" desc="Obtain a copy of the personal data we hold about you." />
                                <RightDetail title="Request Correction" desc="Correct incomplete or inaccurate data we hold about you." />
                                <RightDetail title="Request Erasure" desc="Ask us to delete or remove personal data where there is no good reason for us continuing to process it ('Right to be Forgotten')." />
                                <RightDetail title="Object to Processing" desc="Challenge processing where we rely on legitimate interest." />
                                <RightDetail title="Request Restriction" desc="Ask us to suspend the processing of your personal data." />
                                <RightDetail title="Request Transfer" desc="Transfer your personal data to you or a third party." />
                            </div>
                            <p className="mt-6 text-sm bg-slate-100 p-4 rounded-lg">
                                If you wish to exercise any of the rights set out above, please contact us at <strong>privacy@northtechhub.in</strong>. We try to respond to all legitimate requests within 30 days. Occasionally it may take us longer if your request is particularly complex or you have made a number of requests.
                            </p>
                        </Section>

                        <Section id="children" title="8. Children's Privacy">
                            <p>
                                Our Services do not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
                            </p>
                        </Section>

                        <Section id="changes" title="9. Changes to This Privacy Policy">
                            <p>
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
                            </p>
                            <p>
                                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                            </p>
                        </Section>

                        <Section id="contact" title="10. Contact Us">
                            <p>
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="mt-6 flex flex-col md:flex-row gap-8">
                                <ContactBox title="Email" value="privacy@northtechhub.in" icon="✉️" />
                                <ContactBox title="Legal Queries" value="legal@northtechhub.in" icon="⚖️" />
                            </div>
                            <div className="mt-8 text-sm text-slate-500">
                                <strong>Registered Office:</strong><br />
                                North Tech Hub Pvt. Ltd.<br />
                                123 Tech Park, Sector 62<br />
                                Noida, Uttar Pradesh, India - 201301
                            </div>
                        </Section>

                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function SideLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} className="block px-4 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">
            {children}
        </a>
    );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-32 border-b border-slate-100 pb-12 last:border-0">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 font-serif">{title}</h2>
            <div className="text-slate-600 leading-7 text-lg space-y-4">
                {children}
            </div>
        </section>
    );
}

function DataCard({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
            <ul className="space-y-1">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function UsageCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-2xl mb-2">{icon}</div>
            <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
            <p className="text-sm text-slate-600 leading-snug">{desc}</p>
        </div>
    );
}

function RightDetail({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="relative pl-4 border-l-2 border-blue-500">
            <h4 className="font-bold text-slate-900 text-lg">{title}</h4>
            <p className="text-slate-600 mt-1">{desc}</p>
        </div>
    );
}

function ContactBox({ title, value, icon }: { title: string; value: string; icon: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 text-xl shadow-sm">
                {icon}
            </div>
            <div>
                <h5 className="font-bold text-slate-900">{title}</h5>
                <a href={`mailto:${value}`} className="text-blue-600 font-medium hover:underline">{value}</a>
            </div>
        </div>
    );
}

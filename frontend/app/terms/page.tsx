
export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-800 font-sans selection:bg-purple-100">
            {/* Legal Header */}
            <div className="bg-[#0f172a] text-white pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        Binding Agreement
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        This is a legally binding contract between you and North Tech Hub. By accessing our services, you agree to strictly adhere to these terms.
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
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sections</h3>
                                </div>
                                <nav className="p-2">
                                    <SideLink href="#acceptance">1. Acceptance of Terms</SideLink>
                                    <SideLink href="#accounts">2. Account Obligations</SideLink>
                                    <SideLink href="#intellectual-property">3. Intellectual Property</SideLink>
                                    <SideLink href="#prohibited">4. Prohibited Uses</SideLink>
                                    <SideLink href="#payment">5. Payment & Refunds</SideLink>
                                    <SideLink href="#disclaimer">6. Disclaimers</SideLink>
                                    <SideLink href="#liability">7. Limitation of Liability</SideLink>
                                    <SideLink href="#indemnification">8. Indemnification</SideLink>
                                    <SideLink href="#dispute">9. Dispute Resolution</SideLink>
                                    <SideLink href="#contact">10. Contact Information</SideLink>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Legal Text Content */}
                    <div className="col-span-1 lg:col-span-9 space-y-16">

                        <Section id="acceptance" title="1. Acceptance of Terms">
                            <p>
                                By accessing, browsing, or using the North Tech Hub website ("Platform") and purchasing any products or educational courses ("Services"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.
                            </p>
                            <p className="font-semibold text-red-600">
                                IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE PLATFORM OR SERVICES.
                            </p>
                        </Section>

                        <Section id="accounts" title="2. Account Registration and Security">
                            <p>
                                To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.
                            </p>
                            <div className="mt-4 space-y-3">
                                <ObligationItem title="Security" desc="You are solely responsible for safeguarding your password. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account." />
                                <ObligationItem title="No Sharing" desc="Accounts are individual and non-transferable. You may not share your login credentials with others to allow them access to purchased course content. Detection of simultaneous logins from different locations may result in immediate account suspension." />
                                <ObligationItem title="Eligibility" desc="You must be at least 18 years old to use our Services. If you are under 18, you may use the Services only with the involvement and consent of a parent or guardian." />
                            </div>
                        </Section>

                        <Section id="intellectual-property" title="3. Intellectual Property Rights">
                            <p>
                                The Platform and its entire contents, features, and functionality (including but not limited to all information, software, code, text, displays, images, video, and audio) are owned by North Tech Hub, its licensors, or other providers of such material and are protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                            </p>
                            <div className="mt-6 bg-purple-50 p-6 rounded-lg border border-purple-100">
                                <h4 className="font-bold text-purple-900 mb-2">Digital Content License (Courses)</h4>
                                <p className="text-sm text-purple-800">
                                    Upon purchasing a course, North Tech Hub grants you a <strong>limited, non-exclusive, non-transferable license</strong> to access and view the course content for your personal, non-commercial, and educational purposes only. You strictly may not:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-purple-800">
                                    <li>Redistribute, transmit, assign, sell, broadcast, rent, share, lend, modify, adapt, edit, or create derivative works of any course content.</li>
                                    <li>Download course videos (unless explicitly permitted by a download button).</li>
                                    <li>Use the content for commercial training purposes.</li>
                                </ul>
                            </div>
                        </Section>

                        <Section id="prohibited" title="4. Prohibited Uses">
                            <p>You agree not to use the Services for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Services in any way that could damage the Services, the services of our business partners, or our business generally.</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <ProhibitedCard title="Scraping & Mining" desc="Use any robot, spider, crawler, scraper or other automated means or interface not provided by us to access the Services or to extract data." />
                                <ProhibitedCard title="Reverse Engineering" desc="Reverse engineer any aspect of the Services or do anything that might discover source code or bypass or circumvent measures employed to prevent or limit access." />
                                <ProhibitedCard title="Harmful Activities" desc="Send, unknowingly or knowingly, any viruses, trojan horses, worms, time bombs, cancelbots, spyware, or any other similar computer code." />
                                <ProhibitedCard title="Harassment" desc="Harass, threaten, or defraud other users or our staff members." />
                            </div>
                        </Section>

                        <Section id="payment" title="5. Payment, Billing, and Refunds">
                            <p>
                                <strong>Pricing:</strong> All prices are displayed in applicable currency and are subject to change without notice. We reserve the right to modify or discontinue content at any time.
                            </p>
                            <p className="mt-4">
                                <strong>Payments:</strong> You represent and warrant that you have the legal right to use any credit card(s) or other payment method(s) utilized in connection with any transaction.
                            </p>
                            <h4 className="font-bold text-slate-800 mt-6 mb-2">Refund Policy</h4>
                            <div className="space-y-4">
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <h5 className="font-bold text-slate-900">Physical Products</h5>
                                    <p className="text-sm text-slate-600">
                                        We accept returns for physical electronics within <strong>7 days</strong> of delivery, provided the item is unopened, unused, and in its original packaging. Defective items will be replaced in accordance with the warranty terms.
                                    </p>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    <h5 className="font-bold text-slate-900">Digital Courses</h5>
                                    <p className="text-sm text-slate-600">
                                        Due to the nature of digital content, <strong>all sales are final</strong> once you have accessed more than 10% of the course content or if 7 days have passed since purchase, whichever comes first. Exceptions are made only if the content is technically defective and we are unable to resolve the issue.
                                    </p>
                                </div>
                            </div>
                        </Section>

                        <Section id="disclaimer" title="6. Disclaimer of Warranties">
                            <div className="bg-slate-100 p-6 rounded-lg text-sm font-medium text-slate-700 uppercase tracking-wide leading-relaxed">
                                THE SERVICES AND ALL CONTENT, PRODUCTS, AND SERVICES INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SERVICES ARE PROVIDED BY NORTH TECH HUB ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULL EXTENT PERMITTED BY LAW, NORTH TECH HUB DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND TITLE.
                            </div>
                        </Section>

                        <Section id="liability" title="7. Limitation of Liability">
                            <div className="bg-slate-100 p-6 rounded-lg text-sm font-medium text-slate-700 uppercase tracking-wide leading-relaxed">
                                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL NORTH TECH HUB, ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, SUPPLIERS OR LICENSORS BE LIABLE FOR (A) ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF USE, DATA, BUSINESS, OR PROFITS), REGARDLESS OF LEGAL THEORY; OR (B) ANY DAMAGES EXCEEDING THE GREATER OF FIFTY DOLLARS ($50.00) OR THE AMOUNTS PAID BY YOU TO NORTH TECH HUB FOR THE PAST SIX MONTHS OF SERVICES.
                            </div>
                        </Section>

                        <Section id="indemnification" title="8. Indemnification">
                            <p>
                                You agree to defend, indemnify, and hold harmless North Tech Hub, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Services.
                            </p>
                        </Section>

                        <Section id="dispute" title="9. Dispute Resolution & Governing Law">
                            <p>
                                <strong>Govening Law:</strong> These Terms shall be governed by and defined following the laws of India. North Tech Hub and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                            </p>
                            <p className="mt-4">
                                <strong>Arbitration:</strong> Any dispute arising out of or in connection with this contract, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration required by India Arbitration and Conciliation Act, 1996. The seat of the arbitration shall be New Delhi, India. The language of the arbitration shall be English.
                            </p>
                            <p className="mt-4">
                                <strong>Class Action Waiver:</strong> You agree that any arbitration or proceeding shall be limited to the dispute between us and you individually. To the full extent permitted by law, (i) no arbitration or proceeding shall be joined with any other; (ii) there is no right or authority for any dispute to be arbitrated or resolved on a class-action basis or to utilize class action procedures.
                            </p>
                        </Section>

                        <Section id="contact" title="10. Contact Information">
                            <p>
                                Questions about the Terms of Service should be sent to us at:
                            </p>
                            <div className="mt-6 flex flex-col md:flex-row gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 text-xl shadow-sm">
                                        ⚖️
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">Legal Department</h5>
                                        <a href="mailto:northtechhub2003@gmail.com" className="text-blue-600 font-medium hover:underline">northtechhub2003@gmail.com</a>
                                    </div>
                                </div>
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
        <a href={href} className="block px-4 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 hover:text-purple-600 transition-colors font-medium">
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

function ObligationItem({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-600 text-xs font-bold">✓</span>
            </div>
            <div>
                <h4 className="font-bold text-slate-900 text-base">{title}</h4>
                <p className="text-sm text-slate-600 mt-1">{desc}</p>
            </div>
        </div>
    );
}

function ProhibitedCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h4 className="font-bold text-red-900 text-sm mb-1">{title}</h4>
            <p className="text-xs text-red-800 leading-snug">{desc}</p>
        </div>
    );
}

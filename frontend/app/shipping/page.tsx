export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Elegant & Minimal */}
            <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                            <svg className="w-5 h-5 text-[#C1FF72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <span className="text-sm font-medium text-white">Delivery Information</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Shipping <span className="text-[#C1FF72]">Information</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Fast and reliable delivery to your doorstep
                        </p>
                    </div>
                </div>
            </div>

            {/* Shipping Options */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Shipping Options</h2>
                    <p className="text-xl text-gray-600">Choose the delivery speed that works for you</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {/* Standard */}
                    <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-900 transition-all duration-300 hover:shadow-xl group">
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#C1FF72] rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-gray-900 font-bold text-xs">FREE</span>
                        </div>
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors">
                            <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard Shipping</h3>
                        <p className="text-gray-600 mb-6">5-7 business days</p>
                        <div className="space-y-3 mb-8">
                            <Feature text="Free on orders over $50" />
                            <Feature text="Full tracking included" />
                            <Feature text="Secure packaging" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">$0</p>
                        <p className="text-sm text-gray-500">on orders $50+</p>
                    </div>

                    {/* Express */}
                    <div className="relative bg-gray-900 rounded-3xl p-8 border-2 border-gray-900 shadow-2xl transform md:-translate-y-4">
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#C1FF72] rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-gray-900 font-bold text-xl">⚡</span>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Express Shipping</h3>
                        <p className="text-gray-300 mb-6">2-3 business days</p>
                        <div className="space-y-3 mb-8">
                            <Feature text="Priority processing" white />
                            <Feature text="Real-time GPS tracking" white />
                            <Feature text="Signature on delivery" white />
                        </div>
                        <p className="text-3xl font-bold text-white">$12.99</p>
                        <p className="text-sm text-gray-400">per order</p>
                    </div>

                    {/* Overnight */}
                    <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-900 transition-all duration-300 hover:shadow-xl group">
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">🚀</span>
                        </div>
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors">
                            <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Overnight</h3>
                        <p className="text-gray-600 mb-6">Next business day</p>
                        <div className="space-y-3 mb-8">
                            <Feature text="Fastest delivery option" />
                            <Feature text="Guaranteed arrival time" />
                            <Feature text="Premium white-glove service" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">$24.99</p>
                        <p className="text-sm text-gray-500">per order</p>
                    </div>
                </div>

                {/* Tracking Process */}
                <div className="bg-gray-50 rounded-3xl p-12 mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Track Your Order</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Order Placed", desc: "Confirmation sent", icon: "📋" },
                            { step: "02", title: "Processing", desc: "Being prepared", icon: "📦" },
                            { step: "03", title: "Shipped", desc: "In transit", icon: "🚚" },
                            { step: "04", title: "Delivered", desc: "At your door", icon: "✓" }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gray-200"></div>
                                )}
                                <div className="relative z-10 text-center">
                                    <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
                                        {item.step}
                                    </div>
                                    <p className="text-3xl mb-2">{item.icon}</p>
                                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* International Shipping */}
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">International Delivery</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            We ship worldwide to over 100 countries with trusted courier partners.
                        </p>
                        <div className="space-y-4">
                            <Region region="🇺🇸 North America" time="3-5 days" />
                            <Region region="🇪🇺 Europe" time="7-10 days" />
                            <Region region="🇯🇵 Asia Pacific" time="10-14 days" />
                            <Region region="🌍 Rest of World" time="12-18 days" />
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-3xl p-10 text-white">
                        <h3 className="text-2xl font-bold mb-4">Important Information</h3>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-[#C1FF72] mt-1">✓</span>
                                <span>Orders placed before 2 PM ship same day</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#C1FF72] mt-1">✓</span>
                                <span>Signature required for orders over $500</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#C1FF72] mt-1">✓</span>
                                <span>All shipments are fully insured</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#C1FF72] mt-1">✓</span>
                                <span>Email tracking updates at every stage</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Feature({ text, white = false }: { text: string; white?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${white ? 'bg-[#C1FF72]' : 'bg-gray-100'}`}>
                <svg className={`w-3 h-3 ${white ? 'text-gray-900' : 'text-gray-900'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
            <span className={`text-sm ${white ? 'text-gray-200' : 'text-gray-600'}`}>{text}</span>
        </div>
    );
}

function Region({ region, time }: { region: string; time: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{region}</span>
            <span className="text-gray-600">{time}</span>
        </div>
    );
}

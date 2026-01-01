import Link from "next/link";

export default function PromoBanners() {
    return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Sale Banner - Premium Dark */}
                <Link href="/products?sale=true" className="group">
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 md:p-12 overflow-hidden cursor-pointer transition-all duration-500 h-full min-h-[280px] flex flex-col justify-between group-hover:shadow-2xl group-hover:shadow-gray-400/20 group-hover:-translate-y-1">
                        {/* Decorative elements */}
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full transition-transform duration-700 group-hover:scale-150"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full transition-transform duration-700 group-hover:scale-125"></div>

                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        <div className="relative z-10">
                            <span className="inline-block text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-4 border border-gray-700 px-3 py-1.5 rounded-full">
                                Limited Time
                            </span>
                            <h3 className="text-4xl md:text-5xl font-medium text-white mb-3 tracking-tight">
                                Mega Sale
                            </h3>
                            <p className="text-gray-400 text-xl">Up to 70% OFF</p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between mt-6">
                            <span className="inline-flex items-center gap-3 text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                                Shop Now
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            <span className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 group-hover:rotate-45">
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Free Shipping Banner - Premium Light */}
                <Link href="/products" className="group">
                    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-3xl p-10 md:p-12 overflow-hidden cursor-pointer transition-all duration-500 h-full min-h-[280px] flex flex-col justify-between group-hover:shadow-2xl group-hover:shadow-indigo-200/50 group-hover:-translate-y-1">
                        {/* Decorative elements */}
                        <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-200/30 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-200/40 rounded-full blur-xl transition-transform duration-700 group-hover:scale-125"></div>

                        <div className="relative z-10">
                            <span className="inline-block text-xs font-medium text-indigo-600 uppercase tracking-[0.2em] mb-4 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                ✦ Special Offer
                            </span>
                            <h3 className="text-4xl md:text-5xl font-medium text-gray-900 mb-3 tracking-tight">
                                Free Shipping
                            </h3>
                            <p className="text-gray-500 text-xl">On orders over ₹50</p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between mt-6">
                            <span className="inline-flex items-center gap-3 text-gray-900 font-medium group-hover:translate-x-2 transition-transform duration-300">
                                Learn More
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            <span className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-500 group-hover:rotate-45">
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}

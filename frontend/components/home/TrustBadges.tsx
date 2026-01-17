"use client";

const badges = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
        ),
        title: "Free Shipping",
        description: "On orders above ₹999",
        color: "from-blue-500 to-blue-600"
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: "Secure Payment",
        description: "100% secure transactions",
        color: "from-green-500 to-green-600"
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        title: "Easy Returns",
        description: "30-day return policy",
        color: "from-purple-500 to-purple-600"
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        title: "24/7 Support",
        description: "Dedicated customer service",
        color: "from-orange-500 to-orange-600"
    },
];

export default function TrustBadges() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Icon with gradient background */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${badge.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                {badge.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {badge.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {badge.description}
                            </p>

                            {/* Decorative element */}
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${badge.color} opacity-5 rounded-bl-full`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

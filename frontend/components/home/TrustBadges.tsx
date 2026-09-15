"use client";

const guarantees = [
    {
        title: "Free Fast Delivery",
        subtitle: "Orders above ₹999 Pan-India",
        badge: "Fast Dispatch",
        accent: "text-blue-600 bg-blue-50 border-blue-100",
        icon: (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4m-7 4h10" />
            </svg>
        ),
    },
    {
        title: "32-Point Inspected",
        subtitle: "Hardware & battery tested",
        badge: "Grade A+ Refurbished",
        accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        title: "7-Day Replacement",
        subtitle: "Zero hassle replacement",
        badge: "100% Risk-Free",
        accent: "text-amber-600 bg-amber-50 border-amber-100",
        icon: (
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
    },
    {
        title: "Skill Certification",
        subtitle: "Industry recognized tracks",
        badge: "Career Ready",
        accent: "text-indigo-600 bg-indigo-50 border-indigo-100",
        icon: (
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
        ),
    },
    {
        title: "Direct WhatsApp",
        subtitle: "+91 93553 86007 Live",
        badge: "Expert Support",
        accent: "text-teal-600 bg-teal-50 border-teal-100",
        href: "https://wa.me/919355386007",
        icon: (
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
    },
];

export default function TrustBadges() {
    return (
        <section className="bg-white border-b border-slate-200/80 py-4" aria-label="North Tech Hub Guarantees">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    {guarantees.map((item, index) => {
                        const content = (
                            <div className="flex items-center gap-3 py-2 sm:py-1 sm:px-3 first:pl-0 last:pr-0">
                                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-[#028eff] shrink-0">
                                    {item.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        );

                        if (item.href) {
                            return (
                                <a
                                    key={index}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-opacity block"
                                >
                                    {content}
                                </a>
                            );
                        }

                        return <div key={index}>{content}</div>;
                    })}
                </div>
            </div>
        </section>
    );
}

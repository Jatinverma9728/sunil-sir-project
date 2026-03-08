import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "FAQ - Frequently Asked Questions",
    description: "Find answers to common questions about shipping, returns, refunds, payment security, and product authenticity at North Tech Hub. Get quick support.",
    alternates: {
        canonical: "/faq",
    },
    openGraph: {
        title: "FAQ - Frequently Asked Questions | North Tech Hub",
        description: "Find answers to common questions about shipping, returns, refunds, and product authenticity at North Tech Hub.",
        url: "/faq",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "FAQ | North Tech Hub",
        description: "Find answers to shipping, returns, and product questions at North Tech Hub.",
    },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How long does shipping take?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery. We also offer free shipping on all orders over ₹50."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Do you ship internationally?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes! We ship to over 100 countries worldwide. International shipping times vary by location but typically take 10-15 business days."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is your return policy?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We offer a 30-day return policy on most items. Products must be unused, in original packaging, and in the same condition you received them. Electronics have a 14-day return window."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How do I initiate a return?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Log into your account, navigate to your order history, and select the order you'd like to return. Follow the step-by-step process to generate a prepaid return label."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "When will I receive my refund?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Refunds are processed within 5-7 business days after we receive and inspect your return. The funds will appear in your original payment method within 3-5 business days depending on your bank."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Is my payment information secure?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Absolutely! We use industry-standard SSL encryption to protect all transactions. All payments are processed through PCI-compliant payment gateways for maximum security."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Are your products authentic?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes! We only sell 100% authentic products sourced directly from authorized distributors and manufacturers. Every item comes with original packaging and warranty cards."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Do products come with warranties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "All electronics come with manufacturer warranties ranging from 1-3 years depending on the product. Extended warranty options are available at checkout."
                            }
                        }
                    ]
                })
            }} />
            {children}
        </>
    );
}

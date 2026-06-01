import Link from "next/link";

const footerLinks = {
    shop: [
        { name: "Electronics", href: "/products?category=electronics" },
        { name: "Laptops & Computers", href: "/products?category=laptops" },
        { name: "Smartphones", href: "/products?category=smartphones" },
        { name: "Flash Sales", href: "/products?sale=true" },
    ],
    learn: [
        { name: "Web Development", href: "/courses?cat=web-dev" },
        { name: "Data Science", href: "/courses?cat=data-science" },
        { name: "UI/UX Design", href: "/courses?cat=design" },
        { name: "Mobile Apps", href: "/courses?cat=mobile" },
    ],
    company: [
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Shipping", href: "/shipping" },
    ],
    support: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Cart", href: "/cart" },
        { name: "Wishlist", href: "/wishlist" },
    ],
};

const socialLinks = [
    { name: "X", href: "https://twitter.com/northtechhub" },
    { name: "Instagram", href: "https://www.instagram.com/northtechhub" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/northtechhub" },
];

function FooterSection({
    title,
    links,
}: {
    title: string;
    links: Array<{ name: string; href: string }>;
}) {
    return (
        <div>
            <h3 className="mb-5 text-sm font-bold uppercase text-white">{title}</h3>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className="inline-flex min-h-8 items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/5 bg-[#030303] text-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
                    <div className="max-w-md">
                        <Link href="/" className="inline-flex min-h-11 items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-lg font-bold text-black">
                                N
                            </span>
                            <span className="text-2xl font-bold text-white">North Tech Hub.</span>
                        </Link>
                        <p className="mt-5 text-base leading-7 text-gray-400">
                            India-focused electronics, refurbished laptops, developer tools, and practical online technology courses with clear support paths.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-gray-300 transition-colors hover:border-white/30 hover:text-white"
                                >
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <FooterSection title="Shop" links={footerLinks.shop} />
                        <FooterSection title="Learn" links={footerLinks.learn} />
                        <FooterSection title="Company" links={footerLinks.company} />
                        <FooterSection title="Support" links={footerLinks.support} />
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm font-medium text-gray-500">
                        {"\u00A9"} {currentYear} North Tech Hub. Crafted for practical technology buying and learning.
                    </p>
                    <a
                        href="https://www.northtechhub.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase text-gray-500 transition-colors hover:text-gray-300"
                    >
                        Powered by
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                            <img
                                src="/averiq.png"
                                alt="Averiq"
                                className="h-7 w-auto object-contain grayscale transition-all hover:grayscale-0"
                            />
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
}

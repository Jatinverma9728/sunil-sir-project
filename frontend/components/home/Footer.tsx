import Link from "next/link";
import {
    MessageSquare,
    MapPin,
    Laptop,
    GraduationCap,
    ShieldCheck,
    Scale,
    Lock,
    BadgeCheck,
    CreditCard
} from "lucide-react";

const footerLinks = {
    hardware: [
        { name: "Certified Refurbished Laptops", href: "/refurbished-laptops" },
        { name: "IoT & Robotics Components", href: "/iot" },
        { name: "Computer Accessories & Keyboards", href: "/computer-accessories" },
        { name: "ThinkPad & Dell Business Series", href: "/refurbished-laptops?search=thinkpad" },
        { name: "Flash Deals & Clearance", href: "/products?deals=true" },
    ],
    courses: [
        { name: "All Online Tech Courses", href: "/courses" },
        { name: "Full-Stack Web Development", href: "/courses?category=web-dev" },
        { name: "Python & Machine Learning", href: "/courses?category=programming" },
        { name: "Microcontroller & IoT Systems", href: "/courses?category=iot" },
        { name: "Student Skill Certification", href: "/courses" },
    ],
    trust: [
        { name: "32-Point Quality Checklist", href: "/about" },
        { name: "Warranty & 7-Day Replacement", href: "/about" },
        { name: "Track Your Order", href: "/orders" },
        { name: "Shipping & Delivery Policy", href: "/shipping" },
        { name: "About North Tech Hub", href: "/about" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Return & Refund Policy", href: "/terms" },
        { name: "Contact & Help Center", href: "/contact" },
        { name: "WhatsApp Direct Support", href: "https://wa.me/919355386007" },
    ],
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-300 font-sans">
            {/* Top Newsletter / Quick Help Bar */}
            <div className="border-b border-slate-900 py-8 bg-slate-900/40">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-white">Need advice picking a laptop or course?</h4>
                            <p className="text-xs text-slate-400">Our certified hardware technicians and instructors are available on WhatsApp.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://wa.me/919355386007"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                        >
                            <span>WhatsApp: +91 93553 86007</span>
                        </a>
                        <Link
                            href="/contact"
                            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700"
                        >
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Links Grid */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
                <div className="grid gap-10 lg:grid-cols-5">
                    {/* Brand Info */}
                    <div className="lg:col-span-1 space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                                N
                            </div>
                            <span className="font-black text-xl text-white tracking-tight">
                                NORTH<span className="text-blue-500">TECH</span>HUB
                            </span>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            India's trusted platform for Certified Refurbished Laptops, Computer Accessories, and Practical Tech & Coding Courses.
                        </p>
                        <div className="text-xs text-slate-400 space-y-1 pt-2">
                            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                <span>Hub Location:</span>
                            </p>
                            <p className="pl-5 text-slate-400">Nalka Chowk, 12 Quarter, Near Sector 1-4, Hisar, Haryana - 125001, India</p>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                            <Laptop className="w-4 h-4 text-blue-400" />
                            <span>Tech Hardware</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            {footerLinks.hardware.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-blue-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-blue-400" />
                            <span>Digital Skills</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            {footerLinks.courses.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-blue-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            <span>Assurance & Care</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            {footerLinks.trust.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-blue-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                            <Scale className="w-4 h-4 text-blue-400" />
                            <span>Policies & Contact</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            {footerLinks.legal.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-blue-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar with Security & Copyright */}
                <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© {currentYear} North Tech Hub. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-3 text-slate-400">
                        <span className="inline-flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Safe & Secure Checkout</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                            <span>Made for India</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                            <span>UPI / Cards / NetBanking</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

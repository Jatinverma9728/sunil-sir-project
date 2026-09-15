"use client";

import Link from "next/link";

const BRANDS = [
    { name: "ThinkPad", label: "Lenovo ThinkPad", category: "laptops", desc: "Enterprise Workstations" },
    { name: "Dell", label: "Dell Technologies", category: "laptops", desc: "Latitude & Precision" },
    { name: "HP", label: "HP EliteBook", category: "laptops", desc: "Certified Pro Series" },
    { name: "Apple", label: "Apple MacBook", category: "laptops", desc: "Air & Pro M-Series" },
    { name: "Logitech", label: "Logitech", category: "accessories", desc: "Keyboards & Mice" },
    { name: "Raspberry Pi", label: "Raspberry Pi", category: "iot", desc: "Microcontrollers & SBCs" },
    { name: "Arduino", label: "Arduino", category: "iot", desc: "Robotics & Embedded Kits" },
    { name: "ASUS", label: "ASUS ROG", category: "accessories", desc: "High Refresh Displays" },
    { name: "Crucial", label: "Crucial / Micron", category: "accessories", desc: "High-Speed RAM & SSDs" },
    { name: "Kingston", label: "Kingston", category: "accessories", desc: "Storage & Memory" },
];

export default function BrandCarousel() {
    return (
        <section className="py-12 bg-slate-50/70 border-y border-slate-200/80">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#202020] tracking-tight">
                        Shop By Official Brands
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1">
                        Genuine refurbished workstations, IoT kits, and authentic computer components from world-leading manufacturers.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                    {BRANDS.map((brand) => (
                        <Link
                            key={brand.name}
                            href={`/products?search=${encodeURIComponent(brand.name)}`}
                            className="group flex flex-col items-center justify-center p-5 rounded-xl border border-slate-200 bg-white hover:border-[#028eff] hover:shadow-md transition-all text-center"
                        >
                            <span className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#028eff] transition-colors">
                                {brand.name}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                                {brand.desc}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

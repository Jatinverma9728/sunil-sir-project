import Link from "next/link";

interface BreadcrumbProps {
    items: Array<{ label: string; href: string }>;
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-400">/</span>
                    {index === items.length - 1 ? (
                        <span className="text-gray-900 font-medium capitalize">{item.label}</span>
                    ) : (
                        <Link href={item.href} className="text-gray-600 hover:text-gray-900 capitalize">
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}

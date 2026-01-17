interface SortDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    const sortOptions = [
        { value: "popular", label: "Most Popular" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        { value: "rating", label: "Highest Rated" },
        { value: "newest", label: "Newest First" },
    ];

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap hidden sm:inline">Sort by:</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none px-5 py-2.5 pr-10 border border-gray-200 rounded-xl bg-white text-gray-900 text-sm font-semibold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 outline-none cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

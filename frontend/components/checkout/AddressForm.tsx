"use client";

import { useState } from "react";

interface Address {
    fullName: string;
    phone: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface AddressFormProps {
    onSubmit: (address: Address) => void;
    initialAddress?: Address;
}

export default function AddressForm({ onSubmit, initialAddress }: AddressFormProps) {
    const [formData, setFormData] = useState<Address>(
        initialAddress || {
            fullName: "",
            phone: "",
            streetAddress: "",
            apartment: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
        }
    );

    const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
    const [savedAddresses] = useState<Address[]>([
        {
            fullName: "John Doe",
            phone: "+91 9876543210",
            streetAddress: "123 Main Street",
            apartment: "Apt 4B",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
        },
    ]);

    const [useSavedAddress, setUseSavedAddress] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof Address]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof Address, string>> = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone))
            newErrors.phone = "Invalid phone number";
        if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        else if (!/^\d{6}$/.test(formData.zipCode)) newErrors.zipCode = "Invalid ZIP code";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleUseSavedAddress = (address: Address) => {
        setFormData(address);
        setUseSavedAddress(false);
        setErrors({});
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && !useSavedAddress && (
                <button
                    type="button"
                    onClick={() => setUseSavedAddress(true)}
                    className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                    📋 Use saved address
                </button>
            )}

            {useSavedAddress && (
                <div className="mb-6 p-4 border-2 border-blue-200 rounded-xl bg-blue-50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
                        <button
                            onClick={() => setUseSavedAddress(false)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="space-y-3">
                        {savedAddresses.map((address, index) => (
                            <button
                                key={index}
                                onClick={() => handleUseSavedAddress(address)}
                                className="w-full text-left p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                            >
                                <p className="font-semibold text-gray-900">{address.fullName}</p>
                                <p className="text-sm text-gray-600">{address.phone}</p>
                                <p className="text-sm text-gray-600">
                                    {address.streetAddress}
                                    {address.apartment && `, ${address.apartment}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {address.city}, {address.state} {address.zipCode}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Address Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent ${errors.fullName ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="John Doe"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="+91 9876543210"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent ${errors.streetAddress ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="123 Main Street"
                    />
                    {errors.streetAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent"
                        placeholder="Apt 4B"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent ${errors.city ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Mumbai"
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            State <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent ${errors.state ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Maharashtra"
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent ${errors.zipCode ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="400001"
                        />
                        {errors.zipCode && (
                            <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent bg-white"
                    >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
                >
                    Continue to Payment
                </button>
            </form>
        </div>
    );
}

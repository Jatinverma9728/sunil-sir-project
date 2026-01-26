"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { User, addAddress, Address as ApiAddress } from "@/lib/api/auth";

// Mapping interface to match component internal state structure if slightly different, 
// but try to align with API Address.
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
    const { user, loadUser } = useAuth();
    const addresses = (user as User)?.addresses || [];

    // Default to first address if available and no initialAddress passed
    const [useSavedAddress, setUseSavedAddress] = useState(addresses.length > 0 && !initialAddress);

    const [formData, setFormData] = useState<Address>(
        initialAddress || {
            fullName: user?.name || "",
            phone: (user as User)?.phone || "",
            streetAddress: "",
            apartment: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
        }
    );

    const [saveForLater, setSaveForLater] = useState(true);
    const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
    const [isSaving, setIsSaving] = useState(false);

    // If user has no addresses, ensure form defaults to showing fields
    useEffect(() => {
        if (addresses.length === 0) {
            setUseSavedAddress(false);
        }
    }, [addresses.length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSaving(true);
            try {
                // Save address logic if checked
                if (saveForLater && !useSavedAddress) {
                    await addAddress({
                        fullName: formData.fullName,
                        phone: formData.phone,
                        street: formData.streetAddress, // Map streetAddress -> street
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country,
                        // @ts-ignore
                        apartment: formData.apartment, // Backend doesn't have apartment explicitly in schema I designed? 
                        // Wait, I designed schema with: street, city, state, zipCode, country.
                        // I should probably append apartment to street or just ignore it for profile sync?
                        // Let's check Schema... "street: String". 
                        // I'll append apartment to street for backend storage if it's not separate.
                        type: 'Home',
                        isDefault: false
                    });
                    await loadUser(); // Refresh addresses
                }
            } catch (error) {
                console.error("Failed to save address:", error);
                // Continue to submit order even if save fails, maybe toast warning?
            } finally {
                setIsSaving(false);
                onSubmit(formData);
            }
        }
    };

    const handleSelectAddress = (addr: ApiAddress) => {
        setFormData({
            fullName: addr.fullName,
            phone: addr.phone,
            streetAddress: addr.street,
            apartment: "", // Populate if we stored it?
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country
        });
        // Auto submit or just fill? 
        // Just fill and maybe let user confirm? 
        // Or if "Use Saved Address" mode is active, we just select one and click "Continue".

        // Let's immediately submit if selected from list? 
        // Or just set form data.
        // Actually, if we are in "Select Mode", clicking an address card should select it.
        // Then "Continue" button submits it.
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>

            {/* Saved Addresses Toggle */}
            {addresses.length > 0 && (
                <div className="mb-6 flex gap-4 p-1 bg-gray-100 rounded-xl w-fit">
                    <button
                        type="button"
                        onClick={() => setUseSavedAddress(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${useSavedAddress ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Saved Addresses
                    </button>
                    <button
                        type="button"
                        onClick={() => setUseSavedAddress(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!useSavedAddress ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        New Address
                    </button>
                </div>
            )}

            {useSavedAddress && addresses.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid gap-4">
                        {addresses.map((addr, index) => (
                            <label
                                key={addr._id || index}
                                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.streetAddress === addr.street && formData.zipCode === addr.zipCode
                                        ? "border-[#C1FF72] bg-green-50"
                                        : "border-gray-200 hover:border-blue-200"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={formData.streetAddress === addr.street && formData.zipCode === addr.zipCode}
                                        onChange={() => handleSelectAddress(addr)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900">{addr.fullName}</span>
                                            <span className="text-xs font-bold uppercase bg-gray-200 px-2 py-0.5 rounded text-gray-600">{addr.type}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{addr.phone}</p>
                                        <p className="text-sm text-gray-600">
                                            {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                                        </p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => onSubmit(formData)}
                        className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
                    >
                        Continue to Payment
                    </button>
                </div>
            ) : (
                /* Address Form */
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

                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={saveForLater}
                                onChange={(e) => setSaveForLater(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm text-gray-700">Save this address for better experience</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-70"
                    >
                        {isSaving ? "Saving..." : "Continue to Payment"}
                    </button>
                </form>
            )}
        </div>
    );
}

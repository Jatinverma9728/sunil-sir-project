"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { User, addAddress, Address as ApiAddress } from "@/lib/api/auth";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";

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
                if (saveForLater && !useSavedAddress) {
                    await addAddress({
                        fullName: formData.fullName,
                        phone: formData.phone,
                        street: formData.streetAddress,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country,
                        type: 'Home',
                        isDefault: false
                    });
                    await loadUser();
                }
            } catch (error) {
                console.error("Failed to save address:", error);
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
            apartment: "",
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Address</h2>

            {/* Saved Addresses Toggle */}
            {addresses.length > 0 && (
                <div className="mb-6 flex gap-2 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60">
                    <button
                        type="button"
                        onClick={() => setUseSavedAddress(true)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${useSavedAddress ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Saved Addresses
                    </button>
                    <button
                        type="button"
                        onClick={() => setUseSavedAddress(false)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!useSavedAddress ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        New Address
                    </button>
                </div>
            )}

            {useSavedAddress && addresses.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid gap-3">
                        {addresses.map((addr, index) => {
                            const isSelected = formData.streetAddress === addr.street && formData.zipCode === addr.zipCode;
                            return (
                                <label
                                    key={addr._id || index}
                                    className={`block p-4 border-2 rounded-2xl cursor-pointer transition-all ${isSelected
                                        ? "border-blue-600 bg-blue-50/40 shadow-xs"
                                        : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <input
                                            type="radio"
                                            name="selectedAddress"
                                            checked={isSelected}
                                            onChange={() => handleSelectAddress(addr)}
                                            className="mt-1 accent-blue-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-slate-900">{addr.fullName}</span>
                                                <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{addr.type}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">{addr.phone}</p>
                                            <p className="text-xs text-slate-600 mt-0.5">
                                                {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => onSubmit(formData)}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
                    >
                        Continue to Payment
                    </button>
                </div>
            ) : (
                /* Address Form */
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all ${errors.fullName ? "border-rose-500" : "border-slate-200"
                                    }`}
                                placeholder="e.g. Rahul Sharma"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all ${errors.phone ? "border-rose-500" : "border-slate-200"
                                    }`}
                                placeholder="+91 9876543210"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                            Street Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all ${errors.streetAddress ? "border-rose-500" : "border-slate-200"
                                }`}
                            placeholder="Flat/House No., Building Name, Street"
                        />
                        {errors.streetAddress && (
                            <p className="mt-1 text-xs text-rose-600">{errors.streetAddress}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                            Apartment, Suite, Landmark (Optional)
                        </label>
                        <input
                            type="text"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                            placeholder="Near City Park, Apt 4B"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                City <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all ${errors.city ? "border-rose-500" : "border-slate-200"
                                    }`}
                                placeholder="e.g. Mumbai"
                            />
                            {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                State <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all ${errors.state ? "border-rose-500" : "border-slate-200"
                                    }`}
                                placeholder="e.g. Maharashtra"
                            />
                            {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                PIN Code <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all ${errors.zipCode ? "border-rose-500" : "border-slate-200"
                                    }`}
                                placeholder="400001"
                            />
                            {errors.zipCode && (
                                <p className="mt-1 text-xs text-rose-600">{errors.zipCode}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Country</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all cursor-pointer"
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
                                className="w-4 h-4 rounded accent-blue-600"
                            />
                            <span className="text-xs font-medium text-slate-600">Save this address to my profile for faster checkout</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-70"
                    >
                        {isSaving ? "Saving Address..." : "Continue to Payment"}
                    </button>
                </form>
            )}
        </div>
    );
}

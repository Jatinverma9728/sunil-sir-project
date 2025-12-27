"use client";

import { useState } from "react";

interface PaymentMethodProps {
    totalAmount: number;
    onPayment: (method: string) => Promise<void>;
}

export default function PaymentMethod({ totalAmount, onPayment }: PaymentMethodProps) {
    const [selectedMethod, setSelectedMethod] = useState<string>("razorpay");
    const [processing, setProcessing] = useState(false);

    const paymentMethods = [
        {
            id: "razorpay",
            name: "Razorpay",
            description: "Credit/Debit Card, UPI, Netbanking",
            icon: "💳",
        },
        {
            id: "cod",
            name: "Cash on Delivery",
            description: "Pay when you receive",
            icon: "💵",
        },
        {
            id: "upi",
            name: "UPI",
            description: "PhonePe, Google Pay, Paytm",
            icon: "📱",
        },
    ];

    const handleRazorpayPayment = async () => {
        setProcessing(true);

        try {
            // In production, this would:
            // 1. Create order on backend
            // 2. Get Razorpay order ID
            // 3. Initialize Razorpay SDK
            // 4. Handle payment flow

            // Placeholder for Razorpay integration
            const options = {
                key: "rzp_test_XXXXXXXXXXXX", // Replace with actual Razorpay key
                amount: totalAmount * 100, // Amount in paise
                currency: "INR",
                name: "Flash Store",
                description: "Order Payment",
                image: "/logo.png",
                handler: function (response: any) {
                    console.log("Payment successful:", response);
                    onPayment("razorpay");
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#C1FF72",
                },
            };

            // In production: const razorpay = new window.Razorpay(options);
            // razorpay.open();

            // Simulating payment for demo
            setTimeout(() => {
                alert("Razorpay integration placeholder - In production, this will open Razorpay payment gateway");
                onPayment(selectedMethod);
            }, 1500);
        } catch (error) {
            console.error("Payment error:", error);
            setProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (selectedMethod === "razorpay") {
            await handleRazorpayPayment();
        } else {
            setProcessing(true);
            await onPayment(selectedMethod);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

            {/* Payment Methods */}
            <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => (
                    <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedMethod === method.id
                                ? "border-[#C1FF72] bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedMethod === method.id}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-2xl">{method.icon}</span>
                                <h3 className="font-semibold text-gray-900">{method.name}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {selectedMethod === method.id && (
                            <span className="text-green-600 font-bold">✓</span>
                        )}
                    </label>
                ))}
            </div>

            {/* Razorpay Info */}
            {selectedMethod === "razorpay" && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 mb-2 font-medium">
                        🔒 Secure Payment via Razorpay
                    </p>
                    <p className="text-xs text-blue-700">
                        You will be redirected to Razorpay's secure payment gateway to complete the transaction.
                    </p>
                </div>
            )}

            {/* COD Info */}
            {selectedMethod === "cod" && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-900 mb-2 font-medium">
                        💵 Cash on Delivery
                    </p>
                    <p className="text-xs text-yellow-700">
                        Pay ₹{totalAmount.toFixed(2)} when your order is delivered. Additional COD charges may apply.
                    </p>
                </div>
            )}

            {/* UPI Info */}
            {selectedMethod === "upi" && (
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-900 mb-2 font-medium">
                        📱 UPI Payment
                    </p>
                    <p className="text-xs text-purple-700">
                        Scan QR code or enter UPI ID to complete payment.
                    </p>
                </div>
            )}

            {/* Terms & Conditions */}
            <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </a>
                    </span>
                </label>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {processing ? (
                    <>
                        <span className="animate-spin">⏳</span>
                        Processing...
                    </>
                ) : (
                    <>
                        {selectedMethod === "razorpay" && "Pay"}
                        {selectedMethod === "cod" && "Place Order"}
                        {selectedMethod === "upi" && "Pay via UPI"}
                        {" "}₹{totalAmount.toFixed(2)}
                    </>
                )}
            </button>

            {/* Payment Icons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">Secured by</p>
                <div className="flex justify-center items-center gap-4">
                    <div className="px-3 py-2 bg-gray-100 rounded text-xs font-bold">RAZORPAY</div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-xs font-bold">SSL</div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-xs font-bold">PCI DSS</div>
                </div>
            </div>
        </div>
    );
}

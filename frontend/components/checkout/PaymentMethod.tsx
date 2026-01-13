"use client";

import { useState, useEffect } from "react";
import RazorpayScript, { useRazorpay } from "./RazorpayScript";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentMethodProps {
    totalAmount: number;
    razorpayOrderId?: string | null;
    razorpayKeyId?: string;
    userEmail?: string;
    userName?: string;
    userPhone?: string;
    orderId?: string;
    onPaymentSuccess: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => Promise<void>;
    onPaymentError?: (error: any) => void;
    onCODPayment?: () => Promise<void>;
}

export default function PaymentMethod({
    totalAmount,
    razorpayOrderId,
    razorpayKeyId,
    userEmail,
    userName,
    userPhone,
    orderId,
    onPaymentSuccess,
    onPaymentError,
    onCODPayment,
}: PaymentMethodProps) {
    const [selectedMethod, setSelectedMethod] = useState<string>("razorpay");
    const [processing, setProcessing] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    ];

    const handleRazorpayPayment = async () => {
        if (!razorpayKeyId || !razorpayOrderId) {
            console.error("Razorpay not configured properly");
            onPaymentError?.({ message: "Payment gateway not configured" });
            return;
        }

        if (!window.Razorpay) {
            console.error("Razorpay script not loaded");
            onPaymentError?.({ message: "Payment gateway failed to load. Please refresh the page." });
            return;
        }

        setProcessing(true);

        const options = {
            key: razorpayKeyId,
            amount: Math.round(totalAmount * 100), // Amount in paise
            currency: "INR",
            name: "Flash Store",
            description: "Order Payment",
            image: "/logo.png",
            order_id: razorpayOrderId,
            prefill: {
                name: userName || "",
                email: userEmail || "",
                contact: userPhone || "",
            },
            notes: {
                order_id: orderId,
            },
            theme: {
                color: "#1a1a1a",
            },
            handler: async function (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
            }) {
                console.log("Payment successful:", response);
                try {
                    await onPaymentSuccess(response);
                } catch (error) {
                    console.error("Error processing payment success:", error);
                    onPaymentError?.(error);
                } finally {
                    setProcessing(false);
                }
            },
            modal: {
                ondismiss: function () {
                    console.log("Payment modal closed");
                    setProcessing(false);
                },
                escape: true,
                confirm_close: true,
            },
        };

        try {
            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response: any) {
                console.error("Payment failed:", response.error);
                setProcessing(false);
                onPaymentError?.({
                    code: response.error.code,
                    description: response.error.description,
                    reason: response.error.reason,
                });
            });

            razorpay.open();
        } catch (error) {
            console.error("Error opening Razorpay:", error);
            setProcessing(false);
            onPaymentError?.(error);
        }
    };

    const handleCODPayment = async () => {
        setProcessing(true);
        try {
            await onCODPayment?.();
        } catch (error) {
            console.error("COD error:", error);
            onPaymentError?.(error);
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (!agreedToTerms) {
            alert("Please accept the Terms & Conditions to proceed");
            return;
        }

        if (selectedMethod === "razorpay") {
            await handleRazorpayPayment();
        } else if (selectedMethod === "cod") {
            await handleCODPayment();
        }
    };

    const isButtonDisabled = processing || !agreedToTerms ||
        (selectedMethod === "razorpay" && (!razorpayKeyId || !razorpayOrderId));

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Load Razorpay Script */}
            <RazorpayScript onLoad={() => setScriptLoaded(true)} />

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
                            disabled={processing}
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
                        Pay securely using Credit/Debit Card, UPI, Netbanking, or Wallet. Your payment is protected by Razorpay's secure payment gateway.
                    </p>
                    {(!razorpayKeyId || !razorpayOrderId) && (
                        <p className="text-xs text-orange-600 mt-2">
                            ⚠️ Payment gateway is being configured...
                        </p>
                    )}
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

            {/* Terms & Conditions */}
            <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="mt-1"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        disabled={processing}
                    />
                    <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a href="/terms" className="text-blue-600 hover:underline">
                            Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </a>
                    </span>
                </label>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePayment}
                disabled={isButtonDisabled}
                className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {processing ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        {selectedMethod === "razorpay" && "Pay"}
                        {selectedMethod === "cod" && "Place Order"}
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

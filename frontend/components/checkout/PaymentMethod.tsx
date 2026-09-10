"use client";

import { useState } from "react";
import RazorpayScript from "./RazorpayScript";
import { CreditCard, Smartphone, Building2, Banknote, ShieldCheck, CheckCircle2 } from "lucide-react";

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
    const [selectedMethod, setSelectedMethod] = useState<string>("card"); // Default to card
    const [processing, setProcessing] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Consolidated payment methods into granular options
    const paymentMethods = [
        {
            id: "card",
            name: "Credit / Debit Card",
            description: "Visa, Mastercard, RuPay & more",
            icon: CreditCard,
            iconColor: "text-blue-600 bg-blue-50",
        },
        {
            id: "upi",
            name: "UPI / QR Code",
            description: "Google Pay, PhonePe, Paytm & BHIM",
            icon: Smartphone,
            iconColor: "text-indigo-600 bg-indigo-50",
        },
        {
            id: "netbanking",
            name: "Netbanking",
            description: "All major Indian scheduled banks",
            icon: Building2,
            iconColor: "text-slate-700 bg-slate-100",
        },
        {
            id: "cod",
            name: "Cash on Delivery",
            description: "Pay with cash/UPI at delivery",
            icon: Banknote,
            iconColor: "text-emerald-600 bg-emerald-50",
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
            name: "North Tech Hub",
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
                payment_method_selected: selectedMethod,
            },
            theme: {
                color: "#2563eb",
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
                    console.error("Error in onPaymentSuccess:", error);
                    setProcessing(false);
                }
            },
            modal: {
                ondismiss: function () {
                    setProcessing(false);
                    console.log("Payment cancelled by user");
                },
            },
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                console.error("Payment failed:", response.error);
                setProcessing(false);
                onPaymentError?.(response.error);
            });
            rzp.open();
        } catch (error) {
            console.error("Error opening Razorpay:", error);
            setProcessing(false);
            onPaymentError?.(error);
        }
    };

    const handlePayment = async () => {
        if (!agreedToTerms) {
            alert("Please agree to the Terms & Conditions and Privacy Policy");
            return;
        }

        if (selectedMethod === "cod") {
            if (onCODPayment) {
                setProcessing(true);
                try {
                    await onCODPayment();
                } catch (error) {
                    console.error("COD Error:", error);
                    setProcessing(false);
                }
            }
        } else {
            await handleRazorpayPayment();
        }
    };

    const isRazorpayMethod = ["card", "upi", "netbanking"].includes(selectedMethod);
    const isButtonDisabled = processing || !agreedToTerms || (isRazorpayMethod && !scriptLoaded);

    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <RazorpayScript
                onLoad={() => setScriptLoaded(true)}
                onError={() => console.error("Failed to load Razorpay")}
            />

            <h2 className="text-xl font-bold text-slate-900 mb-6">Select Payment Method</h2>

            {/* Payment Method Options */}
            <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                        <label
                            key={method.id}
                            className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${isSelected
                                ? "border-blue-600 bg-blue-50/40 shadow-xs"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={isSelected}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                className="mt-1 accent-blue-600"
                                disabled={processing}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${method.iconColor}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-900">{method.name}</h3>
                                </div>
                                <p className="text-xs text-slate-500 pl-11">{method.description}</p>
                            </div>
                            {isSelected && (
                                <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs bg-blue-100/60 px-2.5 py-1 rounded-lg">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Selected
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>

            {/* Razorpay Info */}
            {isRazorpayMethod && (
                <div className="mb-6 p-4 bg-blue-50/70 rounded-xl border border-blue-200/60">
                    <p className="text-xs font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Secure Checkout via Razorpay
                    </p>
                    <p className="text-xs text-blue-700">
                        You selected <strong>{paymentMethods.find(m => m.id === selectedMethod)?.name}</strong>.
                        You will be guided through Razorpay's 256-bit encrypted gateway.
                    </p>
                </div>
            )}

            {/* COD Info */}
            {selectedMethod === "cod" && (
                <div className="mb-6 p-4 bg-amber-50/70 rounded-xl border border-amber-200/60">
                    <p className="text-xs font-bold text-amber-900 mb-1">
                        Cash on Delivery
                    </p>
                    <p className="text-xs text-amber-700">
                        Pay ₹{totalAmount.toFixed(2)} when your order is delivered to your doorstep.
                    </p>
                </div>
            )}

            {/* Terms & Conditions */}
            <div className="mb-6">
                <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 accent-blue-600 rounded"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        disabled={processing}
                    />
                    <span className="text-xs text-slate-600">
                        I agree to the{" "}
                        <a href="/terms" className="text-blue-600 hover:underline font-medium">
                            Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                            Privacy Policy
                        </a>
                    </span>
                </label>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePayment}
                disabled={isButtonDisabled}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {processing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Order...</span>
                    </>
                ) : (
                    <span>
                        {isRazorpayMethod && "Pay"}
                        {selectedMethod === "cod" && "Place Order"}
                        {" "}₹{totalAmount.toFixed(2)}
                    </span>
                )}
            </button>

            {/* Payment Icons */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-[11px] font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Secured by</p>
                <div className="flex justify-center items-center gap-3">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-600">RAZORPAY</span>
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-600">256-BIT SSL</span>
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-600">PCI DSS</span>
                </div>
            </div>
        </div>
    );
}

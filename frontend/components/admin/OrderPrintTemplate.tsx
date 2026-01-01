"use client";

import { useEffect, useRef, useState } from "react";
import { Order } from "@/lib/api/admin";
import QRCode from "qrcode";
import Barcode from "react-barcode";

interface OrderPrintTemplateProps {
    order: Order;
}

export default function OrderPrintTemplate({ order }: OrderPrintTemplateProps) {
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        // Generate QR code with order tracking URL
        const generateQR = async () => {
            try {
                const trackingURL = `${window.location.origin}/track-order/${order._id}`;
                const qrDataUrl = await QRCode.toDataURL(trackingURL, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                    },
                });
                setQrCode(qrDataUrl);
            } catch (err) {
                console.error("QR Code generation error:", err);
            }
        };

        generateQR();
    }, [order._id]);

    return (
        <div className="print-template hidden print:block">
            <div className="print-page bg-white p-12 max-w-4xl mx-auto">
                {/* Elegant Header */}
                <div className="border-b-4 border-gray-900 pb-8 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-2">ORDER INVOICE</h1>
                            <p className="text-sm text-gray-600 uppercase tracking-widest">Premium Order Details</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg inline-block">
                                <p className="text-xs uppercase tracking-wider mb-1">Order ID</p>
                                <p className="text-xl font-bold font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Info & QR/Barcode Section */}
                <div className="grid grid-cols-3 gap-8 mb-8">
                    {/* Left: Order Information */}
                    <div className="col-span-2 space-y-6">
                        {/* Customer Details */}
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-2">
                                Customer Information
                            </h2>
                            <div className="space-y-2">
                                <p className="text-base font-semibold text-gray-900">{order.user.name}</p>
                                <p className="text-sm text-gray-700">{order.user.email}</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-2">
                                Shipping Address
                            </h2>
                            <div className="space-y-1">
                                <p className="text-base font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-700">{order.shippingAddress.address}</p>
                                <p className="text-sm text-gray-700">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
                                <p className="text-sm font-semibold text-gray-900 mt-2">Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Order Status */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                <p className="text-sm font-bold text-gray-900 uppercase">{order.orderStatus}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment</p>
                                <p className="text-sm font-bold text-gray-900 uppercase">{order.paymentInfo.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: QR Code & Barcode */}
                    <div className="col-span-1 space-y-4">
                        {/* QR Code */}
                        <div className="border-2 border-gray-900 rounded-lg p-4 text-center">
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Track Order</p>
                            {qrCode && (
                                <img src={qrCode} alt="Order QR Code" className="w-full max-w-[160px] mx-auto" />
                            )}
                            <p className="text-[8px] text-gray-500 mt-2">Scan to track</p>
                        </div>

                        {/* Barcode */}
                        <div className="border-2 border-gray-900 rounded-lg p-3 text-center">
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Order Barcode</p>
                            <div className="flex justify-center">
                                <Barcode
                                    value={order._id}
                                    format="CODE128"
                                    width={1.5}
                                    height={50}
                                    fontSize={10}
                                    margin={0}
                                    displayValue={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items Table */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b-2 border-gray-900 pb-2">
                        Order Items
                    </h2>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Item</th>
                                <th className="text-center py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Qty</th>
                                <th className="text-right py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                                <th className="text-right py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-4">
                                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                                    </td>
                                    <td className="text-center py-4">
                                        <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                                    </td>
                                    <td className="text-right py-4">
                                        <span className="text-sm text-gray-700">₹{item.price.toFixed(2)}</span>
                                    </td>
                                    <td className="text-right py-4">
                                        <span className="text-sm font-semibold text-gray-900">
                                            ₹{(item.quantity * item.price).toFixed(2)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Price Summary */}
                <div className="flex justify-end mb-8">
                    <div className="w-80">
                        <div className="space-y-3 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Tax</span>
                                <span className="font-semibold text-gray-900">₹{order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Shipping</span>
                                <span className="font-semibold text-gray-900">₹{order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="border-t-2 border-gray-900 pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-gray-900 uppercase">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                {order.paymentInfo.razorpayOrderId && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Payment Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Method</p>
                                <p className="font-semibold text-gray-900 capitalize">{order.paymentInfo.method}</p>
                            </div>
                            {order.paymentInfo.razorpayOrderId && (
                                <div>
                                    <p className="text-gray-600">Razorpay Order ID</p>
                                    <p className="font-mono text-xs text-gray-900">{order.paymentInfo.razorpayOrderId}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t-2 border-gray-900 pt-6 mt-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Thank You for Your Order!</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                If you have any questions about your order, please contact our customer support team.
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-600">Printed on {new Date().toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500 mt-1">This is a computer-generated document.</p>
                        </div>
                    </div>
                </div>

                {/* Watermark */}
                <div className="text-center mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Premium E-Commerce Platform</p>
                </div>
            </div>

            <style jsx>{`
                @media print {
                    /* Hide everything except print template */
                    body * {
                        visibility: hidden !important;
                    }
                    
                    /* Show only print template */
                    .print-template,
                    .print-template * {
                        visibility: visible !important;
                    }
                    
                    /* Position print template */
                    .print-template {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        overflow: visible !important;
                    }
                    
                    /* Optimize page */
                    .print-page {
                        max-width: 100% !important;
                        padding: 30px !important;
                        margin: 0 !important;
                        page-break-after: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    
                    /* Prevent page breaks */
                    * {
                        page-break-inside: avoid !important;
                    }
                    
                    /* Ensure single page */
                    @page {
                        size: A4;
                        margin: 0.5cm;
                    }
                }
            `}</style>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Order } from "@/lib/api/admin";
import QRCode from "qrcode";
// @ts-ignore
import Barcode from "react-barcode";

interface OrderPrintTemplateProps {
    order: Order;
}

export default function OrderPrintTemplate({ order }: OrderPrintTemplateProps) {
    const [qrCode, setQrCode] = useState("");
    const companyInfo = {
        name: "North Tech Hub",
        address: "Nalka Chowk, 12 Quarter, Near Sector 1-4",
        city: "Hisar",
        state: "Haryana",
        zip: "125001",
        email: "northtechhub2003@gmail.com",
        phone: "93553-86007",
        website: "www.northtechhub.in"
    };

    useEffect(() => {
        const generateQR = async () => {
            try {
                const trackingURL = `${window.location.origin}/orders/${order._id}`;
                const qrDataUrl = await QRCode.toDataURL(trackingURL, {
                    width: 100,
                    margin: 0,
                    color: { dark: "#000000", light: "#FFFFFF" },
                });
                setQrCode(qrDataUrl);
            } catch (err) {
                console.error("QR Code generation error:", err);
            }
        };
        generateQR();
    }, [order._id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="hidden print:block print:fixed print:inset-0 print:z-[9999] print:bg-white">
            <div className="w-[210mm] mx-auto p-[10mm] bg-white h-[297mm] relative text-gray-900 font-sans flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase mb-1">
                            {companyInfo.name}
                        </h1>
                        <p className="text-xs text-gray-600">{companyInfo.address}</p>
                        <p className="text-xs text-gray-600">{companyInfo.city}, {companyInfo.state} - {companyInfo.zip}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                            {companyInfo.email} | {companyInfo.phone}
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-extrabold text-gray-200 tracking-wider">INVOICE</h2>
                        <div className="mt-1 text-sm">
                            <span className="font-semibold text-gray-500 uppercase tracking-wider mr-2">Invoice #</span>
                            <span className="font-mono font-bold text-gray-900">INV-{order._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="mt-0.5 text-sm">
                            <span className="font-semibold text-gray-500 uppercase tracking-wider mr-2">Date</span>
                            <span className="font-medium text-gray-900">{formatDate(new Date().toISOString())}</span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                    {/* Bill To */}
                    <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Bill To</h3>
                        <p className="text-base font-bold text-gray-900 mb-0.5">{order.shippingAddress.fullName}</p>
                        <div className="text-xs text-gray-600 leading-snug">
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</p>
                            <p className="font-medium mt-0.5">PIN: {order.shippingAddress.postalCode}</p>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                            <p><span className="font-semibold text-gray-500">Email:</span> {order.user.email}</p>
                            <p><span className="font-semibold text-gray-500">Phone:</span> {order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Order Details</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <div>
                                <p className="text-gray-500">Order ID</p>
                                <p className="font-mono font-medium text-gray-900">{order._id.toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Order Date</p>
                                <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Payment Method</p>
                                <p className="font-medium text-gray-900 capitalize">{order.paymentInfo.method.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Payment Status</p>
                                <p className={`font-semibold capitalize ${order.paymentInfo.status === 'completed' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {order.paymentInfo.status}
                                </p>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="mt-4 pt-2 border-t border-gray-100 flex justify-center">
                            <Barcode
                                value={order._id}
                                format="CODE128"
                                width={1}
                                height={25}
                                fontSize={9}
                                margin={0}
                                displayValue={false}
                                background="#ffffff"
                                lineColor="#000000"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Table - Flex Grow to push footer down but keep compact */}
                <div className="mb-6 flex-grow">
                    <table className="w-full text-left table-fixed">
                        <thead>
                            <tr className="bg-gray-50 border-y border-gray-200">
                                <th className="w-[5%] py-2 pl-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">#</th>
                                <th className="w-[45%] py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Item Description</th>
                                <th className="w-[15%] py-2 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="w-[15%] py-2 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="w-[20%] py-2 pr-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 pl-3 text-xs text-gray-500 align-top">{index + 1}</td>
                                    <td className="py-2 text-xs text-gray-900 align-top">
                                        <p className="font-semibold line-clamp-1">{item.title}</p>
                                        {item.variant && <p className="text-[10px] text-gray-500 mt-0.5">Var: {item.variant}</p>}
                                    </td>
                                    <td className="py-2 text-right text-xs text-gray-900 align-top">{item.quantity}</td>
                                    <td className="py-2 text-right text-xs text-gray-900 align-top">₹{item.price.toFixed(2)}</td>
                                    <td className="py-2 pr-3 text-right text-xs font-semibold text-gray-900 align-top">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary & Totals */}
                <div className="flex justify-end mb-6">
                    <div className="w-1/2 md:w-5/12">
                        <div className="space-y-2 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">₹{order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium text-gray-900">₹{order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-gray-900">₹{order.shippingPrice.toFixed(2)}</span>
                            </div>
                            {(order.discountPrice || 0) > 0 && (
                                <div className="flex justify-between text-xs text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{(order.discountPrice || 0).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t-2 border-gray-900 mt-1">
                                <span className="text-sm font-bold text-gray-900 uppercase">Total Amount</span>
                                <span className="text-xl font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Terms */}
                <div className="flex justify-between items-end border-t border-gray-200 pt-4 mt-auto mb-16">
                    <div className="w-3/5">
                        <h4 className="text-[10px] font-bold text-gray-900 uppercase mb-1">Terms & Conditions</h4>
                        <p className="text-[8px] text-gray-500 leading-relaxed text-justify">
                            1. Goods once sold will not be taken back or exchanged unless defective.
                            2. All disputes are subject to {companyInfo.city} jurisdiction only.
                            3. Interest @ 18% pa will be charged if the pill is not paid within the stipulated time.
                            4. This is a computer-generated invoice and needs no signature.
                        </p>
                    </div>
                    <div className="w-[30%] text-right">
                        {/* QR Code for Tracking */}
                        {qrCode && (
                            <div className="mb-2 flex flex-col items-end">
                                <img src={qrCode} alt="Scan to Track" className="w-16 h-16 opacity-90" />
                                <span className="text-[8px] text-gray-400 mt-1 uppercase tracking-wider">Scan to Track</span>
                            </div>
                        )}
                        <div className="mt-4 border-t border-gray-400 pt-1 inline-block w-full">
                            <p className="text-[10px] font-bold text-gray-900 uppercase">Authorized Signatory</p>
                            <p className="text-[9px] text-gray-500">{companyInfo.name}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-indigo-600 print:bg-indigo-600"></div>
            </div>

            {/* Global Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    /* Hide everything else */
                    body > *:not(.print:block) {
                        display: none !important;
                    }
                    /* Force background colors */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}

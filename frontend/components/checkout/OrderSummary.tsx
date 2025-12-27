"use client";

interface OrderItem {
    product: {
        _id: string;
        title: string;
        price: number;
        image?: string;
        images?: Array<{ url: string; alt?: string }>;
    };
    quantity: number;
}

interface OrderSummaryProps {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    discount?: number;
    total: number;
}

export default function OrderSummary({
    items,
    subtotal,
    shipping,
    tax,
    discount = 0,
    total,
}: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            {/* Items List */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                {items.map((item) => (
                    <div key={item.product._id} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {(item.product.images?.[0]?.url || item.product.image) ? (
                                <img
                                    src={item.product.images?.[0]?.url || item.product.image}
                                    alt={item.product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl">📱</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm line-clamp-2">
                                {item.product.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">
                            ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? (
                            <span className="text-green-600">FREE</span>
                        ) : (
                            `$${shipping.toFixed(2)}`
                        )}
                    </span>
                </div>

                <div className="flex justify-between text-gray-700">
                    <span>Tax (GST 10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-${discount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-blue-900 mb-1">
                    📦 Estimated Delivery
                </p>
                <p className="text-xs text-blue-700">3-5 business days</p>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">🔒</span>
                <span>Secure Checkout</span>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";

interface TrackingHistory {
    status: string;
    location?: string;
    message?: string;
    timestamp: string;
}

interface OrderTrackerProps {
    currentStatus: string;
    trackingHistory?: TrackingHistory[];
}

const steps = [
    { id: "pending", label: "Order Placed", icon: "📝" },
    { id: "processing", label: "Processing", icon: "⚙️" },
    { id: "shipped", label: "Shipped", icon: "🚚" },
    { id: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
    { id: "delivered", label: "Delivered", icon: "🎉" },
];

export default function OrderTracker({ currentStatus, trackingHistory }: OrderTrackerProps) {
    // Determine active step index
    // Map status strings to indices
    const statusMap: { [key: string]: number } = {
        'pending': 0,
        'processing': 1,
        'shipped': 2,
        'out_for_delivery': 3,
        'delivered': 4,
        'cancelled': -1
    };

    let currentStepIndex = statusMap[currentStatus.toLowerCase()] ?? 0;
    if (currentStatus.toLowerCase() === 'cancelled') {
        return (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-lg font-medium text-red-700 mb-2">Order Cancelled</h3>
                <p className="text-red-500 text-sm">This order has been cancelled.</p>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-8 left-0 w-full h-1 bg-gray-100 rounded-full -z-10" />

                {/* Active Progress Bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute top-8 left-0 h-1 bg-green-500 rounded-full -z-10"
                />

                <div className="flex justify-between items-start">
                    {steps.map((step, index) => {
                        const isActive = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const historyItem = trackingHistory?.find(h =>
                            // Simple mapping to find relevant history if available
                            h.status.toLowerCase().includes(step.id.replace('_', ' ')) ||
                            h.status.toLowerCase() === step.id
                        );

                        return (
                            <div key={step.id} className="flex flex-col items-center relative group">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-4 transition-colors duration-300 bg-white
                                        ${isActive ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-300'}
                                        ${isCurrent ? 'ring-4 ring-green-100' : ''}
                                    `}
                                >
                                    <span className="text-2xl filter drop-shadow-sm">{step.icon}</span>
                                </motion.div>

                                <div className="text-center">
                                    <h4 className={`text-sm font-semibold mb-1 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.label}
                                    </h4>
                                    {historyItem && (
                                        <p className="text-xs text-gray-500 whitespace-pre-line">
                                            {new Date(historyItem.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                    )}
                                    {isCurrent && !historyItem && (
                                        <div className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full mt-1">
                                            CURRENT
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed History Log (Optional / Collapsible could go here) */}
            {trackingHistory && trackingHistory.length > 0 && (
                <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Tracking Activity</h4>
                    <div className="space-y-6 relative border-l-2 border-gray-200 ml-3 pl-8">
                        {trackingHistory.slice().reverse().map((event, idx) => (
                            <div key={idx} className="relative">
                                <span className="absolute -left-[39px] top-1 w-5 h-5 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full" />
                                </span>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                        <p className="text-gray-900 font-medium text-sm">{event.message || event.status}</p>
                                        <p className="text-gray-500 text-xs mt-1">{event.location}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono mt-1 sm:mt-0">
                                        {new Date(event.timestamp).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

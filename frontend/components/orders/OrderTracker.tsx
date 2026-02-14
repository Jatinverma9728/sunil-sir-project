"use client";

import { CheckCircle2, Package, Truck, Home } from "lucide-react";

interface TrackingHistory {
    status: string;
    location?: string;
    message?: string;
    timestamp: string;
}

interface OrderTrackerProps {
    currentStatus: string;
    trackingHistory?: TrackingHistory[];
    estimatedDelivery?: string;
}

const steps = [
    { id: "pending", label: "Order Confirmed", icon: CheckCircle2 },
    { id: "shipped", label: "Shipped", icon: Package },
    { id: "out_for_delivery", label: "Out For Delivery", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Home },
];

export default function OrderTracker({ currentStatus, trackingHistory, estimatedDelivery }: OrderTrackerProps) {
    const statusMap: { [key: string]: number } = {
        'pending': 0,
        'processing': 0,
        'shipped': 1,
        'out_for_delivery': 2,
        'delivered': 3,
        'cancelled': -1
    };

    const currentStepIndex = statusMap[currentStatus.toLowerCase()] ?? 0;

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        return `${weekday}, ${day}th ${month}`;
    };

    // Get date for each step from history
    const getStepDate = (stepId: string, index: number) => {
        const historyItem = trackingHistory?.find(h =>
            h.status.toLowerCase().includes(stepId.replace('_', ' ')) ||
            h.status.toLowerCase() === stepId
        );

        if (historyItem) {
            return formatDate(historyItem.timestamp);
        }

        // For delivered step, show expected date
        if (stepId === 'delivered' && estimatedDelivery) {
            return `Expected by, ${formatDate(estimatedDelivery)}`;
        }

        return '';
    };

    // Cancelled state
    if (currentStatus.toLowerCase() === 'cancelled') {
        return (
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h3 className="text-base font-medium text-red-700">Order Cancelled</h3>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            {/* Horizontal Timeline */}
            <div className="relative">
                {/* Progress Line Background */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100" style={{ left: '12.5%', right: '12.5%' }} />

                {/* Active Progress Line */}
                <div
                    className="absolute top-4 h-0.5 bg-indigo-600 transition-all duration-700 ease-out"
                    style={{
                        left: '12.5%',
                        width: `${Math.min((currentStepIndex / (steps.length - 1)) * 75, 75)}%`
                    }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const isActive = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const stepDate = getStepDate(step.id, index);
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center group" style={{ width: '25%' }}>
                                {/* Icon Circle */}
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10
                                        ${isActive
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                                            : 'bg-white border-gray-200 text-gray-300'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                                </div>

                                {/* Label */}
                                <span className={`mt-4 text-xs font-semibold text-center uppercase tracking-wide transition-colors duration-300
                                    ${isActive ? 'text-indigo-900' : 'text-gray-400'}
                                `}>
                                    {step.label}
                                </span>

                                {/* Date */}
                                <span className="mt-1 text-[11px] font-medium text-gray-500 text-center">
                                    {stepDate}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

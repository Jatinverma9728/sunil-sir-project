const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Order must belong to a user'],
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'],
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, 'Price cannot be negative'],
                },
                image: {
                    type: String,
                },
            },
        ],
        shippingAddress: {
            fullName: {
                type: String,
                required: [true, 'Please provide full name'],
            },
            address: {
                type: String,
                required: [true, 'Please provide address'],
            },
            city: {
                type: String,
                required: [true, 'Please provide city'],
            },
            state: {
                type: String,
                required: [true, 'Please provide state'],
            },
            postalCode: {
                type: String,
                required: [true, 'Please provide postal code'],
            },
            country: {
                type: String,
                required: [true, 'Please provide country'],
                default: 'India',
            },
            phone: {
                type: String,
                required: [true, 'Please provide phone number'],
            },
        },
        paymentInfo: {
            razorpayOrderId: {
                type: String,
            },
            razorpayPaymentId: {
                type: String,
            },
            razorpaySignature: {
                type: String,
            },
            method: {
                type: String,
                enum: ['razorpay', 'cod', 'wallet'],
                default: 'razorpay',
            },
            status: {
                type: String,
                enum: ['pending', 'completed', 'failed', 'refunded'],
                default: 'pending',
            },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        deliveredAt: {
            type: Date,
        },
        cancelledAt: {
            type: Date,
        },
        cancellationReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.razorpayOrderId': 1 });

// Method to calculate total
orderSchema.methods.calculateTotal = function () {
    this.itemsPrice = this.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    this.taxPrice = this.itemsPrice * 0.18; // 18% GST
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

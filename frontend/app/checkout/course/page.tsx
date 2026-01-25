"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCourse, purchaseCourse, verifyCoursePurchase } from "@/lib/api/courses";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    instructor: { name: string } | string;
    duration?: number;
    lessons?: any[];
    level?: string;
}

interface ContactDetails {
    name: string;
    email: string;
    phone: string;
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = searchParams.get("course");

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [contactDetails, setContactDetails] = useState<ContactDetails>({
        name: "",
        email: "",
        phone: "",
    });
    const [formErrors, setFormErrors] = useState<Partial<ContactDetails>>({});

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        } else {
            router.push("/courses");
        }
    }, [courseId]);

    const getToken = (): string | null => {
        if (typeof document === "undefined") return null;
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
        if (!tokenCookie) return null;
        return tokenCookie.split('=')[1];
    };

    const fetchCourse = async () => {
        try {
            const response = await getCourse(courseId!);
            if (response.success && response.data) {
                setCourse(response.data);
            } else {
                setError("Course not found");
            }
        } catch (err) {
            setError("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const getInstructorName = (instructor: { name: string } | string): string => {
        if (typeof instructor === "string") return instructor;
        return instructor?.name || "Instructor";
    };

    const validateForm = (): boolean => {
        const errors: Partial<ContactDetails> = {};

        if (!contactDetails.name.trim()) {
            errors.name = "Name is required";
        }

        if (!contactDetails.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
            errors.email = "Invalid email format";
        }

        if (!contactDetails.phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(contactDetails.phone.replace(/\D/g, ''))) {
            errors.phone = "Invalid phone number (10 digits starting with 6-9)";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePayment = async () => {
        if (!course) return;

        if (!validateForm()) {
            return;
        }

        const token = getToken();
        if (!token) {
            router.push(`/login?redirect=/checkout/course?course=${courseId}`);
            return;
        }

        setProcessing(true);
        setError("");

        try {
            // Send contact details to backend along with purchase request
            const response = await purchaseCourse(courseId!, token, contactDetails);

            // Free course - enrolled directly
            if (response.data?.isFree) {
                router.push(`/checkout/course/success?course=${courseId}`);
                return;
            }

            // Paid course - open Razorpay
            if (response.data?.orderId) {
                // Check for mock order (development/test mode without valid keys)
                if (response.data.orderId.startsWith('order_mock_')) {
                    // Simulate successful payment immediately
                    await verifyCoursePurchase(
                        courseId!,
                        {
                            razorpay_order_id: response.data.orderId,
                            razorpay_payment_id: `pay_mock_${Date.now()}`,
                            razorpay_signature: 'mock_signature',
                        },
                        token
                    );
                    router.push(`/checkout/course/success?course=${courseId}`);
                    return;
                }

                const options = {
                    key: response.data.keyId,
                    amount: response.data.amount,
                    currency: response.data.currency,
                    name: "Course Enrollment",
                    description: course.title,
                    order_id: response.data.orderId,
                    prefill: {
                        name: contactDetails.name,
                        email: contactDetails.email,
                        contact: contactDetails.phone,
                    },
                    handler: async (paymentResponse: any) => {
                        try {
                            await verifyCoursePurchase(
                                courseId!,
                                {
                                    razorpay_order_id: paymentResponse.razorpay_order_id,
                                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                    razorpay_signature: paymentResponse.razorpay_signature,
                                },
                                token
                            );
                            router.push(`/checkout/course/success?course=${courseId}`);
                        } catch (error) {
                            console.error("Payment verification failed:", error);
                            setError("Payment verification failed. Please contact support.");
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setProcessing(false);
                        }
                    },
                    theme: {
                        color: "#4F46E5",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
        } catch (err: any) {
            console.error("Payment error:", err);
            setError(err.message || "Failed to initiate payment. Please try again.");
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/courses" className="text-indigo-600 hover:underline">
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    const isLoggedIn = !!getToken();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <Link href={`/courses/${courseId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Course
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Enrollment</h1>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Contact Details Form */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Contact Details
                            </h2>
                            <p className="text-gray-500 text-sm mb-6">
                                We'll use these details to send you course updates and important notifications.
                            </p>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={contactDetails.name}
                                        onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={contactDetails.email}
                                        onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                                        placeholder="Enter your email address"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            value={contactDetails.phone}
                                            onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            placeholder="Enter 10-digit mobile number"
                                            className={`flex-1 px-4 py-3 border rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    {formErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Course Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="flex gap-4 p-6">
                                <div className="w-32 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {course?.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{course?.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        By {course && getInstructorName(course.instructor)}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        {course?.lessons && <span>{course.lessons.length} lessons</span>}
                                        {course?.level && <span className="capitalize">{course.level}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What's Included */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
                            <ul className="grid grid-cols-2 gap-3">
                                {["Full lifetime access", "Access on mobile & desktop", "Certificate of completion", "Course materials"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Payment Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
                            <h3 className="font-semibold text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Course Price</span>
                                    <span>₹{course?.price || 0}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-indigo-600">₹{course?.price || 0}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            {!isLoggedIn && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                                    You need to login to complete enrollment
                                </div>
                            )}

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${processing
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
                                    }`}
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : !isLoggedIn ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Login to Continue
                                    </>
                                ) : course?.price === 0 ? (
                                    "Enroll for Free"
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Pay ₹{course?.price}
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                By enrolling, you agree to our Terms of Service
                            </p>

                            {/* Secure Payment Badge */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Secure payment powered by Razorpay
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CourseCheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}

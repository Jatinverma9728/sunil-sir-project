"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";
import GoogleButton from "@/components/auth/GoogleButton";
import { Eye, EyeOff } from "lucide-react";

// --- Enums / Types ---

interface PupilProps {
    size?: number;
    maxDistance?: number;
    pupilColor?: string;
    forceLookX?: number;
    forceLookY?: number;
}

const Pupil = ({
    size = 12,
    maxDistance = 5,
    pupilColor = "black",
    forceLookX,
    forceLookY
}: PupilProps) => {
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const pupilRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const calculatePupilPosition = () => {
        if (!pupilRef.current) return { x: 0, y: 0 };

        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY };
        }

        const pupil = pupilRef.current.getBoundingClientRect();
        const pupilCenterX = pupil.left + pupil.width / 2;
        const pupilCenterY = pupil.top + pupil.height / 2;

        const deltaX = mouseX - pupilCenterX;
        const deltaY = mouseY - pupilCenterY;
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

        const angle = Math.atan2(deltaY, deltaX);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return { x, y };
    };

    const pupilPosition = calculatePupilPosition();

    return (
        <div
            ref={pupilRef}
            className="rounded-full"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: pupilColor,
                transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                transition: 'transform 0.1s ease-out',
            }}
        />
    );
};

interface EyeBallProps {
    size?: number;
    pupilSize?: number;
    maxDistance?: number;
    eyeColor?: string;
    pupilColor?: string;
    isBlinking?: boolean;
    forceLookX?: number;
    forceLookY?: number;
}

const EyeBall = ({
    size = 48,
    pupilSize = 16,
    maxDistance = 10,
    eyeColor = "white",
    pupilColor = "black",
    isBlinking = false,
    forceLookX,
    forceLookY
}: EyeBallProps) => {
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const eyeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const calculatePupilPosition = () => {
        if (!eyeRef.current) return { x: 0, y: 0 };

        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY };
        }

        const eye = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = eye.left + eye.width / 2;
        const eyeCenterY = eye.top + eye.height / 2;

        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

        const angle = Math.atan2(deltaY, deltaX);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return { x, y };
    };

    const pupilPosition = calculatePupilPosition();

    return (
        <div
            ref={eyeRef}
            className="rounded-full flex items-center justify-center transition-all duration-150"
            style={{
                width: `${size}px`,
                height: isBlinking ? '2px' : `${size}px`,
                backgroundColor: eyeColor,
                overflow: 'hidden',
            }}
        >
            {!isBlinking && (
                <div
                    className="rounded-full"
                    style={{
                        width: `${pupilSize}px`,
                        height: `${pupilSize}px`,
                        backgroundColor: pupilColor,
                        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                        transition: 'transform 0.1s ease-out',
                    }}
                />
            )}
        </div>
    );
};

// --- Main Component ---

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Animation State
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
    const [isBlackBlinking, setIsBlackBlinking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
    const [isPurplePeeking, setIsPurplePeeking] = useState(false);

    // Static scene reference to avoid jitter from moving characters
    const sceneRef = useRef<HTMLDivElement>(null);

    // --- Animation Effects ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Blinking effect for purple character
    useEffect(() => {
        const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
        const scheduleBlink = () => {
            const blinkTimeout = setTimeout(() => {
                setIsPurpleBlinking(true);
                setTimeout(() => {
                    setIsPurpleBlinking(false);
                    scheduleBlink();
                }, 150);
            }, getRandomBlinkInterval());
            return blinkTimeout;
        };
        const timeout = scheduleBlink();
        return () => clearTimeout(timeout);
    }, []);

    // Blinking effect for black character
    useEffect(() => {
        const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
        const scheduleBlink = () => {
            const blinkTimeout = setTimeout(() => {
                setIsBlackBlinking(true);
                setTimeout(() => {
                    setIsBlackBlinking(false);
                    scheduleBlink();
                }, 150);
            }, getRandomBlinkInterval());
            return blinkTimeout;
        };
        const timeout = scheduleBlink();
        return () => clearTimeout(timeout);
    }, []);

    // Looking at each other animation when typing starts
    useEffect(() => {
        if (isTyping) {
            setIsLookingAtEachOther(true);
            const timer = setTimeout(() => {
                setIsLookingAtEachOther(false);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setIsLookingAtEachOther(false);
        }
    }, [isTyping]);

    // Purple sneaky peeking animation when typing password and it's visible
    useEffect(() => {
        const isPeeking = (formData.password.length > 0 && showPassword) || (formData.confirmPassword.length > 0 && showConfirmPassword);

        if (isPeeking) {
            const schedulePeek = () => {
                const peekInterval = setTimeout(() => {
                    setIsPurplePeeking(true);
                    setTimeout(() => {
                        setIsPurplePeeking(false);
                    }, 800);
                }, Math.random() * 3000 + 2000);
                return peekInterval;
            };
            const firstPeek = schedulePeek();
            return () => clearTimeout(firstPeek);
        } else {
            setIsPurplePeeking(false);
        }
    }, [formData.password, showPassword, formData.confirmPassword, showConfirmPassword, isPurplePeeking]);

    // Calculate position based on STATIC scene anchors relative to the container
    const calculatePosition = (offsetX: number, width: number, offsetY: number) => {
        if (!sceneRef.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

        const sceneRect = sceneRef.current.getBoundingClientRect();

        // Calculate the static center of the character relative to the viewport
        const centerX = sceneRect.left + offsetX + (width / 2);
        const centerY = sceneRect.top + offsetY; // Approximate 'face' height area

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        const faceX = Math.max(-15, Math.min(15, deltaX / 20));
        const faceY = Math.max(-10, Math.min(10, deltaY / 30));
        const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

        return { faceX, faceY, bodySkew };
    };

    // Define static positions (must match the style left/top values)
    const purplePos = calculatePosition(70, 180, 150);
    const blackPos = calculatePosition(240, 120, 200);
    const yellowPos = calculatePosition(310, 140, 250);
    const orangePos = calculatePosition(0, 240, 300);

    // Derived states for animation conditions
    const isShowingPassword = (formData.password.length > 0 && showPassword) || (formData.confirmPassword.length > 0 && showConfirmPassword);
    const isAnyTyping = isTyping || (formData.password.length > 0 && !showPassword) || (formData.confirmPassword.length > 0 && !showConfirmPassword);


    // --- Form Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) newErrors.password = "Password must contain uppercase, lowercase, number, and special character";

        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setErrors({});
        try {
            await register(formData.name, formData.email, formData.password);
            router.push("/");
        } catch (error: any) {
            console.error("Registration error:", error);
            setErrors({
                general: error.message || "Registration failed. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: "", color: "" };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        const labels = ["", "Weak", "Fair", "Good", "Strong"];
        const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

        return { strength, label: labels[strength] || "", color: colors[strength] || "" };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-gray-50/50 flex text-gray-900 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Dot Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            {/* Left - Interactive Characters */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] relative overflow-hidden items-end justify-center"
            >
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                {/* Character Scene Container with ref for STABLE measurements */}
                <div ref={sceneRef} className="relative z-10 w-[550px] h-[400px] mt-20">

                    {/* Purple tall rectangle character - Back layer */}
                    <div
                        className="absolute bottom-0 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                            left: '70px',
                            width: '180px',
                            height: (isAnyTyping) ? '440px' : '400px',
                            backgroundColor: '#6C3FF5',
                            borderRadius: '10px 10px 0 0',
                            zIndex: 1,
                            transform: (isShowingPassword)
                                ? `skewX(0deg)`
                                : (isAnyTyping)
                                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                            transformOrigin: 'bottom center',
                        }}
                    >
                        {/* Eyes */}
                        <div
                            className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                            style={{
                                left: (isShowingPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + purplePos.faceX}px`,
                                top: (isShowingPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + purplePos.faceY}px`,
                            }}
                        >
                            <EyeBall
                                size={18}
                                pupilSize={7}
                                maxDistance={5}
                                eyeColor="white"
                                pupilColor="#2D2D2D"
                                isBlinking={isPurpleBlinking}
                                forceLookX={(isShowingPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                forceLookY={(isShowingPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                            />
                            <EyeBall
                                size={18}
                                pupilSize={7}
                                maxDistance={5}
                                eyeColor="white"
                                pupilColor="#2D2D2D"
                                isBlinking={isPurpleBlinking}
                                forceLookX={(isShowingPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                forceLookY={(isShowingPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                            />
                        </div>
                    </div>

                    {/* Black tall rectangle character - Middle layer */}
                    <div
                        className="absolute bottom-0 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                            left: '240px',
                            width: '120px',
                            height: '310px',
                            backgroundColor: '#2D2D2D',
                            borderRadius: '8px 8px 0 0',
                            zIndex: 2,
                            transform: (isShowingPassword)
                                ? `skewX(0deg)`
                                : isLookingAtEachOther
                                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                                    : (isAnyTyping)
                                        ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                                        : `skewX(${blackPos.bodySkew || 0}deg)`,
                            transformOrigin: 'bottom center',
                        }}
                    >
                        {/* Eyes */}
                        <div
                            className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                            style={{
                                left: (isShowingPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + blackPos.faceX}px`,
                                top: (isShowingPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + blackPos.faceY}px`,
                            }}
                        >
                            <EyeBall
                                size={16}
                                pupilSize={6}
                                maxDistance={4}
                                eyeColor="white"
                                pupilColor="#2D2D2D"
                                isBlinking={isBlackBlinking}
                                forceLookX={(isShowingPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                                forceLookY={(isShowingPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                            />
                            <EyeBall
                                size={16}
                                pupilSize={6}
                                maxDistance={4}
                                eyeColor="white"
                                pupilColor="#2D2D2D"
                                isBlinking={isBlackBlinking}
                                forceLookX={(isShowingPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                                forceLookY={(isShowingPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                            />
                        </div>
                    </div>

                    {/* Orange semi-circle character - Front left */}
                    <div
                        className="absolute bottom-0 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                            left: '0px',
                            width: '240px',
                            height: '200px',
                            zIndex: 3,
                            backgroundColor: '#FF9B6B',
                            borderRadius: '120px 120px 0 0',
                            transform: (isShowingPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                            transformOrigin: 'bottom center',
                        }}
                    >
                        {/* Eyes - just pupils, no white */}
                        <div
                            className="absolute flex gap-8 transition-all duration-200 ease-out"
                            style={{
                                left: (isShowingPassword) ? `${50}px` : `${82 + (orangePos.faceX || 0)}px`,
                                top: (isShowingPassword) ? `${85}px` : `${90 + (orangePos.faceY || 0)}px`,
                            }}
                        >
                            <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(isShowingPassword) ? -5 : undefined} forceLookY={(isShowingPassword) ? -4 : undefined} />
                            <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(isShowingPassword) ? -5 : undefined} forceLookY={(isShowingPassword) ? -4 : undefined} />
                        </div>
                    </div>

                    {/* Yellow tall rectangle character - Front right */}
                    <div
                        className="absolute bottom-0 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                            left: '310px',
                            width: '140px',
                            height: '230px',
                            backgroundColor: '#E8D754',
                            borderRadius: '70px 70px 0 0',
                            zIndex: 4,
                            transform: (isShowingPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                            transformOrigin: 'bottom center',
                        }}
                    >
                        {/* Eyes - just pupils, no white */}
                        <div
                            className="absolute flex gap-6 transition-all duration-200 ease-out"
                            style={{
                                left: (isShowingPassword) ? `${20}px` : `${52 + (yellowPos.faceX || 0)}px`,
                                top: (isShowingPassword) ? `${35}px` : `${40 + (yellowPos.faceY || 0)}px`,
                            }}
                        >
                            <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(isShowingPassword) ? -5 : undefined} forceLookY={(isShowingPassword) ? -4 : undefined} />
                            <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(isShowingPassword) ? -5 : undefined} forceLookY={(isShowingPassword) ? -4 : undefined} />
                        </div>
                        {/* Horizontal line for mouth */}
                        <div
                            className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                            style={{
                                left: (isShowingPassword) ? `${10}px` : `${40 + (yellowPos.faceX || 0)}px`,
                                top: (isShowingPassword) ? `${88}px` : `${88 + (yellowPos.faceY || 0)}px`,
                            }}
                        />
                    </div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20"
            >
                <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl shadow-gray-200/50 lg:bg-transparent lg:shadow-none lg:p-0 lg:border-none">
                    {/* Header */}
                    <div className="space-y-2">
                        <Link href="/" className="inline-block mb-6 group">
                            <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                                North Tech Hub<span className="text-indigo-600">.</span>
                            </span>
                        </Link>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Create account</h1>
                        <p className="text-gray-500">Get started with your free account</p>
                    </div>

                    {/* Error Alert */}
                    {errors.general && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 border border-red-100 rounded-xl shadow-sm"
                        >
                            <p className="text-sm text-red-600 flex items-center gap-2">
                                <span className="font-bold">!</span> {errors.general}
                            </p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setIsTyping(true)}
                                    onBlur={() => setIsTyping(false)}
                                    className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                    placeholder="John Doe"
                                    disabled={loading}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setIsTyping(true)}
                                    onBlur={() => setIsTyping(false)}
                                    className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                    placeholder="you@example.com"
                                    disabled={loading}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setIsTyping(true)}
                                    onBlur={() => setIsTyping(false)}
                                    className={`w-full px-4 py-3.5 pr-12 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent p-1 rounded-full hover:bg-gray-100"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1 h-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-full transition-colors ${i <= passwordStrength.strength ? passwordStrength.color : "bg-gray-100"}`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 text-right">{passwordStrength.label}</p>
                                </div>
                            )}

                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setIsTyping(true)}
                                    onBlur={() => setIsTyping(false)}
                                    className={`w-full px-4 py-3.5 pr-12 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent p-1 rounded-full hover:bg-gray-100"
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-offset-0 focus:ring-2 focus:ring-indigo-500 transition-colors"
                            />
                            <span className="text-sm text-gray-500">
                                I agree to the{" "}
                                <Link href="/terms" className="text-gray-900 hover:text-indigo-600 hover:underline">
                                    Terms
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-gray-900 hover:text-indigo-600 hover:underline">
                                    Privacy Policy
                                </Link>
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#0A0A0A] text-white rounded-xl font-bold text-lg hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-300/50"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="px-4 bg-white text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Button */}
                    <GoogleButton text="Sign up with Google" />

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-gray-900 font-medium hover:text-indigo-600 transition-colors hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

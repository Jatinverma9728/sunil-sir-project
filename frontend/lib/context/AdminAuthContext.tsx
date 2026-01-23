"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { apiClient } from '../api/client';
import { LockScreen } from '@/components/admin/LockScreen';

interface AdminAuthContextType {
    isLocked: boolean;
    unlockSession: (password: string) => Promise<void>;
    logout: () => void;
    user: any;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Inactivity timeout in milliseconds (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, loading: authLoading } = useAuth();
    const [isLocked, setIsLocked] = useState(false);
    const router = useRouter();
    const lastActivityRef = useRef<number>(Date.now());
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initial check of session status
    useEffect(() => {
        if (authLoading || !user) return;

        const checkStatus = async () => {
            try {
                const res = await apiClient.get<any>('/admin/auth/status');
                // Check res.data.status because we wrapped it in data object in backend
                if (res.success && res.data?.status === 'locked') {
                    setIsLocked(true);
                }
            } catch (error: any) {
                // If 423 is returned, it means locked
                if (error.response?.status === 423) {
                    setIsLocked(true);
                }
            }
        };

        checkStatus();
    }, [user, authLoading]);

    // Setup global API interceptor for 423
    useEffect(() => {
        // We can't easily inject hooks into the singleton apiClient, 
        // but we can listen for a global event or valid "Locked" state detection.
        // For simpler integration, creating a custom fetch wrapper or observing window events might be needed
        // if apiClient doesn't support listeners.
        // Assuming apiClient throws errors, we catch them in components.
        // However, catching every 423 in every component is tedious.

        // Strategy: We rely on the Inactivity Timer primarily. 
        // Determine backend lock state on mount/focus.
    }, []);

    const lockSession = useCallback(async () => {
        setIsLocked(true);
        try {
            await apiClient.post('/admin/auth/lock', {});
        } catch (error) {
            console.error("Failed to lock backend:", error);
        }
    }, []);

    const resetTimer = useCallback(() => {
        if (isLocked) return;

        lastActivityRef.current = Date.now();
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            lockSession();
        }, INACTIVITY_TIMEOUT);
    }, [isLocked, lockSession]);

    // Event listeners for activity
    useEffect(() => {
        if (!user || user.role !== 'admin' || isLocked) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            // Throttling could be added here if performance is an issue
            resetTimer();
        };

        events.forEach(event => window.addEventListener(event, handleActivity));

        resetTimer(); // Start timer

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [user, isLocked, resetTimer]);


    const unlockSession = async (password: string) => {
        try {
            const res = await apiClient.post<any>('/admin/auth/unlock', { password });
            if (res.success) {
                setIsLocked(false);
                resetTimer();
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to unlock');
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/admin/auth/logout', {});
            // Redirect to login
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed', error);
            window.location.href = '/login';
        }
    };

    return (
        <AdminAuthContext.Provider value={{ isLocked, unlockSession, logout, user }}>
            {children}
            <LockScreen />
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

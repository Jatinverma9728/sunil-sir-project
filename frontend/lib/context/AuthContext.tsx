"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../api/auth";
import * as authAPI from "../api/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loadUser: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedToken = authAPI.getAuthToken();
            setToken(storedToken);

            if (storedToken) {
                const response = await authAPI.getProfile();
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            authAPI.removeAuthToken();
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    // Refresh user data (useful after email verification)
    const refreshUser = async () => {
        try {
            const storedToken = authAPI.getAuthToken();
            if (storedToken) {
                const response = await authAPI.getProfile();
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const login = async (email: string, password: string, rememberMe?: boolean) => {
        try {
            const response = await authAPI.login({ email, password, rememberMe });
            setUser(response.data.user);
            setToken(response.data.token);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await authAPI.register({ name, email, password });
            setUser(response.data.user);
            setToken(response.data.token);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loadUser,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

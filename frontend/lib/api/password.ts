import { apiClient, ApiResponse } from './client';

/**
 * Password Reset API Functions
 */

/**
 * Request password reset OTP
 */
export const forgotPassword = async (email: string): Promise<ApiResponse> => {
    return await apiClient.post('/auth/forgot-password', { email });
};

/**
 * Verify OTP and get reset token
 */
export const verifyResetOTP = async (email: string, otp: string): Promise<ApiResponse<{ resetToken: string }>> => {
    return await apiClient.post('/auth/verify-reset-otp', { email, otp });
};

/**
 * Reset password with token
 */
export const resetPassword = async (resetToken: string, newPassword: string): Promise<ApiResponse> => {
    return await apiClient.post('/auth/reset-password', { resetToken, newPassword });
};

/**
 * Two-Factor Authentication API Functions
 */

/**
 * Enable 2FA - Send OTP
 */
export const enable2FA = async (): Promise<ApiResponse> => {
    return await apiClient.post('/auth/2fa/enable', {}, true);
};

/**
 * Verify OTP to complete 2FA setup
 */
export const verify2FASetup = async (otp: string): Promise<ApiResponse<{ backupCodes: string[] }>> => {
    return await apiClient.post('/auth/2fa/verify-setup', { otp }, true);
};

/**
 * Disable 2FA
 */
export const disable2FA = async (password: string): Promise<ApiResponse> => {
    return await apiClient.post('/auth/2fa/disable', { password }, true);
};

/**
 * Verify 2FA code during login
 */
export const verify2FALogin = async (email: string, otp: string): Promise<ApiResponse<{ user: any; token: string }>> => {
    return await apiClient.post('/auth/2fa/verify-login', { email, otp });
};

/**
 * Get 2FA status
 */
export const get2FAStatus = async (): Promise<ApiResponse<{ twoFactorEnabled: boolean; backupCodesCount: number }>> => {
    return await apiClient.get('/auth/2fa/status', true);
};

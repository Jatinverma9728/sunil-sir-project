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


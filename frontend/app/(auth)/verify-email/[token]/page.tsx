'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { apiClient } from '@/lib/api/client';

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const processedRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (processedRef.current) return;
      processedRef.current = true; // Mark as processing to prevent double-fire in Strict Mode

      if (!token) {
        setVerificationStatus('error');
        setMessage('No verification token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/verification/verify/${token}`);

        if (response.success) {
          setVerificationStatus('success');
          setMessage('Email verified successfully! You can now access all features.');

          // Refresh user data to update UI immediately if logged in
          if (refreshUser) {
            await refreshUser();
          }

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          // Handle case where double-invocation in Strict Mode makes the second call fail
          if (response.message === 'Email is already verified') {
            setVerificationStatus('success');
            setMessage('Email is already verified! Redirecting...');
            setTimeout(() => {
              router.push('/');
            }, 3000);
          } else {
            setVerificationStatus('error');
            setMessage(response.message || 'Failed to verify email');
          }
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('An error occurred while verifying your email');
        console.error('Verification error:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Verifying your email...</h2>
          <p className="text-gray-600 mt-2">Please wait while we verify your email address</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {verificationStatus === 'success' ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              <Link
                href="/"
                className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                Possible reasons:
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• The link has expired</li>
                <li>• The link is invalid or was already used</li>
                <li>• Your account doesn't exist</li>
              </ul>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/verify-email/resend')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Resend Verification Email
                </button>
                <Link
                  href="/login"
                  className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

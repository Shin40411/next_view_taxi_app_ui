import { useState, useCallback } from 'react';

// 👇 Thay đường dẫn này bằng URL của Mock Server Postman hoặc Backend thật của bạn
const BASE_URL = 'http://localhost:8080/api';

export function useAuthApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. API Gửi mã OTP (Forgot Password)
    const forgotPassword = useCallback(async (phoneNumber: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
            });

            if (!response.ok) throw new Error('Gửi mã thất bại, vui lòng kiểm tra số điện thoại');

            return await response.json(); // Trả về dữ liệu thành công
        } catch (err: any) {
            setError(err.message);
            throw err; // Ném lỗi để giao diện bắt được
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. API Xác thực OTP (Verify OTP)
    const verifyOtp = useCallback(async (phoneNumber: string, otp: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp }),
            });

            if (!response.ok) throw new Error('Mã xác thực không đúng');

            return await response.json(); // Server sẽ trả về resetToken ở đây
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. API Đổi mật khẩu mới (Reset Password)
    const resetPassword = useCallback(async (payload: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Đổi mật khẩu thất bại');

            return await response.json();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        forgotPassword,
        verifyOtp,
        resetPassword,
    };
}
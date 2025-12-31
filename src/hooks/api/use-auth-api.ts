import { useState, useCallback } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';

export function useAuthApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const forgotPassword = useCallback(async (phoneNumber: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(endpoints.auth.forgotPassword, { username: phoneNumber });
            return response.data;
        } catch (err: any) {
            const errorMsg = err.message || 'Đã có lỗi xảy ra';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyOtp = useCallback(async (phoneNumber: string, otp: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(endpoints.auth.verifyOtp, { username: phoneNumber, otp });
            return response.data;
        } catch (err: any) {
            const errorMsg = err.message || 'Mã OTP không đúng hoặc đã hết hạn';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (payload: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(endpoints.auth.resetPassword, {
                username: payload.phoneNumber,
                otp: payload.resetToken,
                newPassword: payload.newPassword
            });
            return response.data;
        } catch (err: any) {
            const errorMsg = err.message || 'Đổi mật khẩu thất bại';
            setError(errorMsg);
            throw new Error(errorMsg);
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

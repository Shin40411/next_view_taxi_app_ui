import { useState, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { HOST_API } from 'src/config-global';

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

    const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(endpoints.auth.changePassword, { oldPassword, newPassword });
            return response.data;
        } catch (err: any) {
            const errorMsg = err.message || 'Đổi mật khẩu thất bại';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const loginWithGoogle = useCallback((isPartner: boolean = true) => {
        const role = isPartner ? 'PARTNER' : 'INTRODUCER';
        window.location.href = `${HOST_API}${endpoints.auth.google}?role=${role}`;
    }, []);

    const requestRegisterOtp = useCallback(async (data: { username: string; email: string; fullName: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(endpoints.auth.requestRegisterOtp, data);
            return response.data;
        } catch (err: any) {
            const errorMsg = err.message || 'Đã có lỗi xảy ra';
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
        changePassword,
        loginWithGoogle,
        requestRegisterOtp,
        requestLoginOtp: useCallback(async (data: { username: string; password: string }) => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.post(endpoints.auth.requestLoginOtp, data);
                return response.data;
            } catch (err: any) {
                const errorMsg = err.message || 'Đã có lỗi xảy ra';
                setError(errorMsg);
                throw new Error(errorMsg);
            } finally {
                setLoading(false);
            }
        }, []),
    };
}

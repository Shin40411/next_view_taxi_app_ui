import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const SECRET_KEY = import.meta.env.VITE_PAYLOAD_ENCRYPTION_KEY || 'default-secret-key';
const ENABLE_ENCRYPTION = import.meta.env.VITE_ENABLE_ENCRYPTION === 'true';

const encryptData = (data: any) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error('Encrypt Error:', error);
    return null;
  }
};

const decryptData = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText ? JSON.parse(originalText) : null;
  } catch (error) {
    console.error('Decrypt Error:', error);
    return null;
  }
};

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");

    const isAuthUrl = config.url?.startsWith("/auth");
    const isProtectedAuthUrl =
      config.url === "/auth/change-password" ||
      config.url === "/auth/logout" ||
      config.url === "/auth/request-contract-otp" ||
      config.url === "/auth/verify-contract-otp";

    if (token && (!isAuthUrl || isProtectedAuthUrl)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (ENABLE_ENCRYPTION && config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '') && !(config.data instanceof FormData)) {
      const encrypted = encryptData(config.data);
      if (encrypted) {
        config.data = { data: encrypted };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isAlertShown = false;

axiosInstance.interceptors.response.use(
  (res) => {
    if (ENABLE_ENCRYPTION && res.data && res.data.data && typeof res.data.data === 'string' && Object.keys(res.data).length === 1) {
      const originalData = decryptData(res.data.data);
      if (originalData) {
        res.data = originalData;
      }
    }
    return res;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (isAlertShown) return Promise.reject(error);

      Cookies.remove("accessToken");
      Cookies.remove("user");
    }
    return Promise.reject(
      (error.response && error.response.data) || "Đã có lỗi xảy ra"
    );
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/resources/me',
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    requestContractOtp: '/auth/request-contract-otp',
    verifyContractOtp: '/auth/verify-contract-otp',
    google: '/auth/google',
    requestRegisterOtp: '/auth/request-register-otp',
    requestLoginOtp: '/auth/request-login-otp',
  },
  partner: {
    root: '/partner-profiles',
    home: '/partner/home',
    searchDestination: '/partner/search-destination',
    createRequest: '/partner/create-request',
    myRequests: '/partner/my-requests',
    stats: '/partner/stats',
    confirmArrival: '/partner/confirm-arrival',
    cancelRequest: '/partner/cancel-request',
    wallet: {
      deposit: '/partner/wallet/deposit',
      withdraw: '/partner/wallet/withdraw',
      transfer: '/partner/wallet/transfer',
      transactions: '/wallets/partner/transactions',
    }
  },
  customer: {
    pendingRequests: '/customer/pending-requests',
    arrivedRequests: '/customer/arrived-requests',
    completedRequests: '/customer/completed-requests',
    activeDrivers: '/customer/active-drivers',
    previousPartners: '/customer/previous-partners',
    confirmRequest: '/customer/confirm-request',
    rejectRequest: '/customer/reject-request',
    rejectedRequests: '/customer/rejected-requests',
    cancelledRequests: '/customer/cancelled-requests',
    statsBudget: '/customer/stats/budget',
    myServicePoint: '/customer/service-point/me',
    updateServicePoint: '/customer/service-point/update',
    allRequests: '/customer/all-requests',
    wallet: {
      deposit: '/customer/wallet/deposit',
      transfer: '/customer/wallet/transfer',
      transactions: '/wallets/customer/transactions',
    },
    tip: '/customer/tip',
  },
  servicePoint: {
    root: '/service-points',
  },
  trips: {
    root: '/trips',
  },
  user: {
    root: '/admin/users',
    trips: (id: string) => `/admin/users/${id}/trips`,
    changePassword: '/admin/users/change-password',
    partnerStatus: (id: string) => `/admin/users/${id}/partner-status`,
  },
  admin: {
    stats: {
      partners: '/admin/stats/partners',
      customers: '/admin/stats/customers',
      transactions: (id: string) => `/admin/stats/service-points/${id}/transactions`,
    },
    wallets: {
      root: '/wallets',
      resolve: '/admin/wallet-transactions/status',
      banks: '/wallets/banks',
    },
  },
  notification: {
    root: '/notifications',
    markRead: '/read',
  },
  contract: {
    root: '/contracts',
    me: '/contracts/me',
    terminate: (id: string) => `/contracts/${id}/terminate`,
    approve: (id: string) => `/contracts/${id}/approve`,
    extend: (id: string) => `/contracts/${id}/extend`,
    userContract: (userId: string) => `/contracts/user/${userId}`,
  },
  settings: {
    root: '/settings',
  },
  support: {
    root: '/support',
    admin: '/support/admin',
    reply: (id: string) => `/support/${id}/reply`,
    faqs: '/support/faqs',
  },
  companyBankAccount: {
    root: '/company-bank-account',
    active: '/company-bank-account/active',
  },
  chat: {
    conversations: '/chat/conversations',
    detail: (id: string) => `/chat/conversations/${id}`,
    create: '/chat/create',
    messages: (id: string) => `/chat/${id}/messages`,
    read: (id: string) => `/chat/${id}/read`,
    delete: (id: string) => `/chat/${id}`,
    totalUnread: '/chat/total-unread',
  }
};
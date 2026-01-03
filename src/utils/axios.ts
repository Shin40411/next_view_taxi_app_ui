import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");

    const isAuthUrl = config.url?.startsWith("/auth");
    const isProtectedAuthUrl = config.url === "/auth/change-password" || config.url === "/auth/logout";

    if (token && (!isAuthUrl || isProtectedAuthUrl)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
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
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
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
  },
  customer: {
    pendingRequests: '/customer/pending-requests',
    arrivedRequests: '/customer/arrived-requests',
    completedRequests: '/customer/completed-requests',
    confirmRequest: '/customer/confirm-request',
    rejectRequest: '/customer/reject-request',
    rejectedRequests: '/customer/rejected-requests',
    cancelledRequests: '/customer/cancelled-requests',
    statsBudget: '/customer/stats/budget',
    myServicePoint: '/customer/service-point/me',
    updateServicePoint: '/customer/service-point/update',
    allRequests: '/customer/all-requests',
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
  },
  admin: {
    stats: {
      partners: '/admin/stats/partners',
      customers: '/admin/stats/customers',
    }
  },
  notification: {
    root: '/notifications',
    markRead: '/read',
  }
};
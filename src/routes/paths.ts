import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // comingSoon: '/coming-soon',
  // maintenance: '/maintenance',
  // pricing: '/pricing',
  // payment: '/payment',
  // about: '/about-us',
  // contact: '/contact-us',
  // faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  legal: {
    termsOfService: '/terms-of-service',
    privacyPolicy: '/privacy-policy',
  },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      // 👇 MÌNH ĐÃ THÊM 3 DÒNG QUAN TRỌNG NÀY VÀO:
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      newPassword: `${ROOTS.AUTH}/jwt/new-password`,
      verify: `${ROOTS.AUTH}/jwt/verify`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    customer: {
      root: ROOTS.DASHBOARD,
      servicePoint: `${ROOTS.DASHBOARD}/cua-hang-cua-ban`,
      support: `${ROOTS.DASHBOARD}/ho-tro`,
    },
    management: {
      cskd: `${ROOTS.DASHBOARD}/quan-ly/shop`,
      dichvu: `${ROOTS.DASHBOARD}/quan-ly/dich-vu`,
      taixe: `${ROOTS.DASHBOARD}/quan-ly/tai-xe`,
      ctv: `${ROOTS.DASHBOARD}/quan-ly/ctv`,
    },
    forDriver: 'tai-xe',
    ecommercial: 'co-so-kinh-doanh',
    accountant: {
      ctv: 'ke-toan/ctv',
      cskd: 'ke-toan/cskd'
    },
    wallet: 'vi-tien',
    admin: {
      overview: `${ROOTS.DASHBOARD}/admin/overview`,
      liveMap: `${ROOTS.DASHBOARD}/admin/live-map`,
      transactions: `${ROOTS.DASHBOARD}/admin/transactions`,
      contracts: `${ROOTS.DASHBOARD}/admin/contracts`,
      partners: {
        root: `${ROOTS.DASHBOARD}/admin/partners`,
        detail: (id: string) => `${ROOTS.DASHBOARD}/admin/partners/${id}`,
      },
      servicePoints: {
        root: `${ROOTS.DASHBOARD}/admin/service-points`,
        new: `${ROOTS.DASHBOARD}/admin/service-points/new`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/admin/service-points/${id}/edit`,
      },
      wallets: `${ROOTS.DASHBOARD}/admin/wallets`,
      employees: {
        root: `${ROOTS.DASHBOARD}/admin/employees`,
        new: `${ROOTS.DASHBOARD}/admin/employees/new`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/admin/employees/${id}/edit`,
      },
      settings: `${ROOTS.DASHBOARD}/admin/settings`,
      support: `${ROOTS.DASHBOARD}/admin/support`,
      deleted: `${ROOTS.DASHBOARD}/admin/users/deleted/list`,
      faqs: `${ROOTS.DASHBOARD}/admin/faqs`,
    },
    driver: {
      root: ROOTS.DASHBOARD,
      wallet: `${ROOTS.DASHBOARD}/tai-xe/vi-tien`,
      profile: `${ROOTS.DASHBOARD}/tai-xe/ho-so`,
      support: `${ROOTS.DASHBOARD}/tai-xe/ho-tro`,
    }
  },
};

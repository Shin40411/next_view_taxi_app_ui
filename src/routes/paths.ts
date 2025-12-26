import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/',
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
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
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
      servicePoint: `/cua-hang-cua-ban`,
    },
    management: {
      cskd: `quan-ly/shop`,
      dichvu: `quan-ly/dich-vu`,
      taixe: `quan-ly/tai-xe`,
      ctv: `quan-ly/ctv`,
    },
    forDriver: 'tai-xe',
    ecommercial: 'co-so-kinh-doanh',
    accountant: {
      ctv: 'ke-toan/ctv',
      cskd: 'ke-toan/cskd'
    },
    wallet: 'vi-tien',
    admin: {
      overview: 'admin/overview',
      liveMap: 'admin/live-map',
      transactions: 'admin/transactions',
      partners: {
        root: `${ROOTS.DASHBOARD}admin/partners`,
        detail: (id: string) => `${ROOTS.DASHBOARD}admin/partners/${id}`,
      },
      servicePoints: {
        root: `${ROOTS.DASHBOARD}admin/service-points`,
        new: `${ROOTS.DASHBOARD}admin/service-points/new`,
        edit: (id: string) => `${ROOTS.DASHBOARD}admin/service-points/${id}/edit`,
      },
    },
    driver: {
      root: ROOTS.DASHBOARD,
      wallet: 'tai-xe/vi-tien',
      profile: 'tai-xe/ho-so',
    }
  },
};

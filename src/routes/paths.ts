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
  // components: '/components',
  // docs: 'https://docs.minimals.cc',
  // changelog: 'https://docs.minimals.cc/changelog',
  // zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  // minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  // figma:
  //   'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  // product: {
  //   root: `/product`,
  //   checkout: `/product/checkout`,
  //   details: (id: string) => `/product/${id}`,
  //   demo: {
  //     details: `/product/${MOCK_ID}`,
  //   },
  // },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    // amplify: {
    //   login: `${ROOTS.AUTH}/amplify/login`,
    //   verify: `${ROOTS.AUTH}/amplify/verify`,
    //   register: `${ROOTS.AUTH}/amplify/register`,
    //   newPassword: `${ROOTS.AUTH}/amplify/new-password`,
    //   forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    // },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    // firebase: {
    //   login: `${ROOTS.AUTH}/firebase/login`,
    //   verify: `${ROOTS.AUTH}/firebase/verify`,
    //   register: `${ROOTS.AUTH}/firebase/register`,
    //   forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    // },
    // auth0: {
    //   login: `${ROOTS.AUTH}/auth0/login`,
    // },
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
      root: `${ROOTS.DASHBOARD}driver`,
    },
    homeMap: `${ROOTS.DASHBOARD}home-map`,
  },
};

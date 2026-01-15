import { useEffect, useMemo, useState } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { title } from 'process';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

import { useAuthContext } from 'src/auth/hooks';
import { UserRole } from 'src/auth/types';
import Iconify from 'src/components/iconify';

// ... (imports)

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const role = user?.role;

  const adminNav = useMemo(
    () => [
      {
        subheader: t('Tổng quan'),
        items: [
          {
            title: t('Thống kê giao dịch'),
            path: paths.dashboard.admin.overview,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        subheader: t('Quản lý'),
        items: [
          {
            title: t('Tài xế / CTV'),
            path: paths.dashboard.admin.partners.root,
            icon: ICONS.user,
          },
          {
            title: t('Công ty / CSKD'),
            path: paths.dashboard.admin.servicePoints.root,
            icon: ICONS.banking,
          },
          {
            title: t('Nhân viên'),
            path: paths.dashboard.admin.employees.root,
            icon: <Iconify icon="clarity:employee-solid" />,
          },
        ],
      },
      {
        subheader: t('Hỗ trợ khách hàng'),
        items: [
          {
            title: t('Ví Goxu'),
            path: paths.dashboard.admin.wallets,
            icon: <Iconify icon="solar:wallet-bold-duotone" />,
          },
          {
            title: t('Hỗ trợ'),
            path: paths.dashboard.admin.support,
            icon: <Iconify icon="solar:chat-round-dots-bold-duotone" />,
          },
          {
            title: t('FAQ'),
            path: paths.dashboard.admin.faqs,
            icon: <Iconify icon="solar:question-circle-bold-duotone" />,
          },
        ],
      },
      {
        subheader: t('Cấu hình hệ thống'),
        items: [
          {
            title: t('Cài đặt'),
            path: paths.dashboard.admin.settings,
            icon: <Iconify icon="solar:settings-bold-duotone" />,
          },
          {
            title: t('Tài khoản đã khoá'),
            path: paths.dashboard.admin.deleted,
            icon: <Iconify icon="solar:trash-bin-trash-bold-duotone" />,
          },
        ],
      },
    ],
    [t]
  );

  const accountantNav = useMemo(
    () => [
      {
        subheader: t('Tổng quan'),
        items: [
          {
            title: t('Thống kê giao dịch'),
            path: paths.dashboard.admin.overview,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        subheader: t('Hỗ trợ khách hàng'),
        items: [
          {
            title: t('Ví Goxu'),
            path: paths.dashboard.admin.wallets,
            icon: <Iconify icon="solar:wallet-bold-duotone" />,
          },
        ],
      },
    ],
    [t]
  );

  const monitorNav = useMemo(
    () => [
      {
        subheader: t('Tổng quan'),
        items: [
          {
            title: t('Thống kê giao dịch'),
            path: paths.dashboard.admin.overview,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        subheader: t('Quản lý'),
        items: [
          {
            title: t('Tài xế / CTV'),
            path: paths.dashboard.admin.partners.root,
            icon: ICONS.user,
          },
          {
            title: t('Công ty / CSKD'),
            path: paths.dashboard.admin.servicePoints.root,
            icon: ICONS.banking,
          },
        ],
      },
      {
        subheader: t('Hỗ trợ khách hàng'),
        items: [
          {
            title: t('Ví Goxu'),
            path: paths.dashboard.admin.wallets,
            icon: <Iconify icon="solar:wallet-bold-duotone" />,
          },
          {
            title: t('Hỗ trợ'),
            path: paths.dashboard.admin.support,
            icon: <Iconify icon="solar:chat-round-dots-bold-duotone" />,
          },
          {
            title: t('FAQ'),
            path: paths.dashboard.admin.faqs,
            icon: <Iconify icon="solar:question-circle-bold-duotone" />,
          },
        ],
      },
      {
        subheader: t('Cấu hình hệ thống'),
        items: [
          {
            title: t('Tài khoản đã khoá'),
            path: paths.dashboard.admin.deleted,
            icon: <Iconify icon="solar:trash-bin-trash-bold-duotone" />,
          },
        ],
      },
    ],
    [t]
  );

  const driverNav = useMemo(
    () => [
      {
        subheader: t('Trang chủ'),
        items: [
          {
            title: t('Dịch vụ của bạn'),
            path: paths.dashboard.root,
            icon: ICONS.tour,
          },
          {
            title: t('Hồ sơ'),
            path: paths.dashboard.driver.profile,
            icon: ICONS.user,
            id: 'sidebar-profile-link',
          },
          {
            title: t('Ví Goxu'),
            path: paths.dashboard.driver.wallet,
            icon: <Iconify icon="solar:wallet-bold-duotone" />,
          },
        ],
      },
      {
        subheader: t('Hỗ trợ'),
        items: [
          {
            title: t('Yêu cầu hỗ trợ'),
            path: paths.dashboard.driver.support,
            icon: <Iconify icon="solar:chat-round-dots-bold-duotone" />,
          },
          {
            title: t('Xem hướng dẫn'),
            path: '#tutorial',
            icon: <Iconify icon="solar:videocamera-record-bold-duotone" />,
          }
        ]
      }
    ],
    [t]
  );

  const customerNav = useMemo(
    () => [
      {
        subheader: t('Trang chủ'),
        items: [
          {
            title: t('Lịch sử đơn'),
            path: paths.dashboard.root,
            icon: ICONS.invoice,
          },
          {
            title: t('Thông tin công ty'),
            path: paths.dashboard.customer.servicePoint,
            icon: ICONS.kanban,
          },
          {
            title: t('Ví Goxu'),
            path: paths.dashboard.wallet,
            icon: <Iconify icon="solar:wallet-bold-duotone" />,
          },
          {
            title: t('Hỗ trợ'),
            path: paths.dashboard.customer.support,
            icon: <Iconify icon="solar:chat-round-call-bold-duotone" />,
          },
          {
            title: t('Xem hướng dẫn'),
            path: '#tutorial',
            icon: <Iconify icon="solar:videocamera-record-bold-duotone" />,
          }
        ],
      },
    ],
    [t]
  );

  if (role === 'ADMIN') {
    return adminNav;
  }

  if (role === 'ACCOUNTANT') {
    return accountantNav;
  }

  if (role === 'MONITOR') {
    return monitorNav;
  }

  if (role === 'PARTNER' || role === 'INTRODUCER') {
    return driverNav;
  }

  // Default to customer
  return customerNav;
}


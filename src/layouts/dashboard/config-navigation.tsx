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

// ... (imports)

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const role = user?.role;

  const adminNav = useMemo(
    () => [
      {
        subheader: t('Trang chủ'),
        items: [
          {
            title: t('Tổng quan'),
            path: paths.dashboard.admin.overview,
            icon: ICONS.dashboard,
          },
          {
            title: t('Giao dịch'),
            path: paths.dashboard.admin.transactions,
            icon: ICONS.order,
          },
          {
            title: t('Đối tác'),
            path: paths.dashboard.admin.partners.root,
            icon: ICONS.user,
          },
          {
            title: t('Điểm dịch vụ'),
            path: paths.dashboard.admin.servicePoints.root,
            icon: ICONS.banking,
          },
        ],
      },
      // ... Can add existing management items here if Admin needs them
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
          },
          {
            title: t('Lịch sử & Ví tiền'),
            path: paths.dashboard.driver.wallet,
            icon: ICONS.banking,
          },
        ],
      },
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
            title: t('Cửa hàng của bạn'),
            path: paths.dashboard.customer.servicePoint,
            icon: ICONS.kanban,
          },
          {
            title: t('Ví GoXu'),
            path: paths.dashboard.wallet,
            icon: ICONS.banking,
          },
        ],
      },
    ],
    [t]
  );

  if (role === 'ADMIN') {
    return adminNav;
  }

  if (role === 'PARTNER' || role === 'INTRODUCER') {
    return driverNav;
  }

  // Default to customer
  return customerNav;
}


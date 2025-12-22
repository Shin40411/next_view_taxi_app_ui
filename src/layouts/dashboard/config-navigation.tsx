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

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      {
        subheader: t('tổng quan'),
        items: [
          {
            title: t('thống kê'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        subheader: t('quản lý'),
        items: [
          {
            title: t('shop'),
            path: paths.dashboard.management.cskd,
            icon: ICONS.order,
          },
          {
            title: t('dịch vụ'),
            path: paths.dashboard.management.dichvu,
            icon: ICONS.ecommerce,
          },
          {
            title: t('tài xế'),
            path: paths.dashboard.management.taixe,
            icon: ICONS.booking,
          },
          {
            title: t('ctv'),
            path: paths.dashboard.management.ctv,
            icon: ICONS.user,
          }
        ],
      },
      {
        subheader: t('tài xế'),
        items: [
          {
            title: t('thông tin tài xế'),
            path: paths.dashboard.forDriver,
            icon: ICONS.menuItem,
          },
        ]
      },
      {
        subheader: t('cơ sở kinh doanh'),
        items: [
          {
            title: t('thông tin CSKD'),
            path: paths.dashboard.ecommercial,
            icon: ICONS.menuItem,
          },
        ]
      },
      {
        subheader: t('kế toán'),
        items: [
          {
            title: t('cộng tác viên'),
            path: paths.dashboard.accountant.ctv,
            icon: ICONS.menuItem,
          },
          {
            title: t('cơ sở kinh doanh'),
            path: paths.dashboard.accountant.cskd,
            icon: ICONS.menuItem,
          },
        ]
      },
      {
        subheader: t('ví tiền'),
        items: [
          {
            title: t('thông tin ví tiền'),
            path: paths.dashboard.wallet,
            icon: ICONS.banking,
          },
        ]
      }
    ],
    [t]
  );

  return data;
}

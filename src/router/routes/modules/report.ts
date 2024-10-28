import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/report',
  name: 'reports',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '统计分析',
    requiresAuth: true,
    icon: 'icon-bar-chart',
    order: 0,
  },
  children: [
    {
      path: 'daily-report',
      name: 'DailyReport',
      component: () => import('@/views/reports/date-report/index.vue'),
      meta: {
        locale: '日报表',
        requiresAuth: true,
        permissions: ['Pages.Statistic.Analysis.Daily.Report'],
      },
    },
    {
      path: 'Monthly-report',
      name: 'MonthlyReport',
      component: () => import('@/views/reports/date-report/index.vue'),
      meta: {
        locale: '月报表',
        requiresAuth: true,
        permissions: ['Pages.Statistic.Analysis.Monthly.Report'],
      },
    },
    {
      path: 'device-overhaul',
      name: 'DeviceOverhaul',
      component: () => import('@/views/reports/device-overhaul/index.vue'),
      meta: {
        locale: '待检验设备报表',
        requiresAuth: true,
        permissions: ['Pages.Statistic.Analysis.DeviceOverhaul'],
      },
    },
    // {
    //   path: 'yearly-report',
    //   name: 'YearlyReport',
    //   component: () => import('@/views/reports/date-report/index.vue'),
    //   meta: {
    //     locale: '年报表',
    //     requiresAuth: true,
    //     permissions: ['Pages.Statistic.Analysis.Annual.Report'],
    //   },
    // },
  ],
};

export default DASHBOARD;

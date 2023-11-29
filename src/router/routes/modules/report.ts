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
    // {
    //   path: 'temperature-daily',
    //   name: 'TemperatureDailyReport',
    //   component: () => import('@/views/reports/temperature-daily/index.vue'),
    //   meta: {
    //     locale: '温湿度日报表',
    //     requiresAuth: true,
    //     permissions: ['*'],
    //   },
    // },
  ],
};

export default DASHBOARD;

import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/monitor',
  name: 'monitor',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '数据监测',
    requiresAuth: true,
    icon: 'icon-book',
    order: 0,
  },
  children: [
    {
      path: 'temperature-humidity',
      name: 'TemperatureHumidity',
      component: () => import('@/views/monitor/temperature-humidity/index.vue'),
      meta: {
        locale: '温湿度监测',
        requiresAuth: false,
        permissions: ['Pages.Monitor.TemperatureHumidity'],
      },
    },
    {
      path: 'temperature-humidity-history',
      name: 'TemperatureHumidityHistory',
      component: () =>
        import('@/views/monitor/temperature-humidity-history/index.vue'),
      meta: {
        locale: '温湿度历史',
        requiresAuth: false,
        permissions: ['Pages.Monitor.TemperatureHumidityHistory'],
      },
    },
  ],
};

export default DASHBOARD;

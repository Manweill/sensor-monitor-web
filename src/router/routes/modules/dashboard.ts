import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        permissions: ['Pages.Workbench'],
      },
    },
    {
      path: 'floor-plan',
      name: 'FloorPlan',
      component: () => import('@/views/dashboard/floor-plan/index.vue'),
      meta: {
        locale: '平面图',
        requiresAuth: true,
        permissions: ['Pages.Plane.Graph'],
      },
    },
  ],
};

export default DASHBOARD;

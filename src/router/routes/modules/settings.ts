import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/settings',
  name: 'settings',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '系统管理',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 0,
  },
  children: [
    {
      path: 'users',
      name: 'Users',
      component: () => import('@/views/settings/user/index.vue'),
      meta: {
        locale: '用户管理',
        requiresAuth: true,
        permissions: ['Pages.Sys.Menu'],
      },
    },
    {
      path: 'roles',
      name: 'Roles',
      component: () => import('@/views/settings/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
        permissions: ['*'],
      },
    },
    {
      path: 'audit-log',
      name: 'AuditLogs',
      component: () => import('@/views/settings/audit-log/index.vue'),
      meta: {
        locale: '系统日志',
        requiresAuth: true,
        permissions: ['*'],
      },
    },
  ],
};

export default DASHBOARD;

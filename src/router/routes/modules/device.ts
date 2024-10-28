import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/devices',
  name: 'devices',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '设备',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 0,
  },
  children: [
    {
      path: 'gateway',
      name: 'Gateway',
      component: () => import('@/views/devices/gateway/index.vue'),
      meta: {
        locale: '网关管理',
        requiresAuth: true,
        permissions: ['Pages.GateWay'],
      },
    },
    {
      path: 'device-profile',
      name: 'DeviceProfile',
      component: () => import('@/views/devices/device-profile/index.vue'),
      meta: {
        locale: '设备配置',
        requiresAuth: true,
        permissions: ['Pages.Device.Profile'],
      },
    },
    {
      path: 'device-profile-detail',
      name: 'DeviceProfileDetail',
      component: () => import('@/views/devices/device-profile/detail.vue'),
      meta: {
        hideInMenu: true,
        locale: '设备配置详情',
        requiresAuth: true,
        permissions: ['*'],
      },
    },
    {
      path: 'device-list',
      name: 'DeviceList',
      component: () => import('@/views/devices/device-list/index.vue'),
      meta: {
        locale: '设备列表',
        requiresAuth: true,
        permissions: ['Pages.Device.List'],
      },
    },
    {
      path: 'device-list-detail',
      name: 'DeviceDetail',
      component: () => import('@/views/devices/device-list/detail.vue'),
      meta: {
        hideInMenu: true,
        locale: '设备详情',
        requiresAuth: true,
        permissions: ['Pages.Device.List'],
      },
    },
    {
      path: 'device-area',
      name: 'DeviceArea',
      component: () => import('@/views/devices/device-area/index.vue'),
      meta: {
        locale: '设备区域',
        requiresAuth: true,
        permissions: ['Pages.Device.Area'],
      },
    },
    // {
    //   path: 'device-history-data',
    //   name: 'DeviceHistoryData',
    //   component: () => import('@/views/devices/device-history-data/index.vue'),
    //   meta: {
    //     locale: '设备监测数据',
    //     requiresAuth: true,
    //     permissions: ['Pages.Device.Monitor.Data'],
    //   },
    // },
    {
      path: 'device-alert-message',
      name: 'AlertMessage',
      component: () => import('@/views/devices/alert-message/index.vue'),
      meta: {
        locale: '设备告警',
        requiresAuth: true,
        permissions: ['Pages.Device.Alert.Message'],
      },
    },
    {
      path: 'device-alert-message-log',
      name: 'AlertMessageLog',
      component: () => import('@/views/devices/alert-message-log/index.vue'),
      meta: {
        locale: '设备告警日志',
        requiresAuth: true,
        permissions: ['Pages.Device.Alert.MessageLog'],
      },
    },
  ],
};

export default DASHBOARD;

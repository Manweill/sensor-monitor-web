import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      const permissions: any = {};
      userStore?.auth?.forEach((n) => {
        permissions[n.permissionCode as string] = n.granted;
      });
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.permissions ||
        route.meta?.permissions?.includes('*') ||
        route.meta?.permissions?.every((n) => permissions[n] === true)
      );
    },
  };
}

import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  LoginData,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { ConfigurationDto, ConfigurationService } from '@/services/auth';

const useUserStore = defineStore('user', {
  state: (): ConfigurationDto => ({
    auth: [],
    currentUser: {},
    featureConfig: {},
    loginInfo: { needCaptcha: false },
    tenantConfig: {},
    userInfo: {},
  }),

  // getters: {
  //   userInfo(state: ConfigurationDto): ConfigurationDto {
  //     return { ...state };
  //   },
  // },

  actions: {
    setInfo(partial: Partial<ConfigurationDto>) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },
    async getAll() {
      const res: ConfigurationDto = await ConfigurationService.getAll();
      this.setInfo(res);
    },
    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data);
      } catch (err: any) {
        clearToken();
        if (err.code === 401) {
          // 补充验证码的问题
          await this.getAll();
        }
        throw err;
      }
    },
    logoutCallBack() {
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;

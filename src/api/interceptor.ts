import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

import { serviceOptions } from '@/services/serviceOptions';

export interface HttpResponse<T = unknown> {
  status: number;
  message: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Message.error({
        content: res.message || 'Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        [50008, 50012, 50014].includes(res.code) &&
        response.config.url !== '/api/user/info'
      ) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  async (error) => {
    const userStore = useUserStore();

    if (error && error.response) {
      const { message } = error.response.data;
      let responseError = message || '未知错误';
      switch (error.response.status) {
        case 400:
          responseError = message || '请求错误';
          break;
        case 401:
          responseError = '未授权，请登录';
          await userStore.logout();
          window.location.reload();
          break;
        case 403:
          responseError = '拒绝访问';
          break;
        case 404:
          responseError = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          responseError = '请求超时';
          break;
        case 500:
          responseError = '服务器内部错误';
          break;
        case 501:
          responseError = '服务未实现';
          break;
        case 502:
          responseError = '网关错误';
          break;
        // case 503:
        //   const serverName = getServerNameByUrl(error?.config?.url);
        //   responseError = `${serverName}服务不可用`;
        //   break;
        case 504:
          responseError = '网关超时';
          break;
        case 505:
          responseError = 'HTTP版本不受支持';
          break;
        default:
          break;
      }
      Message.error({
        content: responseError,
        duration: 5 * 1000,
      });
    } else {
      const otherError = new Error((error && error.message) || '网络连接错误');
      Message.error({
        content: otherError.message || 'Request Error',
        duration: 5 * 1000,
      });
    }

    return Promise.reject(error);
  }
);

serviceOptions.axios = axios;
serviceOptions.loading = true;

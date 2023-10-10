import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function getDeviceList(params: any) {
  return axios.get('/device/listAll', { params });
}

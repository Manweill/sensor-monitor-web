import axios from 'axios';

export interface LoginData {
  username: string;
  password: string;
  captcha: string;
  key: string;
}

export interface UserListInputDto {
  filter?: string;
  orgId?: number;
  pageNumber: number;
  pageSize: number;
  sorting?: string;
  sortingDirection?: 'ASC' | 'DESC';
  unPage?: boolean;
}

export interface UserDto {
  email?: string;
  faceImage?: string;
  id?: number;
  name: string;
  orgId?: number;
  orgName?: string;
  permissions?: [];
  phone?: string;
  pwd?: string;
  roles?: [];
  userName: string;
  userNo?: string;
}
export function login(data: LoginData) {
  return axios.post('/api/auth/login', data);
}

export function logout() {
  return axios.post('/api/auth/token-auth/logout');
}

export function getUserList(inputDto: UserListInputDto) {
  return axios.post('/api/user/list', { ...inputDto });
}

export function saveUser(userDto: UserDto) {
  return axios.post('/api/user/save', { ...userDto });
}

export function delUser(id: string) {
  return axios.post('/api/user/delete', {}, { params: { id } });
}

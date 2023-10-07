import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  userName: string;
  pwd: string;
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
  return axios.post('/login', data);
}

export function logout() {
  return axios.post('/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/mine');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

export function getUserList(inputDto: UserListInputDto) {
  return axios.post('/user/list', { ...inputDto });
}

export function saveUser(userDto: UserDto) {
  return axios.post('/user/save', { ...userDto });
}

export function delUser(id: string) {
  return axios.post('/user/delete', {}, { params: { id } });
}

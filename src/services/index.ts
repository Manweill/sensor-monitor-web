/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

import {
  IRequestOptions,
  IRequestConfig,
  getConfigs,
  axios,
} from './serviceOptions';
export const basePath = '/api';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export class OrganizationService {
  /**
   * 根据id删除组织机构
   */
  static deleteOrgById(
    params: {
      /** orgId */
      orgId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/deleteOrgById';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options
      );
      configs.params = { orgId: params['orgId'] };

      let data = null;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取所有组织机构数据
   */
  static getAll(options: IRequestOptions = {}): Promise<OrganizationDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/getAll';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 根据Id获取组织机构数据
   */
  static getOrgById(
    params: {
      /** orgId */
      orgId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<OrganizationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/getOrgById';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );
      configs.params = { orgId: params['orgId'] };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 新增/编辑组织机构
   */
  static saveOrg(
    params: {
      /** inputDto */
      inputDto: TreeCreateOrUpdateInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/saveOrg';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['inputDto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class DeviceService {
  /**
   * 删除设备
   */
  static deleteById(
    params: {
      /** id */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/deleteById/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 删除设备的同时，删除设备和区域的绑定关系
   */
  static deleteDevice(
    params: {
      /** input */
      input: DeleteDeviceInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/deleteDevice';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options
      );

      let data = params['input'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 查询设备详情
   */
  static getDetailById(
    params: {
      /** id */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DeviceDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/getDetailById/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 查询所有设备列表
   */
  static listAll(
    params: {
      /** 设备名 */
      deviceName?: string;
      /** 设备类型 */
      deviceType?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ListDeviceOutputDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/listAll';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );
      configs.params = {
        deviceName: params['deviceName'],
        deviceType: params['deviceType'],
      };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 保存设备
   */
  static saveDevice(
    params: {
      /** inputDto */
      inputDto: DeviceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/saveDevice';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['inputDto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class DeviceTsKvService {
  /**
   * 获取到设备属性的历史记录数据
   */
  static getDeviceTsKvRecordData(
    params: {
      /** 设备ID */
      deviceId?: number;
      /** 结束时间 */
      endTime?: string;
      /** 设备属性名 */
      key?: string;
      /** 页码,默认为1 */
      pageNumber?: number;
      /** 分页页大小，默认每页10条 */
      pageSize?: number;
      /** 排序字段名 */
      sorting?: string;
      /** 排序的方式，默认升序 */
      sortingDirection?: string;
      /** 开始时间 */
      startTime?: string;
      /** 是否不分页，默认分页 */
      unPage?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDto<DeviceFieldDataDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/deviceTsKv/getDeviceTsKvRecordData';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );
      configs.params = {
        deviceId: params['deviceId'],
        endTime: params['endTime'],
        key: params['key'],
        pageNumber: params['pageNumber'],
        pageSize: params['pageSize'],
        sorting: params['sorting'],
        sortingDirection: params['sortingDirection'],
        startTime: params['startTime'],
        unPage: params['unPage'],
      };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
}

export class LoginService {
  /**
   * 登录
   */
  static login(
    params: {
      /** loginDto */
      loginDto: LoginDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/login';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['loginDto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 退出登录
   */
  static logout(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/logout';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = null;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取当前登录用户信息，包含角色权限等
   */
  static get(options: IRequestOptions = {}): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/mine';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = null;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class RoleService {
  /**
   * 角色删除
   */
  static delete(
    params: {
      /** id */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/role/delete';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );
      configs.params = { id: params['id'] };

      let data = null;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取角色详情
   */
  static getRole(
    params: {
      /** id */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<RoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/role/get';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );
      configs.params = { id: params['id'] };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取所有权限集合
   */
  static getAllPermissions(
    options: IRequestOptions = {}
  ): Promise<Permission[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/role/getAllPermissions';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取角色列表
   */
  static list(
    params: {
      /** 角色名称 */
      name?: string;
      /** 页码,默认为1 */
      pageNumber?: number;
      /** 分页页大小，默认每页10条 */
      pageSize?: number;
      /** 排序字段名 */
      sorting?: string;
      /** 排序的方式，默认升序 */
      sortingDirection?: string;
      /** 是否不分页，默认分页 */
      unPage?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResult_RoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/role/list';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );
      configs.params = {
        name: params['name'],
        pageNumber: params['pageNumber'],
        pageSize: params['pageSize'],
        sorting: params['sorting'],
        sortingDirection: params['sortingDirection'],
        unPage: params['unPage'],
      };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 角色保存
   */
  static save(
    params: {
      /** roleDto */
      roleDto: RoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<RoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/role/save';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['roleDto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class StorehouseEnumService {
  /**
   * 获取枚举定义
   */
  static getEnums(options: IRequestOptions = {}): Promise<EnumOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/storehouseEnum/getEnums';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
}

export class UserService {
  /**
   * 删除用户
   */
  static delete(
    params: {
      /** id */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/delete';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );
      configs.params = { id: params['id'] };

      let data = null;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取用户详情
   */
  static getUser(
    params: {
      /** id */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/get';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options
      );
      configs.params = { id: params['id'] };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取用户列表
   */
  static getUserList(
    params: {
      /** inputDto */
      inputDto: GetUserListInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResult_UserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/list';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['inputDto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 修改密码
   */
  static changePwd(
    params: {
      /** dto */
      dto: ChangePwdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/pwd/change';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['dto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 管理员修改密码
   */
  static resetPwd(
    params: {
      /** dto */
      dto: ResetPwdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/pwd/reset';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['dto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 保存用户信息
   */
  static save(
    params: {
      /** userDto */
      userDto: UserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/save';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options
      );

      let data = params['userDto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export interface ChangePwdDto {
  /** 新密码,可用sm4加密 */
  newPwd?: string;

  /** 新密码,可用sm4加密 */
  oldPwd?: string;
}

export interface DeleteDeviceInputDto {
  /** 设备id */
  deviceId?: number;

  /** 区域节点 */
  nodeId?: number;
}

export interface DeviceDetailDto {
  /** 是否绑定其它设备，默认：否 */
  containSubDevice?: boolean;

  /** 设备描述 */
  description?: string;

  /** 设备物联ID */
  devEui?: string;

  /** 设备属性 */
  deviceFieldList?: DeviceFieldDto[];

  /** 设备名 */
  deviceName?: string;

  /** 设备类型 */
  deviceType?: EnumDeviceDetailDtoDeviceType;

  /** 设备类型显示名 */
  deviceTypeDisplayName?: string;

  /** 是否启用，默认：否 */
  enabled?: boolean;

  /** id */
  id?: number;
}

export interface DeviceDto {
  /** 是否绑定其它设备，默认：否 */
  containSubDevice?: boolean;

  /** 设备描述 */
  description?: string;

  /** 设备物联ID */
  devEui?: string;

  /** 设备的相关属性 */
  deviceFieldList?: DeviceFieldDto[];

  /** 设备名 */
  deviceName?: string;

  /** 设备类型 */
  deviceType?: EnumDeviceDtoDeviceType;

  /** 是否启用，默认：否 */
  enabled?: boolean;

  /** id */
  id?: number;
}

export interface DeviceFieldDataDto {
  /** 设备属性名 */
  key?: string;

  /** 设备属性值的上报时间 */
  upTime?: Date;

  /** 设备属性值 */
  valueDouble?: number;
}

export interface DeviceFieldDto {
  /** 设备属性的描述 */
  description?: string;

  /** 设备属性名 */
  fieldName?: string;

  /** 设备属性对应的类型 */
  fieldType?: EnumDeviceFieldDtoFieldType;

  /** id */
  id?: number;
}

export interface EnumOutputDto {
  /** 通讯设备类型枚举 */
  deviceType?: SelectListOutputDto[];
}

export interface GetUserListInputDto {
  /** 检索条件，姓名、账号或手机号 */
  filter?: string;

  /** 组织机构Id */
  orgId?: number;

  /** 页码,默认为1 */
  pageNumber?: number;

  /** 分页页大小，默认每页10条 */
  pageSize?: number;

  /** 排序字段名 */
  sorting?: string;

  /** 排序的方式，默认升序 */
  sortingDirection?: EnumGetUserListInputDtoSortingDirection;

  /** 是否不分页，默认分页 */
  unPage?: boolean;
}

export interface ListDeviceOutputDto {
  /** 是否绑定其它设备，默认：否 */
  containSubDevice?: boolean;

  /** 设备描述 */
  description?: string;

  /** 设备物联ID */
  devEui?: string;

  /** 设备的相关属性 */
  deviceFieldList?: DeviceFieldDto[];

  /** 设备名 */
  deviceName?: string;

  /** 设备类型 */
  deviceType?: EnumListDeviceOutputDtoDeviceType;

  /** 设备类型显示名 */
  deviceTypeDisplayName?: string;

  /** 是否启用，默认：否 */
  enabled?: boolean;

  /** id */
  id?: number;
}

export interface LoginDto {
  /** 登录密码，sm4加密可选 */
  pwd?: string;

  /** 账号账号或手机号 */
  userName?: string;
}

export interface OrganizationDto {
  /** 名称 */
  displayName?: string;

  /** id */
  id?: number;

  /** 父id */
  parentId?: number;

  /** 序号 */
  sortIndex?: number;
}

export interface PagedResult_RoleDto {
  /**  */
  items?: RoleDto[];

  /**  */
  totalCount?: number;
}

export interface PagedResult_UserDto {
  /**  */
  items?: UserDto[];

  /**  */
  totalCount?: number;
}

export interface Permission {
  /**  */
  children?: Permission[];

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  parentCode?: string;
}

export interface PermissionDto {
  /** 子权限集合 */
  children?: PermissionDto[];

  /** 权限编码 */
  code?: string;

  /** 是否被赋予 */
  granted?: boolean;

  /** 权限名称 */
  name?: string;

  /** 父权限编码 */
  parentCode?: string;
}

export interface ResetPwdDto {
  /** 新密码,可用sm4加密 */
  newPwd?: string;

  /** 用户id */
  userId?: number;
}

export interface RoleDto {
  /**  */
  description?: string;

  /**  */
  id?: number;

  /**  */
  name?: string;

  /**  */
  permissions?: PermissionDto[];
}

export interface SelectListOutputDto {
  /** 显示名称 */
  displayName?: string;

  /**  */
  name?: string;

  /** 是否被勾选 */
  selected?: boolean;

  /**  */
  value?: number;
}

export interface TreeCreateOrUpdateInputDto {
  /** 名称 */
  displayName?: string;

  /** id */
  id?: number;

  /** 父id */
  parentId?: number;

  /** 序号 */
  sortIndex?: number;
}

export interface UserDto {
  /** 邮箱 */
  email?: string;

  /** 人脸照片base64 */
  faceImage?: string;

  /** id */
  id?: number;

  /** 姓名 */
  name?: string;

  /** 组织机构Id */
  orgId?: number;

  /** 组织机构名 */
  orgName?: string;

  /** 权限集合 */
  permissions?: PermissionDto[];

  /** 手机号 */
  phone?: string;

  /** 密码可输入大小写字母以及数字，长度至少为6，sm4加密可选 */
  pwd?: string;

  /** 角色集合 */
  roles?: RoleDto[];

  /** 用户名 */
  userName?: string;

  /** 工号 */
  userNo?: string;
}
export enum EnumDeviceDetailDtoDeviceType {
  'TC_TH_D1' = 'TC_TH_D1',
}
export enum EnumDeviceDtoDeviceType {
  'TC_TH_D1' = 'TC_TH_D1',
}
export enum EnumDeviceFieldDtoFieldType {
  'DOUBLE' = 'DOUBLE',
  'STRING' = 'STRING',
  'BOOLEAN' = 'BOOLEAN',
  'LONG' = 'LONG',
}
export enum EnumGetUserListInputDtoSortingDirection {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}
export enum EnumListDeviceOutputDtoDeviceType {
  'TC_TH_D1' = 'TC_TH_D1',
}

/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

import {
  IRequestOptions,
  IRequestConfig,
  getConfigs,
  axios,
} from './serviceOptions';
export const basePath = '/api/core';

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

export class BindDeviceAreaService {
  /**
   * 在某个区域下批量绑定设备
   */
  static batchBind(
    params: {
      /** input */
      input: BatchBindDeviceAreaInputDto;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/bindDeviceArea/batchBind';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params['input'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 根据选择的区域IDS,批量解绑
   */
  static batchUnBind(
    params: {
      /** areaIds */
      areaIds: any | null[];
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/bindDeviceArea/batchUnbind';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params['areaIds'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 根据选择的区域下的某些设备,对其进行批量解绑
   */
  static batchUnbindByAreaAndDevice(
    params: {
      /** input */
      input: BatchUnbindByAreaAndDeviceInputDto;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/bindDeviceArea/batchUnbindByAreaAndDevice';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params['input'];

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
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/deleteById/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = null;

      configs.data = data;

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
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/deleteDevice';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
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
    options: IRequestOptions = {},
  ): Promise<DeviceDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/getDetailById/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
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
      /** 页码 */
      pageNumber?: number;
      /** 每页显示的记录数 */
      pageSize?: number;
      /** 排序字段名 */
      sorting?: string;
      /** 排序的方式 */
      sortingDirection?: string;
      /** 是否不分页，默认分页 */
      unPage?: boolean;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<PagedResultDto<DeviceDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/listAll';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = {
        deviceName: params['deviceName'],
        deviceType: params['deviceType'],
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
   * 保存设备
   */
  static saveDevice(
    params: {
      /** inputDto */
      inputDto: DeviceDto;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/device/saveDevice';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params['inputDto'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class DeviceAreaService {
  /**
   * 新增设备区域
   */
  static createDeviceArea(
    params: {
      /** input */
      input: DeviceAreaInputDto;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<DeviceAreaDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/deviceArea/createDeviceArea';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params['input'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 删除设备区域(嵌套删除)
   */
  static deleteDeviceArea(
    params: {
      /** input */
      input: EntityDto;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/deviceArea/deleteDeviceArea';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = params['input'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 获取所有设备区域
   */
  static getAllDeviceArea(
    options: IRequestOptions = {},
  ): Promise<ListResultDto<DeviceAreaDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/deviceArea/getAllDeviceArea';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * 移动设备区域
   */
  static moveDeviceArea(
    params: {
      /** input */
      input: MoveDeviceAreaInputDto;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<DeviceAreaDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/deviceArea/moveDeviceArea';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params['input'];

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * 更新设备区域
   */
  static updateDeviceArea(
    params: {
      /** input */
      input: UpdateDeviceAreaInputDto;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<DeviceAreaDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/deviceArea/updateDeviceArea';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params['input'];

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
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
}

export interface BatchBindDeviceAreaInputDto {
  /** 设备区域ID */
  areaId?: number;

  /** 待绑定的设备ID */
  deviceIdList?: number[];
}

export interface BatchUnbindByAreaAndDeviceInputDto {
  /** 设备区域ID */
  areaId?: number;

  /** 待解绑的设备IDs */
  deviceIdList?: number[];
}

export interface DeleteDeviceInputDto {
  /** 设备id */
  deviceId?: number;

  /** 区域节点 */
  nodeId?: number;
}

export interface DeviceAreaDto {
  /** 区域名称 */
  areaName?: string;

  /** id */
  id?: number;

  /** 组织id */
  orgId?: number;

  /** 父设备区域id */
  parentId?: number;

  /** 序号 */
  sortIndex?: number;
}

export interface DeviceAreaInputDto {
  /** 区域名称 */
  areaName?: string;

  /** 父级区域id */
  parentId?: number;

  /** 顺序 */
  sortIndex?: number;
}

export interface DeviceDetailDto {
  /** 设备描述 */
  description?: string;

  /** 设备物联ID */
  devEui?: string;

  /** 设备的相关属性 */
  deviceFieldList?: DeviceFieldDto[];

  /** 设备名称 */
  deviceName?: string;

  /** 设备类型 */
  deviceType?: EnumDeviceDetailDtoDeviceType;

  /** 设备类型显示名 */
  deviceTypeDisplayName?: string;

  /** 设备类型对应的displayName */
  deviceTypeStrName?: string;

  /** 是否启用，默认：否 */
  enabled?: boolean;

  /** id */
  id?: number;

  /** 设备是否在线，true表示在线 , 默认是false */
  online?: boolean;
}

export interface DeviceDto {
  /** 设备描述 */
  description?: string;

  /** 设备物联ID */
  devEui?: string;

  /** 设备的相关属性 */
  deviceFieldList?: DeviceFieldDto[];

  /** 设备名称 */
  deviceName?: string;

  /** 设备类型 */
  deviceType?: EnumDeviceDtoDeviceType;

  /** 设备类型对应的displayName */
  deviceTypeStrName?: string;

  /** 是否启用，默认：否 */
  enabled?: boolean;

  /** id */
  id?: number;

  /** 设备是否在线，true表示在线 , 默认是false */
  online?: boolean;
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

export interface EntityDto {
  /** id */
  id?: number;
}

export interface EnumOutputDto {
  /** 通讯设备类型枚举 */
  deviceType?: SelectListOutputDto[];
}

export interface MoveDeviceAreaInputDto {
  /** id */
  id?: number;

  /** 新父组织机构id */
  newParentId?: number;
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

export interface UpdateDeviceAreaInputDto {
  /** 区域名称 */
  areaName?: string;

  /** id */
  id?: number;

  /** 父设备区域id */
  parentId?: number;

  /** 顺序 */
  sortIndex?: number;
}
export enum EnumDeviceDetailDtoDeviceType {
  'Environmental_Parameters_Profile' = 'Environmental_Parameters_Profile',
  'Human_Infrared_Sensor_Profile' = 'Human_Infrared_Sensor_Profile',
  'Temperature_Humidity_Profile' = 'Temperature_Humidity_Profile',
}
export enum EnumDeviceDtoDeviceType {
  'Environmental_Parameters_Profile' = 'Environmental_Parameters_Profile',
  'Human_Infrared_Sensor_Profile' = 'Human_Infrared_Sensor_Profile',
  'Temperature_Humidity_Profile' = 'Temperature_Humidity_Profile',
}
export enum EnumDeviceFieldDtoFieldType {
  'DOUBLE' = 'DOUBLE',
  'STRING' = 'STRING',
  'BOOLEAN' = 'BOOLEAN',
  'LONG' = 'LONG',
}

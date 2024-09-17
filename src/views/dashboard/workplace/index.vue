<template>
  <div class="container">
    <a-space direction="vertical" :size="16" fill>
      <div class="space-unit">
        <!-- 数据面板 -->
        <DataPanel :data-panel-data="dataPanelData" />
      </div>
      <div>
        <a-grid :cols="24" :col-gap="16" :row-gap="16">
          <a-grid-item
            :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 16, xxl: 16 }"
          >
            <!-- 设备接入统计 -->
            <DeviceChart :device-chart-data="deviceChartData" />
          </a-grid-item>
          <a-grid-item
            :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }"
          >
            <!-- 设备区域分布 -->
            <DeviceAreaTable :device-area-table-data="deviceAreaTableData" />
          </a-grid-item>
        </a-grid>
      </div>
      <div>
        <a-grid :cols="24" :col-gap="16" :row-gap="16">
          <a-grid-item
            :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }"
          >
            <!-- 今日告警 -->
            <TodayAlert />
          </a-grid-item>
          <a-grid-item
            :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }"
          >
            <!-- 告警趋势统计 -->
            <AlertChart />
          </a-grid-item>
        </a-grid>
      </div>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import {
    DeviceAreaService,
    AlertMessageService,
    DeviceListDto,
    DeviceAreaDto,
  } from '@/services/sensor-core';
  import dayjs from 'dayjs';

  import DataPanel from './components/data-panel.vue';
  import DeviceChart from './components/device-chart.vue';
  import DeviceAreaTable from './components/device-area-table.vue';
  import TodayAlert from './components/today-alert.vue';
  import AlertChart from './components/alert-chart.vue';

  // 定义统计的设备类型
  const profileNameMap: Record<string, string> = {
    Environmental_Parameters_Profile: '环境监测',
    Temperature_Humidity_Profile: '温湿度',
  };

  interface DataPanelData {
    areaCount: number;
    deviceCount: number;
    alertCount: number;
    dataCount: number;
  }

  interface DeviceChartData {
    deviceTypeData: number[];
    deviceStatusData: number[];
  }

  interface DeviceAreaTableData {
    id: string;
    name: string;
    deviceCount: Record<string, number>;
  }

  // 数据面板数据
  const dataPanelData = ref<DataPanelData>({
    areaCount: 0,
    deviceCount: 0,
    alertCount: 0,
    dataCount: 0,
  });

  // 设备接入统计数据
  const deviceChartData = ref<DeviceChartData>({
    deviceTypeData: [],
    deviceStatusData: [],
  });

  // 设备区域分布数据
  const deviceAreaTableData = ref<DeviceAreaTableData[]>([]);

  // 组合设备分布统计数据的方法
  const getDeviceAreaTableData = (
    areaResult: DeviceAreaDto[] | undefined,
    deviceResult: DeviceListDto[] | undefined,
  ) => {
    const areaMap = new Map<
      string,
      { id: string; name: string; deviceCount: Record<string, number> }
    >();
    areaResult?.forEach((area) => {
      if (area.id && area.areaName) {
        areaMap.set(area.id, {
          id: area.id,
          name: area.areaName,
          deviceCount: {},
        });
      }
    });

    deviceResult?.forEach((device) => {
      const areaId = device.areaId ?? '';
      const area = areaMap.get(areaId);
      if (area && device.deviceProfileName) {
        const profileName =
          profileNameMap[device.deviceProfileName] || device.deviceProfileName;
        area.deviceCount[profileName] =
          (area.deviceCount[profileName] || 0) + 1;
      }
    });
    deviceAreaTableData.value = Array.from(areaMap.values());
  };

  // 获取数据
  const fetchData = async () => {
    try {
      const [areaResult, deviceResult, alertResult] = await Promise.all([
        DeviceAreaService.getAllDeviceArea(),
        DeviceAreaService.getDeviceListByArea({ unPage: true }),
        AlertMessageService.getAlertMessageList({
          startTime: dayjs().startOf('day').toDate(),
          endTime: dayjs().endOf('day').toDate(),
        }),
      ]);

      // 处理数据面板数据 （也可以通过统计接口获取）
      dataPanelData.value = {
        areaCount: areaResult.items?.length ?? 0,
        deviceCount: deviceResult.items?.length ?? 0,
        alertCount: alertResult.items?.length ?? 0,
        dataCount: 99, // todo
      };

      // 处理设备接入统计数据
      deviceChartData.value = {
        deviceTypeData: [
          deviceResult.items?.filter(
            (n) => n.deviceProfileName === 'Temperature_Humidity_Profile',
          )?.length ?? 0,
          deviceResult.items?.filter(
            (n) => n.deviceProfileName === 'Environmental_Parameters_Profile',
          )?.length ?? 0,
        ],
        deviceStatusData: [
          deviceResult.items?.filter((n: DeviceListDto) => n.online === true)
            .length ?? 0,
          deviceResult.items?.filter((n: DeviceListDto) => n.online === false)
            .length ?? 0,
        ],
      };

      getDeviceAreaTableData(areaResult.items, deviceResult.items);
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
  }
</style>

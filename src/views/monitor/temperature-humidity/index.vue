<template>
  <div class="container">
    <a-card class="general-card" title="温湿度监测">
      <a-row>
        <!--       搜索表单       -->
        <a-col :flex="1">
          <a-form
            :model="searchModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="deviceAreaId" label="设备区域">
                  <a-tree-select
                    v-model="searchModel.areaId"
                    :data="deviceAreaTreeData"
                    placeholder="请选择"
                    style="width: 300px"
                  ></a-tree-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>

        <!--       搜索按钮       -->
        <a-divider style="height: 32px" direction="vertical" />
        <a-col flex="86px" style="text-align: right">
          <a-space direction="horizontal" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <template #extra>
        <span>{{ countdownText }}</span>
      </template>
      <a-skeleton v-if="loading">
        <a-space direction="vertical" :style="{ width: '100%' }" size="large">
          <a-skeleton-line :rows="3" />
        </a-space>
      </a-skeleton>
      <a-grid v-else :cols="24" :col-gap="12" :row-gap="12">
        <a-grid-item
          v-for="sensor in temperatureHumiditySensors"
          :key="sensor.id"
          :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }"
        >
          <a-card
            :bordered="false"
            :class="['sensor-card', { offline: !sensor.online }]"
          >
            <template #title>
              <a-space>
                <a-tooltip
                  :content="`剩余检验天数：${getRemainingCalibrationDays(
                    sensor,
                  )}天`"
                >
                  <a-badge
                    :status="
                      getRemainingCalibrationDays(sensor) >
                      minRemainingCalibrationDays
                        ? 'success'
                        : 'warning'
                    "
                  />
                </a-tooltip>
                <span>{{ sensor.name }}</span>
              </a-space>
            </template>
            <template #extra>
              <a-button
                shape="circle"
                type="text"
                @click="onSensorClick(sensor)"
              >
                <icon-bar-chart :style="{ color: '#fff' }" />
              </a-button>
              <a-button
                shape="circle"
                type="text"
                @click="onDeviceInfo(sensor)"
              >
                <icon-settings :style="{ color: '#fff' }" />
              </a-button>
            </template>
            <div class="content-wrap">
              <div class="content">
                <div class="desc">
                  <div style="display: flex">
                    <div class="temperature" style="flex: 1">
                      <div class="sensor-icon">
                        <icon-sun />
                        <span>{{
                          getFieldDescription(sensor, 'temperature')
                        }}</span>
                      </div>
                      <span
                        :class="`value-${deviceTemperatureAlertStatus(sensor)}`"
                        >{{ getSensorValue(sensor, 'temperature') }}°C</span
                      >
                    </div>
                    <a-divider
                      direction="vertical"
                      style="
                        height: auto;
                        margin: 0 10px;
                        border-color: rgba(255, 255, 255, 0.2);
                      "
                    />
                    <div class="humidity" style="flex: 1">
                      <div class="sensor-icon">
                        <icon-experiment />
                        <span>{{
                          getFieldDescription(sensor, 'humidity')
                        }}</span>
                      </div>
                      <span
                        :class="`value-${deviceHumidityAlertStatus(sensor)}`"
                        >{{ getSensorValue(sensor, 'humidity') }}%</span
                      >
                    </div>
                  </div>
                </div>
                <a-popover title="设备信息" position="bottom">
                  <template #content>
                    <a-space direction="vertical" fill>
                      <span>
                        距离校准日期:
                        {{
                          sensor.producerConfigInfo?.calibrationPeriod || '--'
                        }}天</span
                      >
                      <span>
                        生产厂家:
                        {{ sensor.producerConfigInfo?.producer || '--' }}</span
                      >
                      <span>
                        产品型号:
                        {{ sensor.producerConfigInfo?.modelNumber || '--' }}
                      </span>
                      <span>
                        设备编码:
                        {{
                          sensor.producerConfigInfo?.serialNumber || '--'
                        }}</span
                      >
                      <span>
                        投运日期:
                        {{
                          dayjs(sensor.producerConfigInfo?.serviceTime).format(
                            'YYYY-MM-DD',
                          ) || '--'
                        }}
                      </span>
                      <span>
                        上次校准日期:
                        {{
                          dayjs(
                            sensor.producerConfigInfo?.lastCalibrationTime,
                          ).format('YYYY-MM-DD') || '--'
                        }}
                      </span>
                    </a-space>
                  </template>
                  <div class="device-des">
                    <a-space direction="vertical" fill>
                      <span> 最近更新: {{ getLastUpdateTime(sensor) }}</span>
                      <span> 位置: {{ sensor.areaName }}</span>
                    </a-space>
                  </div>
                </a-popover>
              </div>
            </div>
          </a-card>
        </a-grid-item>
      </a-grid>
    </a-card>
    <a-modal
      v-model:visible="isReportVisible"
      title="温湿度数据报表"
      width="80%"
      height="80%"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <DeviceDataReport v-if="isReportVisible" :device-eui="deviceEui" />
    </a-modal>
    <DeviceInfo ref="deviceInfoRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import dayjs from 'dayjs';
  import { DeviceAreaService, DeviceListDto } from '@/services/sensor-core';
  import useLoading from '@/hooks/loading';
  import { convertToTree } from '@/utils/convert';
  import { TreeNodeData } from '@arco-design/web-vue';

  import DeviceDataReport from './components/device-data-report.vue';
  import DeviceInfo from './components/device-info.vue';

  // 搜索
  const generateSearchModel = () => {
    return {
      areaId: '',
    };
  };
  const searchModel = ref(generateSearchModel());
  // 设备区域树
  const deviceAreaTreeData = ref<TreeNodeData[]>([]);
  const fetchDeviceAreaTreeData = async () => {
    const { items = [] } = await DeviceAreaService.getAllDeviceArea();
    deviceAreaTreeData.value = convertToTree(
      items.map((n) => ({ title: n.areaName, key: n.id, ...n })),
      'parentId',
    );
  };

  const { loading, setLoading } = useLoading(false);
  // 温湿度传感器
  const temperatureHumiditySensors = ref<DeviceListDto[]>([]);
  // 获取温湿度传感器
  const fetchSensors = async () => {
    setLoading(true);
    try {
      const { items } = await DeviceAreaService.getDeviceListByArea({
        unPage: true,
        areaId: searchModel.value.areaId,
      });
      temperatureHumiditySensors.value = (items as DeviceListDto[]).filter(
        (device) =>
          device.deviceProfileName?.includes('Temperature') ||
          device.deviceProfileName?.includes('Humidity'),
      );
    } catch (err) {
      console.error('获取设备列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 搜索表单按钮事件
  const search = () => {
    fetchSensors();
  };
  // 重置
  const reset = () => {
    searchModel.value = generateSearchModel();
  };

  // 使用use封装定时刷新功能
  const useAutoRefresh = (
    fetchDataFn: () => Promise<void>,
    interval: number = 30,
  ) => {
    const countdown = ref(interval);
    const countdownText = ref(`${interval} 秒后自动刷新`);

    const updateCountdown = () => {
      countdown.value = Math.max(0, countdown.value - 1);
      countdownText.value = `${countdown.value} 秒后自动刷新`;
    };

    const refreshData = async () => {
      await fetchDataFn();
      countdown.value = interval;
      countdownText.value = `${interval} 秒后自动刷新`;
    };

    let timer: number;

    onMounted(() => {
      refreshData();
      timer = setInterval(() => {
        updateCountdown();
        if (countdown.value === 0) {
          refreshData();
        }
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      countdown,
      countdownText,
      refreshData,
    };
  };

  // 使用封装的自动刷新功能
  const { countdownText } = useAutoRefresh(fetchSensors);

  // 初始化
  onMounted(() => {
    // 获取设备区域树
    fetchDeviceAreaTreeData();
  });

  // 获取传感器值
  const getSensorValue = (sensor: DeviceListDto, fieldName: string) => {
    return (
      (
        sensor as DeviceListDto & { latestMetricDataList: any[] }
      ).latestMetricDataList?.find((data) => data.deviceFieldName === fieldName)
        ?.value || '--'
    );
  };
  // 获取字段描述
  const getFieldDescription = (sensor: DeviceListDto, fieldName: string) => {
    return (
      (
        sensor as DeviceListDto & { latestMetricDataList?: any[] }
      ).latestMetricDataList?.find((data) => data.deviceFieldName === fieldName)
        ?.description || ''
    );
  };
  // 获取最近更新时间
  const getLastUpdateTime = (sensor: DeviceListDto) => {
    const latestData = (
      sensor as DeviceListDto & { latestMetricDataList: any[] }
    ).latestMetricDataList?.[0];
    return latestData ? new Date(latestData.time).toLocaleString() : '未知';
  };

  // 最小剩余校准天数
  const minRemainingCalibrationDays: number = 30;
  // 获取剩余校准天数
  const getRemainingCalibrationDays: (sensor: DeviceListDto) => number = (
    sensor: DeviceListDto,
  ) => {
    const lastCalibrationTime = sensor.producerConfigInfo?.lastCalibrationTime;
    const calibrationPeriod = sensor.producerConfigInfo?.calibrationPeriod;
    if (!lastCalibrationTime || !calibrationPeriod) {
      return 0;
    }
    const currentTime = new Date();
    const lastCalibrationDate = new Date(lastCalibrationTime);
    const timeDifference =
      currentTime.getTime() - lastCalibrationDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return calibrationPeriod - daysDifference;
  };

  // 获取温度报警状态
  const deviceTemperatureAlertStatus = (sensor: DeviceListDto) => {
    const temperature = Number(
      sensor.latestMetricDataList?.find(
        (data) => data.deviceFieldName === 'temperature',
      )?.value,
    );

    if (
      !Number.isNaN(temperature) &&
      sensor?.producerConfigInfo?.temperatureUpperValue &&
      sensor?.producerConfigInfo?.temperatureLowerValue
    ) {
      if (
        temperature >
          (sensor?.producerConfigInfo?.temperatureUpperValue || 0) ||
        temperature < (sensor?.producerConfigInfo?.temperatureLowerValue || 0)
      ) {
        return 'warning';
      }
    }
    return 'normal';
  };

  // 获取湿度报警状态
  const deviceHumidityAlertStatus = (sensor: DeviceListDto) => {
    const humidity = Number(
      sensor.latestMetricDataList?.find(
        (data) => data.deviceFieldName === 'humidity',
      )?.value,
    );
    if (
      !Number.isNaN(humidity) &&
      sensor?.producerConfigInfo?.humidityUpperValue &&
      sensor?.producerConfigInfo?.humidityLowerValue
    ) {
      if (
        humidity > (sensor?.producerConfigInfo?.humidityUpperValue || 0) ||
        humidity < (sensor?.producerConfigInfo?.humidityLowerValue || 0)
      ) {
        return 'warning';
      }
    }
    return 'normal';
  };

  const isReportVisible = ref(false);
  const deviceEui = ref('');

  const onSensorClick = (sensor: DeviceListDto) => {
    deviceEui.value = sensor.devEui || '';
    isReportVisible.value = true;
  };

  const handleOk = () => {
    isReportVisible.value = false;
  };

  const handleCancel = () => {
    isReportVisible.value = false;
  };

  const deviceInfoRef = ref();

  const onDeviceInfo = (sensor: DeviceListDto) => {
    deviceInfoRef.value.openModal(sensor.devEui);
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
  .sensor-card {
    background: #206ccf;
    span {
      color: #ffffff;
    }
    .arco-btn-text:hover,
    .arco-btn-text[type='button']:hover,
    .arco-btn-text[type='submit']:hover {
      color: rgb(var(--primary-6));
      background-color: rgba(255, 255, 255, 0.08);
      border-color: transparent;
    }
  }
  .offline {
    background: rgb(var(--gray-6));
  }

  .sensor-info {
    flex: 1;
  }

  .sensor-data {
    display: flex;
    flex-direction: column;
  }

  .temperature,
  .humidity {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 24px;
    font-weight: bold;
  }

  .sensor-icon {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7); // 略微透明的白色

    i {
      margin-right: 5px;
      font-size: 20px;
    }

    span {
      margin-left: 5px;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .temperature {
    .value-normal {
      color: #ffd700; // 金色，与蓝色背景形成对比
    }
    .value-warning {
      color: #ff4d4f; // 红色，表示报警
    }
  }

  .humidity {
    .value-normal {
      color: #00ffff; // 青色，与蓝色背景形成对比
    }
    .value-warning {
      color: #ff4d4f; // 红色，表示报警
    }
  }

  .device-des {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 10px;
  }
</style>

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
            :style="{
              background: '#206CCF',
            }"
          >
            <div class="content-wrap">
              <div class="content">
                <h3>{{ sensor.name }}</h3>
                <div class="desc">
                  <div style="display: flex">
                    <div class="temperature" style="flex: 1">
                      <div class="sensor-icon">
                        <icon-sun />
                        <span>{{
                          getFieldDescription(sensor, 'temperature')
                        }}</span>
                      </div>
                      <span class="value"
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
                      <span class="value"
                        >{{ getSensorValue(sensor, 'humidity') }}%</span
                      >
                    </div>
                  </div>
                </div>
                <div class="update-time">
                  最近更新: {{ getLastUpdateTime(sensor) }}
                </div>
              </div>
            </div>
          </a-card>
        </a-grid-item>
      </a-grid>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { DeviceAreaService, DeviceDto } from '@/services/sensor-core';
  import useLoading from '@/hooks/loading';
  import { convertToTree } from '@/utils/convert';
  import { TreeNodeData } from '@arco-design/web-vue';

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
  const temperatureHumiditySensors = ref<DeviceDto[]>([]);
  // 获取温湿度传感器
  const fetchSensors = async () => {
    setLoading(true);
    try {
      const { items } = await DeviceAreaService.getDeviceListByArea({
        unPage: true,
        areaId: searchModel.value.areaId,
      });
      temperatureHumiditySensors.value = (items as DeviceDto[]).filter(
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
  const getSensorValue = (sensor: DeviceDto, fieldName: string) => {
    return (
      (
        sensor as DeviceDto & { latestMetricDataList: any[] }
      ).latestMetricDataList?.find((data) => data.deviceFieldName === fieldName)
        ?.value || '--'
    );
  };
  // 获取字段描述
  const getFieldDescription = (sensor: DeviceDto, fieldName: string) => {
    return (
      (
        sensor as DeviceDto & { latestMetricDataList?: any[] }
      ).latestMetricDataList?.find((data) => data.deviceFieldName === fieldName)
        ?.description || ''
    );
  };
  // 获取最近更新时间
  const getLastUpdateTime = (sensor: DeviceDto) => {
    const latestData = (sensor as DeviceDto & { latestMetricDataList: any[] })
      .latestMetricDataList?.[0];
    return latestData ? new Date(latestData.time).toLocaleString() : '未知';
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }

  .sensor-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .sensor-card {
    background-color: #1e1e1e; // 深色背景
    border-radius: 8px;
    padding: 20px;
    width: calc(33.33% - 14px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    color: #ffffff; // 白色文字

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }
  }

  .sensor-info {
    flex: 1;
  }

  h3 {
    margin: 0 0 15px;
    font-size: 18px;
    color: #ffffff; // 白色标题
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
    .value {
      color: #ffd700; // 金色，与蓝色背景形成对比
    }
  }

  .humidity {
    .value {
      color: #00ffff; // 青色，与蓝色背景形成对比
    }
  }

  .update-time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 10px;
  }
</style>

<template>
  <a-card
    class="general-card"
    title="设备分布统计"
    :header-style="{ paddingBottom: '12px' }"
  >
    <a-table
      :columns="columns"
      :data="tableData"
      :pagination="false"
      :loading="loading"
    >
      <template #name="{ record }">
        {{ record.name }}
      </template>
      <template #deviceCount="{ record }">
        <a-space>
          <a-tag v-for="(count, type) in record.deviceCount" :key="type">
            {{ type }}: {{ count }}
          </a-tag>
        </a-space>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { DeviceAreaService } from '@/services/sensor-core';

  const columns = [
    {
      title: '区域名称',
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      slotName: 'deviceCount',
    },
  ];

  interface AreaData {
    id: string;
    name: string;
    deviceCount: Record<string, number>;
  }

  const tableData = ref<AreaData[]>([]);
  const loading = ref(false);

  const fetchDeviceAreaData = async () => {
    loading.value = true;
    try {
      const areaResult = await DeviceAreaService.getAllDeviceArea();
      const deviceResult = await DeviceAreaService.getDeviceListByArea({
        unPage: true,
      });

      const areaMap = new Map<
        string,
        { id: string; name: string; deviceCount: Record<string, number> }
      >();
      areaResult.items?.forEach((area) => {
        if (area.id && area.areaName) {
          areaMap.set(area.id, {
            id: area.id,
            name: area.areaName,
            deviceCount: {},
          });
        }
      });

      const profileNameMap: Record<string, string> = {
        Environmental_Parameters_Profile: '环境监测',
        Temperature_Humidity_Profile: '温湿度',
      };

      deviceResult.items?.forEach((device) => {
        const areaId = device.areaId ?? '';
        const area = areaMap.get(areaId);
        if (area && device.deviceProfileName) {
          const profileName =
            profileNameMap[device.deviceProfileName] ||
            device.deviceProfileName;
          area.deviceCount[profileName] =
            (area.deviceCount[profileName] || 0) + 1;
        }
      });
      tableData.value = Array.from(areaMap.values());
    } catch (error) {
      //   console.error('获取设备区域数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchDeviceAreaData();
  });
</script>

<style scoped>
  .general-card {
    width: 100%;
    min-height: 340px;
  }
</style>

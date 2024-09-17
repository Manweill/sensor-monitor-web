<template>
  <div class="container">
    <a-space direction="vertical" :size="16" fill>
      <div class="space-unit">
        <!-- 数据面板 -->
        <DataPanel />
      </div>
      <div>
        <a-grid :cols="24" :col-gap="16" :row-gap="16">
          <a-grid-item
            :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 16, xxl: 16 }"
          >
            <!-- 设备接入统计 -->
            <DeviceChart />
          </a-grid-item>
          <a-grid-item
            :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }"
          >
            <!-- 设备区域分布 -->
            <DeviceAreaTable />
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
  import DataPanel from './components/data-panel.vue';
  import DeviceChart from './components/device-chart.vue';
  import DeviceAreaTable from './components/device-area-table.vue';
  import TodayAlert from './components/today-alert.vue';
  import AlertChart from './components/alert-chart.vue';
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
  }
</style>

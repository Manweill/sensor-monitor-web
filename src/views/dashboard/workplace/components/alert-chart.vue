<template>
  <a-card
    class="general-card"
    title="告警趋势统计"
    :header-style="{ paddingBottom: '12px' }"
  >
    <Chart height="510px" :option="chartOption" />
  </a-card>
</template>

<script setup lang="ts">
  import useChartOption from '@/hooks/chart-option';
  import dayjs from 'dayjs';
  import { onMounted, ref } from 'vue';
  import { AlertMessageService } from '@/services/sensor-core';

  const alerteStats = ref<{ xAxisData: string[]; yAxisData: number[] }>({
    xAxisData: [],
    yAxisData: [],
  });

  const { chartOption } = useChartOption(() => ({
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{b}: {c} 个',
    },
    xAxis: {
      type: 'category',
      data: alerteStats.value.xAxisData,
      axisLabel: {
        show: true,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true,
      },
    },
    series: [
      {
        data: alerteStats.value.yAxisData,
        type: 'line',
        smooth: true,
      },
    ],
  }));

  async function onRefreshData() {
    const now = new Date();
    const result = await AlertMessageService.getAlertMessageList({
      startTime: dayjs(now).add(-7, 'day').toDate(),
      endTime: now,
      unPage: true,
      // sorting: 'alertTime',
      // sortingDirection: 'ASC',
    });

    const xAxisData = [];
    const yAxisData = {};
    let i = 0;
    do {
      const xAxis = dayjs(now).add(-i, 'day').format('MM-DD');
      xAxisData.unshift(xAxis);
      yAxisData[xAxis] = 0;
      i += 1;
    } while (i < 7);

    result.items?.forEach((item) => {
      const xAxis = dayjs(item.alertTime).format('MM-DD');
      yAxisData[xAxis] = yAxisData[xAxis] ? yAxisData[xAxis] + 1 : 1;
    }, {});

    alerteStats.value = {
      xAxisData,
      yAxisData: Object.values(yAxisData).reverse(),
    };
  }

  onMounted(onRefreshData);
</script>

<style scoped>
  .general-card {
    height: 100%;
  }
</style>

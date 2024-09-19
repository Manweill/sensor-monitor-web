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
    xAxis: {
      type: 'category',
      data: alerteStats.value.xAxisData,
    },
    yAxis: {
      type: 'value',
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
    const result = await AlertMessageService.getAlertMessageList({
      startTime: dayjs(new Date()).add(-7, 'day').toDate(),
      endTime: new Date(),
      unPage: true,
      // sorting: 'alertTime',
      // sortingDirection: 'ASC',
    });

    const data = result.items?.reduce((stats, item) => {
      const xAxis = dayjs(item.alertTime).format('MM-DD');
      stats[xAxis] = stats[xAxis] ? stats[xAxis] + 1 : 1;
      return stats;
    }, {});

    alerteStats.value = {
      xAxisData: Object.keys(data).reverse(),
      yAxisData: Object.values(data).reverse(),
    };
  }

  onMounted(onRefreshData);
</script>

<style scoped>
  .general-card {
    height: 100%;
  }
</style>

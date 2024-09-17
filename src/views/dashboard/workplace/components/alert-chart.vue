<template>
  <a-card
    class="general-card"
    title="告警趋势统计"
    :header-style="{ paddingBottom: '12px' }"
  >
    <Chart height="300px" :option="chartOption" />
  </a-card>
</template>

<script setup lang="ts">
  import useChartOption from '@/hooks/chart-option';
  import dayjs from 'dayjs';

  const { chartOption } = useChartOption(() => {
    return {
      xAxis: {
        type: 'category',
        data: [
          dayjs().subtract(6, 'day').format('MM-DD'),
          dayjs().subtract(5, 'day').format('MM-DD'),
          dayjs().subtract(4, 'day').format('MM-DD'),
          dayjs().subtract(3, 'day').format('MM-DD'),
          dayjs().subtract(2, 'day').format('MM-DD'),
          dayjs().subtract(1, 'day').format('MM-DD'),
          dayjs().format('MM-DD'),
        ],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [3, 4, 1, 4, 0, 0, 3],
          type: 'line',
          smooth: true,
        },
      ],
    };
  });
</script>

<style scoped>
  .general-card {
    height: 100%;
  }
</style>

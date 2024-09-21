<template>
  <a-card
    class="general-card"
    title="设备统计"
    :header-style="{ paddingBottom: '12px' }"
  >
    <a-row :gutter="16">
      <a-col :span="12">
        <h3 class="chart-title">设备类型统计</h3>
        <Chart
          style="width: 100%; height: 220px"
          :option="deviceTypeChartOption"
        />
      </a-col>
      <a-col :span="12">
        <h3 class="chart-title">设备状态统计</h3>
        <Chart
          style="width: 100%; height: 220px"
          :option="deviceStatusChartOption"
        />
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import useChartOption from '@/hooks/chart-option';

  const props = defineProps<{
    deviceChartData: {
      deviceTypeData: number[];
      deviceStatusData: number[];
    };
  }>();

  const { chartOption: deviceStatusChartOption } = useChartOption(() => {
    return {
      grid: {
        left: 40,
        right: 20,
        top: 30,
        bottom: 40,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: ['在线', '离线'],
        axisLabel: {
          show: true,
        },
        axisTick: {
          show: false,
        },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      series: [
        {
          data: props.deviceChartData.deviceStatusData,
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
          },
        },
      ],
    };
  });

  const { chartOption: deviceTypeChartOption } = useChartOption((isDark) => {
    return {
      legend: {
        icon: 'circle',
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          name: '设备类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: props.deviceChartData.deviceTypeData[0],
              name: '温湿度传感器',
              // itemStyle: {
              //   color: isDark ? '#3D72F6' : '#249EFF',
              // },
            },
            {
              value: props.deviceChartData.deviceTypeData[1],
              name: '环境监测传感器',
              // itemStyle: {
              //   color: isDark ? '#A079DC' : '#313CA9',
              // },
            },
          ],
        },
      ],
    };
  });
</script>

<style scoped>
  .chart {
    height: 300px;
  }
  .general-card {
    width: 100%;
  }
  .chart-title {
    text-align: center;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
</style>

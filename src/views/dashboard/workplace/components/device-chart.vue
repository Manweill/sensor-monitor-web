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

  const { chartOption: deviceStatusChartOption } = useChartOption((isDark) => {
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
          color: isDark ? '#ffffffb3' : '#4E5969',
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#484849' : '#E5E8EF',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: ['在线', '离线', '异常'],
        axisLabel: {
          show: true,
          color: isDark ? '#ffffffb3' : '#4E5969',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#484849' : '#E5E8EF',
          },
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
          data: [30, 4, 1],
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
            color: isDark ? '#ffffffb3' : '#1D2129',
          },
        },
      ],
    };
  });

  const { chartOption: deviceTypeChartOption } = useChartOption((isDark) => {
    return {
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center',
        data: ['温湿度传感器', '环境监测传感器'],
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
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
          center: ['65%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 126,
              name: '温湿度传感器',
              itemStyle: {
                color: isDark ? '#3D72F6' : '#249EFF',
              },
            },
            {
              value: 78,
              name: '环境监测传感器',
              itemStyle: {
                color: isDark ? '#A079DC' : '#313CA9',
              },
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

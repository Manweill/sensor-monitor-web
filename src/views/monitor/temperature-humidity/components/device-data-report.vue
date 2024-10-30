<template>
  <!-- 选择报表类型和切换按钮 -->
  <a-row style="margin-bottom: 16px; display: flex; align-items: center">
    <a-col :flex="1">
      <a-radio-group
        v-model="reportType"
        type="button"
        @change="onReportTypeChange"
      >
        <a-radio value="DailyReport">日报</a-radio>
        <a-radio value="MonthlyReport">月报</a-radio>
      </a-radio-group>
    </a-col>
    <a-col :flex="1" style="text-align: right">
      <a-button
        type="text"
        :disabled="tableData.length === 0"
        @click="toggleChart()"
      >
        <template #icon>
          <icon-sync />
        </template>
        {{ showChart ? '切换表格' : '切换图表' }}
      </a-button>
    </a-col>
  </a-row>

  <div class="table-container">
    <a-table
      v-if="!showChart"
      row-key="id"
      :loading="loading"
      :pagination="false"
      :columns="columns"
      :data="tableData"
    >
      <template #date="{ record }">
        {{ dayjs(record.date).format(config.tableDateFormat) }}
      </template>
    </a-table>

    <a-card
      v-else
      class="general-card"
      :header-style="{ paddingBottom: '16px' }"
    >
      <template v-for="(option, index) in chartOptionList" :key="index">
        <Chart style="width: 100%; height: 370px" :option="option" />
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import dayjs, { OpUnitType } from 'dayjs';

  import _ from 'lodash';
  import { DeviceService } from '@/services/sensor-core';

  const props = defineProps<{
    deviceEui: string;
  }>();

  const reportType = ref('DailyReport');

  interface ReportConfig {
    title: string;
    aggregation: string;
    chartDateFormat: string;
    tableDateFormat: string;
    searchDateUnit: OpUnitType;
  }

  const REPORT_CONFIG: { [key: string]: ReportConfig } = {
    DailyReport: {
      title: '日统计报表',
      aggregation: 'HOUR',
      chartDateFormat: 'HH:mm',
      tableDateFormat: 'YYYY-MM-DD HH:mm',
      searchDateUnit: 'day',
    },
    MonthlyReport: {
      title: '月统计报表',
      aggregation: 'DAY',
      chartDateFormat: 'MM-DD',
      tableDateFormat: 'YYYY-MM-DD',
      searchDateUnit: 'month',
    },
    YearlyReport: {
      title: '年统计报表',
      aggregation: 'MONTH',
      chartDateFormat: 'YYYY-MM',
      tableDateFormat: 'YYYY-MM',
      searchDateUnit: 'year',
    },
  };

  interface Dataset {
    label: string;
    data: number[];
  }
  interface MetricsPros {
    name: string;
    timestamps: string[];
    datasets: Dataset[];
    kind: string;
  }
  interface Metrics {
    [key: string]: MetricsPros;
  }

  const { loading, setLoading } = useLoading(false);

  const config = computed(() => REPORT_CONFIG[reportType.value]);

  const metricsData = ref<Metrics>({});

  const columns = computed(() => {
    const cols = [
      {
        title: '时间',
        dataIndex: 'date',
        slotName: 'date',
      },
    ];
    Object.entries(metricsData.value).forEach(([key, value]: [string, any]) => {
      cols.push({
        title: value.name,
        dataIndex: key as string,
        slotName: key as string,
      });
    });
    return cols;
  });

  // 表格
  const tableData = computed(() => {
    const table: any[] = [];
    Object.entries(metricsData.value).forEach(([key, value]: [string, any]) => {
      value.timestamps.forEach((n: any, index: number) => {
        const findIndex = table.findIndex((t) => t.date === n);
        if (findIndex >= 0) {
          table[findIndex][key] = Number.parseFloat(
            value.datasets[0].data[index],
          ).toFixed(2);
        } else {
          table.push({
            date: n,
            [key]: Number.parseFloat(value.datasets[0].data[index]).toFixed(2),
          });
        }
      });
    });

    return table;
  });

  // 查询表格数据
  const queryTable = async () => {
    const devEui = props.deviceEui;

    const date = new Date();

    setLoading(true);
    try {
      const { metrics } = await DeviceService.getDeviceMetrics({
        devEui,
        aggregation: config.value.aggregation,
        startTime: dayjs(date)
          .startOf(config.value.searchDateUnit)
          .toISOString(),
        endTime: dayjs(date).endOf(config.value.searchDateUnit).toISOString(),
      });

      metricsData.value = metrics as Metrics;
    } catch (err: any) {
      Message.error({
        content: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onReportTypeChange = (value: string | number | boolean) => {
    reportType.value = value as string;
    queryTable();
  };
  onMounted(async () => {
    await queryTable();
  });

  // 图表
  const showChart = ref(true);

  const toggleChart = () => {
    showChart.value = !showChart.value;
  };

  const chartOptionList = computed(() => {
    const list: any = [];
    Object.entries(metricsData.value).forEach(
      ([, value]: [string, MetricsPros]) => {
        const { timestamps, name, datasets } = value;
        const data = datasets[0].data.filter((n) => n !== 0);
        const max = Math.max(...data);
        const min = Math.min(...data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        list.push({
          grid: {
            left: '50',
            right: '50',
            top: '40',
            // bottom: '100',
          },
          legend: {
            bottom: 0,
            icon: 'circle',
            textStyle: {
              color: '#4E5969',
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {
                show: true,
                type: ['line', 'bar'],
                title: {
                  line: '切换为折线图',
                  bar: '切换为柱状图',
                },
              },
              restore: { show: true, title: '还原' },
              saveAsImage: { show: true, title: '保存为图片' },
            },
          },
          xAxis: {
            type: 'category',
            data: timestamps.map((n: any) =>
              dayjs(n).format(config.value.chartDateFormat),
            ),
            axisTick: {
              alignWithLabel: true,
            },
            boundaryGap: false,
          },
          yAxis: [
            {
              type: 'value',
              name,
              // alignTicks: true,
              axisLine: {
                show: true,
              },
              scale: true,
              // max: 'dataMax',
              // min: 'dataMin',
            },
          ],
          series: [
            {
              name,
              data: data.map((n) => n.toFixed(2)),
              type: 'line',
              smooth: true,
              showSymbol: false,
              color: '#246EFF',
              symbol: 'circle',
              symbolSize: 10,
              emphasis: {
                focus: 'series',
                itemStyle: {
                  borderWidth: 2,
                  borderColor: '#E0E3FF',
                },
              },
              // markPoint: {
              //   data: [
              //     { type: 'max', name: '最大值' },
              //     { type: 'min', name: '最小值' },
              //   ],
              // },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' },
                  {
                    yAxis: max,
                    name: '最大值',
                    lineStyle: { color: '#FF4D4F' },
                  },
                  {
                    yAxis: min,
                    name: '最小值',
                    lineStyle: { color: '#52C41A' },
                  },
                  {
                    yAxis: avg,
                    name: '平均值',
                    lineStyle: { color: '#FAAD14' },
                  },
                ],
              },
            },
          ],
        });
      },
    );
    return list;
  });
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
  .table-container {
    max-height: 60vh;
  }
</style>

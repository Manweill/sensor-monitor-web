<template>
  <div class="container">
    <a-card class="general-card" title="温湿度日报表">
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
              <a-col :span="8">
                <a-form-item field="name" label="日期">
                  <a-date-picker
                    v-model="searchModel.date"
                    placeholder="请输入日期"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" label="温湿度设备">
                  <a-select
                    v-model="searchModel.deviceId"
                    placeholder="请选择温湿度设备"
                    allow-clear
                  >
                    <a-option
                      v-for="item in deviceList"
                      :key="item.id"
                      :value="item.id"
                      >{{ item.deviceName }}</a-option
                    >
                  </a-select>
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
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="onExportToExcel">
              <template #icon>
                <icon-plus />
              </template>
              导出Excel
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="false"
        :columns="columns"
        :data="tableData"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import {
    DeviceService,
    DeviceTsKvService,
    ListDeviceOutputDto,
  } from '@/services';
  import dayjs from 'dayjs';

  import _ from 'lodash';

  const { loading, setLoading } = useLoading(false);

  // 分页
  const basePagination: Pagination = {
    pageNumber: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  // 搜索
  const generateSearchModel = () => {
    return {
      date: '',
      deviceId: '',
    };
  };
  const searchModel = ref(generateSearchModel());

  // 表格
  const tableData = ref<Record<string, any>[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '时间',
      dataIndex: 'dateHour',
    },
    {
      title: '温度',
      dataIndex: 'temperature',
    },
    {
      title: '湿度',
      dataIndex: 'humidity',
    },
  ]);

  // 查询表格数据
  const queryTable = async () => {
    const { date, deviceId } = searchModel.value;

    if (!date || !deviceId) {
      Message.error({
        content: '请选择日期和温湿度设备',
      });
      return;
    }
    setLoading(true);
    try {
      const result = await DeviceTsKvService.getDeviceTsKvRecordData({
        unPage: true,
        deviceId: deviceId as unknown as number,
        startTime: dayjs(date).startOf('d').toISOString(),
        endTime: dayjs(date).endOf('d').toISOString(),
      });
      // 按照小时聚合数据
      const groups = _.groupBy(
        result.items
          ?.filter((n) => n.key === 'humidity' || n.key === 'temperature')
          .map((n) => ({
            ...n,
            time: dayjs(n.upTime).format('HH:00'),
            upTime: dayjs(n.upTime).toDate().getTime(),
          })),
        'time',
      );

      // 处理整点数据
      tableData.value = Array.from({ length: 24 }, (v, k) => k).map((n) => {
        const dateHour = `${String(n).padStart(2, '0')}:00`;
        const humidityValue = groups[dateHour]
          ?.filter((item) => item.key === 'humidity')
          .sort((a, b) => b.upTime - a.upTime)[0];
        const temperatureValue = groups[dateHour]
          ?.filter((item) => item.key === 'temperature')
          .sort((a, b) => b.upTime - a.upTime)[0];
        return {
          dateHour,
          humidity: humidityValue?.value || '--',
          temperature: temperatureValue?.value || '--',
        };
      });
    } catch (err: any) {
      Message.error({
        content: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 搜索表单按钮事件
  const search = () => {
    pagination.pageNumber = 1;
    queryTable();
  };
  const reset = () => {
    searchModel.value = generateSearchModel();
  };

  const deviceList = ref<ListDeviceOutputDto[]>([]);
  const queryDeviceList = async () => {
    setLoading(true);
    try {
      deviceList.value = await DeviceService.listAll({
        deviceType: 'Temperature_Humidity_Profile',
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  queryDeviceList();

  const onExportToExcel = () => {};
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

<template>
  <div class="container">
    <a-card
      class="general-card"
      :title="`近${minRemainingCalibrationDays}天待检修设备`"
    >
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
                <a-form-item field="name" label="设备名">
                  <a-input
                    v-model="searchModel.deviceName"
                    placeholder="请输入设备名"
                  />
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
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="tableData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #lastCalibrationTime="{ record }">
          {{ dayjs(record.lastCalibrationTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template #nextCalibrationTime="{ record }">
          {{ getNextCalibrationTime(record) }}
        </template>
        <template #calibrationPeriodStatus="{ record }">
          <a-tag :color="getStatusColor(record)">
            {{ getStatusText(record) }}
          </a-tag>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { TableColumnData, Message } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import {
    DeviceAreaService,
    DeviceDto,
    DeviceListDto,
  } from '@/services/sensor-core';
  import dayjs from 'dayjs';

  const { loading, setLoading } = useLoading(false);
  const minRemainingCalibrationDays: number = 30;

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
      deviceName: '',
    };
  };
  const searchModel = ref(generateSearchModel());

  // 表格
  const tableData = ref<DeviceDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '待检设备',
      dataIndex: 'name',
    },
    {
      title: '上次检修日期',
      dataIndex: 'lastCalibrationTime',
      slotName: 'lastCalibrationTime',
    },
    {
      title: '下次检修日期',
      dataIndex: 'nextCalibrationTime',
      slotName: 'nextCalibrationTime',
    },
    {
      title: '检修周期(天)',
      dataIndex: 'calibrationPeriod',
      slotName: 'calibrationPeriod',
    },
    {
      title: '当前检修状态',
      dataIndex: 'calibrationPeriodStatus',
      slotName: 'calibrationPeriodStatus',
    },
  ]);

  // 获取下次检修时间
  const getNextCalibrationTime = (record: any): string => {
    const nextDate = dayjs(record.lastCalibrationTime).add(
      record.calibrationPeriod,
      'day',
    );
    return nextDate.format('YYYY-MM-DD HH:mm:ss');
  };

  // 设备状态相关
  const getStatusColor = (record: any): string => {
    const nextDate = dayjs(record.lastCalibrationTime).add(
      record.calibrationPeriod,
      'day',
    );
    const diffDays = nextDate.diff(dayjs(), 'day');
    if (nextDate.isBefore()) {
      return 'red';
    }
    return diffDays <= minRemainingCalibrationDays ? 'orange' : 'green';
  };

  // 获取状态文本
  const getStatusText = (record: any): string => {
    const nextDate = dayjs(record.lastCalibrationTime).add(
      record.calibrationPeriod,
      'day',
    );
    const diffDays = nextDate.diff(dayjs(), 'day');
    if (nextDate.isBefore()) {
      return '已过期';
    }
    return diffDays <= minRemainingCalibrationDays ? '即将到期' : '正常';
  };

  // 查询表格数据
  const queryTable = async () => {
    setLoading(true);
    try {
      const { items } = await DeviceAreaService.getDeviceListByArea({
        unPage: true,
        ...searchModel.value,
      });

      if (!items?.length) {
        tableData.value = [];
        Message.info('暂无数据');
        return;
      }

      tableData.value = (items as DeviceListDto[])
        .map((item) => ({
          ...item,
          lastCalibrationTime: item.producerConfigInfo?.lastCalibrationTime,
          calibrationPeriod: item.producerConfigInfo?.calibrationPeriod,
        }))
        .filter((item) => {
          if (!item.lastCalibrationTime || !item.calibrationPeriod) {
            return false;
          }
          const checkDate = dayjs(item.lastCalibrationTime).add(
            item.calibrationPeriod - minRemainingCalibrationDays,
            'day',
          );
          return checkDate.isBefore(dayjs());
        });
    } catch (err) {
      Message.error('获取设备列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 分页
  const onPageChange = (pageNumber: number) => {
    pagination.pageNumber = pageNumber;
    queryTable();
  };

  // 搜索表单按钮事件
  const search = () => {
    pagination.pageNumber = 1;
    queryTable();
  };
  const reset = () => {
    searchModel.value = generateSearchModel();
  };
  // 初始化
  queryTable();
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

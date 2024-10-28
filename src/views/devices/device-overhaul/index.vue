<template>
  <div class="container">
    <a-card class="general-card" title="待检修设备报表">
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
        <template #online="{ record }">
          <span v-if="!record.online" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.online ? '在线' : '离线' }}
        </template>
        <template #lastCalibrationTime="{ record }">
          {{ dayjs(record.lastCalibrationTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template #nextCalibrationTime="{ record }">
          {{
            dayjs(record.lastCalibrationTime)
              .add(record.calibrationPeriod, 'day')
              .format('YYYY-MM-DD HH:mm:ss') +
            `（剩余${durationWithTime(
              dayjs(record.lastCalibrationTime).add(
                record.calibrationPeriod,
                'day',
              ),
            )}）`
          }}
        </template>
        <template #calibrationPeriodStatus="{ record }">
          <span
            v-if="
              dayjs(record.lastCalibrationTime)
                .add(record.calibrationPeriod)
                .isBefore()
            "
            style="color: green"
            >正常</span
          >
          <span v-else style="color: red">已过期</span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import {
    DeviceAreaService,
    DeviceDto,
    DeviceListDto,
  } from '@/services/sensor-core';
  import dayjs from 'dayjs';
  import { durationWithTime } from '@/utils/dayjs-utils';

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
      deviceName: '',
    };
  };
  const searchModel = ref(generateSearchModel());

  // 表格
  const tableData = ref<DeviceDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备描述',
      dataIndex: 'description',
    },
    // {
    //   title: '设备类型',
    //   dataIndex: 'deviceProfileName',
    // },
    // {
    //   title: 'EUI',
    //   dataIndex: 'devEui',
    // },
    {
      title: '状态',
      dataIndex: 'online',
      slotName: 'online',
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
      title: '检修周期',
      dataIndex: 'calibrationPeriod',
      slotName: 'calibrationPeriod',
    },
    {
      title: '检修状态',
      dataIndex: 'calibrationPeriodStatus',
      slotName: 'calibrationPeriodStatus',
    },
    // {
    //   title: '操作',
    //   slotName: 'operations',
    // },
  ]);

  // 查询表格数据
  const queryTable = async () => {
    setLoading(true);
    try {
      const { items } = await DeviceAreaService.getDeviceListByArea({
        unPage: true,
        deviceName: searchModel.value.deviceName,
      });
      tableData.value = (items as DeviceListDto[])
        .map((item) => ({
          ...item,
          lastCalibrationTime: item.producerConfigInfo?.lastCalibrationTime,
          calibrationPeriod: item.producerConfigInfo?.calibrationPeriod,
        }))
        .filter(
          (item) =>
            item.lastCalibrationTime &&
            item.calibrationPeriod &&
            dayjs(item.lastCalibrationTime)
              .add(Number(item.calibrationPeriod - 30), 'd')
              .isBefore(),
        );
    } catch (err) {
      console.error('获取设备列表失败:', err);
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

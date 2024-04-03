<template>
  <div class="container">
    <a-card class="general-card" title="设备数据明细">
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
              <a-col :span="12">
                <a-form-item field="key" label="时间范围">
                  <a-range-picker
                    v-model="searchModel.searchTime"
                    style="width: 100%"
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
      <a-row :gutter="8">
        <a-col :flex="4" class="card-area-tree">
          <a-card title="设备区域" :bordered="false">
            <device-area-tree
              ref="deviceAreaTreeRef"
              :append-device="true"
              @on-select-change="handleSelect"
            ></device-area-tree>
          </a-card>
        </a-col>
        <a-col flex="8" style="text-align: right">
          <a-table
            row-key="id"
            :loading="loading"
            :pagination="pagination"
            :columns="columns"
            :data="tableData"
            :bordered="false"
            @page-change="onPageChange"
          >
            <template #date="{ record }">
              {{ dayjs(record.date).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import {
    DeviceMetricRecordResponseItemDto,
    DeviceService,
  } from '@/services/sensor-core';
  import dayjs from 'dayjs';
  import DeviceAreaTree from '@/components/tree/device-area-tree/index.vue';
  import { Message } from '@arco-design/web-vue';

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
      searchTime: [Date.now(), Date.now()],
    };
  };
  const searchModel = ref(generateSearchModel());

  const currentDeviceEui = ref('');
  const metricsData = ref<DeviceMetricRecordResponseItemDto[]>([]);

  const columns = computed(() => {
    const cols = [
      {
        title: '时间',
        dataIndex: 'date',
        slotName: 'date',
      },
    ];

    metricsData.value[0]?.telemetries?.forEach((n) => {
      cols.push({
        title: n.fileName as string,
        dataIndex: n.key as string,
        slotName: n.key as string,
      });
    });
    // Object.entries(metricsData.value).forEach(([key, value]: [string, any]) => {
    //   cols.push({
    //     title: value.name,
    //     dataIndex: key as string,
    //     slotName: key as string,
    //   });
    // });
    return cols;
  });

  const tableData = computed(() => {
    const table: any[] = [];

    metricsData.value.forEach((n) => {
      const data: { [key: string]: any } = {
        date: n.upTime,
      };
      n.telemetries?.forEach((item) => {
        data[item.key as string] = `${item.value}`;
      });
      table.push(data);
    });

    // Object.entries(metricsData.value).forEach(([key, value]: [string, any]) => {
    //   value.timestamps.forEach((n: any, index: number) => {
    //     const findIndex = table.findIndex((t) => t.date === n);
    //     if (findIndex >= 0) {
    //       table[findIndex][key] = Number.parseFloat(
    //         value.datasets[0].data[index],
    //       ).toFixed(2);
    //     } else {
    //       table.push({
    //         date: n,
    //         [key]: Number.parseFloat(value.datasets[0].data[index]).toFixed(2),
    //       });
    //     }
    //   });
    // });

    return table;
  });

  // 查询表格数据
  const queryTable = async () => {
    setLoading(true);
    const [startTime, endTime] = searchModel.value.searchTime;

    try {
      const { items, totalCount } = await DeviceService.getDeviceMetricRecords({
        ...pagination,
        deviceEui: currentDeviceEui.value,
        startTime: dayjs(startTime).startOf('d').toDate(),
        endTime: dayjs(endTime).endOf('d').toDate(),
      });
      metricsData.value = (items as DeviceMetricRecordResponseItemDto[]) || [];
      pagination.total = totalCount;
    } catch (err) {
      // you can report use errorHandler or other
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
  const handleSelect = async ({ data }: any) => {
    if (data?.raw?.isDevice === true) {
      currentDeviceEui.value = data.raw.raw.devEui;
      queryTable();
    } else {
      Message.error('请选择设备');
    }
  };

  // 初始化
  // queryTable('1742374020046667777');
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
  .card-area-tree :deep(.arco-card-header) {
    border: none;
    background-color: var(--color-neutral-2);
    padding: 2px 16px;
    height: 40px;
  }
</style>

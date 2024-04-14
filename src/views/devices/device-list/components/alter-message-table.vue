<template>
  <div>
    <a-row>
      <!--       搜索表单       -->
      <a-col :flex="1">
        <a-form :model="searchModel" label-align="left">
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
    <a-table
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      :columns="columns"
      :data="tableData"
      :bordered="false"
      @page-change="onPageChange"
    >
      <template #alertTime="{ record }">
        {{
          record.alertTime
            ? dayjs(record.alertTime).format('YYYY-MM-DD HH:mm:ss')
            : '--'
        }}
      </template>

      <template #resolvedTime="{ record }">
        {{
          record.resolvedTime
            ? dayjs(record.resolvedTime).format('YYYY-MM-DD HH:mm:ss')
            : '--'
        }}
      </template>

      <template #resolved="{ record }">
        <span v-if="record.resolved" class="circle pass"></span>
        <span v-else class="circle"></span>
        {{ record.resolved ? '已消除' : '未消除' }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { computed, PropType, reactive, ref } from 'vue';
  import {
    AlertMessageListDto,
    AlertMessageService,
    DeviceLatestMetricDataDto,
  } from '@/services/sensor-core';
  import { TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';

  const props = defineProps({
    deviceEui: {
      type: String,
      default: '',
    },
    filedList: {
      type: Array as PropType<DeviceLatestMetricDataDto[]>,
      default() {
        return [];
      },
    },
  });

  // 搜索
  const generateSearchModel = () => {
    return {
      searchTime: [Date.now(), Date.now()],
      deviceEui: props.deviceEui,
    };
  };

  const searchModel = ref(generateSearchModel());

  const { loading, setLoading } = useLoading(false);

  // 表格
  const tableData = ref<AlertMessageListDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '告警等级',
      dataIndex: 'alertLevelStrName',
    },
    {
      title: '告警标题',
      dataIndex: 'alertTitle',
    },
    {
      title: '告警消息',
      dataIndex: 'alertMessage',
    },
    {
      title: '告警值',
      dataIndex: 'value',
    },
    {
      title: '告警时间',
      dataIndex: 'alertTime',
      slotName: 'alertTime',
    },
    {
      title: '已消除',
      dataIndex: 'resolved',
      slotName: 'resolved',
    },
    {
      title: '消除时间',
      dataIndex: 'resolvedTime',
      slotName: 'resolvedTime',
    },
  ]);

  // 分页
  const basePagination: Pagination = {
    pageNumber: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  // 查询表格数据
  const queryTable = async () => {
    setLoading(true);
    try {
      const [startTime, endTime] = searchModel.value.searchTime;
      const { items, totalCount } =
        await AlertMessageService.getAlertMessageList({
          ...pagination,
          ...searchModel.value,
          startTime: dayjs(startTime).startOf('d').toDate(),
          endTime: dayjs(endTime).endOf('d').toDate(),
        });
      tableData.value = items as AlertMessageListDto[];
      pagination.total = totalCount as unknown as number;
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

  // 初始化
  queryTable();
</script>

<style scoped lang="less"></style>

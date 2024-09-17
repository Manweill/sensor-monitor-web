<template>
  <a-card
    class="general-card"
    title="今日告警记录"
    :header-style="{ paddingBottom: '12px' }"
  >
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
        {{ dayjs(record.alertTime).format('YYYY-MM-DD HH:mm:ss') }}
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
  </a-card>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import {
    AlertMessageListDto,
    AlertMessageService,
  } from '@/services/sensor-core';
  import { TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';

  const { loading, setLoading } = useLoading(false);

  const tableData = ref<AlertMessageListDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '等级',
      dataIndex: 'alertLevelStrName',
    },
    {
      title: '标题',
      dataIndex: 'alertTitle',
    },
    {
      title: '消息',
      dataIndex: 'alertMessage',
    },
    {
      title: '告警值',
      dataIndex: 'value',
    },
    {
      title: '时间',
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

  const pagination = reactive<Pagination>({
    pageNumber: 1,
    pageSize: 10,
  });

  const queryTable = async () => {
    setLoading(true);
    try {
      const startTime = dayjs().startOf('day').toDate();
      const endTime = dayjs().endOf('day').toDate();
      const { items, totalCount } =
        await AlertMessageService.getAlertMessageList({
          ...pagination,
          startTime,
          endTime,
        });
      tableData.value = items as AlertMessageListDto[];
      pagination.total = totalCount as number;
    } catch (err) {
      // 错误处理
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (pageNumber: number) => {
    pagination.pageNumber = pageNumber;
    queryTable();
  };

  onMounted(() => {
    queryTable();
  });
</script>

<style scoped lang="less">
  .circle {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgb(var(--red-6));
    margin-right: 4px;
  }
  .pass {
    background-color: rgb(var(--green-6));
  }
</style>

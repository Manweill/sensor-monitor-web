<template>
  <div class="container">
    <a-card class="general-card" title="设备告警">
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
              <a-col :span="12">
                <a-form-item field="name" label="设备">
                  <a-select
                    v-model="searchModel.deviceEui"
                    placeholder="请选择设备"
                    allow-clear
                  >
                    <a-option
                      v-for="item in deviceList"
                      :key="item.id"
                      :value="item.devEui"
                      >{{ item.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="name" label="是否已消除">
                  <a-select v-model="searchModel.resolved">
                    <a-option :value="true">已消除</a-option>
                    <a-option :value="false">未消除</a-option>
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

        <template #operations="{ record }">
          <template v-if="!record.resolved">
            <a-popconfirm content="确认手动消除?" @ok="onResolve(record)">
              <a-button type="text" status="danger" size="small">
                消除
              </a-button>
            </a-popconfirm>
          </template>
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
  import dayjs from 'dayjs';
  import {
    AlertMessageListDto,
    AlertMessageService,
    DeviceListDto,
    DeviceService,
  } from '@/services/sensor-core';

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
      resolved: false,
      deviceEui: '',
    };
  };
  const searchModel = ref(generateSearchModel());

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
      title: '描述',
      dataIndex: 'description',
    },

    {
      title: '设备ID',
      dataIndex: 'deviceEUI',
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
    {
      title: '操作',
      slotName: 'operations',
    },
  ]);

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

  const deviceList = ref<DeviceListDto[]>([]);
  const queryDeviceList = async () => {
    setLoading(true);
    try {
      const { items } = await DeviceService.listAll({ unPage: true });
      deviceList.value = items as DeviceListDto[];
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  queryDeviceList();

  // 消除
  const onResolve = async (record: any) => {
    await AlertMessageService.resolveAlertMessage({
      messageId: record.id,
    });
    queryTable();
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

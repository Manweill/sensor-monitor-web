<template>
  <div class="container">
    <a-card class="general-card" title="系统日志">
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
                <a-form-item field="startDate" label="开始时间">
                  <a-date-picker
                    v-model="searchModel.startDate"
                    placeholder="请输入开始时间"
                    :disabled-date="
                      (current) => dayjs(current).isAfter(dayjs())
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="endDate" label="结束时间">
                  <a-date-picker
                    v-model="searchModel.endDate"
                    placeholder="请输入结束时间"
                    :disabled-date="
                      (current) => dayjs(current).isAfter(dayjs())
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="hasException" label="是否异常">
                  <a-select v-model="searchModel.hasException">
                    <a-option :value="true">有异常</a-option>
                    <a-option :value="false">无异常</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="methodName" label="方法名">
                  <a-input
                    v-model="searchModel.methodName"
                    placeholder="请输入方法名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="serviceName" label="服务名">
                  <a-input
                    v-model="searchModel.serviceName"
                    placeholder="请输入服务名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="userName" label="用户名">
                  <a-input
                    v-model="searchModel.userName"
                    placeholder="请输入用户名"
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
        <template #executionTime="{ record }">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="onView(record)">
            查看
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import { AuditLogListDto, AuditLogService } from '@/services';
  import dayjs from 'dayjs';

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
      // 开始日期
      startDate: dayjs().subtract(7, 'day').toDate(),
      // 结束日期
      endDate: dayjs().toDate(),
      // 是否有异常
      hasException: false,
      // 方法名称
      methodName: '',
      // 服务名称
      serviceName: '',
      // 用户名称
      userName: '',
    };
  };
  const searchModel = ref(generateSearchModel());

  // 表格
  const tableData = ref<AuditLogListDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '时间',
      dataIndex: 'executionTime',
      slotName: 'executionTime',
      width: 180,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '服务',
      dataIndex: 'serviceName',
      ellipsis: true,
      width: 120,
      tooltip: { position: 'left' },
    },
    {
      title: '操作',
      dataIndex: 'methodName',
    },
    {
      title: '耗时（ms）',
      dataIndex: 'executionDuration',
    },
    {
      title: 'IP地址',
      dataIndex: 'clientIpAddress',
    },
    {
      title: '浏览器',
      dataIndex: 'browserInfo',
      ellipsis: true,
      width: 150,
      tooltip: { position: 'left' },
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
      const { items, totalCount } = await AuditLogService.getAuditLogs({
        ...pagination,
        ...searchModel.value,
        startDate: searchModel.value.startDate
          ? dayjs(searchModel.value.startDate)
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
        endDate: searchModel.value.endDate
          ? dayjs(searchModel.value.endDate)
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
      });
      tableData.value = items as AuditLogListDto[];
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

  // 初始化
  queryTable();
  const onView = (record: AuditLogListDto) => {
    console.log(record);
  };
</script>

<style scoped lang="less"></style>

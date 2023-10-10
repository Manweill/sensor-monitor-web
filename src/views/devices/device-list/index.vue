<template>
  <div class="container">
    <a-card class="general-card" title="设备列表">
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
      <!--      <a-row style="margin-bottom: 16px">-->
      <!--        <a-col :span="12">-->
      <!--          <a-space>-->
      <!--            <a-button type="primary" @click="onAdd">-->
      <!--              <template #icon>-->
      <!--                <icon-plus />-->
      <!--              </template>-->
      <!--              新增-->
      <!--            </a-button>-->
      <!--          </a-space>-->
      <!--        </a-col>-->
      <!--      </a-row>-->
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="tableData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #enabled="{ record }">
          <span v-if="!record.enabled" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.enabled ? '在线' : '离线' }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="onView(record)">
            查看
          </a-button>
          <a-popconfirm content="确认删除?" @ok="onDel(record)">
            <a-button type="text" status="danger" size="small"> 删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import { DeviceService, ListDeviceOutputDto } from '@/services';
  import { useRouter } from 'vue-router';

  const router = useRouter();

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
  const tableData = ref<ListDeviceOutputDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceTypeDisplayName',
    },
    {
      title: '设备描述',
      dataIndex: 'description',
    },
    {
      title: 'EUI',
      dataIndex: 'devEui',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      slotName: 'enabled',
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
      const list = await DeviceService.listAll({
        ...pagination,
        ...searchModel.value,
      });
      tableData.value = list;
      // pagination.total = data.totalCount;
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

  // crud
  // const modelVisible = ref(false);
  // const isEdit = ref(false);
  //
  // const formRef = ref();
  // const generateFormData = () => {
  //   return {
  //     name: '',
  //     userNo: '',
  //     userName: '',
  //     pwd: '',
  //     phone: '',
  //     email: '',
  //   };
  // };
  // const onEdit = (record: any) => {
  //   isEdit.value = true;
  //   modelVisible.value = true;
  //   formData.value = { ...record };
  // };
  const onDel = async (record: any) => {
    await DeviceService.deleteById({ id: record.id });
    queryTable();
  };

  const onView = (record: any) => {
    router.push({ name: 'DeviceDetail', query: { id: record.id } });
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

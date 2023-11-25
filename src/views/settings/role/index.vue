<template>
  <div class="container">
    <a-card class="general-card" title="角色管理">
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
                <a-form-item field="name" label="关键字">
                  <a-input
                    v-model="searchModel.filter"
                    placeholder="请输入关键字"
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
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="onAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="tableData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="onEdit(record)">
            修改
          </a-button>
          <a-popconfirm content="确认删除?" @ok="onDel(record)">
            <a-button type="text" status="danger" size="small"> 删除 </a-button>
          </a-popconfirm>
          <a-button type="text" size="small" @click="onEditAuth(record)">
            权限
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="modelVisible" title="角色管理" @before-ok="onOk">
      <a-form ref="formRef" :model="formData">
        <a-form-item
          field="code"
          label="编码"
          :rules="[{ required: true, message: '编码不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.code" />
        </a-form-item>
        <a-form-item
          field="name"
          label="名称"
          :rules="[{ required: true, message: '名称不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import { delUser, getUserList, saveUser } from '@/api/user';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';

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
      filter: '',
    };
  };
  const searchModel = ref(generateSearchModel());

  // 表格
  const tableData = ref([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
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
      const { data } = await getUserList({
        ...pagination,
        ...searchModel.value,
      });
      tableData.value = data.items;
      pagination.total = data.totalCount;
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
  const modelVisible = ref(false);
  const isEdit = ref(false);

  const formRef = ref();
  const generateFormData = () => {
    return {
      code: '',
      name: '',
    };
  };
  const formData = ref(generateFormData());

  const onAdd = () => {
    isEdit.value = false;
    modelVisible.value = true;
    formData.value = generateFormData();
  };
  const onEdit = (record: any) => {
    isEdit.value = true;
    modelVisible.value = true;
    formData.value = { ...record };
  };
  const onDel = async (record: any) => {
    await delUser(record.id);
    queryTable();
  };
  const onOk = async () => {
    const errors: Record<string, ValidatedError> | undefined =
      await formRef.value.validate();
    if (!errors) {
      await saveUser(formData.value);
      queryTable();
      return true;
    }
    return false;
  };
  const onEditAuth = (record: any) => {};
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

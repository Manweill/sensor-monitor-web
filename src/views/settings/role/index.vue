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
                <a-form-item field="name" label="角色名">
                  <a-input
                    v-model="searchModel.filter"
                    placeholder="请输入角色名"
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
        <template #roleName="{ record }">
          {{ record.roleName }}
          <a-tag v-if="record.default" size="small" color="green">
            <template #icon>
              <icon-check-circle-fill />
            </template>
            <span>默认</span>
          </a-tag>
        </template>
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
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
          field="roleCode"
          label="编码"
          :rules="[{ required: true, message: '编码不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.roleCode" />
        </a-form-item>
        <a-form-item
          field="roleName"
          label="名称"
          :rules="[{ required: true, message: '名称不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.roleName" />
        </a-form-item>
        <a-form-item field="default" label="默认角色">
          <a-switch v-model="formData.default" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="authModelVisible"
      title="权限配置"
      :mask-closable="false"
      :fullscreen="true"
      @before-ok="onAuthOk"
    >
      <div>
        <a-typography-text>节点联动</a-typography-text>
        <a-switch v-model="isStrictly" style="margin-left: 12px" />
      </div>
      <a-tree
        v-model:checked-keys="checkedKeys"
        v-model:expanded-keys="expandedKeys"
        :data="treeData"
        :check-strictly="!isStrictly"
        :checkable="true"
        :show-line="true"
        :default-expand-all="true"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { RoleDto, RolePermissionDto, RoleService } from '@/services';
  import dayjs from 'dayjs';
  import { convertToTree } from '@/utils/convert';

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
  const tableData = ref<RoleDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '编码',
      dataIndex: 'roleCode',
    },
    {
      title: '名称',
      dataIndex: 'roleName',
      slotName: 'roleName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      slotName: 'createTime',
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
      const { items, totalCount } = await RoleService.getRoles({
        ...pagination,
        ...searchModel.value,
      });
      tableData.value = items as RoleDto[];
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

  // crud
  const modelVisible = ref(false);
  const isEdit = ref(false);

  const formRef = ref();
  const generateFormData = () => {
    return {
      roleCode: '',
      roleName: '',
      default: false,
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
    await RoleService.deleteRole({ id: record.id });
    queryTable();
  };
  const onOk = async () => {
    const errors: Record<string, ValidatedError> | undefined =
      await formRef.value.validate();
    if (!errors) {
      await RoleService.createOrUpdateRole({ input: formData.value });
      queryTable();
      return true;
    }
    return false;
  };

  const authModelVisible = ref(false);
  const checkedKeys = ref<string[]>([]);
  const expandedKeys = ref<string[]>([]);
  const treeData = ref<any[]>([]);
  const roleId = ref<string>('');
  const isStrictly = ref(false);
  const onEditAuth = async (record: any) => {
    authModelVisible.value = true;
    const { permissionList } = (await RoleService.getRoleDetails({
      id: record.id,
    })) as { permissionList: RolePermissionDto[] };

    roleId.value = record.id;
    expandedKeys.value = permissionList.map((item) => item.name) as [string];
    checkedKeys.value = permissionList
      .filter((item) => item.granted === true)
      .map((item) => item.name) as [string];

    treeData.value = convertToTree(
      permissionList.map((item) => ({
        ...item,
        title: item.displayName,
        key: item.name,
      })) as any[],
      'parentName',
      'name',
      'children',
    );
  };
  const onAuthOk = async () => {
    await RoleService.updateRolePermission({
      input: {
        id: roleId.value as unknown as number,
        permissions: checkedKeys.value.map((item) => ({ name: item })),
      },
    });
    authModelVisible.value = false;
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

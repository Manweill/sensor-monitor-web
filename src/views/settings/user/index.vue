<template>
  <div class="container">
    <a-card class="general-card" title="用户管理">
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
        <template #name="{ record }">
          {{ record.name }}
          <a-tag v-if="record.admin" size="small" color="green">
            <template #icon>
              <icon-check-circle-fill />
            </template>
            <span>管理账户</span>
          </a-tag>
        </template>
        <template #active="{ record }">
          <span v-if="!record.active" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.active ? '已激活' : '未激活' }}
        </template>
        <template #lock="{ record }">
          <span v-if="record.lock" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.lock ? '已锁定' : '未锁定' }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="onEdit(record)">
            修改
          </a-button>
          <a-button type="text" size="small" @click="onChangePassword(record)">
            重置密码
          </a-button>
          <a-popconfirm content="确认解锁用户?" @ok="onUnlockUser(record)">
            <a-button type="text" size="small"> 解锁用户 </a-button>
          </a-popconfirm>
          <a-popconfirm content="确认删除?" @ok="onDel(record)">
            <a-button type="text" status="danger" size="small"> 删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="modelVisible" title="用户管理" @before-ok="onOk">
      <a-form ref="formRef" :model="formData">
        <a-form-item
          field="name"
          label="姓名"
          :rules="[{ required: true, message: '姓名不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.name" />
        </a-form-item>
        <a-form-item
          field="userName"
          label="用户名"
          :rules="[{ required: true, message: '用户名不能为空' }]"
          :validate-trigger="['change', 'blur']"
          :disabled="isEdit"
        >
          <a-input v-model="formData.userName" />
        </a-form-item>
        <a-form-item
          v-if="!isEdit"
          field="password"
          label="密码"
          :rules="[{ required: true, message: '密码不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.password" />
        </a-form-item>
        <a-form-item field="active" label="是否激活">
          <a-switch v-model="formData.active" />
        </a-form-item>
        <a-form-item
          field="phoneNo"
          label="手机号"
          :rules="[
            {
              match:
                /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3]))\d{8}$/,
              message: '请输入正确的手机号',
            },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.phoneNo" />
        </a-form-item>
        <a-form-item
          field="emailAddress"
          label="email"
          :rules="[{ type: 'email', message: '请输入正确的email' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="formData.emailAddress" />
        </a-form-item>
        <a-form-item field="assignedRoleIds" label="角色">
          <a-select
            v-model="formData.assignedRoleIds"
            :allow-clear="true"
            :multiple="true"
            :allow-search="true"
          >
            <a-option
              v-for="roles in allRoles"
              :key="roles.id"
              :value="roles.id"
              >{{ roles.roleName }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="changePasswordVisible"
      title="修改密码"
      @before-ok="onChangePasswordOk"
    >
      <a-form ref="changePasswordFormRef" :model="changePasswordFormData">
        <a-form-item
          field="newPwd"
          label="密码"
          :rules="[{ required: true, message: '密码不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="changePasswordFormData.newPwd" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { FormInstance, Message, TableColumnData } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import {
    RoleDto,
    RoleService,
    UserListDto,
    UserService,
  } from '@/services/auth';

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
  const tableData = ref<UserListDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '姓名',
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNo',
    },
    {
      title: 'email',
      dataIndex: 'emailAddress',
    },
    {
      title: '是否激活',
      dataIndex: 'active',
      slotName: 'active',
    },
    {
      title: '是否锁定',
      dataIndex: 'lock',
      slotName: 'lock',
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
      const { items, totalCount } = await UserService.getUsers({
        ...pagination,
        ...searchModel.value,
      });
      tableData.value = items as UserListDto[];
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

  const allRoles = ref<RoleDto[]>([]);
  const getAllRoles = async () => {
    const list = await RoleService.getAllRoles();
    allRoles.value = list;
  };
  getAllRoles();

  // crud
  const modelVisible = ref(false);
  const isEdit = ref(false);

  const formRef = ref();
  const generateFormData = () => {
    return {
      name: '',
      userName: '',
      password: '',
      phoneNo: '',
      workNumber: '',
      emailAddress: '',
      active: true,
      assignedRoleIds: [],
    };
  };
  const formData = ref(generateFormData());

  // 新增
  const onAdd = () => {
    isEdit.value = false;
    modelVisible.value = true;
    formData.value = generateFormData();
  };
  // 修改
  const onEdit = (record: any) => {
    isEdit.value = true;
    modelVisible.value = true;
    formData.value = {
      ...record,
      assignedRoleIds: record.userRoles.map((n: RoleDto) => n.id),
    };
  };
  // 删除
  const onDel = async (record: any) => {
    await UserService.deleteUser({ entityDto: { id: record.id } });
    queryTable();
  };
  // 保存
  const onOk = async () => {
    const errors: Record<string, ValidatedError> | undefined =
      await formRef.value.validate();
    if (!errors) {
      await UserService.createOrUpdateUser({
        createOrUpdateUserInput: {
          user: formData.value,
          assignedRoleIds: formData.value.assignedRoleIds,
        },
      });
      queryTable();
      return true;
    }
    return false;
  };

  // 解锁
  const onUnlockUser = (record: any) => {
    UserService.unlockUser({ entityDto: { id: record.id } });
    Message.success('解锁成功');
  };

  const changePasswordVisible = ref(false);
  const changePasswordFormRef = ref<FormInstance>();
  const changePasswordFormData = ref({
    userId: '',
    newPwd: '',
  });

  // 重置密码
  const onChangePassword = (record: any) => {
    changePasswordFormRef.value?.resetFields();
    changePasswordFormRef.value?.clearValidate();
    changePasswordFormData.value.userId = record.id;

    changePasswordVisible.value = true;
  };
  const onChangePasswordOk = async () => {
    await UserService.listChangePwd({
      input: { ...changePasswordFormData.value } as any,
    });
    Message.success('修改密码成功');
    changePasswordVisible.value = false;
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

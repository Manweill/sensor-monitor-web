<template>
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
    :columns="columns"
    :data="tableData"
    :bordered="false"
  >
    <template #type="{ record }">
      {{ getFiledTypeString(record.type) }}
    </template>
    <template #dataType="{ record }">
      {{ getDataTypeString(record.dataType) }}
    </template>
    <template #operations="{ record }">
      <a-button type="text" size="small" @click="onEdit(record)">
        修改
      </a-button>
      <a-popconfirm content="确认删除?" @ok="onDel(record)">
        <a-button type="text" status="danger" size="small"> 删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="modelVisible" title="属性管理" @before-ok="onOk">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-form-item
        field="key"
        label="属性标识"
        :rules="[{ required: true, message: '属性标识不能为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="formData.key" />
      </a-form-item>
      <a-form-item
        field="fieldName"
        label="名称"
        :rules="[{ required: true, message: '名称不能为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="formData.fieldName" />
      </a-form-item>
      <a-form-item field="type" label="类型">
        <a-select v-model="formData.type">
          <a-option
            v-for="(value, key) in FieldTypeEnum"
            :key="key"
            :value="key"
            >{{ value }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="dataType" label="数据类型">
        <a-select v-model="formData.dataType">
          <a-option v-for="(value, key) in DataType" :key="key" :value="key"
            >{{ value }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="unit" label="单位">
        <a-input v-model="formData.unit" />
      </a-form-item>
      <a-form-item field="precision" label="精度">
        <a-input-number v-model="formData.precision" />
      </a-form-item>
      <a-form-item field="commandValue" label="遥控命令">
        <a-input v-model="formData.commandValue" />
      </a-form-item>
      <a-form-item field="commandValue" label="配置">
        <a-input v-model="formData.config" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import useLoading from '@/hooks/loading';
  import { onMounted, ref } from 'vue';
  import {
    DeviceTypeFieldDto,
    DeviceTypeFieldService,
    EnumDeviceTypeFieldDtoDataType,
    EnumDeviceTypeFieldDtoType,
  } from '@/services/sensor-core';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';

  const props = defineProps({
    profileId: {
      type: String,
      default: '',
    },
  });

  const DataType = {
    [EnumDeviceTypeFieldDtoDataType.STRING]: '字符串',
    [EnumDeviceTypeFieldDtoDataType.BOOLEAN]: '布尔',
    [EnumDeviceTypeFieldDtoDataType.DOUBLE]: '浮点',
    [EnumDeviceTypeFieldDtoDataType.LONG]: '整形',
  };

  const getDataTypeString = (type: EnumDeviceTypeFieldDtoDataType) => {
    return DataType[type];
  };

  const FieldTypeEnum = {
    [EnumDeviceTypeFieldDtoType.ONLY_READ]: '只读',
    [EnumDeviceTypeFieldDtoType.ONLY_WRITE]: '只写',
    [EnumDeviceTypeFieldDtoType.READ_AND_WRITE]: '读写',
  };

  const getFiledTypeString = (type: EnumDeviceTypeFieldDtoType) => {
    return FieldTypeEnum[type];
  };

  const { loading, setLoading } = useLoading(false);

  const tableData = ref<DeviceTypeFieldDto[]>([]);

  const columns = ref([
    {
      title: '属性编码',
      dataIndex: 'key',
    },
    {
      title: '属性名称',
      dataIndex: 'fieldName',
    },
    {
      title: '属性类型',
      dataIndex: 'type',
      slotName: 'type',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      slotName: 'dataType',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      slotName: 'unit',
    },
    {
      title: '精度',
      dataIndex: 'precision',
      slotName: 'precision',
    },
    {
      title: '遥控命令',
      dataIndex: 'commandValue',
      slotName: 'commandValue',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // crud
  const modelVisible = ref(false);
  const isEdit = ref(false);

  const formRef = ref();
  const generateFormData = () => {
    return {
      commandValue: '',
      config: '',
      dataType: EnumDeviceTypeFieldDtoDataType.DOUBLE,
      fieldName: '',
      key: '',
      precision: 2,
      profileId: props.profileId,
      type: EnumDeviceTypeFieldDtoType.ONLY_READ,
      unit: '',
    };
  };
  const formData = ref<DeviceTypeFieldDto>(generateFormData());

  // 查询表格数据
  const queryTable = async () => {
    setLoading(true);
    try {
      const { items } = await DeviceTypeFieldService.getDeviceTypeList({
        unPage: true,
        profileId: props.profileId,
      });
      tableData.value = items as DeviceTypeFieldDto[];
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 新增
  const onAdd = () => {
    isEdit.value = false;
    modelVisible.value = true;
    formData.value = generateFormData();
  };

  const onOk = async () => {
    const errors: Record<string, ValidatedError> | undefined =
      await formRef.value.validate();
    if (!errors) {
      await DeviceTypeFieldService.saveDeviceType({
        input: { ...formData.value },
      });
      queryTable();
      return true;
    }
    return false;
  };

  const onEdit = async (record: DeviceTypeFieldDto) => {
    isEdit.value = true;
    modelVisible.value = true;
    const result = await DeviceTypeFieldService.getDeviceTypeDetail({
      id: record.id as string,
    });
    formData.value = {
      ...(result as unknown as any),
    };
  };

  const onDel = async (record: DeviceTypeFieldDto) => {
    await DeviceTypeFieldService.removeDeviceType({ id: record.id as string });
    queryTable();
  };

  onMounted(async () => {
    queryTable();
  });
</script>

<style scoped lang="less"></style>

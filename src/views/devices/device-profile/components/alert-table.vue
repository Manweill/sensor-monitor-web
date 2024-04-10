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
    <template #isEnabled="{ record }">
      {{ record.isEnabled ? '启用' : '禁用' }}
    </template>
    <template #alertLevel="{ record }">
      {{ getAlertLevelString(record.alertLevel) }}
    </template>
    <template #comparisonOperator="{ record }">
      {{ getComparisonOperatorString(record.comparisonOperator) }}
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
  <a-modal v-model:visible="modelVisible" title="告警配置" @before-ok="onOk">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-form-item field="isEnabled" label="是否启用">
        <a-switch v-model="formData.isEnabled" />
      </a-form-item>
      <a-form-item
        field="key"
        label="属性标识"
        :rules="[{ required: true, message: '属性标识不能为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-select v-model="formData.key" placeholder="请输入属性标识">
          <a-option
            v-for="item in propsList"
            :key="item.id"
            :value="item.key"
            >{{ item.fieldName }}</a-option
          >
        </a-select>
      </a-form-item>
      <a-form-item field="alertLevel" label="告警等级">
        <a-select v-model="formData.alertLevel">
          <a-option
            v-for="(value, key) in AlertLevel"
            :key="key"
            :value="key"
            >{{ value }}</a-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        field="alertTitle"
        label="告警标题"
        :rules="[{ required: true, message: '标题不能为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="formData.alertTitle" />
      </a-form-item>
      <a-form-item
        field="alertMessage"
        label="告警内容"
        :rules="[{ required: true, message: '内容不能为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="formData.alertMessage" />
      </a-form-item>
      <a-form-item field="comparisonOperator" label="比较符">
        <a-select v-model="formData.comparisonOperator">
          <a-option
            v-for="(value, key) in ComparisonOperator"
            :key="key"
            :value="key"
            >{{ value }}</a-option
          >
        </a-select>
      </a-form-item>
      <template
        v-if="
          formData.comparisonOperator ===
            EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.GREATER_THAN ||
          formData.comparisonOperator ===
            EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.LESS_THAN
        "
        ><a-form-item
          field="threshold"
          label="阈值"
          :rules="[{ required: true, message: '阈值不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input-number v-model="formData.threshold" />
        </a-form-item>
      </template>
      <template v-else>
        <a-form-item
          field="thresholdUpperLimit"
          label="上限"
          :rules="[{ required: true, message: '阈值不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input-number v-model="formData.thresholdUpperLimit" />
        </a-form-item>
        <a-form-item
          field="thresholdLowerLimit"
          label="下限"
          :rules="[{ required: true, message: '阈值不能为空' }]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input-number v-model="formData.thresholdLowerLimit" />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import useLoading from '@/hooks/loading';
  import { onMounted, ref, watch } from 'vue';
  import {
    DeviceAlertRuleConfigDetailDto,
    DeviceAlertRuleConfigListDto,
    DeviceAlertRuleConfigService,
    DeviceTypeFieldDto,
    DeviceTypeFieldService,
    EnumDeviceAlertRuleConfigDetailDtoAlertLevel,
    EnumDeviceAlertRuleConfigDetailDtoAlertType,
    EnumDeviceAlertRuleConfigDetailDtoComparisonOperator,
  } from '@/services/sensor-core';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';

  const props = defineProps({
    profileId: {
      type: String,
      default: '',
    },
    devEui: {
      type: String,
      default: '',
    },
  });

  const AlertLevel = {
    [EnumDeviceAlertRuleConfigDetailDtoAlertLevel.CRIT]: '故障',
    [EnumDeviceAlertRuleConfigDetailDtoAlertLevel.WARN]: '警告',
    [EnumDeviceAlertRuleConfigDetailDtoAlertLevel.INFO]: '消息',
    [EnumDeviceAlertRuleConfigDetailDtoAlertLevel.NORMAL]: '正常',
  };

  const ComparisonOperator = {
    [EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.LESS_THAN]:
      '小于等于',
    [EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.GREATER_THAN]:
      '大于等于',
    [EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.IN_SECTION]:
      '在...区间',
    [EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.NOT_IN_SECTION]:
      '不在...区间',
  };

  const getComparisonOperatorString = (
    comparisonOperator: EnumDeviceAlertRuleConfigDetailDtoComparisonOperator,
  ) => {
    return ComparisonOperator[comparisonOperator];
  };

  const getAlertLevelString = (
    alertLevel: EnumDeviceAlertRuleConfigDetailDtoAlertLevel,
  ) => {
    return AlertLevel[alertLevel];
  };

  const { loading, setLoading } = useLoading(false);

  const tableData = ref<DeviceAlertRuleConfigListDto[]>([]);

  const columns = ref([
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      slotName: 'isEnabled',
    },
    {
      title: '属性标识',
      dataIndex: 'key',
    },
    {
      title: '告警等级',
      dataIndex: 'alertLevel',
      slotName: 'alertLevel',
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
      title: '比较符',
      dataIndex: 'comparisonOperator',
      slotName: 'comparisonOperator',
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
    },
    {
      title: '阈值上限',
      dataIndex: 'thresholdUpperLimit',
    },
    {
      title: '阈值下限',
      dataIndex: 'thresholdLowerLimit',
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
      alertLevel: EnumDeviceAlertRuleConfigDetailDtoAlertLevel.WARN,
      alertMessage: '',
      alertTitle: '',
      alertType: EnumDeviceAlertRuleConfigDetailDtoAlertType.COMMON_DEVICE,
      comparisonOperator:
        EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.LESS_THAN,
      devEui: props.devEui,
      isEnabled: true,
      key: '',
      profileId: props.profileId,
      threshold: 0,
      thresholdLowerLimit: 0,
      thresholdUpperLimit: 0,
    };
  };
  const formData = ref(generateFormData());

  // 当comparisonOperator 为EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.GREATER_THAN 或 EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.LESS_THAN 时，thresholdUpperLimit 和 thresholdLowerLimit 置为undefined
  watch(
    () => formData.value.comparisonOperator,
    (newValue) => {
      if (
        newValue ===
          EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.GREATER_THAN ||
        newValue ===
          EnumDeviceAlertRuleConfigDetailDtoComparisonOperator.LESS_THAN
      ) {
        formData.value.thresholdUpperLimit = 0;
        formData.value.thresholdLowerLimit = 0;
      } else {
        formData.value.threshold = 0;
      }
    },
  );

  // 查询表格数据
  const queryTable = async () => {
    setLoading(true);
    try {
      const { items } =
        await DeviceAlertRuleConfigService.getDeviceAlertRuleConfigList({
          unPage: true,
          profileId: props.profileId,
          devEui: props.devEui,
        });
      tableData.value = items as DeviceAlertRuleConfigListDto[];
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const propsList = ref<DeviceTypeFieldDto[]>([]);

  const queryPropsList = async () => {
    try {
      const { items } = await DeviceTypeFieldService.getDeviceTypeList({
        unPage: true,
        profileId: props.profileId,
      });
      propsList.value = items as DeviceTypeFieldDto[];
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  // 新增
  const onAdd = () => {
    isEdit.value = false;
    modelVisible.value = true;
    queryPropsList();
    formData.value = generateFormData();
  };

  const onOk = async () => {
    const errors: Record<string, ValidatedError> | undefined =
      await formRef.value.validate();
    if (!errors) {
      await DeviceAlertRuleConfigService.saveDeviceAlertRuleConfig({
        input: { ...formData.value },
      });
      queryTable();
      return true;
    }
    return false;
  };

  const onEdit = async (record: DeviceAlertRuleConfigDetailDto) => {
    isEdit.value = true;
    modelVisible.value = true;
    const result = await DeviceAlertRuleConfigService.getDeviceAlertRuleConfig({
      id: record.id as string,
    });
    formData.value = {
      ...(result as unknown as any),
    };
  };

  const onDel = async (record: DeviceAlertRuleConfigDetailDto) => {
    await DeviceAlertRuleConfigService.removeDeviceAlertConfig({
      id: record.id as string,
    });
    queryTable();
  };

  onMounted(async () => {
    queryTable();
  });
</script>

<style scoped lang="less"></style>

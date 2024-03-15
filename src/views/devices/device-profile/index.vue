<template>
  <div class="container">
    <a-card class="general-card" title="设备配置">
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
                <a-form-item field="name" label="名称">
                  <a-input
                    v-model="searchModel.search"
                    placeholder="请输入名称"
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
        :columns="columns"
        :data="tableData"
        :bordered="false"
        :pagination="false"
      >
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="onConfig(record)">
            配置
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="modelVisible"
      fullscreen
      title="设备模板配置"
      @before-ok="onOk"
    >
      <a-space direction="vertical" :size="16" fill>
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="模板属性">
            <a-row style="margin-bottom: 16px">
              <a-col :span="12">
                <a-space>
                  <a-button type="primary" @click="onAddProps">
                    <template #icon>
                      <icon-plus />
                    </template>
                    新增
                  </a-button>
                </a-space>
              </a-col>
            </a-row>

            <a-table :columns="propsColumns" :data="propsTableData">
              <template #filedKey="{ record }">
                <a-input v-model="record.filedKey" />
              </template>
              <template #fileName="{ record }">
                <a-input v-model="record.fileName" />
              </template>
              <template #type="{ record }">
                <a-select v-model="record.type">
                  <a-option value="read"> 读 </a-option>
                  <a-option value="write"> 写 </a-option>
                  <a-option value="readwrite"> 读写 </a-option>
                </a-select>
              </template>
              <template #dataType="{ record }">
                <a-select v-model="record.dataType">
                  <a-option value="float"> 浮点 </a-option>
                  <a-option value="int"> 整数 </a-option>
                  <a-option value="bool"> 布尔 </a-option>
                  <a-option value="string"> 字符串 </a-option>
                </a-select>
              </template>
              <template #unit="{ record }">
                <a-input v-model="record.unit" />
              </template>
              <template #precision="{ record }">
                <a-input v-model="record.precision" />
              </template>
              <template #commandValue="{ record }">
                <a-input v-model="record.commandValue" />
              </template>
              <template #operations="{ record, rowIndex }">
                <a-button
                  type="text"
                  status="danger"
                  size="small"
                  @click="onDelProps(record, rowIndex)"
                >
                  删除
                </a-button>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" title="告警规则">
            <a-space>
              <a-button type="primary" @click="onAdd">
                <template #icon>
                  <icon-plus />
                </template>
                新增行
              </a-button>
            </a-space>
            <a-table
              row-key="id"
              :loading="loading"
              :columns="columns"
              :data="tableData"
              :bordered="false"
              :pagination="false"
            >
            </a-table
          ></a-tab-pane>
        </a-tabs>
      </a-space>

      <a-row style="margin-bottom: 16px"> </a-row>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    ChirpStackDeviceProfileService,
    DeviceProfileDto,
  } from '@/services/sensor-core';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { loading, setLoading } = useLoading(false);

  // 搜索
  const generateSearchModel = () => {
    return {
      search: '',
    };
  };
  const searchModel = ref(generateSearchModel());

  // 表格
  const tableData = ref<DeviceProfileDto[]>([]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '名称',
      dataIndex: 'name',
      slotName: 'name',
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
      const result = await ChirpStackDeviceProfileService.getDeviceProfileList({
        ...searchModel.value,
      });
      tableData.value = result as DeviceProfileDto[];
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 搜索表单按钮事件
  const search = () => {
    queryTable();
  };
  const reset = () => {
    searchModel.value = generateSearchModel();
  };

  // 初始化
  queryTable();

  const modelVisible = ref(false);

  const typeOptions = [
    {
      value: 'read',
      label: '读',
    },
    {
      value: 'write',
      label: '写',
    },
    {
      value: 'readwrite',
      label: '读写',
    },
  ];

  const propsColumns = ref([
    {
      title: '属性编码',
      dataIndex: 'filedKey',
      slotName: 'filedKey',
    },
    {
      title: '属性名称',
      dataIndex: 'fileName',
      slotName: 'fileName',
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

  const propsTableData = ref<any[]>([]);

  const onConfig = (record: any) => {
    router.push({ name: 'DeviceProfileDetail', query: { id: record.id } });
  };

  const onAddProps = () => {
    propsTableData.value.push({
      key: '',
      name: '',
      type: '',
      dataType: '',
      unit: '',
      precision: '',
      commandValue: '',
    });
  };

  const onDelProps = (record: any, rowIndex: number) => {
    propsTableData.value.splice(rowIndex, 1);
  };

  const onConfigAlert = (record) => {};

  const onOk = () => {
    modelVisible.value = false;
    // TODO: 保存配置
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

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

  const onConfig = (record: any) => {
    router.push({ name: 'DeviceProfileDetail', query: { id: record.id } });
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>

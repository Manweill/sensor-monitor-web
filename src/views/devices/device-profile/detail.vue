<template>
  <div class="container">
    <a-space direction="vertical" :size="16" fill>
      <a-card class="general-card" title="设备模板配置">
        <template #extra>
          <a-space>
            <a-button @click="onBack">返回</a-button>
          </a-space>
        </template>
        <a-space>
          <a-descriptions
            :label-style="{
              textAlign: 'right',
              width: '200px',
              paddingRight: '10px',
              color: 'rgb(var(--gray-8))',
            }"
            :column="2"
            :value-style="{ width: '450px' }"
            :data="formFiled"
          >
            <template #label="{ label }">{{ $t(label) }} :</template>
            <template #value="{ value }">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ value || '--' }}</span>
            </template>
          </a-descriptions>
        </a-space>
      </a-card>
      <a-card class="general-card" title="设备模板详情">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="属性配置" style="padding: 20px">
            <props-table :profile-id="id as string" />
          </a-tab-pane>
          <a-tab-pane key="3" title="告警配置" style="padding: 20px">
            <alert-table :profile-id="id as string" />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import {
    ChirpStackDeviceProfileService,
    DeviceProfileDetailDataDto,
  } from '@/services/sensor-core';
  import { computed, onMounted, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import PropsTable from '@/views/devices/device-profile/components/props-table.vue';
  import AlertTable from '@/views/devices/device-profile/components/alert-table.vue';

  const { loading, setLoading } = useLoading(true);
  const router = useRouter();
  const route = useRoute();
  const { id = '' } = route.query;

  const formData = ref<DeviceProfileDetailDataDto>({});

  const formFiled = computed(() => {
    return [
      {
        label: '名称',
        value: formData.value.name || '--',
      },
      {
        label: 'MAC版本',
        value: formData.value.macVersion || '--',
      },

      {
        label: '区域参数修订',
        value: formData.value.regParamsRevision || '--',
      },
      {
        label: '区域',
        value: formData.value.region || '--',
      },
    ];
  });

  const onBack = () => {
    router.back();
  };

  onMounted(async () => {
    if (id) {
      setLoading(true);
      try {
        const { deviceProfile } =
          await ChirpStackDeviceProfileService.getDeviceProfileDetailByProfileId(
            {
              profileId: id as string,
            },
          );
        formData.value = {
          ...deviceProfile,
        };
      } finally {
        setLoading(false);
      }
    }
  });
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>

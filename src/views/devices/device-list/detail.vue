<template>
  <div class="container">
    <a-space direction="vertical" :size="16" fill>
      <a-card class="general-card" title="基础属性">
        <template #extra>
          <a-space>
            <a-button @click="onBack">返回</a-button>
          </a-space>
        </template>
        <a-space>
          <a-image
            width="150px"
            :src="
              deviceTypeImage[formData.deviceProfileName as string] || iotImage
            "
          />
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
      <a-card class="general-card" title="设备详情">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="实时数据" style="padding: 20px">
            <a-table
              row-key="id"
              :loading="loading"
              :columns="filedListColumns"
              :data="latestMetricDataList"
              :bordered="false"
              :pagination="false"
            >
              <template #time="{ record }">
                {{
                  record.time
                    ? dayjs(record.time).format('YYYY-MM-DD HH:mm:ss')
                    : '--'
                }}
              </template>
              <template #operations="{ record }">
                <template v-if="!!record.propConfig">
                  <a-button
                    v-for="config in record.propConfig"
                    :key="config.label"
                    type="primary"
                    size="small"
                    @click="onCommand(record, config)"
                  >
                    <template #icon>
                      <icon-command />
                    </template>
                    {{ config.name }}
                  </a-button>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" title="数据明细" style="padding: 20px">
            <KvTable
              v-if="formData.devEui"
              :device-id="id as string"
              :device-eui="formData.devEui"
              :filed-list="deviceFieldList"
            />
          </a-tab-pane>
          <a-tab-pane key="3" title="告警配置" style="padding: 20px">
            <alert-table
              v-if="formData.devEui"
              :dev-eui="formData.devEui"
              :profile-id="formData.deviceProfileId"
            />
          </a-tab-pane>
          <a-tab-pane key="4" title="告警记录" style="padding: 20px">
            <alert-message-table
              v-if="formData.devEui"
              :device-eui="formData.devEui"
            />
          </a-tab-pane>
          <!--          <a-tab-pane key="5" title="设备配置">-->
          <!--            <a-form-->
          <!--              class="form"-->
          <!--              :label-col-props="{ span: 8 }"-->
          <!--              :wrapper-col-props="{ span: 16 }"-->
          <!--            >-->
          <!--              <a-form-item field="email" label="心跳时间（秒）">-->
          <!--                <a-input-number :model-value="30" />-->
          <!--              </a-form-item>-->
          <!--              <a-form-item field="email" label="离线提醒">-->
          <!--                <a-switch :model-value="true" />-->
          <!--              </a-form-item>-->
          <!--              <a-form-item>-->
          <!--                <a-space>-->
          <!--                  <a-button type="primary"> 更新 </a-button>-->
          <!--                </a-space>-->
          <!--              </a-form-item>-->
          <!--            </a-form>-->
          <!--          </a-tab-pane>-->
        </a-tabs>
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import {
    ChirpStackDeviceService,
    DeviceDetailDto,
    DeviceLatestMetricDataDto,
    DeviceService,
    EnumDeviceFieldDtoType,
  } from '@/services/sensor-core';
  import { computed, onMounted, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import eppImage from '@/assets/images/Environmental_Parameters_Profile.png';
  import hispImage from '@/assets/images/Human_Infrared_Sensor_Profile.png';
  import thpImage from '@/assets/images/Temperature_Humidity_Profile.png';
  import iotImage from '@/assets/images/IOT.png';

  import dayjs from 'dayjs';
  import AlertTable from '@/views/devices/device-profile/components/alert-table.vue';
  import AlertMessageTable from '@/views/devices/device-list/components/alter-message-table.vue';
  import { hexToBase64 } from '@/utils';
  import { Message } from '@arco-design/web-vue';
  import KvTable from './components/kv-table.vue';

  interface ITelemetryPropConfig {
    value: string;
    name: string;
    color: string | null;
    command: string;
  }

  const deviceTypeImage: Record<string, any> = {
    Environmental_Parameters_Profile: eppImage,
    Human_Infrared_Sensor_Profile: hispImage,
    Temperature_Humidity_Profile: thpImage,
  };

  const { loading, setLoading } = useLoading(true);
  const router = useRouter();
  const route = useRoute();
  const { id = '' } = route.query;

  const formData = ref<DeviceDetailDto>({});

  const formFiled = computed(() => {
    return [
      {
        label: '设备名称',
        value: formData.value.name || '--',
      },
      {
        label: '设备描述',
        value: formData.value.description || '--',
      },

      {
        label: '设备类型',
        value: formData.value.deviceProfileName || '--',
      },
      {
        label: 'EUI',
        value: formData.value.devEui || '--',
      },
      {
        label: '设备状态',
        value: formData.value.isDisabled ? '禁用' : '启用',
      },
      {
        label: '帧计数器验证',
        value: formData.value.skipFcntCheck ? '启用' : '禁用',
      },
      {
        label: '创建时间',
        value: formData.value.chirpStackDeviceInfo?.createdAt
          ? dayjs(formData.value.chirpStackDeviceInfo?.createdAt).format(
              'YYYY-MM-DD HH:mm:ss',
            )
          : '--',
      },
      {
        label: '最后上报时间',
        value: formData.value.chirpStackDeviceInfo?.lastSeenAt
          ? dayjs(formData.value.chirpStackDeviceInfo?.lastSeenAt).format(
              'YYYY-MM-DD HH:mm:ss',
            )
          : '--',
      },
    ];
  });

  const latestMetricDataList = computed<any[]>(() => {
    // 使用 reduce 函数转换为对象
    const latestDataObj = (formData.value.latestMetricDataList || []).reduce<{
      [key: string]: any;
    }>((obj, item) => {
      obj[item.deviceFieldName!] = item;
      return obj;
    }, {});

    return (
      // 最新的遥信列表缺少数据，所以以属性配置列表为准
      formData.value.deviceFieldList?.map((n) => {
        // 获取属性列表的最新遥测数据
        const latestValue = latestDataObj[n.key!];

        // 如果包含写的属性
        if (
          !!n.config &&
          (n.type === EnumDeviceFieldDtoType.READ_AND_WRITE ||
            n.type === EnumDeviceFieldDtoType.ONLY_WRITE)
        ) {
          // 安全地解析JSON字符串
          let propConfig: ITelemetryPropConfig[];
          try {
            propConfig = JSON.parse(n.config || '{}');
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to parse config JSON:', n.config, error);
            propConfig = []; // 默认值或根据业务需要进行处理
          }

          // 根据配置格式化显示值
          const formatValue =
            propConfig.find(
              (item) => `${item.value}` === `${latestValue?.value}`,
            )?.name ||
            latestValue?.value ||
            '';

          // 过滤当前状态的控制
          const filterConfig = propConfig.filter(
            (item) => `${item.value}` !== `${latestValue?.value}`,
          );

          // 组合全部数据
          return {
            ...n,
            value: latestValue?.value,
            time: latestValue?.time || '',
            formatValue,
            propConfig: filterConfig,
          };
        }
        return { ...n, value: latestValue?.value, tim: latestValue?.time };
      }) || []
    );
  });

  const deviceFieldList = computed<DeviceLatestMetricDataDto[]>(() => {
    return formData.value.deviceFieldList || [];
  });

  // const deviceFieldList = computed(() => {
  //   return (
  //     formData.value.deviceFieldList?.map((n) => {
  //       if (
  //         !!n.config &&
  //         (n.type === EnumDeviceFieldDtoType.READ_AND_WRITE ||
  //           n.type === EnumDeviceFieldDtoType.ONLY_WRITE)
  //       ) {
  //         // 安全地解析JSON字符串
  //         let propConfig: ITelemetryPropConfig[];
  //         try {
  //           propConfig = JSON.parse(n.config || '{}');
  //         } catch (error) {
  //           console.error('Failed to parse config JSON:', n.config, error);
  //           propConfig = []; // 默认值或根据业务需要进行处理
  //         }
  //         return { ...n, propConfig };
  //       }
  //       return n;
  //     }) || []
  //   );
  // });

  const filedListColumns = [
    {
      title: '属性标识',
      dataIndex: 'key',
    },
    {
      title: '描述',
      dataIndex: 'fieldName',
    },
    {
      title: '最新值',
      dataIndex: 'formatValue',
    },
    {
      title: '上报时间',
      dataIndex: 'time',
      slotName: 'time',
    },
    {
      title: '控制命令',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ];

  /**
   * 执行命令操作的异步函数。
   */
  const onCommand = async (row: any, config: ITelemetryPropConfig) => {
    // 创建设备队列项，用于向设备发送命令
    await ChirpStackDeviceService.createDeviceQueueItem({
      devEui: formData.value.devEui, // 设备的DevEUI
      input: {
        queueItem: {
          confirmed: true, // 确认发送
          data: hexToBase64(config.command), // 将命令从十六进制转换为Base64格式
          fcntDown: '0', // 下行帧计数
          fport: '1', // 使用的FPort
          isPending: false, // 不设置为待处理
          isEncrypted: false, // 命令不加密
        },
      },
    });

    Message.success({
      content: '命令已下发，请稍后查看！',
      duration: 5 * 1000,
    });
  };

  const onBack = () => {
    router.back();
  };

  onMounted(async () => {
    if (id) {
      // 定时刷新
      setInterval(async () => {
        try {
          const result = await DeviceService.getDetailById({
            id: id as string,
          });
          formData.value = {
            ...result,
          };
        } catch (error) {
          console.error(error);
        }
      }, 5000);

      setLoading(true);
      try {
        const result = await DeviceService.getDetailById({
          id: id as string,
        });
        formData.value = {
          ...result,
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

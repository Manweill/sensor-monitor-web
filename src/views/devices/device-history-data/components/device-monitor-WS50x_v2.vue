<template>
  <div
    style="
      display: flex;
      flex: 1;
      padding: 0 5px 0 5px;
      min-height: 300px;
      width: 300px;
      position: relative;
    "
  >
    <div class="cover-container">
      <div
        v-for="valueProp in latestMetricDataList"
        :key="valueProp.deviceFieldName"
        class="switch-btn-bg"
        @click="onActionClick(valueProp.commandProp)"
      >
        <div
          class="switch-btn-bg-off"
          :style="{ backgroundColor: valueProp.config[valueProp.value].color }"
        >
        </div>
      </div>
      <a-image :src="img" :preview="false" style="position: absolute"></a-image>
    </div>
    <div class="action-container">
      <div
        v-for="valueProp in latestMetricDataList"
        :key="valueProp.deviceFieldName"
        class="switch-btn-action"
        @click="onActionClick(valueProp.commandProp)"
      >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    DeviceDetailDto,
    DeviceLatestMetricDataDto,
    DeviceService,
    EnumDeviceFieldDtoType,
  } from '@/services/sensor-core';
  import { hexToBase64 } from '@/utils';
  import { Message } from '@arco-design/web-vue';
  import { computed, onMounted, ref } from 'vue';
  import img from '@/assets/images/WS50x_v2.png';

  const device = ref<DeviceDetailDto>({});

  interface ITelemetryPropConfig {
    value: string;
    name: string;
    color: string | null;
    command: string;
  }

  const latestMetricDataList = computed<any[]>(() => {
    // 使用 reduce 函数转换为对象

    const latestDataObj: Record<string, DeviceLatestMetricDataDto> =
      Object.fromEntries(
        device.value.latestMetricDataList?.map((item) => [
          item.deviceFieldName,
          item,
        ]) ?? [],
      );

    return (
      // 最新的遥信列表缺少数据，所以以属性配置列表为准
      device.value.deviceFieldList?.map((n) => {
        // 获取属性列表的最新遥测数据
        const latestValue = latestDataObj[n.key!];

        // 如果包含写的属性
        if (
          !!n.config &&
          (n.type === EnumDeviceFieldDtoType.READ_AND_WRITE ||
            n.type === EnumDeviceFieldDtoType.ONLY_WRITE)
        ) {
          // 安全地解析JSON字符串
          let config: ITelemetryPropConfig[];
          try {
            config = JSON.parse(n.config || '{}');
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to parse config JSON:', n.config, error);
            config = []; // 默认值或根据业务需要进行处理
          }

          // 根据配置格式化显示值
          const formatValue =
            config.find((item) => `${item.value}` === `${latestValue?.value}`)
              ?.name ||
            latestValue?.value ||
            '';

          // 过滤当前状态的控制
          const filterConfig = config.filter(
            (item) => `${item.value}` !== `${latestValue?.value}`,
          );

          // 组合全部数据
          return {
            ...n,
            value: latestValue?.value,
            time: latestValue?.time || '',
            formatValue,
            config: Object.fromEntries(config.map((c) => [c.value, c])),
            commandProp: filterConfig,
          };
        }
        return { ...n, value: latestValue?.value, tim: latestValue?.time };
      }) || []
    );
  });

  const onActionClick = async (commandProp: ITelemetryPropConfig[]) => {
    await DeviceService.createDeviceQueueItem({
      devEui: device.value.devEui,
      input: {
        queueItem: {
          confirmed: true, // 确认发送
          data: hexToBase64(commandProp[0].command), // 将命令从十六进制转换为Base64格式
          fcntDown: '0', // 下行帧计数
          fport: '1', // 使用的FPort
          isPending: false, // 不设置为待处理
          isEncrypted: false, // 命令不加密 ,
        },
      },
    });

    Message.success({
      content: '命令已下发，请等待状态刷新！',
      duration: 5 * 1000,
    });
  };

  const init = async () => {
    const result = await DeviceService.getDetailById({
      id: '1779876311041331202',
    });

    device.value = { ...result };
  };

  onMounted(async () => {
    await init();
    setInterval(init, 5000);
  });
</script>

<style scoped>
  .cover-container {
    flex: 1;
    display: flex;
  }
  .switch-btn-bg {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 10px;
  }
  .switch-btn-bg-off {
    /* width: 28px; */
    /* height: 8px; */
    margin: 10px;
    flex: 1;
    background-color: gray;
    border-radius: 5px;
  }
  .action-container {
    flex: 1;
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .switch-btn-action {
    flex: 1;
    justify-content: center;
    cursor: pointer;
    padding: 10px;
  }
</style>

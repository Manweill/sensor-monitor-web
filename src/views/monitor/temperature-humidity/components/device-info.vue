<template>
  <div>
    <a-modal v-model:visible="modelVisible" title="设备配置" @before-ok="onOk">
      <a-form ref="formRef" :model="formData" auto-label-width>
        <a-form-item field="manufacturer" label="生产厂家">
          <a-input v-model="formData.producer" />
        </a-form-item>
        <a-form-item field="productModel" label="产品型号">
          <a-input v-model="formData.modelNumber" />
        </a-form-item>
        <a-form-item field="deviceCode" label="设备编码">
          <a-input v-model="formData.serialNumber" />
        </a-form-item>
        <a-form-item field="commissioningDate" label="投运日期">
          <a-date-picker v-model="formData.serviceTime" />
        </a-form-item>
        <a-form-item field="lastCalibrationDate" label="上次校准日期">
          <a-date-picker v-model="formData.lastCalibrationTime" />
        </a-form-item>
        <a-form-item field="calibrationCycle" label="校准周期（天）">
          <a-input-number v-model="formData.calibrationPeriod" />
        </a-form-item>

        <a-form-item field="enableTemperatureAlert" label="启用温度告警">
          <a-switch v-model="formData.enableTemperatureAlert" />
        </a-form-item>

        <a-form-item field="temperatureUpperLimit" label="温度告警阈值">
          <a-input-group>
            <a-input-number
              v-model="formData.temperatureLowerValue"
              :disabled="!formData.enableTemperatureAlert"
              placeholder="下限"
            />
            <span>～</span>
            <a-input-number
              v-model="formData.temperatureUpperValue"
              :disabled="!formData.enableTemperatureAlert"
              placeholder="上限"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item field="enableHumidityAlert" label="启用湿度告警">
          <a-switch v-model="formData.enableHumidityAlert" />
        </a-form-item>

        <a-form-item field="humidityUpperLimit" label="湿度告警阈值">
          <a-input-group>
            <a-input-number
              v-model="formData.humidityLowerValue"
              :disabled="!formData.enableHumidityAlert"
              placeholder="下限"
            />
            <span>～</span>
            <a-input-number
              v-model="formData.humidityUpperValue"
              :disabled="!formData.enableHumidityAlert"
              placeholder="上限"
            />
          </a-input-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    DeviceConfigInfoService,
    SaveDeviceProducerConfigInputDto,
  } from '@/services/sensor-core';
  import { Message } from '@arco-design/web-vue';

  interface ExtendedSaveDeviceProducerConfigInputDto
    extends SaveDeviceProducerConfigInputDto {
    enableTemperatureAlert: boolean;
    enableHumidityAlert: boolean;
  }

  const modelVisible = ref(false);

  const formRef = ref();
  const formData = ref<ExtendedSaveDeviceProducerConfigInputDto>({
    enableTemperatureAlert: false,
    enableHumidityAlert: false,
    id: '',
    devEui: '',
    modelNumber: '',
    producer: '',
    serialNumber: '',
    serviceTime: undefined as Date | undefined,
    lastCalibrationTime: undefined as Date | undefined,
    calibrationPeriod: undefined as number | undefined,
    humidityLowerValue: undefined as number | undefined,
    humidityUpperValue: undefined as number | undefined,
    powerAlertValue: undefined as number | undefined,
    temperatureLowerValue: undefined as number | undefined,
    temperatureUpperValue: undefined as number | undefined,
  });

  const onOk = async () => {
    // 当温度告警未启用时，将温度上下限设置为undefined
    if (!formData.value.enableTemperatureAlert) {
      formData.value.temperatureLowerValue = undefined;
      formData.value.temperatureUpperValue = undefined;
    }

    // 当湿度告警未启用时，将湿度上下限设置为undefined
    if (!formData.value.enableHumidityAlert) {
      formData.value.humidityLowerValue = undefined;
      formData.value.humidityUpperValue = undefined;
    }
    // 提交表单数据Ï
    try {
      await DeviceConfigInfoService.saveDeviceProducerConfig({
        input: {
          ...formData.value,
          serviceTime: formData.value.serviceTime
            ? new Date(formData.value.serviceTime)
            : undefined,
          lastCalibrationTime: formData.value.lastCalibrationTime
            ? new Date(formData.value.lastCalibrationTime)
            : undefined,
        },
      });
      modelVisible.value = false;
    } catch (error) {
      Message.error('保存设备配置失败');
    }
  };

  const openModal = async (devEui: string) => {
    try {
      const res = await DeviceConfigInfoService.getDeviceProducerConfig({
        devEui,
      });

      Object.assign(formData.value, {
        ...res,
        devEui,
        enableTemperatureAlert: false,
        enableHumidityAlert: false,
      });

      // 检查温度告警阈值是否不为空，如果不为空则设置enableTemperatureAlert为true
      if (
        (formData.value.temperatureLowerValue !== undefined ||
          formData.value.temperatureUpperValue !== undefined) &&
        formData.value.temperatureLowerValue !== 0 &&
        formData.value.temperatureUpperValue !== 0
      ) {
        formData.value.enableTemperatureAlert = true;
      }

      // 检查湿度告警阈值是否不为空，如果不为空则设置enableHumidityAlert为true
      if (
        (formData.value.humidityLowerValue !== undefined ||
          formData.value.humidityUpperValue !== undefined) &&
        formData.value.humidityLowerValue !== 0 &&
        formData.value.humidityUpperValue !== 0
      ) {
        formData.value.enableHumidityAlert = true;
      }
    } catch (error) {
      Message.error('获取设备配置失败');
    }
    modelVisible.value = true;
  };

  defineExpose({
    openModal,
  });
</script>

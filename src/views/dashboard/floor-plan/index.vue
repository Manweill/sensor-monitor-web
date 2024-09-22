<template>
  <div class="container">
    <div class="left-side">
      <div class="panel">
        <!--        <Banner />-->
        <!--        <DataPanel />-->
        <!-- <ContentChart /> -->
      </div>
      <a-col :flex="1" style="margin-top: 16px">
        <a-card title="平面图监控">
          <graph
            ref="floorPlanRef"
            canvas-id="floor-plan"
            :height="660"
            :height-fix="660"
            @ready="onInit"
          ></graph>
        </a-card>
      </a-col>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Graph from '@/components/graph/index.vue';
  import { DeviceService } from '@/services/sensor-core';
  import { units } from '@/utils/profile-utils';
  // import Banner from '@/views/dashboard/workplace/components/banner.vue';
  // import DataPanel from '@/views/dashboard/workplace/components/data-panel.vue';
  import * as fabric from 'fabric';
  import { ref } from 'vue';

  // w = 1600 h=1060
  // w= 1250 h=660
  const floorPlanRef = ref();

  const points = [
    {
      x: 830,
      y: 910,
    },
    { x: 960, y: 910 },
    { x: 1060, y: 955.3333282470703 },
  ];

  function createDevice(args: {
    nid: string | undefined;
    no: number;
    profile?: string;
    telemetryValues: Array<{ name: string; value: number; unit: string }>;
    x?: number;
    y?: number;
    position?: { x: number; y: number };
  }) {
    const height = 100;
    const width = height * 1.2;
    const teleTexts: fabric.Textbox[] = [];
    // switch (args.profile) {
    //   case 'Temperature_Humidity_Profile':
    // 基础偏移量，每次累计
    let baseLeft = 0;
    for (let i = 0; i < args.telemetryValues.length; i += 1) {
      const v = args.telemetryValues[i];
      const value = v.value.toFixed(1);
      const valueLength = v.value.toFixed(1).length - 1;
      const left = baseLeft + 95 + i * 18 * valueLength;
      baseLeft += left;
      // 名称
      const textInfo = new fabric.Textbox(v.name, {
        width,
        fontSize: 20,
        top: 35,
        left,
        lockRotation: true, // 禁止旋转
        lockScalingY: true, // 禁止Y轴伸缩
        lockScalingFlip: true, // 禁止负值反转
        splitByGrapheme: true, // 拆分中文，可以实现自动换行
        objectCaching: false,
        stroke: '#5473e2',
        fill: '#76a0f8',
        textAlign: 'center',
      });
      // 遥测值

      const textValue = new fabric.Textbox(value, {
        width,
        fontSize: 48,
        top: 35 + 20,
        left,
        lockRotation: true, // 禁止旋转
        lockScalingY: true, // 禁止Y轴伸缩
        lockScalingFlip: true, // 禁止负值反转
        splitByGrapheme: true, // 拆分中文，可以实现自动换行
        objectCaching: false,
        stroke: '#5473e2',
        fill: '#76a0f8',
        textAlign: 'center',
      });
      // 单位
      const textUnit = new fabric.Textbox(v.unit, {
        width,
        fontSize: 20,
        top: 35 + 25,
        left: left + 10 + 18 * valueLength,
        lockRotation: true, // 禁止旋转
        lockScalingY: true, // 禁止Y轴伸缩
        lockScalingFlip: true, // 禁止负值反转
        splitByGrapheme: true, // 拆分中文，可以实现自动换行
        objectCaching: false,
        stroke: '#5473e2',
        fill: '#76a0f8',
        textAlign: 'center',
      });
      teleTexts.push(textInfo, textValue, textUnit);
    }
    //   break;
    // default:
    //   break;
    // }

    const imgUrl = `/src/assets/images/${args.profile}.png`;
    fabric.FabricImage.fromURL(imgUrl).then((oImg) => {
      oImg.left = 20;
      oImg.top = 35;
      oImg.scale(0.1);
      if (args.position) {
        const g = new fabric.Group([oImg, ...teleTexts], {
          nid: args.nid,
          top: args.position.y,
          left: args.position.x,
          hasControls: false,
        } as any);
        g.fill = '#eaf3fe';
        g.backgroundColor = '#eaf3fe';
        floorPlanRef.value.add(g);
        floorPlanRef.value.renderAll();
      } else {
        const g = new fabric.Group([oImg, ...teleTexts], {
          nid: args.nid,
          top: args.x,
          left: args.y,
          hasControls: false,
        } as any);
        g.fill = '#eaf3fe';
        floorPlanRef.value.add(g);
      }
    });
  }

  const onInit = async () => {
    const devices = await DeviceService.listAll({ unPage: true });

    devices.items
      ?.filter((item) =>
        [
          'Temperature_Humidity_Profile',
          'Environmental_Parameters_Profile',
        ].includes(item.deviceProfileName as string),
      )
      .slice(0, 3)
      .forEach((device, index) => {
        const p = points[index];

        createDevice({
          ...p,
          nid: device.id,
          no: index,
          profile: device.deviceProfileName,
          telemetryValues:
            device.latestMetricDataList
              ?.map((item) => ({
                name: item.description as string,
                value: item.value as number,
                unit: units[item.deviceFieldName as string] as string,
              }))
              .filter((item) => item.unit) ?? [],
        });
      });
  };

  // onMounted();
</script>

<script lang="ts">
  export default {
    name: 'FloorPlan', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
  }

  .left-side {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
</style>

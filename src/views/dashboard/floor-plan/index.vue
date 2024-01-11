<template>
  <div class="container">
    <graph
      ref="floorPlanRef"
      canvas-id="floor-plan"
      :height="1060"
      :height-fix="1060"
      @ready="onInit"
    ></graph>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { fabric } from 'fabric';
  import Graph from '@/components/graph/index.vue';
  import { DeviceService } from '@/services/sensor-core';

  const floorPlanRef = ref();

  const points = [
    {
      nid: '1742374242076344322',
      x: 152,
      y: 32.33332824707031,
    },
    { nid: '1742374020046667777', x: 752, y: 523.3333282470703 },
    { nid: '1742374165828091905', x: 1060, y: 955.3333282470703 },
  ];
  function createDevice({
    nid,
    no,
    name,
    x,
    y,
    imgUrl,
    position,
  }: {
    nid: string;
    no: number;
    name?: string;
    x?: number;
    y?: number;
    imgUrl: string;
    position?: { x: number; y: number };
  }) {
    const height = 100;
    const width = height * 1.2;
    const text = new fabric.Textbox(`${no}\n${name}`, {
      width,
      fontSize: 10,
      top: 35,
      lockRotation: true, // 禁止旋转
      lockScalingY: true, // 禁止Y轴伸缩
      lockScalingFlip: true, // 禁止负值反转
      splitByGrapheme: true, // 拆分中文，可以实现自动换行
      objectCaching: false,
      textAlign: 'center',
    });

    fabric.Image.fromURL(imgUrl, (oImg) => {
      console.log(oImg);

      oImg.left = 25;
      oImg.scale(0.5);
      if (position) {
        const g = new fabric.Group([oImg, text], {
          nid,
          top: position.y,
          left: position.x,
          hasControls: false,
        });
        floorPlanRef.value.add(g);
      } else {
        const g = new fabric.Group([oImg, text], {
          nid,
          top: height * x,
          left: width * y + 10,
          hasControls: false,
        });
        floorPlanRef.value.add(g);
      }
    });
  }

  const onInit = async () => {
    // console.log('dada init');
    // const devices = await DeviceService.listAll({ unPage: true });
    // points.forEach((p, index) => {
    //   const device = devices.items?.find((item) => item.id === p.nid);
    //   console.log(p);
    //   if (device) {
    //     const img = `/src/assets/images/${device.deviceProfileName}.png`;
    //     createDevice({ ...p, imgUrl: img, no: index, name: device.name });
    //   }
    // });
    // console.log(floorPlanRef.value.getPositionChangedObjects());
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
</style>

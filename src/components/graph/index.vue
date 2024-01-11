<template>
  <div style="width: 100%; height: 100%; position: relative">
    <canvas :id="props.canvasId"></canvas>
    <!-- 右键菜单（绝对定位，且默认是隐藏的） -->
    <!-- <div :id="contextId" class="menu-x">
      <div
        v-for="menu in contextmenus"
        :key="menu.key"
        class="menu-li"
        @click="onContextMenuItemClick(menu.key)"
      >
        {{ menu.label }}
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
  import { DeviceService } from '@/services/sensor-core';
  import { fabric } from 'fabric';
  import { CanvasHTMLAttributes, onMounted, ref } from 'vue';
  //   import {
  //     initMinimap,
  //     updateMiniMap,
  //     updateMiniMapVP,
  //   } from '@/view/devices/utils/minimapUtils';

  const props = defineProps<{
    canvasId: string;
    height: number;
    heightFix: number;
  }>();

  const contextId = `${props.canvasId}contextMenu`;

  const emits = defineEmits<{
    dblclick?: [id: number, name: string];
    ready: [];
  }>();

  // 隐藏菜单
  //   function hiddenContextMenu() {
  //     document.getElementById(contextId).style = `
  //       visibility: hidden;
  //       left: 0;
  //       top: 0;
  //       z-index: -100;
  //     `;
  //     // activeEl = null
  //   }

  const contextmenus = ref([]);

  let canvasDesign: fabric.Canvas;
  let canvasSize;

  let canvasMinimap;

  const currentSelector = {
    pointer: {
      x: 0,
      y: 0,
    },
    target: null,
  };

  function resizeCanvas() {
    const heightFix = props.heightFix || 0;
    const elemCanvas = document.getElementById(
      props.canvasId,
    ) as unknown as CanvasHTMLAttributes;
    // console.log('elem_canvas', elem_canvas.parentElement)
    // canvasSize = {
    //   width: elemCanvas?.parentElement?.clientWidth,
    //   height: props.height
    //     ? props.height
    //     : elemCanvas?.parentElement?.clientHeight - heightFix,
    // };
    if (elemCanvas) {
      canvasSize = {
        width: 1600,
        height: 1060,
      };
      elemCanvas.width = canvasSize.width;
      elemCanvas.height = props.height ? props.height : canvasSize.height;
    }
  }

  function onContextMenuItemClick(key) {
    // hiddenContextMenu();
    // emits('contextmenuItemClick', { key, target: currentSelector.target });
  }

  const rerenderTimer = 0;
  const requestFixed = false;

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
      oImg.left = 25;
      oImg.scale(0.1);
      if (position) {
        const g = new fabric.Group([oImg, text], {
          nid,
          top: position.y,
          left: position.x,
          hasControls: false,
        });
        canvasDesign.add(g);
        canvasDesign.renderAll();
      } else {
        const g = new fabric.Group([oImg, text], {
          nid,
          top: x,
          left: y,
          hasControls: false,
        });
        canvasDesign.add(g);
        canvasDesign.renderAll();
        console.log('111111');
      }
    });
  }

  const onInit = async () => {
    console.log('dada init');

    const devices = await DeviceService.listAll({ unPage: true });

    points.forEach((p, index) => {
      const device = devices.items?.find((item) => item.id === p.nid);
      console.log(p);

      if (device) {
        const img = `/src/assets/images/${device.deviceProfileName}.png`;

        createDevice({ ...p, imgUrl: img, no: index, name: device.name });
      }
    });
  };

  onMounted(() => {
    resizeCanvas();
    canvasDesign = new fabric.Canvas(props.canvasId, {
      stopContextMenu: true,
      fireRightClick: true,
      containerClass: `canvas-container-${props.canvasId}`,
    });

    fabric.Image.fromURL('/src/assets/svg/floor-plan.png', (img) => {
      img.set({ left: 0, top: 0 });
      canvasDesign.backgroundImage = img;
      canvasDesign.renderAll();
      // emits('ready');
      onInit();
    });

    // canvasDesign.on('after:render', function () {
    //   if (rerenderTimer) clearTimeout(rerenderTimer);
    //   if (!requestFixed) return;
    //   rerenderTimer = setTimeout(() => {
    //     center();
    //     center();
    //     requestFixed = false;
    //   }, 50);
    // });

    // canvasDesign.on('object:modified', function () {
    //   if (canvasMinimap) {
    //     updateMiniMap({
    //       canvas_design: canvasDesign,
    //       canvas_minimap: canvasMinimap,
    //       canvas_size: canvasSize,
    //     });
    //   }
    // });

    // canvasDesign.on('object:added', function () {
    //   if (canvasMinimap) {
    //     updateMiniMap({
    //       canvas_design: canvasDesign,
    //       canvas_minimap: canvasMinimap,
    //       canvas_size: canvasSize,
    //     });
    //   }
    // });

    // canvasDesign.on('object:removed', function () {
    //   if (canvasMinimap) {
    //     updateMiniMap({
    //       canvas_design: canvasDesign,
    //       canvas_minimap: canvasMinimap,
    //       canvas_size: canvasSize,
    //     });
    //   }
    // });
    canvasDesign.on('object:moving', (e) => {
      // console.log(e)
      // 如果位置发生改动，则标记
      e.target.set('isPositionChanged', true);
    });

    // hook up the pan and zoom
    canvasDesign.on('mouse:wheel', function (opt) {
      // let delta = opt.e.deltaY
      // let zoom = canvas_design.getZoom()
      // zoom *= 0.999 ** delta
      // if (zoom > 20) zoom = 20
      // if (zoom < 0.01) zoom = 0.01
      // canvas_design.setZoom(zoom)
      //
      // if (canvas_minimap) {
      //   updateMiniMapVP({ canvas_design, canvas_minimap, canvas_size })
      // }
      // opt.e.preventDefault()
      // opt.e.stopPropagation()
    });
    canvasDesign.on('mouse:dblclick', (opt) => {
      if (opt.target) {
        currentSelector.target = opt.target;
        currentSelector.pointer = { x: opt.pointer.x, y: opt.pointer.y };
        emits('dblclick', {
          canvasEvent: {
            target: opt.target,
            pointer: currentSelector.pointer,
          },
        });
      }
    });

    canvasDesign.on('mouse:down', (opt) => {
      const evt = opt.e;

      if (evt.altKey === true) {
        canvasDesign.isDragging = true;
        canvasDesign.selection = false;
        canvasDesign.lastPosX = evt.clientX;
        canvasDesign.lastPosY = evt.clientY;
      }

      currentSelector.target = opt.target;
      currentSelector.pointer = { x: opt.pointer.x, y: opt.pointer.y };
      // console.log('aa', { x: opt.pointer.x, y: opt.pointer.y });

      if (opt.button === 3) {
        // emits('contextmenuClick', {
        //   target: opt.target,
        //   pointer: currentSelector.pointer,
        // });
      }
    });
    canvasDesign.on('mouse:move', (opt) => {
      if (canvasDesign.isDragging) {
        const { e } = opt;
        const vpt = canvasDesign.viewportTransform;
        vpt[4] += e.clientX - canvasDesign.lastPosX;
        vpt[5] += e.clientY - canvasDesign.lastPosY;
        canvasDesign.requestRenderAll();

        canvasDesign.lastPosX = e.clientX;
        canvasDesign.lastPosY = e.clientY;
      }
    });
    canvasDesign.on('mouse:up', () => {
      canvasDesign.isDragging = false;
      canvasDesign.selection = true;
    });
  });
  // 以下都是暴露的方法
  function clear() {
    return canvasDesign.clear();
  }
  function toJSON() {
    return canvasDesign.toJSON();
  }

  function loadFromJSON(json) {
    return canvasDesign.loadFromJSON(json);
  }

  function remove(obj) {
    canvasDesign.remove(obj);
  }

  function add(obj) {
    canvasDesign.add(obj);
    // requestFixed = true;
    canvasDesign.renderAll();
    console.log('12321312');
  }

  function getPositionChangedObjects() {
    return (
      canvasDesign
        .getObjects()
        // .filter((item) => item.isPositionChanged)
        .map((item) => ({
          nid: item.nid,
          x: item.left,
          y: item.top,
        }))
    );
  }

  function getDataUrl() {
    return canvasDesign.toDataURL({
      format: 'png',
    });
  }

  defineExpose({
    clear,
    add,
    remove,
    toJSON,
    loadFromJSON,
    getPositionChangedObjects,
    getDataUrl,
  });
</script>

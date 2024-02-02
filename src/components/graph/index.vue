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
  import * as fabric from 'fabric';
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

  const emit = defineEmits<{
    (
      event: 'dblclick',
      args: {
        target?: fabric.FabricObject;
        pointer: { x: number; y: number };
      },
    ): void;
    (event: 'ready'): void;
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
    target: undefined,
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
        width: 1250,
        height: 660,
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

  onMounted(() => {
    resizeCanvas();
    canvasDesign = new fabric.Canvas(props.canvasId, {
      stopContextMenu: true,
      fireRightClick: true,
      containerClass: `canvas-container-${props.canvasId}`,
    });

    fabric.FabricImage.fromURL('/src/assets/svg/floor-plan.png').then((img) => {
      img.set({ left: 0, top: 0 });
      // img.scale(660 / 1060);
      canvasDesign.backgroundImage = img;
      canvasDesign.setZoom(660 / 1060);
      canvasDesign.renderAll();
      emit('ready');
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
        // currentSelector.target = opt.target;
        // currentSelector.pointer = { x: opt.pointer.x, y: opt.pointer.y };
      }
      emit('dblclick', {
        target: opt.target,
        pointer: currentSelector.pointer,
      });
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

<template>
  <div class="container">
    <a-card class="general-card content" title="图形编辑">
      <a-row :gutter="[24, 12]">
        <a-col :span="18">
          <graph
            ref="floorPlanRef"
            canvas-id="floor-plan"
            :height="660"
            :height-fix="660"
            @dblclick="onDblClick"
          ></graph>
        </a-col>
        <a-col :span="6"> </a-col>
      </a-row>
    </a-card>
    <a-modal
      v-model:visible="visible"
      draggable
      :mask="false"
      @ok="visible = !visible"
      @cancel="visible = !visible"
    >
      <template #title> Title </template>
      <div
        >You can customize modal body text by the current situation. This modal
        will be closed immediately once you press the OK button.</div
      >
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Graph from '@/components/graph/index.vue';
  import * as fabric from 'fabric';

  const floorPlanRef = ref();

  const visible = ref(false);

  const onDblClick = ({
    target,
    pointer,
  }: {
    target?: fabric.FabricObject;
    pointer: { x: number; y: number };
  }) => {
    visible.value = !visible.value;
    console.log(pointer);
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    padding: 20px;
    min-height: calc(100vh - 134px);
    flex-direction: column;
  }
  .content {
    background-color: '#f4f4f4';
    flex: 1;
  }
</style>

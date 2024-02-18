<template>
  <div class="container">
    <div class="content">
      <a-card class="general-card" title="图形编辑">
        <graph
          ref="floorPlanRef"
          canvas-id="floor-plan"
          :height="660"
          :height-fix="660"
          @dblclick="onDblClick"
        ></graph>
      </a-card>
      <div class="attr-container">
        <a-card title="属性"
          ><a-form :model="form" :style="{ width: '325px' }">
            <a-form-item
              field="name"
              label="Username"
              validate-trigger="input"
              required
            >
              <a-input
                v-model="form.name"
                placeholder="please enter your username..."
              />
              <template #extra>
                <div>Used to login</div>
              </template>
            </a-form-item>
            <a-form-item
              field="post"
              label="Post"
              validate-trigger="input"
              required
            >
              <a-input
                v-model="form.post"
                placeholder="please enter your post..."
              />
              <template #extra>
                <div>Used to login</div>
              </template>
              <template #help>
                <div>Custom valitae message</div>
              </template>
            </a-form-item>
            <a-form-item field="isRead">
              <a-checkbox v-model="form.isRead">
                I have read the manual
              </a-checkbox>
            </a-form-item>
          </a-form>
        </a-card></div
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Graph from '@/components/graph/index.vue';
  import fabric from 'fabric';
  // import { Container, Draggable } from 'vue3-smooth-dnd';

  const floorPlanRef = ref();

  const visible = ref(false);
  const form = ref({
    name: '',
    post: '',
    isRead: false,
  });

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
    flex-direction: row;
  }
  .content {
    // background-color: '#f4f4f4';
    flex: 1;
    position: relative;
  }

  .attr-container {
    width: 325px;
    height: 90%;
    position: absolute;
    top: 10px;
    right: 20px;
  }
</style>

<template>
  <div
    style="
      display: flex;
      flex: 1;
      padding: 0 5px 0 5px;
      min-height: 300px;
      width: 300px;
      background-image: url('../../../../src/assets/images/WS50x_v2.png');
    "
  >
    <div class="switch-btn" @click="console.log(1)">
      <div class="switch-btn-on"></div>
    </div>
    <div class="switch-btn" @click="console.log(2)">
      <div class="switch-btn-off"></div
    ></div>
    <div class="switch-btn" @click="console.log(3)"
      ><div class="switch-btn-off"></div
    ></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .switch-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
  .switch-btn-on {
    width: 28px;
    height: 8px;
    background-color: greenyellow;
    margin-top: 236px;
    border-radius: 5px;
  }
  .switch-btn-off {
    width: 28px;
    height: 8px;
    background-color: gray;
    margin-top: 236px;
    border-radius: 5px;
  }
</style>

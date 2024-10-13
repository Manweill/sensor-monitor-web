<template>
  <a-layout-footer class="footer">{{ appName }} v1.0.1</a-layout-footer>
</template>

<script lang="ts" setup>
  const appName = import.meta.env.VITE_APP_NAME;
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>

<template>
  <a-card
    class="general-card"
    title="统计信息"
    :header-style="{ paddingBottom: '12px' }"
  >
    <a-row :gutter="16">
      <a-col v-for="item in statisticsData" :key="item.title" :span="6">
        <a-card
          :bordered="false"
          class="content-card"
          :style="{ background: item.background }"
        >
          <div class="content-wrap">
            <div class="left-content">
              <a-statistic
                :title="item.title"
                :value="item.value"
                :value-from="0"
                animation
                show-group-separator
              />
              <div class="desc">
                <a-typography-text type="secondary" class="label">
                  较昨日
                </a-typography-text>
                <a-typography-text
                  :type="item.trend === 'up' ? 'danger' : 'success'"
                >
                  {{ item.change }}
                  <icon-arrow-rise v-if="item.trend === 'up'" />
                  <icon-arrow-fall v-else />
                </a-typography-text>
              </div>
            </div>
            <div class="right-icon">
              <a-avatar :size="84" class="icon-avatar">
                <img :src="item.icon" :alt="item.title" />
              </a-avatar>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, PropType, watch, computed } from 'vue';
  import useLoading from '@/hooks/loading';

  const props = defineProps({
    dataPanelData: {
      type: Object as PropType<{
        areaCount: number;
        deviceCount: number;
        alertCount: number;
        dataCount: number;
      }>,
      required: true,
    },
  });

  console.log(props.dataPanelData);

  const statisticsData = computed(() => {
    return [
      {
        title: '区域总数',
        value: props.dataPanelData.areaCount,
        change: '30',
        trend: 'up',
        icon: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        background: 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
      },
      {
        title: '设备总数',
        value: props.dataPanelData.deviceCount,
        change: '90',
        trend: 'up',
        icon: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image',
        background: 'linear-gradient(180deg, #F5FEF2 0%, #E6FEEE 100%)',
      },
      {
        title: '告警数量',
        value: props.dataPanelData.alertCount,
        change: '20',
        trend: 'down',
        icon: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image',
        background: 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
      },
      {
        title: '上报数据量',
        value: props.dataPanelData.dataCount,
        change: '2.3%',
        trend: 'up',
        icon: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image',
        background: 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
      },
    ];
  });
</script>

<style lang="less" scoped>
  .general-card {
    width: 100%;
  }

  .content-card {
    height: 100%;
  }

  .content-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .left-content {
    flex: 1;
    overflow: hidden;
  }

  .right-icon {
    margin-left: 12px;
    flex-shrink: 0;
  }

  .icon-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  }

  .desc {
    display: flex;
    align-items: center;
    margin-top: 4px;

    .label {
      margin-right: 8px;
    }
  }

  @media (max-width: 1200px) {
    .content-wrap {
      flex-direction: column-reverse;
      align-items: flex-start;
    }

    .right-icon {
      margin-left: 0;
      margin-bottom: 12px;
    }
  }

  @media (max-width: 768px) {
    .content-wrap {
      flex-direction: row;
      align-items: center;
    }

    .right-icon {
      margin-left: 12px;
      margin-bottom: 0;
    }
  }
</style>

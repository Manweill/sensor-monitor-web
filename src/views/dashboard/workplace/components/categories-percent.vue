<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0', textAlign: 'center' }"
    >
      <template #title> 实时监控 </template>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item
          v-for="(id, idx) in items"
          :key="id"
          :span="{ xs: 12, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8 }"
        >
          <!-- <a-card :title="idx + '#房'">
            <template #extra>
              <a-link>查看</a-link>
            </template>
            ByteDance's core product, Toutiao ("Headlines"), is a content
            platform in China and around the world. Toutiao started out as a
            news recommendation engine and gradually evolved into a platform
            delivering content in various formats.
          </a-card> -->
          <a-card>
            <div style="display: flex; justify-content: space-between">
              <a-link>{{ idx + 1 + '#房' }}</a-link>
              <span>{{ idx + 1 }}</span>
            </div>
            <a-list-item
              v-for="(item, i) in ['温度传感器', '湿度传感器']"
              :key="i"
            >
              <a-list-item-meta :title="item">
                <template #avatar>
                  <a-avatar shape="square">
                    <img alt="avatar" :src="thpImage" />
                  </a-avatar>
                </template>
              </a-list-item-meta>
              <template #extra>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    font-size: 28px;
                    height: 100%;
                  "
                >
                  35 °C
                </div>
              </template>
            </a-list-item>
          </a-card>
        </a-grid-item>
        <!-- <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
        >
          <CategoriesPercent />
        </a-grid-item> -->
      </a-grid>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import thpImage from '@/assets/images/Temperature_Humidity_Profile.png';

  const items = [1, 2, 3, 4];
  const { loading } = useLoading();
  const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    return {
      legend: {
        left: 'center',
        data: ['温湿度传感器', '环境监测传感器', '人体红外传感器'],
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '设备数量',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: '213',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: [
            {
              value: [126],
              name: '温湿度传感器',
              itemStyle: {
                color: isDark ? '#3D72F6' : '#249EFF',
              },
            },
            {
              value: [78],
              name: '环境监测传感器',
              itemStyle: {
                color: isDark ? '#A079DC' : '#313CA9',
              },
            },
            {
              value: [9],
              name: '人体红外传感器',
              itemStyle: {
                color: isDark ? '#6CAAF5' : '#21CCFF',
              },
            },
          ],
        },
      ],
    };
  });
</script>

<style scoped lang="less"></style>

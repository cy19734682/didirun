<template>
  <div class="home-container">
    <div class="home-page-title">数据总览</div>
    <TotalData />
    <a-divider />
    <a-row class="mt-20" :gutter="20">
      <a-col :span="12">
        <UserLine />
      </a-col>
      <a-col :span="12">
        <OrderStatus ref="orderStatus" />
      </a-col>
    </a-row>
    <OrderLine />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import TotalData from '@/components/overview/TotalData.vue';
import UserLine from '@/components/overview/UserLine.vue';
import OrderStatus from '@/components/overview/OrderStatus.vue';
import OrderLine from '@/components/overview/OrderLine.vue';
export default Vue.extend({
  name: 'Home',
  components: {
    TotalData,
    UserLine,
    OrderStatus,
    OrderLine
  },
  layout: 'global'
});
</script>

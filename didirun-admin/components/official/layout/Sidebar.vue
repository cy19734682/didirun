<template>
  <div class="sidebar">
    <Scrollbar max-height="100%" height="100%">
      <a-menu
        mode="inline"
        :selected-keys="selectedKeys"
        :default-open-keys="defaultOpenKeys"
        @click="clickMenuItem"
      >
        <a-menu-item key="/">
          <i class="iconfont icon-dashboard"></i>
          <span class="ml-8 bold">数据总览</span>
        </a-menu-item>
        <a-sub-menu key="user">
          <span slot="title">
            <i class="iconfont icon-user-maner"></i>
            <span class="ml-8 bold">用户管理</span>
          </span>
          <a-menu-item key="/user/agents"> 代理列表 </a-menu-item>
          <a-menu-item key="/user/admins"> 管理员列表 </a-menu-item>
          <a-menu-item key="/user/users"> 用户列表 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="order">
          <span slot="title">
            <i class="iconfont icon-drawer"></i>
            <span class="ml-8 bold">订单管理</span>
          </span>
          <a-menu-item key="/order/orders"> 订单列表 </a-menu-item>
          <a-menu-item key="/order/capitalTrend"> 资金走向列表 </a-menu-item>
          <a-menu-item key="/order/cancelSet"> 取消订单配置 </a-menu-item>
          <a-menu-item key="/order/feeSet">小费选项配置 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="rider">
          <span slot="title">
            <i class="iconfont icon-rider"></i>
            <span class="ml-8 bold">骑手管理</span>
          </span>
          <a-menu-item key="/rider/riders"> 骑手列表 </a-menu-item>
          <a-menu-item key="/rider/registers"> 骑手审核列表 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="city">
          <span slot="title">
            <i class="iconfont icon-city"></i>
            <span class="ml-8 bold">城市管理</span>
          </span>
          <a-menu-item key="/city/citys"> 运营城市列表 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="operate">
          <span slot="title">
            <i class="iconfont icon-template"></i>
            <span class="ml-8 bold">运营管理</span>
          </span>
          <a-menu-item key="/operate/valuation"> 计价规则 </a-menu-item>
          <a-menu-item key="/operate/weight"> 重量标签 </a-menu-item>
          <a-menu-item key="/operate/tag"> 物品标签组 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="coupon">
          <span slot="title">
            <i class="iconfont icon-coupon"></i>
            <span class="ml-8 bold">优惠券管理</span>
          </span>
          <a-menu-item key="/coupon/coupons"> 优惠券列表 </a-menu-item>
          <a-menu-item key="/coupon/setting"> 优惠券设置 </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="cash">
          <span slot="title">
            <i class="iconfont icon-pic"></i>
            <span class="ml-8 bold">提现管理</span>
          </span>
          <a-menu-item key="/cash/cashs"> 提现列表 </a-menu-item>
          <a-menu-item key="/cash/cashConfig"> 提现设置 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="config">
          <span slot="title">
            <i class="iconfont icon-setting"></i>
            <span class="ml-8 bold">系统设置</span>
          </span>
          <a-menu-item key="/config/app"> 小程序设置 </a-menu-item>
          <a-menu-item key="/config/share"> 分享设置 </a-menu-item>
          <a-menu-item key="/config/integral"> 积分设置 </a-menu-item>
          <a-menu-item key="/config/wxSubscribe"> 订阅消息设置 </a-menu-item>
          <a-menu-item key="/config/user"> 用户指南 </a-menu-item>
          <a-menu-item key="/config/rider"> 骑手指南 </a-menu-item>
          <a-menu-item key="/config/agreementRider"> 骑手协议 </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </Scrollbar>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  computed: {
    selectedKeys() {
      return [this.$route.fullPath];
    },
    defaultOpenKeys() {
      return [this.$route.fullPath?.split('/')?.[1] || '/'];
    }
  },
  methods: {
    clickMenuItem(e: { key: string }) {
      if (e.key !== this.selectedKeys[0]) {
        this.$router.push(e.key);
      }
    }
  }
});
</script>
<style lang="less">
.sidebar {
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-color: transparent;
  }
}
</style>

<style lang="less" scoped>
.sidebar {
  position: absolute;
  width: 240px;
  height: calc(100vh - 60px);
  left: 0;
  top: 60px;
  border-radius: 4px;
  background-color: #ffffff;
  border-right: 1px solid #e1e1e1;
}
</style>

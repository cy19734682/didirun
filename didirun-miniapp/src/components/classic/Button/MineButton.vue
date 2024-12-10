<template>
  <button
    class="mine-btn"
    type="default"
    @click="type === 'rider' ? riderClick() : navToMine()"
  >
    <view class="mine-button">
      <view :class="['iconfont', 'icon-' + type]"></view>
    </view>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "user",
    },
  },
  methods: {
    navToMine() {
      uni.navigateTo({
        url: "/pages/mine/mine",
      });
    },
    riderClick() {
      uni.navigateTo({
        url: "/pages/rider/rider",
      });
    },
  },
};
</script>

<style lang="less">
.mine-button {
  position: fixed;
  right: 0;
  top: 100rpx;
  height: 100rpx;
  width: 100rpx;
  border-radius: 50rpx 0 0 50rpx;
  box-shadow: 0 0 20rpx 10rpx rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  &:hover {
    opacity: 0.8;
  }
  .iconfont {
    line-height: 100rpx;
    text-align: center;
  }
}
</style>

<template>
  <view class="mine">
    <view class="user-content flex flex-between item-center">
      <view class="flex flex-start item-center">
        <view class="avatar">
          <view v-if="!userInfo.avatarUrl" class="iconfont icon-avatar fo-9">
          </view>
          <image
            v-else
            :src="userInfo.avatarUrl"
            mode="aspectFill"
            @click="getUserProfile"
          ></image>
        </view>
        <view class="ml-24">
          <view class="ell fo-32 fo-w">
            {{ userInfo.nickName || "未登录" }}
          </view>
          <view class="fo-28 fo-w">
            {{ userInfo.mobileNumber || "" }}
          </view>
        </view>
      </view>

      <view> </view>
    </view>
    <view class="flex flex-between item-center py-30">
      <navigator
        class="panel-item flex flex-center item-center"
        url="/pages/mine/coupon/coupon"
      >
        <view class="fo-28 fo-28"> 优惠券{{ coupon }}张 </view>
      </navigator>
      <navigator class="panel-item flex flex-center item-center">
        <view class="fo-28 fo-28"> 积分 {{ integral }} </view>
      </navigator>
    </view>
    <dd-card>
      <navigator
        class="p-30 flex flex-between item-center"
        url="/pages/order/order"
      >
        <view class="flex flex-start item-center">
          <view class="iconfont icon-order fo-28"> </view>
          <view class="ml-30 fo-28"> 我的订单 </view>
        </view>
        <view class="iconfont icon-arrow-right fo-28 fo-9"> </view>
      </navigator>
    </dd-card>

    <dd-card margin="30rpx 0 0 0">
      <navigator
        class="p-30 flex flex-between item-center border-b-none"
        url="/pages/text/text?type=user"
      >
        <view class="flex flex-start item-center">
          <view class="iconfont icon-guide fo-28"> </view>
          <view class="ml-30 fo-28"> 用户指南 </view>
        </view>
        <view class="iconfont icon-arrow-right fo-28 fo-9"> </view>
      </navigator>
      <navigator
        class="p-30 flex flex-between item-center"
        :url="
          provider === 'qq' ? '/pages/login/phone/phone' : '/pages/login/login'
        "
      >
        <view class="flex flex-start item-center">
          <view class="iconfont icon-change-user fo-28"> </view>
          <view class="ml-30 fo-28"> 切换手机号 </view>
        </view>
        <view class="iconfont icon-arrow-right fo-28 fo-9"> </view>
      </navigator>
    </dd-card>

    <dd-card margin="30rpx 0 0 0">
      <navigator
        :class="[
          'p-30 flex flex-between item-center',
          isRider ? 'border-b-none' : '',
        ]"
        :url="isRider ? '/pages/rider/rider' : '/pages/rider/register/register'"
      >
        <view class="flex flex-start item-center">
          <view class="iconfont icon-send fo-28"> </view>
          <view class="ml-30 fo-28">
            {{ isRider ? "骑手中心" : "注册为骑手" }}
          </view>
        </view>
        <view class="iconfont icon-arrow-right fo-28 fo-9"> </view>
      </navigator>
      <view
        v-if="isRider"
        class="p-30 flex flex-between item-center"
        @click="changeVersion"
      >
        <view class="flex flex-start item-center">
          <view class="iconfont icon-change fo-28"> </view>
          <view class="ml-30 fo-28">
            {{ userVersion === "rider" ? "切换为用户版" : "切换为骑手版" }}
          </view>
        </view>
        <view class="iconfont icon-arrow-right fo-28 fo-9"> </view>
      </view>
    </dd-card>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { $get, post, info } from "@/util/request.js";
export default {
  data() {
    return {
      coupon: 0, //优惠券
      integral: 0, //积分
      provider: uni.getStorageSync("provider"),
    };
  },
  computed: {
    ...mapGetters(["userInfo", "userVersion", "isRider"]),
  },
  onLoad() {
    this.getCoupon();
  },
  methods: {
    ...mapMutations("auth", ["setUserVersion"]),
    async getCoupon() {
      uni.showLoading({});
      const res = await $get("home/mine");
      uni.hideLoading();
      if (res.code === 200) {
        this.integral = res.data.intergralCount;
        this.coupon = res.data.couponCount;
      }
    },
    getUserProfile() {
      uni.getUserProfile({
        lang: "zh_CN",
        desc: "展示用户头像",
        complete: async (up) => {
          if (up.userInfo) {
            const res = await post("user/update", {
              avatarUrl: up.userInfo.avatarUrl,
              city: up.userInfo.city,
              province: up.userInfo.province,
              gender: up.userInfo.gender,
              nickName: up.userInfo.nickName,
            });
            if (res.code === 200) {
              await info();
            }
          }
        },
      });
    },
    changeVersion() {
      const isRider = this.userVersion === "rider";
      this.setUserVersion(isRider ? "user" : "rider");
      uni.reLaunch({
        url: isRider ? "/pages/index/index" : "/pages/rider/order/order",
      });
    },
  },
};
</script>

<style lang="less">
.mine {
  padding: 30rpx 32rpx;
  .user-content {
    padding: 30rpx;
    background-color: @color-theme;
    border-radius: 8rpx;
    .avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 100rpx;
      border: 4rpx solid #ffffff;
      background-color: #ffffff;
      .icon-avatar {
        font-size: 100rpx;
      }
      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100rpx;
      }
    }
  }
  .panel-item {
    width: 330rpx;
    padding: 40rpx 0;
    border-radius: 8rpx;
    background-color: #ffffff;
    box-shadow: 0 0 10rpx 10rpx rgba(0, 0, 0, 0.05);
  }
}
</style>

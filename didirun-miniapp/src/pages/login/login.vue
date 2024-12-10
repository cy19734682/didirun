<template>
  <view class="login-container flex flex-center item-center">
    <view class="p-30">
      <view class="p-logo">
        <image class="image" src="../../static/logo.png"></image>
      </view>
      <view class="p-text">
        <view class="title">申请获取以下权限</view>
        <view class="dec">获得你的公开信息（昵称，头像等）</view>
      </view>
      <button
        class="login-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        手机号一键登录
      </button>
      <button
        v-if="provider !== 'qq'"
        class="mt-24 login-text"
        @click="redrictToPhone"
      >
        其他手机号登录
      </button>
    </view>
  </view>
</template>

<script>
import ClassicBtn from "../../components/classic/Button/ClassicButton.vue";
import { post } from "../../util/request.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    ClassicBtn,
  },
  data() {
    return {
      provider: uni.getStorageSync("provider"),
    };
  },
  computed: {
    ...mapGetters(["userVersion"]),
    isRiderVersion() {
      return this.userVersion === "rider";
    },
  },
  methods: {
    ...mapMutations("auth", ["setUserInfo"]),
    redrictToPhone() {
      uni.redirectTo({
        url: "/pages/login/phone/phone",
      });
    },
    async getPhoneNumber(event) {
      const provider = uni.getStorageSync("provider");
      if (event.detail.errMsg === "getPhoneNumber:ok") {
        if (provider === "weixin") {
          const { code } = event.detail;
          const result = await post("wxapp/register", {
            code,
          });
          if (result.code === 200) {
            this.setUserInfo(result.data);
            uni.reLaunch({
              url: !this.isRiderVersion
                ? "/pages/index/index"
                : "/pages/rider/order/order",
            });
          }
        } else if (provider === "alipay") {
          const { encryptedData, sign } = event.detail;
          const result = await post("alipay/register", {
            encryptedData,
            sign,
          });
          if (result.code === 200) {
            this.setUserInfo(result.data);
            uni.reLaunch({
              url: !this.isRiderVersion
                ? "/pages/index/index"
                : "/pages/rider/order/order",
            });
          }
        } else if (provider === "toutiao") {
          console.log("provider,event");
        }
      } else {
        uni.showToast({
          title: "小程序权限不足",
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="less">
.login-container {
  width: 100vw;
  height: 80vh;
  .p-logo{
    text-align: center;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);
    padding-bottom: 20rpx;
    image{
      width: 100rpx;
      height: 100rpx;
    }
  }
  .p-text{
    margin-top: 40rpx;
    .dec{
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #ccc;
    }
  }
  .login-btn {
    width: 690rpx;
    height: 100rpx;
    line-height: 100rpx;
    background-color: @color-theme;
    color: #ffffff;
    margin-top: 40rpx;
    &:active {
      opacity: 0.8;
    }
  }
  .login-text {
    height: 100rpx;
    line-height: 100rpx;
    background-color: #ffffff;
    color: @color-theme;
  }
}
</style>

<template>
  <view class="login-container flex flex-center item-center">
    <view class="p-30">
      <view class="text-center fo-50" style="margin-bottom: 160rpx">
        手机号码登录/注册
      </view>
      <!-- <ClassicBtn label="一键登录" width="690rpx"  /> -->
      <button
        class="login-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        一键登录/注册
      </button>
      <view
        v-if="provider !== 'qq'"
        class="mt-24 text-center fo-28 login-text"
        @click="redrictToPhone"
      >
        手机短信验证登录/注册
      </view>
    </view>
  </view>
</template>

<script>
import ClassicBtn from "../../components/classic/Button/ClassicButton.vue";
import { post } from "../../util/request.js";
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
    isRider() {
      return this.$store.state.auth.userVersion === "rider";
    },
  },
  methods: {
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
            this.$store.commit("auth/setUserInfo", result.data);
            uni.reLaunch({
              url: !this.isRider
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
            this.$store.commit("auth/setUserInfo", result.data);
            uni.reLaunch({
              url: !this.isRider
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
  height: 90vh;
  .login-btn {
    width: 690rpx;
    height: 100rpx;
    line-height: 100rpx;
    background-color: @color-theme;
    color: #ffffff;
    &:active {
      opacity: 0.8;
    }
  }
}
.login-text {
  color: @color-info;
}
</style>

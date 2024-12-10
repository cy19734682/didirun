<template>
  <view class="container">
    <!-- 经典版 -->
    <d-classic :city="city" />
    <CouponModal v-if="unreadCoupons.length > 0" />
  </view>
</template>

<script>
import DClassic from "../../components/classic/index.vue";
import { $get, login } from "../../util/request.js";
import CouponModal from "../../components/modal/CouponModal.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  components: {
    DClassic,
    CouponModal,
  },
  data() {
    return {
      city: uni.getStorageSync("currentCity"),
      isLoad: false,
    };
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "unreadCoupons",
      "userVersion",
      "startAddress",
      "endAddress",
      "share",
    ]),
  },
  onShow() {
    if (this.userInfo?.mobileNumber) {
      this.getUnreadCoupons()
    }
    if (!this.isLoad) {
      return;
    }
    const city = uni.getStorageSync("currentCity");
    if (this.startAddress?.city !== city) {
      this.setStartAddress({});
    }
    if (this.endAddress?.city !== city) {
      this.setEndAddress({});
    }
    if (this.city !== city) {
      this.getCityData(city);
    }
    this.city = city;
  },
  onShareTimeline(res) {
    //分享到朋友圈
    return {
      title: this.share.title || "智速送达",
      desc: this.share.desc || "",
      path: this.share.path || "/pages/index/index",
      imageUrl: this.share.imageUrl || "",
    };
  },
  onShareAppMessage() {
    return {
      title: this.share.title || "智速送达",
      desc: this.share.desc || "",
      path: this.share.path || "/pages/index/index",
      imageUrl: this.share.imageUrl || "",
    };
  },
  async onLoad() {
    // #ifdef MP-WEIXIN
    if (wx.hideHomeButton) {
      await wx.hideHomeButton();
    }
    if (wx.canIUse("hideHomeButton")) {
      await wx.hideHomeButton();
    }
    // #endif
    // 是否是骑手版
    const isRiderVersion = this.userVersion === "rider";
    if (isRiderVersion) {
      uni.reLaunch({
        url: "/pages/rider/order/order",
      });
      return;
    }
    await login();
    uni.getLocation({
      type: "gcj02",
      complete: async (res) => {
        if (res.errMsg === "getLocation:ok") {
          const result = await $get("home", {
            latitude: res.latitude,
            longitude: res.longitude,
          });
          if (result.code === 200) {
            this.city = result.data.address.city;
            uni.setStorageSync("currentCity", result.data.address.city);
            this.setCityNo(result.data.cityNo);
            this.setWeights(result.data.weights);
            this.setTags(result.data.tags);
            this.setDefaultAddress(result.data.address);
            this.setIsOp(true);
          } else {
            this.setIsOp(false);
            this.city = result.data.cityName;
            uni.setStorageSync("currentCity", result.data.cityName);
          }
        } else if (uni.getStorageSync("currentCity")) {
          await this.getCityData(uni.getStorageSync("currentCity"));
        } else {
          uni.navigateTo({
            url: "/pages/mine/address/city/city?type=home",
          });
        }
        this.isLoad = true;
      },
    });
  },
  methods: {
    ...mapMutations("home", [
      "setCityNo",
      "setWeights",
      "setTags",
      "setDefaultAddress",
      "setIsOp",
      "setStartAddress",
      "setEndAddress",
    ]),
    ...mapActions("home", ["getUnreadCoupons"]),
    async getCityData(keyword) {
      uni.showLoading();
      const result = await $get("home/city", {
        keyword,
      });
      uni.hideLoading();
      if (result.code === 200) {
        uni.setStorageSync("currentCity", result.data.cityName);
        this.setCityNo(result.data.cityNo);
        this.setWeights(result.data.weights);
        this.setTags(result.data.tags);
        this.setIsOp(true);
      } else {
        this.setIsOp(false);
      }
    },
  },
};
</script>

<style lang="less">
page {
  background-color: #f3f3f3;
}

.container {
  .content {
    padding: 30rpx;
  }
}
</style>

export default {
  namespaced: true,
  state: {
    userInfo: uni.getStorageSync("userInfo") || {}, //用户信息
    userVersion: uni.getStorageSync("userVersion") || "user", //用户版本（用户版/骑手版）
    isRider: uni.getStorageSync("isRider") || false,
  },
  getters: {},
  mutations: {
    setUserInfo(state, val) {
      uni.setStorageSync("userInfo", val);
      state.userInfo = val;
      uni.setStorageSync("isRider", !!val?.isRider);
      state.isRider = !!val?.isRider;
      if (!val?.isRider) {
        // 非骑手重置用户版本
        uni.setStorageSync("userVersion", "user");
        state.userVersion = "user";
      }
    },
    setUserVersion(state, val) {
      uni.setStorageSync("userVersion", val);
      state.userVersion = val;
    },
    setIsRider(state, val) {
      uni.setStorageSync("isRider", val);
      state.isRider = val;
    },
  },
  actions: {},
};

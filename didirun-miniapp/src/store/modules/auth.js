export default {
  namespaced: true,
  state: {
    userInfo: uni.getStorageSync("userInfo") || {}, //用户信息
    userVersion: uni.getStorageSync("userVersion") || 'user', //用户版本（用户版/骑手版）
  },
  getters: {},
  mutations: {
    setUserInfo(state, val) {
      uni.setStorageSync("userInfo", val);
      state.userInfo = val;
    },
    setUserVersion(state, val) {
      uni.setStorageSync("userVersion", val);
      state.userVersion = val;
    },
  },
  actions: {},
};

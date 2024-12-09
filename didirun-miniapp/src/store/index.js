import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth.js";
import home from "./modules/home.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {
    userInfo: (state) => state.auth.userInfo,
    userVersion: (state) => state.auth.userVersion,
    isRider: (state) => state.auth.isRider,
    cityNo: (state) => state.home.cityNo,
    tags: (state) => state.home.tags,
    weights: (state) => state.home.weights,
    weightCurrent: (state) => state.home.weightCurrent,
    desc: (state) => state.home.desc,
    tabCurrent: (state) => state.home.tabCurrent,
    startAddress: (state) => state.home.startAddress,
    endAddress: (state) => state.home.endAddress,
    buyStyle: (state) => state.home.buyStyle,
    notice: (state) => state.home.notice,
    share: (state) => state.home.share,
    isOp: (state) => state.home.isOp,
    feeTips: (state) => ["不添加小费", ...state.home.feeTips],
    unreadCoupons: (state) => state.home.unreadCoupons,
  },
  modules: {
    auth,
    home,
  },
});

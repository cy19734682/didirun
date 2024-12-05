import Vuex from 'vuex';
import Vue from 'vue';
import profile from './modules/profile';
Vue.use(Vuex);
interface IndexState {
  tempData: any;
}
export default () => {
  // eslint-disable-next-line import/no-named-as-default-member
  return new Vuex.Store({
    state: {
      tempData: null as any,
    } as IndexState,
    mutations: {
      setTempData(state: IndexState, val: any) {
        state.tempData = val;
      },
    },
    actions: {},
    modules: {
      profile
    }
  });
};

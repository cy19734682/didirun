<template>
  <div class="home-container">
    <div class="home-page-title">订阅消息设置</div>
    <a-tabs v-model="rowKey" @change="tabChange">
      <a-tab-pane key="mySubscribeRef" tab="我的模板" force-render>
        <MySubscribe ref="mySubscribeRef" />
      </a-tab-pane>
      <a-tab-pane key="pubSubscribeRef" tab="公共模板" force-render>
        <PubSubscribe ref="pubSubscribeRef" />
      </a-tab-pane>
      <a-tab-pane key="subscribeSettingRef" tab="消息设置" force-render>
        <SubscribeSetting ref="subscribeSettingRef" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import MySubscribe from '@/components/config/MySubscribe.vue';
import PubSubscribe from '@/components/config/PubSubscribe.vue';
import SubscribeSetting from '@/components/config/SubscribeSetting.vue';
export default Vue.extend({
  name: 'WxSubscribe',
  components: {
    MySubscribe,
    PubSubscribe,
    SubscribeSetting
  },
  layout: 'global',
  data() {
    return {
      rowKey: 'mySubscribeRef'
    };
  },
  mounted() {
    this.$refs.mySubscribeRef.init();
  },
  methods: {
    tabChange() {
      this.$refs[this.rowKey].init();
    }
  }
});
</script>

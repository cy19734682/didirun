<template>
  <a-modal
    title="取消订单理由"
    :visible="visible"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <a-radio-group v-model="cancelReason">
      <a-radio v-for="(item, index) in reasons" :key="index" :value="item">{{ item }}</a-radio>
    </a-radio-group>
    <div class="mt-12">
      <a-input v-model="cancelReason" placeholder="请输入其他原因"></a-input>
    </div>
  </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      visible: false,
      loading: false,
      orderNo: '',
      cancelReason: '',
      reasons: []
    };
  },
  mounted() {
    this.getAdminConfig();
  },
  methods: {
    open({ orderNo }) {
      this.orderNo = orderNo;
      this.cancelReason = '';
      this.visible = true;
    },
    async getAdminConfig() {
      const res = await (this as any).$api.adminCancelOrderGet();
      if (res.code === 200 && res.data) {
        this.reasons = res.data.adminCancelTips;
      }
    },
    async handleOk() {
      if (!this.cancelReason) {
        (this as any).$message.error('请输入取消原因');
        return;
      }
      this.loading = true;
      const res = await (this as any).$api.orderCancel({
        orderNo: this.orderNo,
        cancelReason: this.cancelReason
      });
      this.loading = false;
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.$emit('success');
      }
    }
  }
});
</script>

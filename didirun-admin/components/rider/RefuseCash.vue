<template>
  <a-modal
    title="拒绝提现理由"
    :visible="visible"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="loading"
    :destroy-on-close="true"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <a-input v-model="reason" placeholder="请输入拒绝的理由" />
  </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      visible: false,
      loading: false,
      cashNo: '',
      reason: ''
    };
  },
  methods: {
    open({ cashNo }) {
      this.cashNo = cashNo;
      this.reason = '';
      this.visible = true;
    },
    async handleOk() {
      this.loading = true;
      const res = await (this as any).$api.cashFail({
        cashNo: this.cashNo,
        reason: this.reason
      });
      this.loading = false;
      if (res.code === 200) {
        (this as any).$message.success('操作成功');
        this.$emit('success');
      }
    }
  }
});
</script>

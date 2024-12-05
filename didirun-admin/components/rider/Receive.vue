<template>
  <a-modal
    title="配送员"
    :visible="visible"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <ModalRider v-model="riderNo" />
  </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      visible: false,
      loading: false,
      riderNo: '',
      orderNo: '',
      type: 'receive' // receive  or send
    };
  },
  methods: {
    open({ orderNo, type }) {
      this.orderNo = orderNo;
      this.type = type;
      this.visible = true;
    },
    async handleOk() {
      this.loading = true;
      const res = await (this as any).$api[
        this.type === 'receive' ? 'orderReceive' : 'orderDeliver'
      ]({
        riderNo: this.riderNo,
        orderNo: this.orderNo
      });
      this.loading = false;
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.visible = false;
        this.$emit('success');
      }
    }
  }
});
</script>

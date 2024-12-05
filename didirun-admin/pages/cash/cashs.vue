<template>
  <div>
    <SearchTable
      ref="searchTableRef"
      title="提现列表"
      :search-options="searchOptions"
      :columns="columns"
      api="cashList"
      row-key="cashNo"
    >
      <template slot="cashBy" slot-scope="text">
        <div v-if="text.cashBy === 'user'">用户</div>
        <div v-else-if="text.cashBy === 'rider'">骑手</div>
        <div v-else>代理</div>
      </template>

      <template slot="amount" slot-scope="text">
        <div>{{ text.amount }}元</div>
      </template>

      <template slot="account" slot-scope="text">
        <div>{{ text.bankName }}</div>
        <div>{{ text.cardNo }}-{{ text.realname }}</div>
      </template>

      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status === 1" color="green"> 提现成功 </a-tag>
        <a-tag v-else-if="text.status === 0" color="orange"> 待提现 </a-tag>
        <a-tag v-else color="red"> 提现失败 </a-tag>
        <div v-if="text.status === -1" class="fo-9 fo-12">{{ text.reason }}</div>
      </template>
      <template slot="createTime" slot-scope="text">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="action" slot-scope="text">
        <Action
          :options="[
            { label: '提现成功', disabled: text.status === 1, key: 'success' },
            { label: '提现失败', disabled: text.status === -1, key: 'fail' }
          ]"
          @click-item="actionClick($event, text)"
        />
      </template>
    </SearchTable>
    <CashRefuse ref="cashRefuseRef" @success="getTableData()" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import CashRefuse from '~/components/rider/RefuseCash.vue';
export default Vue.extend({
  name: 'CashPage',
  components: { CashRefuse },
  layout: 'global',
  data() {
    return {
      searchOptions: [
        { key: 'bankName', type: 'text', label: '开户行' },
        { key: 'cardNo', type: 'text', label: '银行卡号' },
        { key: 'realname', type: 'text', label: '真实姓名' },
        { key: 'cashNo', type: 'text', label: '提现编号' },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：提现成功', value: 1 },
            { label: '状态：待提现', value: 0 },
            { label: '状态：提现失败', value: -1 }
          ]
        }
      ],
      columns: [
        {
          title: '编号',
          dataIndex: 'cashNo'
        },
        { title: '提现用户', key: 'cashBy', scopedSlots: { customRender: 'cashBy' } },
        { title: '用户', dataIndex: 'cashByNo', scopedSlots: { customRender: 'cashByNo' } },
        {
          title: '提现金额',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '提现账户',
          key: 'account',
          scopedSlots: { customRender: 'account' }
        },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'success':
          this.updateSuccess(text.cashNo);
          break;
        case 'fail':
          this.updateFail(text.cashNo);
          break;
      }
    },
    // 提现成功
    updateSuccess(cashNo: string) {
      (this as any).$confirm({
        title: '提示',
        content: '请确保提现已到账',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.cashSuccess({ cashNo });
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            this.$refs.searchTableRef.getTableData();
          }
        }
      });
    },
    // 体现失败
    updateFail(cashNo: string) {
      this.$refs.cashRefuseRef.open({ cashNo });
    },
    getTableData() {
      this.$refs.searchTableRef.getTableData();
    }
  }
});
</script>

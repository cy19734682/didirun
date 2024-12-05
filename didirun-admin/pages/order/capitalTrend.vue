<template>
  <SearchTable
    ref="searchTableRef"
    title="资金走向列表"
    :search-options="searchOptions"
    :columns="columns"
    api="orderCapitalTrendList"
  >
    <template slot="platformIncome" slot-scope="{ text }">
      <div>{{ text.platformIncome }}元</div>
    </template>

    <template slot="agentIncome" slot-scope="{ text }">
      <div>{{ text.agentIncome }}元 <agent-link class="ml-8" :no="text.agentNo" /></div>
    </template>

    <template slot="riderIncome" slot-scope="{ text }">
      <div>{{ text.riderIncome }}元 <rider-link class="ml-8" :no="text.riderNo" /></div>
    </template>

    <template slot="createTime" slot-scope="{ text }">
      <div class="fo-12">{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
    </template>
  </SearchTable>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'CapitalTrend',
  layout: 'global',
  data() {
    return {
      searchOptions: [
        { key: 'orderNo', type: 'text', label: '订单编号' },
        { key: 'agentNo', type: 'text', label: '代理编号' },
        { key: 'cityNo', type: 'text', label: '城市编号' },
        { key: 'desc', type: 'text', label: '描述' }
      ],
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderNo',
          width: 200
        },
        {
          title: '平台收入',
          key: 'platformIncome',
          scopedSlots: { customRender: 'platformIncome' }
        },
        { title: '代理收入', key: 'agentIncome', scopedSlots: { customRender: 'agentIncome' } },
        { title: '骑手收入', key: 'riderIncome', scopedSlots: { customRender: 'riderIncome' } },
        { title: '描述', key: 'desc', dataIndex: 'desc' },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } }
      ]
    };
  }
});
</script>

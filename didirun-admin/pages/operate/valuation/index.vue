<template>
  <SearchTable
    ref="searchTableRef"
    title="计价规则列表"
    :search-options="searchOptions"
    :columns="columns"
    api="cityValuationList"
  >
    <template slot="beginBtnGroup">
      <a-button type="primary" size="large" @click="$router.push('/operate/valuation/edit/add')"
        >添加计价规则</a-button
      >
    </template>

    <template slot="distanceContext" slot-scope="{ text }">
      <div v-for="(item, index) in text.ruleContext.distance" :key="index">
        在{{ item.gt }}~{{ item.lte }}公里范围内，<span v-if="item.unitDistance > 0"
          >每{{ item.unitDistance }}公里</span
        >加价{{ item.price }}元
      </div>
    </template>
    <template slot="weightContext" slot-scope="{ text }">
      <div v-for="(item, index) in text.ruleContext.weight" :key="index">
        在{{ item.gt }}~{{ item.lte }}公斤范围内，<span v-if="item.unitWeight > 0"
          >每{{ item.unitWeight }}公斤</span
        >加价{{ item.price }}元
      </div>
    </template>

    <template slot="timeContext" slot-scope="{ text }">
      <div v-for="(item, index) in text.ruleContext.weight" :key="index">
        在{{ item.gt }}~{{ item.lte }}时间段内，加价{{ item.price }}元
      </div>
    </template>

    <template slot="createTime" slot-scope="{ text }">
      <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
      <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
    </template>
    <template slot="action" slot-scope="{ text }">
      <admin-link :no="text.updatedBy" />
      <Action
        :options="[
          { label: '修改', key: 'update' },
          { label: '删除', key: 'delete' }
        ]"
        @click-item="actionClick($event, text)"
      />
    </template>
  </SearchTable>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Valuation',
  layout: 'global',
  data() {
    return {
      searchOptions: [{ key: 'ruleName', type: 'text', label: '规则名称' }],
      columns: [
        { title: '规则名称', dataIndex: 'ruleName' },
        {
          title: '距离规则',
          key: 'distanceContext',
          scopedSlots: { customRender: 'distanceContext' }
        },
        { title: '重量规则', key: 'weightContext', scopedSlots: { customRender: 'weightContext' } },
        { title: '时间规则', key: 'timeContext', scopedSlots: { customRender: 'timeContext' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'update':
          this.$store.commit('setTempData', text.ruleContext);
          this.$router.push({
            path: '/operate/valuation/edit/update',
            query: text
          });
          break;
        case 'delete':
          this.del(text.id);
          break;
      }
    },
    // 删除
    async del(id: number) {
      const res = await (this as any).$api.cityValuationDel({
        id
      });
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.$refs.searchTableRef.getTableData();
      }
    }
  }
});
</script>

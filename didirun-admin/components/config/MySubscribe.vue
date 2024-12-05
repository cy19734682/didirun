<template>
  <SearchTable
    ref="searchTableRef"
    :columns="columns"
    api="wxSubscribeTemplates"
    row-key="priTmplId"
    :init-data="false"
    :show-search-row="false"
    :show-center-row="false"
    :show-page="false"
    style="padding: 0"
  >
    <template slot="action" slot-scope="{ text }">
      <Action :options="[{ label: '删除', key: 'del' }]" @click-item="actionClick($event, text)" />
    </template>
  </SearchTable>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      columns: [
        { title: 'tmpID', dataIndex: 'priTmplId', width: 250 },
        { title: '标题', dataIndex: 'title', width: 250 },
        { title: '说明', dataIndex: 'content' },
        { title: '示例', dataIndex: 'example' },
        { title: '操作', width: 150, key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    };
  },
  methods: {
    init() {
      this.$refs.searchTableRef.getTableData();
    },
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'del':
          this.del(text.priTmplId);
          break;
      }
    },
    del(priTmplId: string) {
      (this as any).$confirm({
        title: '提示',
        content: '确定要删除吗？删除后可登录小程序账号进行恢复。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.wxSubscribeDel({ priTmplId });
          if (result.code === 200) {
            (this as any).$message.success('删除成功');
            this.$refs.searchTableRef.getTableData();
          }
        }
      });
    }
  }
});
</script>

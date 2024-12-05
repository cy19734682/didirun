<template>
  <SearchTable
    ref="searchTableRef"
    :columns="columns"
    api="wxSubscribeTitles"
    row-key="tid"
    :init-data="false"
    :show-search-row="false"
    :show-center-row="false"
    style="padding: 0"
  >
    <template slot="action" slot-scope="{ text }">
      <a-button type="link" @click="chooseTmp(text.tid, text.title)">选用</a-button>
    </template>
  </SearchTable>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      columns: [
        { title: 'ID', dataIndex: 'tid' },
        { title: '标题', dataIndex: 'title' },
        { title: '操作', width: 150, key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    };
  },
  methods: {
    init() {
      this.getCate();
    },
    async getCate() {
      const result = await (this as any).$api.wxSubscribeCate();
      if (result.code === 200) {
        const cates = result.data || [];
        if (cates?.length > 0) {
          this.$refs.searchTableRef.search({ ids: cates?.map(e => e.id)?.join(',') });
        }
      }
    },
    // 选用模板
    chooseTmp(tid: string, title: string) {
      this.$router.push({ path: '/config/wxSubscribeEdit', query: { tid, title } });
    }
  }
});
</script>

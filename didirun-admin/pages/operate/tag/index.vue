<template>
  <SearchTable
    ref="searchTableRef"
    title="物品标签组列表"
    :search-options="searchOptions"
    :columns="columns"
    api="tagGroupList"
  >
    <template slot="beginBtnGroup">
      <a-button type="primary" size="large" @click="$router.push('/operate/tag/edit/add')"
        >添加物品标签组</a-button
      >
    </template>

    <template slot="tags" slot-scope="{ text }">
      <div>{{ text.tags.toString() }}</div>
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
  name: 'Tag',
  layout: 'global',
  data() {
    return {
      searchOptions: [{ key: 'groupName', type: 'text', label: '标签组名称' }],
      columns: [
        { title: '标签组名称', dataIndex: 'groupName' },
        { title: '标签', key: 'tags', scopedSlots: { customRender: 'tags' } },
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
          this.$store.commit('setTempData', text.tags);
          this.$router.push({
            path: '/operate/tag/edit/update',
            query: { id: text.id, groupName: text.groupName, tags: text.tags.toString() }
          });
          break;
        case 'delete':
          this.del(text.id);
          break;
      }
    },
    // 删除
    async del(id: number) {
      const res = await (this as any).$api.tagGroupDel({
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

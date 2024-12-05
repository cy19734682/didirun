<template>
  <SearchTable
    ref="searchTableRef"
    title="重量标签列表"
    :search-options="searchOptions"
    :columns="columns"
    api="weightList"
  >
    <template slot="beginBtnGroup">
      <a-button type="primary" size="large" @click="$router.push('/operate/weight/edit/add')"
        >添加重量标签</a-button
      >
    </template>

    <template slot="tags" slot-scope="{ text }">
      <div v-for="(item, index) in text.tags" :key="index">{{ item.label }}</div>
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
  name: 'Weight',
  layout: 'global',
  data() {
    return {
      searchOptions: [{ key: 'tagName', type: 'text', label: '标签名称' }],
      columns: [
        { title: '标签名称', dataIndex: 'tagName' },
        { title: '重量标签', key: 'tags', scopedSlots: { customRender: 'tags' } },
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
            path: '/operate/weight/edit/update',
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
      const res = await (this as any).$api.weightDel({
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

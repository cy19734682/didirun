<template>
  <SearchTable
    ref="searchTableRef"
    title="用户列表"
    :search-options="searchOptions"
    :columns="columns"
    api="userList"
    row-key="userNo"
  >
    <template slot="avatarUrl" slot-scope="{ text }">
      <a-avatar size="large" icon="user" :src="text.avatarUrl" />
    </template>

    <template slot="address" slot-scope="{ text }">
      <div>{{ text.province || '----' }} {{ text.city }}</div>
    </template>

    <template slot="status" slot-scope="{ text }">
      <a-tag v-if="text.status" color="green"> 启用 </a-tag>
      <a-tag v-else color="red"> 禁用 </a-tag>
    </template>

    <template slot="createTime" slot-scope="{ text }">
      <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
      <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
    </template>

    <template slot="action" slot-scope="{ text }">
      <Action
        :options="[
          { label: '启用', disabled: text.status === 1, key: 'status', value: 1 },
          { label: '禁用', disabled: text.status === 0, key: 'status', value: 0 }
        ]"
        @click-item="actionClick($event, text)"
      />
    </template>
  </SearchTable>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'User',
  layout: 'global',
  data() {
    return {
      /* ---- 必要参数 start ---- */
      searchOptions: [
        { key: 'userNo', type: 'text', label: '用户编号' },
        { key: 'nickName', type: 'text', label: '昵称' },
        { key: 'mobileNumber', type: 'text', label: '手机号' },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：启用', value: 1 },
            { label: '状态：禁用', value: 0 }
          ]
        }
      ],
      columns: [
        {
          title: '编号',
          key: 'userNo',
          dataIndex: 'userNo'
        },
        { title: '头像', key: 'avatarUrl', scopedSlots: { customRender: 'avatarUrl' } },
        { title: '昵称', dataIndex: 'nickName' },
        { title: '手机号', dataIndex: 'mobileNumber' },
        { title: '地区', key: 'address', scopedSlots: { customRender: 'address' } },
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
        case 'status':
          this.updateStatus(text.userNo, obj.value);
          break;
      }
    },
    // 修改状态
    async updateStatus(userNo: string, value: any) {
      const res = await (this as any).$api.userStatus({
        userNo,
        status: value
      });
      if (res.code === 200) {
        (this as any).$message.success('修改状态成功');
        this.$refs.searchTableRef.getTableData();
      }
    }
  }
});
</script>

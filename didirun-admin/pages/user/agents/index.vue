<template>
  <SearchTable
    ref="searchTableRef"
    title="代理列表"
    :search-options="searchOptions"
    :columns="columns"
    api="agentList"
    row-key="agentNo"
  >
    <template slot="beginBtnGroup">
      <a-button type="primary" size="large" @click="$router.push('/user/agents/edit/add')"
        >添加代理</a-button
      >
    </template>

    <template slot="agentAccount" slot-scope="{ text }">
      <div>
        <div>{{ text.agentAccount }}</div>
        <div v-if="text.defaultPwd">初始密码:{{ text.defaultPwd }}</div>
      </div>
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
      <admin-link :no="text.updatedBy" />
      <Action
        :options="[
          { label: '修改', key: 'update' },
          { label: '启用', disabled: text.status === 1, key: 'status', value: 1 },
          { label: '禁用', disabled: text.status === 0, key: 'status', value: 0 },
          { label: '重置密码', key: 'resetPwd' }
        ]"
        @click-item="actionClick($event, text)"
      />
    </template>
  </SearchTable>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Agent',
  layout: 'global',
  data() {
    return {
      searchOptions: [
        { key: 'agentNo', type: 'text', label: '代理编号' },
        { key: 'agentAccount', type: 'text', label: '账号' },
        { key: 'mobileNumber', type: 'text', label: '手机号' },
        { key: 'realName', type: 'text', label: '昵称' },
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
        { title: '编号', dataIndex: 'agentNo' },
        { title: '账号', dataIndex: 'agentAccount' },
        { title: '手机号', dataIndex: 'mobileNumber' },
        { title: '姓名', dataIndex: 'realName' },
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
          this.updateStatus(text.agentNo, obj.value);
          break;
        case 'update':
          this.$router.push({ path: '/user/agents/edit/update', query: text });
          break;
        case 'resetPwd':
          this.resetPwd(text.agentNo);
          break;
      }
    },
    // 修改状态
    async updateStatus(agentNo: string, value: any) {
      const res = await (this as any).$api.agentStatus({
        agentNo,
        status: value
      });
      if (res.code === 200) {
        (this as any).$message.success('修改状态成功');
        this.$refs.searchTableRef.getTableData();
      }
    },
    // 重置密码
    async resetPwd(agentNo: string) {
      const res = await (this as any).$api.agentResetpwd({
        agentNo
      });
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.$refs.searchTableRef.getTableData();
      }
    }
  }
});
</script>

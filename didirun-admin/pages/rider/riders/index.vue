<template>
  <SearchTable
    ref="searchTableRef"
    title="骑手列表"
    :search-options="searchOptions"
    :columns="columns"
    api="riderList"
    row-key="riderNo"
  >
    <template slot="user" slot-scope="{ text }">
      <div
        class="flex flex-start item-center pointer"
        @click="$router.push({ path: '/user/users', query: { userNo: text.userNo } })"
      >
        <a-avatar icon="user" :size="32" :src="text.avatarUrl" />
        <div class="ml-8 fo-12">
          <div>{{ text.nickName }}</div>
          <div class="fo-9">{{ text.mobileNumber }}</div>
        </div>
      </div>
    </template>

    <template slot="accountBalance" slot-scope="{ text }">
      <div>{{ text.accountBalance || 0 }}元</div>
    </template>

    <template slot="startReceive" slot-scope="{ text }">
      <a-switch
        :checked="text.startReceive === 1"
        @change="receiveChange(text.riderNo, text.startReceive !== 1)"
      />
    </template>

    <template slot="status" slot-scope="{ text }">
      <a-tag v-if="text.status" color="green"> 启用 </a-tag>
      <a-tag v-else color="red"> 禁用 </a-tag>
    </template>
    <template slot="createTime" slot-scope="text">
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
  name: 'RiderPage',
  layout: 'global',
  data() {
    return {
      searchOptions: [
        { key: 'riderNo', type: 'text', label: '骑手编号' },
        { key: 'userNo', type: 'text', label: '用户编号' },
        { key: 'realname', type: 'text', label: '真实姓名' },
        { key: 'idCardNo', type: 'text', label: '身份证号码' },
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
          dataIndex: 'riderNo'
        },
        { title: '用户', key: 'user', scopedSlots: { customRender: 'user' } },
        { title: '身份', dataIndex: 'realname' },
        {
          title: '账户余额',
          key: 'accountBalance',
          scopedSlots: { customRender: 'accountBalance' }
        },
        {
          title: '开启接单',
          key: 'startReceive',
          scopedSlots: { customRender: 'startReceive' }
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
        case 'status':
          this.updateStatus(text.riderNo, obj.value);
          break;
      }
    },
    // 修改状态
    async updateStatus(riderNo: string, value: any) {
      const res = await (this as any).$api.riderStatus({
        riderNo,
        status: value
      });
      if (res.code === 200) {
        (this as any).$message.success('修改状态成功');
        this.$refs.searchTableRef.getTableData();
      }
    },
    // 接单状态修改
    async receiveChange(riderNo: string, startReceive: boolean) {
      const res = await (this as any).$api.riderReceiveSet({
        riderNo,
        startReceive
      });
      if (res.code === 200) {
        this.$refs.searchTableRef.getTableData();
      }
    }
  }
});
</script>

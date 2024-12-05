<template>
  <div>
    <SearchTable
      ref="searchTableRef"
      title="骑手审核列表"
      :search-options="searchOptions"
      :columns="columns"
      api="riderRegisterList"
    >
      <template slot="beginBtnGroup">
        <a-button type="primary" size="large" @click="$router.push('/rider/registers/edit/add')"
          >新增一位骑手</a-button
        >
      </template>

      <template slot="avatarFaceImage" slot-scope="{ text }">
        <img :src="imageCenterCrop(text.avatarFaceImage, 150, 100)" alt="" />
      </template>

      <template slot="nationalFaceImage" slot-scope="{ text }">
        <img :src="imageCenterCrop(text.nationalFaceImage, 150, 100)" alt="" />
      </template>

      <template slot="status" slot-scope="{ text }">
        <a-tag v-if="text.status === 0" color="blue"> 待审核 </a-tag>
        <a-tag v-else-if="text.status === 1" color="green"> 通过审核 </a-tag>
        <a-tag v-else-if="text.status === 2" color="red"> 未通过 </a-tag>
        <div v-if="text.status === 2" class="fo-12 mt-8 fo-9">{{ text.refuseReason }}</div>
      </template>
      <template slot="createTime" slot-scope="{ text }">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="action" slot-scope="{ text }">
        <Action
          :options="[
            { label: '通过审核', disabled: text.status !== 0, key: 'pass' },
            { label: '拒绝通过', disabled: text.status !== 0, key: 'refuse' }
          ]"
          @click-item="actionClick($event, text)"
        />
      </template>
    </SearchTable>
    <Refuse ref="refuseRef" @success="getTableData" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Refuse from '~/components/rider/Refuse.vue';
export default Vue.extend({
  name: 'RegisterRider',
  components: {
    Refuse
  },
  layout: 'global',
  data() {
    return {
      searchOptions: [
        { key: 'userNo', type: 'text', label: '用户编号' },
        { key: 'realname', type: 'text', label: '真实姓名' },
        { key: 'idCardNo', type: 'text', label: '身份证号码' },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：待审核', value: 0 },
            { label: '状态：已通过', value: 1 },
            { label: '状态：未通过', value: 2 }
          ]
        }
      ],
      columns: [
        { title: '用户编号', dataIndex: 'userNo' },
        { title: '姓名', dataIndex: 'realname' },
        { title: '身份证号码', dataIndex: 'idCardNo' },
        {
          title: '身份证头像照片',
          key: 'avatarFaceImage',
          scopedSlots: { customRender: 'avatarFaceImage' }
        },
        {
          title: '身份证国徽照片',
          key: 'nationalFaceImage',
          scopedSlots: { customRender: 'nationalFaceImage' }
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
        case 'pass':
          this.pass(text.userNo);
          break;
        case 'refuse':
          this.refuse(text.userNo);
          break;
      }
    },
    // 拒绝通过
    refuse(userNo: string) {
      this.$refs.refuseRef.open({ userNo });
    },
    // 通过审核
    async pass(userNo: string) {
      const res = await (this as any).$api.riderPass({
        userNo
      });
      if (res.code === 200) {
        (this as any).$message.success('操作成功');
        this.$refs.searchTableRef.getTableData();
      }
    },
    getTableData() {
      this.$refs.searchTableRef.getTableData();
    }
  }
});
</script>

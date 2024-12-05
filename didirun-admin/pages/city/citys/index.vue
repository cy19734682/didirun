<template>
  <SearchTable
    ref="searchTableRef"
    title="运营城市列表"
    :search-options="searchOptions"
    :columns="columns"
    api="cityList"
    row-key="cityNo"
  >
    <template slot="beginBtnGroup">
      <a-button type="primary" size="large" @click="$router.push('/city/citys/edit/add')"
        >添加运营城市</a-button
      >
    </template>
    <template slot="cityNo" slot-scope="{ text }">
      <div>{{ text.cityNo }}</div>
      <router-link :to="`/operate/valuation?id=${text.citysValuationId}`">【计价规则】</router-link>
      <div v-if="text.corwxChatid" class="fo-12 fo-9">「已有群聊」</div>
    </template>
    <template slot="city" slot-scope="{ text }">
      <div>{{ text.province }} - {{ text.cityName }}</div>
    </template>
    <template slot="startPrice" slot-scope="{ text }">
      <div>{{ text.startPrice }}元</div>
    </template>

    <template slot="extractHelpDeliver" slot-scope="{ text }">
      <div>
        <span>送 {{ (text.extractHelpDeliver * 100).toFixed(0) }}% | </span>
        <span>取 {{ (text.extractHelpGet * 100).toFixed(0) }}% | </span>
        <span>买 {{ (text.extractHelpBuy * 100).toFixed(0) }}% </span>
      </div>
    </template>
    <template slot="extractHelpDeliverForAgent" slot-scope="{ text }">
      <div>
        <span>送 {{ (text.extractHelpDeliverForAgent * 100).toFixed(0) }}% | </span>
        <span>取 {{ (text.extractHelpGetForAgent * 100).toFixed(0) }}% | </span>
        <span>买 {{ (text.extractHelpBuyForAgent * 100).toFixed(0) }}% </span>
      </div>
    </template>

    <template slot="agentNo" slot-scope="{ text }">
      <div v-if="!text.agentNo" class="fo-9">暂无代理</div>
      <agent-link v-else :no="text.agentNo"></agent-link>
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
          { label: text.corwxChatid ? '重新创建群聊' : '创建群聊', key: 'chat' },
          { label: '修改', key: 'update' },
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
  name: 'CityPage',
  layout: 'global',
  data() {
    return {
      searchOptions: [
        { key: 'cityNo', type: 'text', label: '城市编号' },
        { key: 'province', type: 'text', label: '省/直辖市/自治区' },
        { key: 'cityName', type: 'text', label: '城市名称' },
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
          key: 'cityNo',
          scopedSlots: { customRender: 'cityNo' }
        },
        { title: '城市', key: 'city', scopedSlots: { customRender: 'city' } },
        { title: '起步价', key: 'startPrice', scopedSlots: { customRender: 'startPrice' } },
        {
          title: '平台抽成',
          key: 'extractHelpDeliver',
          scopedSlots: { customRender: 'extractHelpDeliver' }
        },
        {
          title: '代理抽成',
          key: 'extractHelpDeliverForAgent',
          scopedSlots: { customRender: 'extractHelpDeliverForAgent' }
        },
        { title: '代理人', key: 'agentNo', scopedSlots: { customRender: 'agentNo' } },
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
          this.updateStatus(text.cityNo, obj.value);
          break;
        case 'update':
          this.$router.push({ path: '/city/citys/edit/update', query: text });
          break;
        case 'chat':
          this.$router.push({
            path: '/city/citys/edit/chat',
            query: { cityNo: text.cityNo, title: text.cityName }
          });
          break;
      }
    },
    // 修改状态
    async updateStatus(no: string, value: any) {
      const res = await (this as any).$api.cityStatus({
        cityNo: no,
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

<template>
  <div>
    <SearchTable
      ref="searchTableRef"
      title="订单列表"
      :search-options="searchOptions"
      :columns="columns"
      api="orderList"
      row-key="orderNo"
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

      <template slot="goods" slot-scope="{ text }">
        <div class="fo-12 bold">{{ text.goodsDesc }}</div>

        <div v-if="text.startAddress" class="fo-12">
          <span class="bold fo-6">起点:</span>
          <span class="fo-9"
            >{{ text.startAddress.city }}{{ text.startAddress.district
            }}{{ text.startAddress.addressDetail }}</span
          >
          <div class="fo-12">
            {{ text.startAddress.contactName }} - {{ text.startAddress.mobileNumber }}
          </div>
        </div>
        <div v-if="text.endAddress" class="fo-12">
          <span class="bold fo-6">终点:</span>
          <span class="fo-9"
            >{{ text.endAddress.city }}{{ text.endAddress.district
            }}{{ text.endAddress.addressDetail }}</span
          >
          <div class="fo-12">
            {{ text.endAddress.contactName }} - {{ text.endAddress.mobileNumber }}
          </div>
        </div>
      </template>

      <template slot="pay" slot-scope="{ text }">
        <div class="fo-12">
          <div class="show-price flex flex-between item-center">
            <div>起步价</div>
            <div>{{ text.startPrice }}元</div>
          </div>
          <div v-if="text.distancePrice > 0" class="show-price flex flex-between item-center">
            <div>路程价</div>
            <div>{{ text.distancePrice }}元</div>
          </div>
          <div v-if="text.weightPrice > 0" class="show-price flex flex-between item-center">
            <div>重量价</div>
            <div>{{ text.weightPrice }}元</div>
          </div>
          <div v-if="text.timePrice > 0" class="show-price flex flex-between item-center">
            <div>时间段价</div>
            <div>{{ text.timePrice }}元</div>
          </div>
          <div v-if="text.fee > 0" class="show-price flex flex-between item-center">
            <div>小费</div>
            <div>{{ text.fee }}元</div>
          </div>
          <div v-if="text.couponDiscount > 0" class="show-price flex flex-between item-center">
            <div>优惠券</div>
            <div>-{{ text.couponDiscount }}元</div>
          </div>
          <div class="show-price flex flex-between item-center bold">
            <div>支付金额</div>
            <div>{{ text.payAmount }}元</div>
          </div>
        </div>
      </template>
      <template slot="afterSale" slot-scope="{ text }">
        <div v-if="text.refundStatus === 0">无</div>
        <div v-if="text.cancelReason" class="fo-9 fo-12 mt-8">{{ text.cancelReason }}</div>
        <div v-if="text.refundStatus === 1" class="fo-12">
          <div>已退款 {{ text.refundAmount }}元</div>
          <div class="fo-9">No: {{ text.refundNo }}</div>
          <div class="fo-9">{{ dayjs(parseInt(text.refundTime)).format('YYYY/MM/DD HH:mm') }}</div>
        </div>
        <rider-link v-if="text.riderNo" :no="text.riderNo" />
      </template>

      <template slot="status" slot-scope="{ text }">
        <a-tag v-if="text.status === -2" color="#aaaaaa"> 已取消 </a-tag>
        <a-tag v-else-if="text.status === -1" color="#333333"> 已关闭 </a-tag>
        <a-tag v-else-if="text.status === 0" color="#0099FF"> 待付款 </a-tag>
        <a-tag v-else-if="text.status === 1" color="#ff6633"> 待接单 </a-tag>
        <a-tag v-else-if="text.status === 2" color="#FF6666"> 配送中 </a-tag>
        <a-tag v-else-if="text.status === 3" color="#FF3300"> 待确认完成 </a-tag>
        <a-tag v-else color="#00CC66"> 已完成 </a-tag>
      </template>
      <template slot="createTime" slot-scope="{ text }">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div v-if="text.payTime" class="fo-12">
          付款:{{ dayjs(text.payTime).format('YYYY/MM/DD HH:mm') }}
        </div>
        <div v-if="text.sendTime" class="fo-12">
          接单:{{ dayjs(text.sendTime).format('YYYY/MM/DD HH:mm') }}
        </div>
        <div v-if="text.getTime" class="fo-12">
          送完:{{ dayjs(text.getTime).format('YYYY/MM/DD HH:mm') }}
        </div>
        <div v-if="text.successTime" class="fo-12">
          完成:{{ dayjs(text.successTime).format('YYYY/MM/DD HH:mm') }}
        </div>
        <div v-if="text.closeTime" class="fo-12">
          关闭:{{ dayjs(text.closeTime).format('YYYY/MM/DD HH:mm') }}
        </div>
        <div v-if="text.cancelTime" class="fo-12">
          取消:{{ dayjs(text.cancelTime).format('YYYY/MM/DD HH:mm') }}
        </div>
      </template>
      <template slot="action" slot-scope="{ text }">
        <Action
          :options="[
            { label: '接单', disabled: text.status !== 1, key: 'receive' },
            { label: '配送完成', disabled: text.status !== 2, key: 'deliver' },
            { label: '确认完成', disabled: text.status !== 3, key: 'complate' },
            {
              label: '取消',
              disabled:
                text.status === 3 || text.status === 4 || text.status === -1 || text.status === -2,
              key: 'cancel'
            }
          ]"
          @click-item="actionClick($event, text)"
        />
      </template>
    </SearchTable>
    <Receive ref="receiveRef" @success="getTableData" />
    <Cancel ref="cancelRef" @success="getTableData" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Receive from '@/components/rider/Receive.vue';
import Cancel from '@/components/order/Cancel.vue';
export default Vue.extend({
  name: 'Orders',
  components: {
    Receive,
    Cancel
  },
  layout: 'global',
  data() {
    return {
      searchOptions: [
        { key: 'userNo', type: 'text', label: '用户编号' },
        { key: 'orderNo', type: 'text', label: '订单编号' },
        { key: 'riderNo', type: 'text', label: '骑手编号' },
        { key: 'mobileNumber', type: 'text', label: '用户手机号' },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '取消订单', value: -2 },
            { label: '交易关闭', value: -1 },
            { label: '待付款', value: 0 },
            { label: '待接单', value: 1 },
            { label: '配送中', value: 2 },
            { label: '待确认完成', value: 3 },
            { label: '订单已完成', value: 4 }
          ]
        }
      ],
      columns: [
        { title: '编号', dataIndex: 'orderNo', width: 200 },
        { title: '下单用户', key: 'user', scopedSlots: { customRender: 'user' } },
        { title: '下单金额', key: 'pay', scopedSlots: { customRender: 'pay' } },
        { title: '下单信息', key: 'goods', scopedSlots: { customRender: 'goods' } },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '售后', key: 'afterSale', scopedSlots: { customRender: 'afterSale' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'receive':
          this.receive(text.orderNo);
          break;
        case 'deliver':
          this.orderDeliver(text.orderNo);
          break;
        case 'complate':
          this.orderComplete(text.orderNo);
          break;
        case 'cancel':
          this.orderCancel(text.orderNo);
          break;
      }
    },
    // 接单
    receive(orderNo: string) {
      this.$refs.receiveRef.open({ orderNo, type: 'receive' });
    },
    // 订单配送
    orderDeliver(orderNo: string) {
      this.$refs.receiveRef.open({ orderNo, type: 'send' });
    },
    // 取消订单
    orderCancel(orderNo: string) {
      this.$refs.cancelRef.open({ orderNo });
    },
    // 订单完成
    orderComplete(orderNo: string) {
      (this as any).$confirm({
        title: '提示',
        content: '您确定不是误点吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.orderComplete({ orderNo });
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            this.$refs.searchTableRef.getTableData();
          }
        }
      });
    },
    // 刷新页面
    getTableData() {
      this.$refs.searchTableRef.getTableData();
    }
  }
});
</script>
<style scoped>
.show-price {
  width: 120px;
}
</style>

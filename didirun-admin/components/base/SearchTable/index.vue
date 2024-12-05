<template>
  <div class="home-container">
    <div v-if="title" class="home-page-title">{{ title }}</div>
    <div v-if="showSearchRow" class="search mt-20">
      <div class="flex flex-start flex-wrap">
        <div v-for="(item, index) in searchOptions" :key="index" class="search-item">
          <a-input
            v-if="item.type === 'text'"
            v-model="searchData[item.key]"
            :placeholder="item.label"
            type="text"
            allow-clear
            @keyup.enter.native="getTableData"
          />
          <a-select
            v-else-if="item.type === 'select'"
            v-model="searchData[item.key]"
            style="width: 200px"
            :placeholder="item.label"
            :options="item.options"
            allow-clear
          ></a-select>
        </div>
        <div>
          <a-button
            class="search-btn"
            size="large"
            type="primary"
            :loading="loading"
            @click="getTableData"
            >搜索</a-button
          >
          <a-button class="search-btn" size="large" @click="reset">重置</a-button>
        </div>
      </div>
      <a-divider></a-divider>
    </div>
    <div v-if="showCenterRow" class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <slot name="beginBtnGroup" />
      </div>
      <div class="flex flex-end item-center">
        <a-button size="large" icon="redo" :loading="loading" @click="getTableData"> </a-button>
      </div>
    </div>
    <a-table
      class="mt-20"
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :row-key="rowKey"
      :loading="loading"
      bordered
    >
      <template v-for="item in scopedSlotsC" :slot="item.key" slot-scope="text">
        <slot :name="item.key" :text="text" />
      </template>
    </a-table>
    <div v-if="showPage" class="mt-20 flex flex-end">
      <a-pagination
        v-model="query.current"
        size="small"
        :total="count"
        :page-size="query.pageSize"
        show-quick-jumper
        :show-total="total => `共 ${total} 条数据`"
        @change="getTableData"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'SearchTable',
  props: {
    title: {
      type: String,
      default: ''
    },
    // 是否初始化拉取数据
    initData: {
      type: Boolean,
      default: true
    },
    // 搜索项
    searchOptions: {
      type: Array,
      default: () => {
        /**
         * key '字段名称'
         * type '输入类型' text or select
         * label '显示名称'
         * like 是否是模糊查询
         * options select的选项值 格式: {label:'',value:''}
         */
        return [];
      }
    },
    // 表格列表项
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 请求API地址
    api: {
      type: String,
      default: ''
    },
    // 列表唯一key
    rowKey: {
      type: String,
      default: 'id'
    },
    // 是否展示搜索栏
    showSearchRow: {
      type: Boolean,
      default: true
    },
    // 是否展示中部栏
    showCenterRow: {
      type: Boolean,
      default: true
    },
    // 是否展示分页参数
    showPage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 分页条件
      query: {
        current: 1,
        pageSize: 20
      },
      // 搜索数据
      searchData: {},
      // 列表数据
      tableData: [],
      // 总数量
      count: 0,
      // 加载中
      loading: false
    };
  },
  computed: {
    scopedSlotsC() {
      return this.columns.filter(e => e.scopedSlots !== undefined);
    }
  },
  created() {
    if (this.initData) {
      this.searchData = this.$route.query || {};
      this.getTableData();
    }
  },
  methods: {
    search(data: Record<string, any>) {
      this.searchData = JSON.parse(JSON.stringify(data));
      this.getTableData();
    },
    reset() {
      this.searchData = {};
      this.getTableData();
    },
    // 获取列表数据
    getTableData() {
      const params: Record<string, any> = {
        ...this.query,
        ...this.searchData
      };
      this.loading = true;
      (this as any).$api[this.api](params)
        .then((result: any) => {
          if (result.code === 200) {
            this.tableData = result?.data?.data || result.data || [];
            this.count = result.data.count || 0;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
});
</script>
<style lang="less" scoped>
.search {
  .search-item {
    width: 200px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .search-btn {
    width: 120px;
  }
}
</style>

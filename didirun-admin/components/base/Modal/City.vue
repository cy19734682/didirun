<template>
  <a-select
    v-model="cityNo"
    show-search
    allow-clear
    style="width: 100%"
    placeholder="请选择运营城市"
    option-filter-prop="name"
    @change="onChange"
  >
    <a-select-option v-for="(item, index) in cityList" :key="index" :value="item.cityNo" :name="item.cityName" >
      {{ item.cityName }}
    </a-select-option>
  </a-select>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  model: {
    prop: 'no',
    event: 'change'
  },
  props: {
    no: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cityNo: undefined,
      cityList: []
    };
  },
  mounted() {
    this.queryCityList();
  },
  methods: {
    async queryCityList() {
      const item = await (this as any).$api.cityList({ pageSize: 999, status: 1 });
      if (item.code === 200) {
        this.cityList = item.data.data || [];
      }
    },
    onChange() {
      this.$emit('change', this.cityNo);
    }
  }
});
</script>

<template>
	<picker class="mt-32" @change="bindPickerChange" :value="weightCurrentT" range-key="label" :range="weights">
		<dd-card padding="30rpx" width="626rpx" >
			<view class="flex flex-between item-center weight-picker">
				<view class="flex flex-start item-center">
					<view class="iconfont icon-weight fo-28"></view>
					<view class="fo-28 ml-32">
						物品重量预估
					</view>
				</view>
				<view class="flex flex-end item-center">
					<view class="fo-28 fo-9">
						{{weights.length>0? weights[weightCurrentT].label : '暂无选项'}}
					</view>
					<view class="fo-28 fo-9 iconfont icon-arrow-right ml-16"></view>
				</view>
			</view>
		</dd-card>
	</picker>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
	export default {
		computed: {
      ...mapGetters(["weights",'weightCurrent']),
			weightCurrentT: {
				get() {
					return this.weightCurrent
				},
				set(val){
					this.setWeightCurrent(val)
				}
			}
		},
		methods: {
			...mapMutations('home',['setWeightCurrent']),
			bindPickerChange(e){
				this.weightCurrentT = e.detail.value
			}
		}
	}
</script>

<style lang="less">
.weight-picker{
	width: 626rpx;
}
</style>

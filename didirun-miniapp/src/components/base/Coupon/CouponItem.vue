<template>
	<view class="coupon-item flex flex-between" @click="$emit('click')">
		<view :class="['iconfont icon-coupon fo-32 mt-8', type+'-color']"></view>
		<view class="ml-30 coupon-item-content">
			<view class="flex flex-between item-center">
				<view :class="['fo-32 bold-500',type === 'active'?'fo-3':'overdue-color']">
					{{options.couponName}}
				</view>
				<view :class="[type === 'active'?'fo-3':'overdue-color']">
					<text class="fo-40 bold">{{options.discountAmount}}</text>
					<text class="fo-24" space="nbsp">  元</text>
				</view>
			</view>
			<view :class="['fo-24 mt-8', type === 'active'?'fo-9':'overdue-color']">
				{{options.conditionsAmount > 0 ? `满${options.conditionsAmount}元可用`:'无使用限制'}}
			</view>
			
			<view  :class="['fo-24 mt-16', type === 'active'?'fo-9':'overdue-color']">
				{{options.deadlineTime === '-1' ? '无限期':`有效期至 ${formatDate(options.deadlineTime, 'yyyy-MM-dd')}`}}
			</view>
			
		</view>
		<view v-if="type === 'overdue'" class=" overdue iconfont icon-overdue overdue-color"> </view>
	</view>
</template>

<script>
	import { formatDate } from '../../../util/date.js'
	export default {
		props: {
			type: {
				type: String,
				default: 'active'
			},
			options: {
				type: Object,
				default:()=> {return{}}
			}
		},
		methods: {
			formatDate
		}
	}
</script>

<style lang="less" scoped>
	.coupon-item{
		padding: 30rpx;
		background-color: #ffffff;
		box-shadow: 0 0 10rpx 10rpx rgba(0, 0, 0, 0.05);
		border-radius: 8rpx;
		margin-bottom: 30rpx;
		position: relative;
		
		.active-color{
			color: #ff8866;
		}
		.disable-color {
			color: #ff9900;
		}
		.overdue-color{
			color: #aaaaaa;
		}
		.coupon-item-content{
			width: 568rpx;
		}
		.overdue{
			font-size: 60rpx;
			position: absolute;
			right: 30rpx;
			top: 80rpx;
			transform: rotate(-15deg);
		}
	}
</style>

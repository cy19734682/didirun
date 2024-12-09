<template>
	<view>
		<ServerTab />
		<view class="classic-content">
			<AddressPicker :city="city" />
			<WeightPicker />
			<Desc />
			<view class="mt-32">
				<ClassicButton label="下一步" @click="doNext" />
			</view>
			<MineBtn type="user" />
		</view>
	</view>
</template>

<script>
  import { mapGetters } from "vuex";
	import ServerTab from './ServerTab/ServerTab.vue'
	import AddressPicker from './AddressPicker/AddressPicker.vue'
	import WeightPicker from './WeightPicker/WeightPicker.vue'
	import Desc from './Desc/Desc.vue'
	import ClassicButton from './Button/ClassicButton.vue'
	import MineBtn from './Button/MineButton.vue'
	import {
		HELP_BUY,
		BUY_NEARBY
	} from '../../util/constant.js'
	export default {
		props: {
			city: {
				type: String,
				default: '----'
			}
		},
		components: {
			ServerTab,
			AddressPicker,
			WeightPicker,
			Desc,
			ClassicButton,
			MineBtn
		},
    computed: {
      ...mapGetters([
        "tabCurrent",
        "buyStyle",
        "startAddress",
        "endAddress",
        "desc",
      ]),
    },
		methods: {
			doNext() {
				if (!(this.tabCurrent === HELP_BUY && this.buyStyle === BUY_NEARBY)) {
					const startAddress = this.startAddress;
					if (!startAddress.province || !startAddress.city || !startAddress.district || !startAddress.latitude ||
						!startAddress.longitude || !startAddress.contactName || !startAddress.mobileNumber ||
						!startAddress.addressDetail) {
						uni.showToast({
							title: '请补充完起点地址',
							icon: 'none'
						});
						return;
					}
				}
				const endAddress = this.endAddress;
				if (!endAddress.province || !endAddress.city || !endAddress.district || !endAddress.latitude ||
					!endAddress.longitude || !endAddress.contactName || !endAddress.mobileNumber ||
					!endAddress.addressDetail) {
					uni.showToast({
						title: '请补充完终点地址',
						icon: 'none'
					});
					return;
				}
				if(!this.desc){
					uni.showToast({
						title: '请描述您的物品',
						icon: 'none'
					});
					return ;
				}
				uni.navigateTo({
					url: '/pages/publish/publish'
				})
			}
		}
	}
</script>

<style lang="less">
	.classic-content {
		padding: 32rpx;
	}
</style>

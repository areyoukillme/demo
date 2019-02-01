<template>
	<div class="bigbox f_pr">
		<navbar>天气</navbar>
		<!-- <div class="routerbox">
			<div class="router" :class="{'isipx':isIphoneX,'haveTop':haveTop}" >
				<div v-for="(item,index) in List" @click.stop="change(item,index)" class="item"><span :class="{active:index==currentIndex}">
						{{item.name}}</span>
				</div>
			</div>
		</div> -->
	
		<div class=" box" :class="{'isipx':isIphoneX,'haveTop':haveTop}">
			<keep-alive>
				<component :is="componentName" ></component>
			</keep-alive>
		</div>
		
		
	</div>
</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import weather15 from './weather15.vue'
	import weather from './weather.vue'
	import station from './station.vue'
	export default {
		components: {
			weather,
			navbar,
			weather15,
			station,
		},
		data() {
			return {
				List: [{
					name: "实时气象",
					nav: "station"
				}, {
					name: "天气预报",
					nav: "weather"
				}, {
					name: "15天天气预报",
					nav: "weather15"
				}],
				currentIndex: 0,
				componentName: 'weather',
				isIphoneX:'',
				haveTop:''
			};
		},
		created(){
			this.judgeIphoneX()
			this.haveTop=this.$route.query.havetop=='hide'
		},
		methods: {
			change(item, index) {
				this.currentIndex = index;
				this.componentName = item.nav;
			},
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
		}
	}
</script>


<style lang="scss" scoped>
	.bigbox{min-height: inherit;}
	.box{}
	.box.isipx{}
	.box.haveTop{top:1.2rem !important;}
	.routerbox{height: 1.2rem;}
	.router.haveTop{top:0 !important;}
	.router.isipx{top:2.32rem;}
	.router {
		z-index:99;
		height: 1.2rem;
		position: fixed;
		width: 100%;
		top:1.706666rem;
		display: flex;
		font-family: PingFangSC-Regular;
		background: #fff;
		font-size: 0.346666rem;
		color: #C0C0C0;
		box-sizing: border-box;
		.item {
			flex: 1;
			text-align: center;
			line-height: 1.146666rem;
			font-size: 0.346666rem;
		
			.active {
				display: inline-block;
				font-family: PingFangSC-Semibold;
				font-size: 0.4rem;
				color: #4A90E2;
				border-bottom: 0.053333rem solid #4A90E2;
				box-sizing: border-box;
			}
		}
	}
</style>

<template>
	<div class="station f_pr">
		<h2 class="title">实时温度</h2>
		<p class="du">{{stationdata.temperature}}°C</p>
		<ul class="icon1">
			<li @click="change(0,'humidity')"><img src="../../assets/weather/airsidu.png" alt="" v-if="choose==0"><img src="../../assets/weather/airsidu1.png"
				 alt="" v-else><span>空气湿度{{stationdata.humidity}}</span></li>
			<li @click="change(1,'rainFall')"><img src="../../assets/weather/jiangyuliang.png" v-if="choose==1" alt=""><img src="../../assets/weather/jiangyuliang1.png"
				 alt="" v-else><span>降雨量{{stationdata.rainFall}}</span></li>
			<li @click="change(2,'rainIntensity')"><img src="../../assets/weather/jiangyuqiangdu.png" v-if="choose==2" alt=""><img
				 src="../../assets/weather/jiangyuqiangdu1.png" alt="" v-else><span>降雨强度{{stationdata.rainIntensity}}</span></li>
		</ul>
		<ul class="icon2">
			<li><img src="../../assets/weather/fengli.png" alt=""><span>{{stationdata.windSpeedLabel}}</span></li>
			<li><img src="../../assets/weather/fengxiang.png" alt=""><span>{{stationdata.winDirectLabel?stationdata.winDirectLabel:'无风'}}</span></li>
		</ul>
		<img class="lunpan" src="../../assets/weather/lunpan.png" alt="">
		<span class="show f_pa">{{stationdata[item]}}</span>
		<span class="danwei f_pa">{{danwei}}</span>
		<span class="left">{{stationdata[item] | left}}</span>
		<span class="righ">{{stationdata[item] | right}}</span>
	</div>
</template>

<script>
	import {
		station
	} from '../../service/getData.js'
	export default {
		data() {
			return {
				tokenId: this.$route.query.tokenId,
				stationdata: '',
				choose: 0,
				item: 'humidity',
			
			}

		},
		created() {
			this.station()
			
		},
		filters:{
			left:function(input){
				if(input<100){
					return parseInt(input/10)*10
				}
				else{
					return parseInt(input/100)*100
				}
			},
			right:function(input){
				if(input<100){
					return (parseInt(input/10)+1)*10
				}
				else{
					return (parseInt(input/100)+1)*100
				}
			}
		},
		computed: {
			danwei() {
				if (this.item == "humidity") {
					return "%"
				}
				if (this.item == "rainFall") {
					return "mm"
				}
				if (this.item == "rainIntensity") {
					return "mm/min"
				}
			}
		},
		methods: {
			async station() {
				let res = await station(this.tokenId)
				if (res.code == 0) {
					this.stationdata = res.data
				}
			},
			change(index, item) {
				this.choose = index;
				this.item = item;
			},
			

		}
	}
</script>

<style scoped lang="scss">
	.station {
		background-image: linear-gradient(-231deg, #A0D2FF 0%, #5086CD 91%);
		height: 100%;

	}

	.title {
		padding-top: 1.146666rem;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		letter-spacing: 1px;
		text-align: center;
		line-height: 0.533333rem;
	}

	.du {
		font-family: PingFangSC-Medium;
		font-size: 1.2rem;
		color: #FFFFFF;
		letter-spacing: 0.0428rem;
		text-align: center;
		line-height: 1.68rem;
	}

	.icon1 {
		margin-top: 1.16rem;
		display: flex;

		li {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			img {
				width: 1.36rem;
				height: 1.36rem;
			}

			span {
				font-family: PingFangSC-Regular;
				font-size: 0.373333rem;
				color: #FFFFFF;
				letter-spacing: 1px;
				text-align: center;
				line-height: 0.533333rem;
				margin-top: 0.266666rem;
			}

			;
		}
	}

	.icon2 {
		margin-top: 0.68rem;
		display: flex;
		padding: 0 16.6%;

		li {

			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			img {
				width: 1.36rem;
				height: 1.36rem;
			}

			span {
				font-family: PingFangSC-Regular;
				font-size: 0.373333rem;
				color: #FFFFFF;
				letter-spacing: 1px;
				text-align: center;
				line-height: 0.533333rem;
				margin-top: 0.266666rem;
			}

			;
		}
	}

	.lunpan {
		width: 100%;
		height: auto;
		bottom: 0;
		position: absolute;
		padding: 0;
		margin: 0;

	}

	.show {
		font-family: PingFangSC-Medium;
		font-size: 0.533333rem;
		color: #FFFFFF;
		letter-spacing: 0.019066rem;

		bottom: 1.866666rem;
		margin-left: 50%;
		transform: translateX(-50%);
	}

	.danwei {
		ont-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		letter-spacing: 1px;
		text-align: center;
		line-height: 0.533333rem;
		bottom: 1.346666rem;
		margin-left: 50%;
		transform: translateX(-50%);
	}

	.left {
		position: absolute;
		opacity: 0.53;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		letter-spacing: 1px;
		bottom:0.533333rem;
		margin-left:15%;
		left:0;
		transform: translateX(-50%);
	}
	.righ{
		position: absolute;
		opacity: 0.53;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		letter-spacing: 1px;
		bottom:0.533333rem;
		margin-right:15%;
		right:0;
		transform: translateX(50%);
	}
</style>

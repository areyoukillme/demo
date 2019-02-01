<template>
	<div>
		<div class="content">
			<img src="../../assets/position.png" alt="" class="imgbox pa" height="100%">
			<div class="where pa">
				<span>{{cityName}}</span>
			</div>
			<div class="pa detail">{{des}}</div>

		</div>
		<div class="data15">
			<ul v-for="(item,index) in datalist" :key="index">
				<li>
					<div class="fl">
						<p class="dayweek">{{item.fmtDate}}</p>
						<h2 class="daytime">{{item.dateLabel}}</h2>
					</div>

					<div class="fr">
						<ul class="ul_content">
							<li class="li_content f_pr">
								<img :src="item.weather | imgurl" alt="" class="img f_pa">
								<span class="show0">{{item.weather}}</span>
								<span class="show1">{{item.highTemp}}°C</span>
								<span class="show2">{{item.windDirDay}}/{{item.windLevelDay}}级</span>
								<span class="show3">风速<{{item.windSpeedMax}}</span>
							</li>
							<li class="mgt li_content f_pr">
								<img :src="item.weather | imgurl" alt="" class="img f_pa">
								<span class="show0">{{item.weather}}</span>
								<span class="show4">{{item.lowTemp}}°C</span>
								<span class="show5">{{item.windDirNight}}/{{item.windLevelNight}}级</span>
								<span class="show6">风速<{{item.windSpeedMax}}</span>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import {
		weather
	} from '../../service/getData.js'
	import navbar from '../../components/common/navbar.vue'
	export default {
		components: {
			navbar
		},
		filters:{
			imgurl:function(myInput,name){
				if(myInput=="晴"){
					return require('../../assets/weather/'+"qing"+'@2x.png') 
				}
				else if(myInput=="小雨"){
					return require('../../assets/weather/'+'xiaoyu'+'@2x.png')
				}
				else if(myInput=="中雨"){
					return require('../../assets/weather/'+'zhongyu'+'@2x.png')
				}
				else if(myInput=="大雨"){
					return  require('../../assets/weather/'+'dayu'+'@2x.png')
				}
				else if(myInput=="雷阵雨"){
					return  require('../../assets/weather/'+'leizhenyu'+'@2x.png')
				}
				else if(myInput=="阴"){
					return require('../../assets/weather/'+'yin'+'@2x.png') 
				}
				else if(myInput=="暴雨"){
					return  require('../../assets/weather/'+'baoyu'+'@2x.png')
				}
				else if(myInput=="雾"){
					return  require('../../assets/weather/'+'wu'+'@2x.png')
				}
				else if(myInput=="霾"){
					return require('../../assets/weather/'+'mai'+'@2x.png')
				}
				else if(myInput=="阵雨"){
					return require('../../assets/weather/'+'zhenyu'+'@2x.png')
				}
				else if(myInput=="多云"){
					return require('../../assets/weather/'+'duoyun'+'@2x.png')
				}
				else if(myInput=="阴"){
					return require('../../assets/weather/'+'yin'+'@2x.png')
				}
				else if(myInput=="雨"){
					return require('../../assets/weather/'+'zhenyu'+'@2x.png')
				}
			}
		},
		data() {
			return {
				cityName:'',
				datalist:'',
				pinjun:'',
				des:'',
				sidu:'',
				farmId:this.$route.query.farmId,
				tokenId:this.$route.query.tokenId,
			};
		},
		created(){this.getweather()},
		methods:{
			async getweather(){
				let res=await weather(this.farmId,this.tokenId);
				if(res.code==0){
					this.cityName=res.data.cityName;
					this.datalist=res.data.weatherList.slice(1)
					this.des=res.todayDetail.tips
					this.sidu=res.todayDetail.humidity
				}
			}
		}

	}
</script>

<style scoped lang="scss">
	.pa {
		position: absolute;
	}

	.tac {
		text-align: center;
	}

	.m10 {
		margin-top: 0.133333rem;
	}

	.m27 {
		margin-top: 0.36rem;
	}

	.title {
		text-align: center;
		height: 1.706666rem;
		padding-top: 0.533333rem;
		line-height: 1.173333rem;
		font-size: 0.453333rem;
		font-weight: 600;

	}

	.content {
		height: 1.893333rem;
		background: #86BAEF;
		position: relative;

	}

	.content .imgbox {
		width: 0.32rem;
		height: 0.32rem;
		top: 0.38rem;
		left: 0.373333rem;
	}

	.content .where {
		font-size: 0.4rem;
		font-family: PingFangSC-Regular;
		line-height: 0.56rem;
		top: 0.24rem;
		left: 0.96rem;
	}

	.content .where span {
		color: #ffffff;
	}

	.content .where img {
		vertical-align: middle;
		height: 0.16rem;
		width: 0.213333rem;
		margin-left: 0.133333rem;

	}

	.content .detail {
		top: 1.04rem;
		padding-left: 0.826666rem;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		letter-spacing: 0.005333rem;
	}

	.content .detail span {
		color: #FFFFFF;
	}

	.data15 {
		background: #86BAEF;
		line-height: 0.533333rem;
		padding-bottom: 1rem;
	}

	.data15>ul>li {
		overflow: hidden;
		background: rgba(50, 84, 137, 0.26);
		margin-bottom: 0.266666rem;
	}

	.data15 ul li .fl {
		height: 2.4rem;
		float: left;
		width: 1.6rem;

	}

	.data15 ul li .fl p {
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		margin-top: 0.533333rem;
		text-align: center;
	}

	.data15 ul li .fl h2 {
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		text-align: center;
		margin-top: 0.133333rem;
	}

	.data15 ul li .fl {
		float: left;
		border-right: 2px solid #86BAEF;

	}

	.data15 ul li .fr .weatherimg {
		width: 1.8rem;
		display: inline-block;
		float: left;
		height: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

	}

	.data15 ul li .fr .weatherimg .weatherimgbox {
		vertical-align: center;
		height: 1rem;
		width: 1rem;
	}

	.weatherdsc {
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
	}

	.data15 ul li .fr {
		height: 2.4rem;
		float: left;
		padding-top: 0.346666rem;
		padding-bottom: 0.306666rem;

	}

	.data15 .ul_content {
		display: inline-block;
		float: left;
	}

	.data15 ul li .fr .mgt {
		margin-top: 0.6rem;
	}

	.data15 ul li .fr ul li span {
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		display: inline-block;

	}

	.data15 .show1 {
		display: inline-block;
		width: 1.6rem;
		text-align: center;

	}

	.data15 .show4 {
		display: inline-block;
		width: 1.6rem;
		text-align: center;

	}

	.data15 .show2 {
		display: inline-block;
		width: 2.5rem;
		text-align: center;

	}

	.data15 .show5 {
		display: inline-block;
		width: 2.5rem;
		text-align: center;

	}
	.data15 .show0{
		display: inline-block;
		width:1.8rem;
		text-align: left;
		padding-left:1rem;
		
	}
	.data15 .show3{margin-left: 0.366666rem;}
	.data15 .show6{margin-left: 0.366666rem;}
	
	.li_content img{width:0.693333rem; height: 0.64rem;top:-0.066666rem;left:0.266666rem}
</style>

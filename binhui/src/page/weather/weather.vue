<template>
	<div>
		<div class="content">
			<img src="../../assets/position.png" alt="" class="imgbox pa" height="100%">
			<div class="where pa">
				<span>{{cityName}}</span>
			</div>
			<div class="number f_pa">{{farmNum}}号农场</div>
			<div class="much pa" v-show="show">{{Number(todaylist.temperature)}}°</div>
			<div class="descript">{{todaytext.weather}}</div>
			<div class="daytime f_pa">{{todaytext.fmtDate}}&nbsp;&nbsp;{{todaytext.date | month}}</div>
			<div class="desc pa" v-show="show">{{todaylist.condition}}{{todaylist.windDir}}
			</div>
			<ul class="f_pa bottomul">
				<li class="libox">
					<img src="../../assets/weather/fengxiang.png" alt="">
					<h4>{{todaytext.windDesc}}</h4>
					<p>{{Number(todaytext.windLevelMax)}}级</p>
				</li>
				<li class="libox">
					<img src="../../assets/weather/jiangyuliang.png" alt="">
					<h4>近10小时降雨量</h4>
					<p>1000mm</p>
				</li>
				<li class="libox">
					<img src="../../assets/weather/airsidu.png" alt="">
					<h4>空气湿度</h4>
					<p>70%</p>
				</li>
			</ul>
		</div>
		<div class="charts">
			<ul>
				<li class="yestoday">
					<div class="chartcontent bdr">
						<p class="tac">昨天</p>
						<p class="time tac m10">{{datalist0.fmtDate}}</p>
						<p class=" tac m27 yun"><img :src="datalist0.weather | imgurl" class="weatherbox yestodayimg"></p>
						<p class="wind tac">{{datalist0.windDesc}}</p>
					</div>
				</li>
				<li>
					<div class="chartcontent bdr">
						<p class="tac">今天</p>
						<p class="time tac m10">{{datalist1.fmtDate}}</p>
						<p class="tac m27 yun"><img :src="datalist1.weather | imgurl" alt="" class="weatherbox"></p>
						<p class="wind tac">{{datalist1.windDesc}}</p>
					</div>
				</li>
				<li>
					<div class="chartcontent bdr">
						<p class="tac">明天</p>
						<p class="time tac m10">{{datalist2.fmtDate}}</p>
						<p class="tac m27 yun"><img :src="datalist2.weather | imgurl" alt="" class="weatherbox"></p>
						<p class="wind tac">{{datalist2.windDesc}}</p>
					</div>
				</li>
				<li>
					<div class="chartcontent bdr">
						<p class="tac">后天</p>
						<p class="time tac m10">{{datalist3.fmtDate}}</p>
						<p class="tac m27 yun"><img :src="datalist3.weather | imgurl" alt="" class="weatherbox"></p>
						<p class="wind tac">{{datalist3.windDesc}}</p>
					</div>
				</li>
				<li>
					<div class="chartcontent">
						<p class="tac">大后天</p>
						<p class="time tac m10">{{datalist4.fmtDate}}</p>
						<p class="tac m27 yun"><img :src="datalist4.weather | imgurl" alt="" class="weatherbox"></p>
						<p class="wind tac">{{datalist4.windDesc}}</p>
					</div>
				</li>

				<div id="echarts"></div>
			</ul>
		</div>
	</div>
</template>
<script scoped>
	import {
		weather
	} from '../../service/getData.js'
	import navbar from '../../components/common/navbar.vue'
	let echarts = require('echarts/lib/echarts')
	// 引入线形图组件
	require('echarts/lib/chart/line')
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/legend')
	export default {
		components: {
			navbar,

		},
		created() {
			this.tokenId = this.$route.query.tokenId
			this.deviceType = this.$route.query.deviceType
			this.getweather()
		},
		filters: {
			imgurl: function(myInput, name) {
				if (myInput == "晴") {
					return require('../../assets/weather/' + "qing" + '@2x.png')
				} else if (myInput == "小雨") {
					return require('../../assets/weather/' + 'xiaoyu' + '@2x.png')
				} else if (myInput == "中雨") {
					return require('../../assets/weather/' + 'zhongyu' + '@2x.png')
				} else if (myInput == "大雨") {
					return require('../../assets/weather/' + 'dayu' + '@2x.png')
				} else if (myInput == "雷阵雨") {
					return require('../../assets/weather/' + 'leizhenyu' + '@2x.png')
				} else if (myInput == "阴") {
					return require('../../assets/weather/' + 'yin' + '@2x.png')
				} else if (myInput == "暴雨") {
					return require('../../assets/weather/' + 'baoyu' + '@2x.png')
				} else if (myInput == "雾") {
					return require('../../assets/weather/' + 'wu' + '@2x.png')
				} else if (myInput == "霾") {
					return require('../../assets/weather/' + 'mai' + '@2x.png')
				} else if (myInput == "阵雨") {
					return require('../../assets/weather/' + 'zhenyu' + '@2x.png')
				} else if (myInput == "多云") {
					return require('../../assets/weather/' + 'duoyun' + '@2x.png')
				} else if (myInput == "阴") {
					return require('../../assets/weather/' + 'yin' + '@2x.png')
				} else if (myInput == "雨") {
					return require('../../assets/weather/' + 'zhenyu' + '@2x.png')
				}
			},
			month: function(input) {
				let week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				let index = new Date(input).getDay()
				return week[index]
			}
		},
		data() {
			return {
				farmNum: '',
				cityName: '',
				farmId: this.$route.query.farmId,
				show: false,
				deviceType: '',
				tokenId: '',
				datalist: '',
				todaylist: '',
				todaytext: '',
				datalist0: '',
				datalist1: '',
				datalist2: '',
				datalist3: '',
				datalist4: '',
				wechart: '',
				option: {
					// 设置间隙
					grid: {
						x: '10%',
						right: '10%',
						bottom: '0%',
						top: '20%',
						containLabel: false
					},

					xAxis: {
						type: 'category',
						boundaryGap: false,
						show: false
					},
					yAxis: {
						type: 'value',
						show: false,
						splitLine: {
							show: false
						}, //去除网格线
						type: 'value',
						axisLabel: {},
					},
					series: [
						// 高温
						{
							name: '',
							type: 'line',
							smooth: false, //关键点，为true是不支持虚线，实线就用true
							symbolSize: 10,

							itemStyle: {
								normal: {
									borderWidth: 2,
									color: "#9b9b9b",
									lineStyle: {
										color: "#9b9b9b",
										width: 2,
										type: 'dotted' //'dotted'虚线 'solid'实线
									},
									//	显示数值
									label: {
										show: true,
										fontSize: 18,
										color: "#e9e9e9",
										// 添加单位
										formatter: function(param) {
											return param.value + "°"
										}
									}
								}
							},
							data: ''
						},
						{
							name: '',
							type: 'line',
							symbolSize: 10,
							itemStyle: {
								normal: {
									borderWidth: 2,
									color: "#999",
									lineStyle: {
										color: "#979797",
										width: 2,
										type: 'solid' //'dotted'虚线 'solid'实线
									},
									//	显示数值
									label: {
										show: true,
										color: "#333",
										fontSize: 18,
										formatter: function(param) {
											return param.value + "°"
										}
									}
								}
							},
							data: ["-", {
								value: 24,
								symbol: "circle"
							}, 19, 23, 22]
						},
						// 低温
						{
							name: '',
							type: 'line',
							smooth: false, //关键点，为true是不支持虚线，实线就用true
							symbolSize: 10,
							itemStyle: {
								normal: {
									borderWidth: 2,
									color: "#9b9b9b", //圆点颜色
									lineStyle: {
										color: '#9b9b9b',
										width: 2,
										type: 'dotted' //'dotted'虚线 'solid'实线
									},
									//	显示数值
									label: {
										show: true,
										color: "#e9e9e9",
										fontSize: 18,
										position: 'bottom',
										formatter: function(param) {
											return param.value + "°"
										}

									}
								}
							},
							data: [11, 17, "-", "-", "-"]
						},
						{
							name: '',
							type: 'line',
							symbolSize: 10,

							itemStyle: {
								normal: {
									borderWidth: 2,
									color: "#999",
									lineStyle: {
										color: "#979797",
										width: 2,
										type: 'solid' //'dotted'虚线 'solid'实线
									},
									//	显示数值
									label: {
										show: true,
										color: '#333',
										fontSize: 16,
										position: 'bottom',
										formatter: function(param) {
											return param.value + "°"
										},

									}
								}
							},
							data: ["-", {
								value: 17,
								symbol: 'circle'

							}, 16, 14, 17]
						},

					]
				}
			}
		},
		methods: {

			async getweather() {
				let res = await weather(this.farmId, this.tokenId);
				if (res.code == 0) {
					this.show = true
					this.cityName = res.data.cityName
					this.farmNum = res.data.farmName
					let datalist = res.data.weatherList.slice(0, 5)
					this.datalist = datalist;
					this.todaylist = res.todayDetail
					this.todaytext = res.data.weatherList[1]
					this.datalist0 = this.datalist[0]
					this.datalist1 = this.datalist[1]
					this.datalist2 = this.datalist[2]
					this.datalist3 = this.datalist[3]
					this.datalist4 = this.datalist[4]
					var higharr1 = [datalist[0].highTemp, datalist[1].highTemp, "-", "-", "-"];
					var higharr2 = ["-", {
						value: datalist[1].highTemp,
						symbol: "circle"
					}, datalist[2].highTemp, datalist[3].highTemp, datalist[4].highTemp];
					var lowarr1 = [datalist[0].lowTemp, datalist[1].lowTemp, "-", "-", "-"];
					var lowarr2 = ["-", {
						value: datalist[1].lowTemp,
						symbol: "circle"
					}, datalist[2].lowTemp, datalist[3].lowTemp, datalist[4].lowTemp];
					this.option.series[0].data = higharr1;
					this.option.series[1].data = higharr2;
					this.option.series[2].data = lowarr1;
					this.option.series[3].data = lowarr2;
					let scwidth = document.body.clientWidth;
					for (let i = 0; i < 4; i++) {
						this.option.series[i].symbolSize = 14 * scwidth / 750
						this.option.series[i].itemStyle.normal.label.fontSize = 28 * scwidth / 750
					}
					this.option = Object.assign({}, this.option)
					this.weichart.setOption(this.option)

				}
			}
		},
		mounted() {
			this.weichart = echarts.init(document.getElementById('echarts'));
			this.getweather()
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
		border-bottom: 0.013333rem solid #828282;
	}

	.content {
		height: 7.466666rem;
		background-image: linear-gradient(-231deg, #A0D2FF 0%, #5086CD 91%);
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
		left: 0.96rem
	}

	.content .where span {
		color: #fff;
	}

	.daytime {
		top: 3.24rem;
		width: 100%;
		text-align: center;
		font-size: 0.32rem;
		color: #FFFFFF;
		letter-spacing: 0.35px;
	}

	.bottomul {
		position: absolute;
		top: 4.693333rem;
		display: flex;
		width: 100%;

		.libox {
			flex: 1;
			text-align: center;

			img {
				width: 0.96rem;
				height: 0.96rem;
			}

			h4 {
				font-size: 0.373333rem;
				color: #FFFFFF;
				letter-spacing: 1px;
				margin-top: 0.213333rem;
				line-height: 0.533333rem;
			}

			p {
				font-size: 0.373333rem;
				color: #FFFFFF;
				letter-spacing: 1px;
				line-height: 0.44rem;
				margin-top: 0.053333rem;
			}
		}
	}

	.content .where img {
		vertical-align: middle;
		height: 0.16rem;
		width: 0.213333rem;
		margin-left: 0.133333rem;

	}

	.number {
		top: 0.84rem;
		width: 100%;
		font-size: 0.373333rem;
		color: #FFFFFF;
		letter-spacing: 1px;
		text-align: center;
		line-height: 0.533333rem;
	}

	.content .much {
		font-family: PingFangSC-Thin;
		font-size: 1.2rem;
		line-height: 1.68rem;
		color: #FFFFFF;
		text-align: center;
		width: 100%;
		top: 1.373333rem;
	}

	.descript {
		font-size: 0.48rem;
		color: #FFFFFF;
		letter-spacing: 0.0172rem;
		text-align: center;
		position: absolute;
		top: 1.92rem;
		left: 6.693333rem;
	}

	.content .desc {
		font-family: PingFangSC-Regular;
		font-size: 0.48rem;
		color: #FFFFFF;
		text-align: center;
		top: 3.533333rem;
		width: 100%;
	}

	.content .detail {
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #FFFFFF;
		top: 5.746666rem;
		width: 100%;
		text-align: center;
	}

	.charts ul {
		display: flex;
		position: relative;
	}

	.charts ul li {
		flex: 1;
	}

	.charts ul #echarts {
		position: absolute;
		top: 3rem;
		width: 100%;
		height: 3.8rem;
		left: 0%;
	}

	.charts ul .yestoday p {
		color: #9b9b9b;
	}

	.charts ul li .chartcontent {
		margin-top: 0.533333rem;
		box-sizing: border-box;
	}

	.charts ul li .bdr {
		border-right: 2px solid #f0f0f0;
		height: 6.64rem;
	}

	.charts ul li .chartcontent p {
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		line-height: 0.533333rem;
	}

	.charts ul li .chartcontent .time {
		height: 0.54rem;
	}

	.charts ul li .chartcontent .yun {

		height: 0.773333rem;
		text-align: center;
	}

	.charts ul li .chartcontent .yun img {
		height: 100%;
	}

	.charts .chartcontent .wind {
		width: 100%;
		margin-top: 3.8rem;
	}

	.go15 a {
		display: block;
		width: 3.853333rem;
		height: 0.906666rem;
		background: #FFFFFF;
		border: 0.026666rem solid #C0C0C0;
		border-radius: 0.106666rem;
		margin: 0 auto;
		margin-top: 0.76rem;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #333333;
		letter-spacing: 0.005333rem;
		text-align: center;
		line-height: 0.906666rem;
	}

	.yestodayimg {
		opacity: 0.8;
	}
</style>

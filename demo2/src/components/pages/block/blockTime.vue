<template>
	<div class="charts-show">
		<div class="roundness-show" id="charts" :style="{width:'300px',height:'300px'}"></div>
		<p>区块大小</p>
	</div>
</template>
<script>
const echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default{
	data(){
		return{
			dataTime:"",
			dataNumber:"",
		}
	},
	mounted(){
		this.option()
	},
	methods:{
		time(){
			let now = new Date(),res = [],len = 10;
			while(len --){
				res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
			    now = new Date(now - 2000);
			}
			return this.dataTime = res;
		},
		seriesNum(){
			let res =[],len = 0;
			while(len < 10){
				res.push((Math.random()*(10-1)+1).toFixed(0))
				len++
			}
			return res
		},
		option(){
			const self = this;
			const myCharts = echarts.init(document.getElementById("charts"));
			let options = {
				toolbox:{
					show:true,
					feature:{
						dataView:{readOnly:false},
						restore:{},
						saveAsImage:{}
					}
				},
				tooltip:{
					trigger:"axis",
					axisPointer:{
						type:"cross",
						label:{
							backgroundColor:"#283b56"
						}
					}
				},
				xAxis:[
					{
						type:"category",
						boundaryGap:true,
						show:false,
						data:self.time()
					},
				],
				yAxis:[
					{
						type:"value",
						scale:true,
						show:false,
						max:10,
						min:0,
						boundaryGap:[0.2,0.2]
					}
				],
				series:[
					{
						type:"bar",
						name:"区块大小",
						barWidth: '60%',
						itemStyle:{color:"#16f8b4"},
						data:self.seriesNum()
					}
				]
			}
			myCharts.setOption(options)
			setInterval(()=>{
				let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
				options.series[0].data.shift()
				options.series[0].data.push((Math.random()*(10-1)+1).toFixed(0));
				options.xAxis[0].data.shift()
				options.xAxis[0].data.push(axisData)
				myCharts.setOption(options)
			},2000)
		}


	}
}
	
</script>
<style scoped lang="scss">
	.charts-show{
		position:relative;
		width:300px;
		height:300px;
		p{
			line-height:50px;
			color:#fff;
			text-align:center;    
			position: absolute;
		    bottom: 0;
		    width: 100%;
		    font-size: 16px;
		    font-weight:600;
		}
	}
</style>
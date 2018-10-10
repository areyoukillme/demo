<template>
	<div class="charts-show">
		<div class="roundness-show" id="chartsLine" :style="{width:'300px',height:'300px'}"></div>
		<p>节点网络延迟</p>
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
			return res;
		},
		seriesNum(){
			var res = [];
			var len = 0;
			while (len < 10) {
   				res.push((Math.random() * (150 - 100)+100).toFixed(1) -0);
    			len++;
			}
			return res;
		},
		option(){
			const myChart = echarts.init(document.getElementById("chartsLine"));
			let options = {
				tooltip:{
					trigger:"axis",
					axisPointer:{
						type:"cross",
						label:{backgroundColor:"#283b56"}
					}
				},
				toolbox:{
					show:true,
					feature:{
						dataView:{readOnly:false},
						restore:{},
						saveAsImage:{}
					}
				},
				xAxis:[
					{
						type:"category",
						boundaryGap:true,
						data:this.time(),
						show:false,
					}
				],
				yAxis:[
					{
						type:"value",
						scale:true,
						max:150,
						min:100,
						boundaryGap:[0.3,0.3],
						show:false,
					}
				],
				series:[
					{
						type:"line",
						name:"节点延迟",
						itemStyle:{color:"#14a5f9"},
						data:this.seriesNum(),
						show:false,
					},
					{
						type:"line",
						name:"节点延迟",
						itemStyle:{color:"#19f8b4"},
						data:this.seriesNum(),
						show:false,
					},
					{
						type:"line",
						name:"节点延迟",
						data:this.seriesNum(),
						show:false,
					}
				]
			}
			myChart.setOption(options)
			setInterval(()=>{
				let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
				options.xAxis[0].data.shift()
				options.xAxis[0].data.push(axisData)
				options.series[0].data.shift()
				options.series[0].data.push((Math.random() * (150 - 100)+100).toFixed(1) -0)
				options.series[1].data.shift()
				options.series[1].data.push((Math.random() * (150 - 100)+100).toFixed(1) -0)
				options.series[2].data.shift()
				options.series[2].data.push((Math.random() * (150 - 100)+100).toFixed(1) -0)
				myChart.setOption(options)
			},1000)
		}
	}
}
</script>
<style scoped lang="scss">
	.charts-show{
		width:300px;
		height:300px;
		position:relative;
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



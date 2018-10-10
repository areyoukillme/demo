<template>
	<div class="charts-show">
		<div class="roundness-show" id="chartsCenter" :style="{width:'300px',height:'300px'}"></div>
		<p>区块确认时间</p>
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
			// option:{
			// 	toolbox: {
			// 		show: true,
			// 		feature: {
			// 			dataView: {readOnly: false},
			// 			restore: {},
			// 			saveAsImage: {}
			// 		}
			// 	},
			// 	tooltip: {
			// 		trigger: 'axis',
			// 		axisPointer: {
			// 			type: 'cross',
			// 			label: {
			// 				backgroundColor: '#283b56'
			// 			}
			// 		}
			// 	},
			//     xAxis: [
			//         {
			//             type: 'category',
			//             boundaryGap: true,
			//             show:false,
			//             data: (function (){
			//                 var now = new Date();
			//                 var res = [];
			//                 var len = 10;
			//                 while (len--) {
			//                     res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
			//                     now = new Date(now - 2000);
			//                 }
			//                 return res;
			//             })()
			//         },
			//     ],
			//     yAxis: [
			//         {
			//             type: 'value',
			//             scale: true,
			//             max: 10010,
			//             min: 9999,
			//             boundaryGap: [0.2, 0.2],
			//             show:false,
			//         },
			//     ],
			//     series: [
			//         {
			//             type:'bar',
			//             name:"区块高度",
			//             data:(function (){
			//                 var res = [];
			//                 var len = 10;
			//                 while (len--) {
			//                     res.push((Math.random()*(10010-10000)+10000).toFixed(0));
			//                 }
			//                 return res;
			//             })()
			//         },
			//     ]
			// },
		}
	},
	mounted(){
		// const Charts = echarts.init(document.getElementById("chartsCenter"));
		// Charts.setOption(this.option);
		// let self = this;
		// setInterval(function (){
		//     var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
		//     var data0 = self.option.series[0].data;
		//     data0.shift();
		//     data0.push((Math.random()*(10010-10000)+10000).toFixed(0));
		//     self.option.xAxis[0].data.shift();
		//     self.option.xAxis[0].data.push(axisData);
		//     Charts.setOption(self.option);
		// }, 2100);
		this.blockpillar()
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
		num(){
			let res = [],len = 10;
			while(len --){
				res.push(10- len - 1);
			}
			return this.dataNumber = res
		},
		seriesNum(){
			let res =[],len = 0;
			while(len < 10){
				res.push((Math.random()*(10010-10000)+10000).toFixed(0))
				len++
			}
			return res
		},



		blockpillar(){
			const Charts = echarts.init(document.getElementById("chartsCenter"));
			let self = this;
			let option = {
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
					}
				],
				yAxis:[
					{
						type:"value",
						scale:true,
						max:10010,
						min:9999,
						boundaryGap:[0.2,0.2],
						show:false,
					}
				],
				series:[
					{
						type:"bar",
						barWidth: '60%',
						itemStyle:{color:"#14a5f9"},
						name:"区块高度",
						data:self.seriesNum()
					}
				]
			}
			Charts.setOption(option)
			setInterval(()=>{
				let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
				option.series[0].data.shift()
				option.series[0].data.push((Math.random()*(10010-10000)+10000).toFixed(0));
				option.xAxis[0].data.shift()
				option.xAxis[0].data.push(axisData)
				Charts.setOption(option)
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
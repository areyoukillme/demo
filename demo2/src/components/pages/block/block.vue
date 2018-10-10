<template>
	<div class="blockchain">
		<div class="block-show">
			<div class="block-roundness">
				<div class="roundness-gross">
					<p>作品总量</p>
					<p>{{blockGross}}</p>
				</div>
				<div class="roundness-heihgt">
					<p>区块高度</p>
					<p>{{blockHeight}}</p>
				</div>
				<div class="roundness-size">
					<p>区块大小</p>
					<p>{{blockSize}}</p>
				</div>
			</div>
			<div class="block-charts">
				<MyCharts></MyCharts>
				<chartsCenter></chartsCenter>
				<chartsLine></chartsLine>
			</div>
			<div class="block-info">
				<table>
					<tbody>
						<tr>
							<td>区块摘要</td>
							<td>版权数量</td>
							<td>区块高度</td>
							<td>上链时间</td>
						</tr>	
						<tr v-for="item in tableData">
							<td>{{item.hash}}</td>
							<td>{{item.number}}</td>
							<td>{{item.height}}</td>
							<td>{{item.time | time}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
import MyCharts from "./blockTime"
import chartsCenter from "./blockcenter"
import chartsLine from "./blockline"
export default{
	data(){
		return{
			tableData: [
				{
		            hash:"8EBPpnYnPHbcmN6kLKBhkZdxRCCJoWJY2IDxbdtmYJalGue1MypYZ6sxHlutrA",
		            number:152,
		            height:10025,
		            time:"2018-8-29 15:34:27"

		        }, 
		        {
		            hash:"kwbGKDfH324BRyNQglqWWAO4e61mTi1sEtl1uKUcwaZVneYWGe8KyuOCBDCOMo",
		            number:256,
		            height:10045,
		            time:"2018-8-29 15:34:27"

		        }, 
		        {
		            hash:"08cbf5e7f88d775af930f8c4a4e171800836917df345ce8120b2f670deed268b",
		            number:325,
		            height:10023,
		            time:"2018-8-29 15:34:27"

		        }, 
	          	{
		            hash:"vutAbYdptNs3HuGNecF1QEtZeYuY7CoVtAfj1CpQGaGElK6m861o9RO2Dp0r7r",
		            number:420,
		            height:10032,
		            time:"2018-8-29 15:34:27"
		        },
		        {
		        	hash:"E0jwgy1RnVWpx6OvUIeFKxVZc7KFttycQrR9oboNQs3HCx2LN1teHG0UO9CAep",
		        	number:354,
		        	height:10021,
		        	time:"2018-8-29 15:34:27"
		        },
		        {
		        	hash:"WddJRIqbVenqbIQaheItQRFC31WWbK2x9sBPEUDoWIndtYX8hm6Q3Nrhroo1oG",
		        	number:152,
		        	height:10042,
		        	time:"2018-8-29 15:34:27"
		        }
	        ],
	        randomObj:{
	        	hash:"",
	        	number:"",
	        	height:"",
	        	time:""
	        },
	        blockGross:1850,
	        blockHeight:10025,
	        blockSize:2560,
		}
	},
	components:{
		MyCharts,
		chartsCenter,
		chartsLine
	},
	mounted(){
		setInterval(()=>{
				this.tableData.shift();
				this.tableData.push(this.getNum())
				this.blockHeight++;
				this.blockGross++;
				this.blockSize+=5;
		},2000)

	},
	methods:{
		getNum(){
			const self = this;
			let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			let random = "";
			for(var i in chars){
				var id = parseInt(Math.random() * 61);
				random += chars[id]
			}
			this.randomObj.time = new Date();
			this.randomObj.height = (Math.random()*(10050-10000)+10000).toFixed(0);
			this.randomObj.number = (Math.random()*(500 - 100)+100).toFixed(0);
			this.randomObj.hash = random
			return {
				hash:this.randomObj.hash,
				number:this.randomObj.number,
				height:this.randomObj.height,
				time:this.randomObj.time
			}
		},
	}

}
</script>
<style scoped lang="scss">
	.blockchain{
		background:url(/static/img/block.png) no-repeat;
		padding:30px 0 80px 0;
	}
	.block-show{
		width:1200px;
		height:100%;
		overflow:hidden;
		margin:0 auto;
		.block-roundness{
			height:600px;
			width:635px;
			margin:0 auto;
			background:url(/static/img/bj111.png) no-repeat;
			position:relative;
			div{
				width:150px;
				color:#fff;
				font-size:14px;
				text-align:center;
				padding-top:35px;
				line-height:30px
			}
			.roundness-gross{
				width:120px;
				height: 85px;
				background:url(/static/img/zuoping.png) no-repeat;
				position:absolute;
				top:120px;
				left:0;
			}
			.roundness-heihgt{
				background:url(/static/img/gaodu.png) no-repeat;
				position:absolute;
				top:100px;
				right:0;
				height: 115px;
    			line-height: 40px;
			}
			.roundness-size{
				background:url(/static/img/daxiao.png) no-repeat;
				position:absolute;
				left:200px;
				bottom:0;
				height: 115px;
    			line-height: 40px;
			}
			
		}
	}
	.block-charts{
		width:100%;
		height:300px;
		position:relative;
		display:flex;
		justify-content: space-around;
		margin-bottom:40px;
	}
	.block-info{
		background:rgba(36,75,112,0.5);
		color:#fff;
		table{
			width:95%;
			tr{
				text-align:center;
				td{
					line-height:40px;
				}
				td:first-child{
					color:#14a5f9
				}
			}
			tr:first-child{
				font-weight:600;
				line-height:50px;
				font-size:14px;
				td:first-child{
					color:#fff;
				}
			}
		}

	}


</style>
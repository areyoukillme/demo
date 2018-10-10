<template>
	<div class="blockchain-newest">
		<div class="newest-show">
			<ul>
				<li v-for="(item,idx) in ullist" :key="idx" @mouseenter="hoverli(idx)">
					<h1><span :class="{active:index==idx}">{{item.title}}</span></h1>
					<h2>{{item.h2}}</h2>
					<p>{{item.p1}}</p>
					<p>{{item.p2}}</p>
				</li>
			</ul>
		</div>
		<div class="newest-recommend">
			<h1>最新上传</h1>
			<div class="recommend-first">
				<img src="/static/img/pd05.jpg" alt="">
				<div class="first-info">
					<h3>大理石拼花奢华地砖</h3>
					<p>区块高度：00100007</p>
				</div>
			</div>
			<div class="recommend-else">
				<ul>
					<li>
						<img src="/static/img/pd06.jpg" alt="">
						<div class="else-info">
							<h3>大理石拼花奢华地砖</h3>
							<p>区块高度：00100007</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd4.jpg" alt="">
					</li>
					<li>
						<img src="/static/img/pd6.jpg" alt="">
					</li>
					<li>
						<img src="/static/img/pd7.jpg" alt="">
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return {
				index:0,
				ullist:[{title:"01",h2:"版权保护",p1:"采用最新区块链技术",p2:"上传成功不可逆，永久有效"},
						{title:"02",h2:"海量内容",p1:"采用最新区块链技术",p2:"上传成功不可逆，永久有效"},
						{title:"03",h2:"优质服务",p1:"24小时客服专员随时待命",p2:"将版权保护进行到底"},
				]
			}
		},
		methods: {
			 hoverli(idx){
				 this.index=idx;
			 }
		}

	}
</script>
<style scoped lang="scss">
	

	.blockchain-newest{
		position:relative;
		width:1200px;
		height: 700px;
		margin:0 auto;
		background:#eee;
		.newest-show{
			width:1200px;
			height:194px;
			margin:0 auto;
			background:#fff;
			border-radius:4px;
			position:relative;
			top:-120px;
			box-sizing:border-box;
			ul{
				width:100%;
				height:100%;
				:last-child h2{border-right:none;}
				li{
					width:398px;
					height:100%;
					float:left;
					text-align:center;
					h1{
						padding-top:28px;
						position:relative;
						overflow:hidden;
						color:#e6e6e6;
						height:38px;
						span{
							display:block;
							cursor:default;
						    width: 100px;
						    height: 38px;
						    margin: 0 auto;
						    font-size: 38px;
						    font-weight: 700;
						    position:absolute;
						    bottom:-10px;
						    left:37%;
						}
					}
					.borderright{ 		
				        border-right: 2px solid #e6e6e6;   
			    	}
					h2{
						margin:16px 0  10px 0;
						font-size: 24px;
			    		font-weight:600;
				        color: #1c1e20;
						border-right: 2px solid #e6e6e6;
					}
					
			    	p{
				        font-size: 16px;
				        color: #999999;
				        line-height: 24px;
				    }
				}
				.active{
					color:#0078ff;
					bottom:10px;
				}
			}
		}
		.newest-recommend{
			width:100%;
			height:510px;
			position:absolute;top:125px;
			h1{
				color:#1c1e20;
				font-size:30px;
				margin-bottom:36px;
				font-weight:700;
			}
			.recommend-first{
				width:590px;
				height:420px;
				float:left;
				margin-right:20px;
				border-radius:4px;
				overflow:hidden;
				position:relative;
				img{
					width:100%;
					height:100%;
				}
				.first-info{
					height:80px;
					width:calc(100% - 20px);
					position:absolute;
					bottom:0;
					left:0;
					background:rgba(0,0,0,.5);
					padding-left:20px;
					color:#fff;
					h3{
						font-size:24px;
						margin-top:10px;
						margin-bottom:5px;
					}
					p{
						font-size:16px;
					}
				}
			}
			.recommend-else{
				float:left;
				width:590px;
				height:420px;
				background:#fff;
				ul{
					width:100%;
					height:100%;
					li{
						width:285px;
						height:200px;
						float:left;
						margin-bottom:20px;
						overflow:hidden;
						position:relative;
						border-radius:4px;
						img{
							width:100%;
							height:100%;
						}
						.else-info{
							width:100%;
							height:100%;
							background:rgba(0,0,0,.5);
							position:absolute;
							top:0;
							left:0;
							color:#fff;
							text-align: center;
    						line-height: 100px;
    						h3{
    							font-size:24px;
    						}
    						p{
    							font-size:16px;
    						}
						}
					}
					li:nth-child(1),li:nth-child(3){
						margin-right:20px;
					}
					li:nth-child(3),li:nth-child(4){
						margin-bottom:0
					}
				}
			}
		}
	}
</style>
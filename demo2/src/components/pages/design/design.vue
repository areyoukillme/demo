<template>
	<div class="blockchain">
		<div class="block-design">
			<div class="design-left">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/' }">发现</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/' }">室内设计师</el-breadcrumb-item>
					<span class="el-item-color"></span>
				</el-breadcrumb>
				<div class="desigin-details">
					<div class="details-text">
						陶瓷砖按吸水率可分为五大类，即瓷质砖、炻瓷砖、细炻砖、炻质砖、陶质砖。吸水率大于10%的称陶瓷砖，市场上一般称内墙砖，广泛用于居民住宅、宾馆饭店、公共场所等建筑物的墙面装饰，是室内装修的主要产品。吸水率小于0.5%的称瓷质砖，也就是通常所说的玻化砖，用于铺地的大多经过表面抛光处理的，因此又叫抛光砖。广泛用于各类建筑物的地面装饰，也是室内装修的主要产品。吸水率在0.5%~10%之间的陶瓷砖一部分用于外墙修饰，一部分主要用于室内地面的装饰，多用于卫生间，与内墙砖配套使用
					</div>
					<div class="details-photos">
						<img src="/static/img/pd1.jpg" alt="">
						<img src="/static/img/pd2.jpg" alt="">
						<img src="/static/img/pd3.jpg" alt="">
						<img src="/static/img/pd4.jpg" alt="">
						<img src="/static/img/pd5.jpg" alt="">
					</div>
					<div class="details-tips">该作品已通过区块链版权备案，版权归于XXX所有，禁止未授权情况下转载、用作商业用途</div>
				</div>
			</div>
			<div class="design-right">
				<h3>意大利红木实心地板</h3>
				<p class="design-collect">
					<span>2075</span>
					<span>2160</span>
				</p>
				<div class="design-label">
					<span>地板</span>
					<span>红木</span>
					<span>家具</span>
					<span>意大利进口</span>
				</div>
				<div class="design-block">区块高度：<span>00100004</span></div>
				<div class="design-block">上链时间：<span>2018-8-27 16:52:54</span></div>
				<div class="design-block">上链标识：<em>0c21dc996efaf061479fcfff96600b0cdf9088c176225b41d8eafe59ea6930c0</em></div>
				<div class="design-block">
				区块摘要：<em>4daf8d2382851ebe7705b7213b310012a16354ae9157c8e17b1ac227f8af4128</em></div>
				<div class="design-block">版权凭证：<em>35881ca9352d8ae64f93265dde86f2e71696d57b63a441c07e4747ebedecb208</em></div>
				<div class="design-designer">
					<div class="designer-face"><img src="/static/img/sjs4.jpg" alt=""></div>
					<div class="designer-info">
						<p>Francisca</p>
						<p>
							<span>广州</span>
							<span>室内设计师</span>
						</p>
					</div>
					<div class="designer-attention"><span>关注</span></div>
				</div>
				<div class="design-download">
					<span>下载</span>
					<span>收藏</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	
}
</script>

<style  scoped lang="scss">
	.blockchain{
		background:#eee;
	}
	.block-design{
		width:1200px;
		margin:0 auto 80px auto;
		overflow:hidden;
		display:flex;
		.design-left{
			width:800px;
			overflow:hidden;
			background:#fff;
			.desigin-details{
				width:768px;
				margin:30px auto 0 auto;
				.details-text{
					letter-spacing:3px;
					padding-bottom:35px;
				}
				.details-photos{
					background:#eee;
					padding-bottom:35px;
					img{
						width:100%;
					}
				}
				.details-tips{
					height:120px;
					line-height:120px;
					font-size:14px;
					text-align:center;
					color:#999;
				}
			}
		}
		.design-right{
			width:376px;
			padding:0 12px;
			margin-top:80px;
			overflow:hidden;
			font-size:14px;
			h3{
				font-size:18px;
				font-weight:700;
				margin-bottom:15px;
			}
			.design-collect{
				color:#666;
				span:before{
					display:inline-block;
					content:"";
					width:20px;
					height:20px;
					vertical-align: middle;
					background:#934efb;
					margin-right:5px;
				}
			}
			.design-label{
				color:#666;
				margin-top:15px;
				margin-bottom:16px;
				span{
					display:inline-block;
					padding:5px 15px;
					border:1px solid #666;
					border-radius:4px;
					margin-right:8px;

				}
			}
			.design-block{
				word-break:break-all;
				margin-bottom:16px;
				span{
					float:right;
					margin-right:6px;
				}
				em,span{
					color:#666
				}
			}
			.design-designer{
				width:calc(100% - 10px);
				height:80px;
				border-top:1px solid #000;
				border-bottom:1px solid #000;
				padding:24px 0 24px 10px;
				display:flex;
				.designer-face{
					width:80px;
					height:80px;
					overflow:hidden;
					border-radius:50%;
					img{
						width:100%;
						height:100%;
					}
				}
				.designer-info{
					width:176px;
					padding-left:24px;
					p{
						line-height:40px;
						text-align:left;
						span:first-child{
							padding-right:10px;
							border-right:2px solid #666;
						}
						span:last-child{
							padding-left:10px;
						}
					}
				}
				.designer-attention{
					width:88px;
					span{
						border-radius:15px;
						color:#fff;
						background:#0078ff;
						text-align:center;
						line-height:80px;
						padding:5px 29px;
					}
				}
			}
			.design-download{
				padding-top:26px;
				span{
					float:right;
					cursor:pointer;

				}
				span:before{
					content: "";
				    display: inline-block;
				    width: 20px;
				    height: 20px;
				    vertical-align: middle;
				    margin-right: 14px;
				    background: url(/static/img/qkl_icon.d2931c5.png) no-repeat -646px -258px;
				}
				span:last-child{
					margin-right:24px;
				}
			}
		}
	}
	.el-breadcrumb{
		height:50px;
		line-height:50px;
		width:250px;
		background:#1c1e20;
		position:relative;
		.el-item-color{
			width: 0;
    		height: 0;
		    border-bottom: 50px solid #fff;
		    border-left: 50px solid transparent;
		    position:absolute;
		    top:0;
		    right:0;
		}
	}
</style>
<style lang="scss">
	.design-left{
		.el-breadcrumb__inner.is-link{
			color:#fff;
			font-weight:400;
		}
		.el-breadcrumb__separator{
			color:#fff;
		}
	} 
</style>
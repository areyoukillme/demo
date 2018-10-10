<template>
	<div class="blockchain">
		<div class="block-designer">
			<h2>我们的设计师</h2>
			<div class="designer-search">
				<div class="search-letter">
					<span v-for="item in search">{{item}}</span>
				</div>
			</div>
		</div>
		<div class="block-search">
			<div class="search-name">
				<div class="name-select">
					<el-select v-model="value" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
				  	</el-select>
				</div>
				<div class="name-import">
					<el-input placeholder="通过姓名检索" prefix-icon="el-icon-search" v-model="searchName"> </el-input>
				</div>
			</div>
		</div>
		<div class="block-stylist">
			<div class="stylist-show">
				<h1>室内设计师</h1>
				<p class="line"><span></span></p>
				<div class="show-info">
					<ul>
						<li>
							<div class="info-data">
								<div class="data-main">
									<img src="/static/img/sjs1.jpg" alt="">
									<div class="main-author">
										<p>Francisca</p>
										<p><span>广州</span><span>设计师</span></p>
										<p><i>2071</i><i>2100</i></p>
									</div>
								</div>
								<router-link to="/">关注</router-link>
							</div>
							<div class="info-works">
								<img src="/static/img/pd04.jpg" alt="">
								<img src="/static/img/pd05.jpg" alt="">
								<img src="/static/img/pd06.jpg" alt="">
							</div>
						</li>
						<li></li>
						<li></li>
					</ul>
				</div>
				<el-pagination background layout="prev, pager, next" :total="1000">
				</el-pagination>		
			</div>	
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			searchName:"",
			search:["#","A","B","C","D","E","F","G","H","I","J","K","L","H","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
			],
			 options: [{
	          value: '选项1',
	          label: '黄金糕'
	        }, {
	          value: '选项2',
	          label: '双皮奶'
	        }, {
	          value: '选项3',
	          label: '蚵仔煎'
	        }, {
	          value: '选项4',
	          label: '龙须面'
	        }, {
	          value: '选项5',
	          label: '北京烤鸭'
	        }],
	        value: ''
		}
	}

}
</script>
<style scope lang="scss"> 
	$width:1200px;
	$center:0 auto;
	.blockchain{
		background:#eee;
	}
	.block-designer{
		width:100%;
		height:280px;
		background:url(/static/images/hash.jpg) no-repeat;
		background-size:100% 100%;
		overflow:hidden;
		position: relative;
		h2{
			text-align:center;
			font-size:36px;
			font-weight:700;
			color:#fff;
			margin-top:50px;
			margin-bottom:24px;
		}
		.designer-search{
			background:#3a3a3a;
			height:80px;
			width:100%;
			line-height:80px;
			position:absolute;
			bottom:0;
			.search-letter{
				width:1200px;
				margin:0 auto;
				display:flex;
				span{
					font-size:18px;
					color:#fff;
					display:inline-block;
					width:50px;
					height:80px;
					line-height:80px;
					text-align:center;
					cursor: pointer;
				}
			}
		}
	}
	.block-search{
		width:100%;
		height:110px;
		background:#1c1e20;
		.search-name{
			width:1197px;
			height:110px;
			margin:$center;
			border-left:1px solid #707070;
			border-right:2px solid #707070;
			display:flex;
			.name-select{
				width:400px;
				height:100%;
				.el-input__inner{
					background:transparent;
					color:#fff;
					border:none;
				}
				.el-input{
					top:50px;
					left:100px;
				}
			}
			.name-import{
				width:calc(100% - 401px);
				height:100%;
				border-left:1px solid #707070;
				.el-input{
					top:50px;
					width:300px;
					left:300px;
				}
				.el-input__inner{
					background:transparent;
					color:#fff;
					border:none;
				}
			}
		}
	}
	.block-stylist{
		width:100%;
		overflow:hidden;
		padding-bottom:80px;
		.stylist-show{
			width:1200px;
			margin:0 auto;
			overflow:hidden;
			padding-top:64px;
			h1{
				font-size:30px;
				font-weight:700;
				text-align:center;
			}
			.line{
				margin-top:20px;
				margin-bottom:66px;
				text-align:center;
				span{
					display:inline-block;
					width:48px;
					height:2px;
					background:#0078ff;
				}
			}
			.show-info{
				width:$width;
				overflow:hidden;
				ul{
					overflow:hidden;
					li{
						width:100%;
						height:216px;
						border-radius:4px;
						float:left;
						background:#fff;
						margin-bottom:22px;
						display:flex;
						.info-data{
							width:330px;
							height:100%;
							text-align:center;
							.data-main{
								width:calc(100% - 32px);
								height:80px;
								margin-top: 47px;
    							margin-bottom: 38px;
								padding-left:32px;
								img{
									width:80px;
									height:80px;
									border-radius:50%;
									float:left;
								}
								.main-author{
									float:left;
									margin-left:24px;
									
									p:first-child{
										color:#1c1e20;
										font-size:18px;
										line-height:30px;
									}
									p:nth-child(2){
										font-size:14px;
										line-height:30px;
										span{
											padding:0 10px;
										}
										span:first-child{
											border-right:1px solid #666;
										}
									}
									p:last-child{
										line-height:20px;
										i{
											margin-right:5px;
										}
										i:before{
											display:inline-block;
											content:"";
											width:20px;
											height:20px;
											vertical-align:top;
											background:#1c1e20;
											margin-right:5px;
										}
									}
								}
							}
							a{
								padding:7px 28px;
								background:#0078ff;
								color:#fff;
								border-radius:15px;
							}
						}
						.info-works{
							width:calc(100% - 330px);
							height:100%;
							display: flex;
    						justify-content: space-around;
							img{
								width:258px;
								height:182px;
								margin:17px 0;
								border-radius:4px;
							}
						}
					}
					li:last-child{
						margin-bottom:60px;
					}

				}
			}
		}

	}
	.el-pagination{
		text-align:center;
		.btn-prev,.btn-next{
			width:40px;
			height:40px;
		}
		.el-pager{
			li{
				width:40px;
				height:40px;
				line-height:40px;
			}
		}
	}
</style>
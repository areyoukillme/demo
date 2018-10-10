<template>
	<div class="blockchain">
		<div class="block-discover">
			<h2>地板-木材</h2>
			<p>当前有1002件作品符合您的搜索</p>
		</div>
		<div class="discover-nav">
			<span>
				<router-link to="/">全部</router-link>
			</span>
			<span>
				<router-link to="/">知名设计师</router-link>
			</span>
			<span>
				<router-link to="/">机构企业</router-link>
			</span>
		</div>
		<div class="discover-works">
			<div class="works-show">
				<h2>
					<span class="active">全部</span>
					<span>红木</span>
					<span>濒危名贵</span>
					<span>其他</span>
				</h2>
			</div>
			<div class="works-info">
				<ul>
					<li>
						<img src="/static/img/pd01.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd02.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd03.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd04.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd05.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd06.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd07.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
					<li>
						<img src="/static/img/pd08.jpg" alt="">
						<div class="works-information">
							<p class="information-name">最新设计</p>
							<p class="information-height">区块高度：00100008</p>
							<p class="information-writer">
								<img src="/static/img/sjs4.jpg" alt="">
								<span>Salita</span>
								<em>
									<i>2756</i>
									<i>207</i>
								</em>
							</p>
						</div>
					</li>
				</ul>
			</div>	
			<el-pagination background layout="prev, pager, next" :total="1000">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	
</script>
<style scoped lang="scss">

	.block-discover{
		width:100%;
		height:280px;
		background:url(/static/images/hash.jpg) no-repeat;
		background-size:100% 100%;
		overflow:hidden;
		h2{
			text-align:center;
			font-size:36px;
			font-weight:700;
			color:#fff;
			margin-top:50px;
			margin-bottom:24px;
		}
		p{
			color:#fff;
			font-size:24px;
			text-align:center;
		}
	}
	.discover-nav{
		width:1200px;
		margin:0 auto;
		height:78px;
		line-height:78px;
		font-size:18px;
		span{
			padding:0 15px;
		}
		span:first-child a{
			color:#0078ff;
		}
		a{
			color:#666;
		}
	}
	.discover-works{
		width:100%;
		background:#eee;
		overflow:hidden;
		padding-bottom:100px;
		.works-show{
			width:1200px;
			margin:24px auto 0 auto;
			h2{
				span{
					display:inline-block;
					padding:5px 10px;
					border:1px solid #666;
					color:#666;
					border-radius:4px;
				}
				.active{
					border:1px solid #0078ff;
					color:#fff;
					background:#0078ff;
				}
			}
		}
		.works-info{
			overflow:hidden;
			width:1200px;
			margin:56px auto 0 auto;
			ul{
				overflow:hidden;
				li{
					width:285px;
					height:335px;
					border-radius:4px;
					float:left;
					margin-right:20px;
					margin-bottom:20px;
					overflow:hidden;
					img{
						width:100%;
						height:200px;
						border-bottom-left-radius:4px;
						border-bottom-right-radius:4px;
					}
					.works-information{
						width:100%;
						height:135px;
						p{
							line-height:30px;
							font-size:16px;
						}
						.information-name{
							color:#1c1e20;
						}
						.information-height{
							color:#666;
						}
						.information-writer{
							margin-top:24px;
							img{
								width:32px;
								height:32px;
								border-radius:50%;
								float:left;
								margin-right:12px;
							}
							em{
								display:inline-block;
								float:right;
								margin-right:5px;
								i{
									vertical-align:middle;
									line-height:22px;
									font-size:14px;
								}
								i:before{
									display:inline-block;
									content:"";
									width:20px;
									height:20px;
									margin-right:5px;
									background:#fff;
									vertical-align:middle;
								}
							}
						}
					}
				}
				li:nth-child(4n+4){
					margin-right:0;
				}
			}
		}
	}
	.el-pagination{
		text-align:center;
	}
	.btn-prev{
		width:40px;
		height:40px;
	}
</style>
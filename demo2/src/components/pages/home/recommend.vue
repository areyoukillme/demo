<template>
	<div class="blockchain-recommend">
		<div class="recommend-works">
			<h1>推荐</h1>
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
		</div>
		<div class="recommend-banner"></div>
	</div>
</template>
<script>
	
</script>
<style scoped lang="scss">
	.blockchain-recommend{
		width:100%;
		background:#fff;
		overflow:hidden;
		padding-bottom:24px;
		.recommend-works{
			width:1200px;
			margin:42px auto 50px auto;
			h1{
				color:#1c1e20;
				font-size:30px;
				font-weight:700;
				margin-bottom:40px;
			}
			.works-info{
				overflow:hidden;
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
		.recommend-banner{
			height:400px;
			background:url(/static/images/qkl_bg.jpg) no-repeat;
		}
	}
</style>
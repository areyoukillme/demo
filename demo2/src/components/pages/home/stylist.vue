<template>
	<div class="top-stylist">
		<div class="stylist-rank">
			<h1>TOP设计师</h1>
			<div class="ranking-main">
				<ul>
					<li>
						<div class="main-writer">
							<div class="writer-info">
								<img src="/static/img/sjs4.jpg" alt="">
								<div class="writer-name">
									<p>Slita</p>
									<p>优秀的设计师</p>
								</div>
							</div>
							<div class="writer-click">
								<p><span>关注</span></p>
								<p>
									<i>2756</i>
									<i>2012</i>
								</p>
							</div>
						</div>
						<div class="main-works">
							<img src="/static/img/pd05.jpg" alt="">
							<img src="/static/img/pd06.jpg" alt="">
							<img src="/static/img/pd07.jpg" alt="">
						</div>
					</li>
					<li>
						<div class="main-writer">
							<div class="writer-info">
								<img src="/static/img/sjs4.jpg" alt="">
								<div class="writer-name">
									<p>Slita</p>
									<p>优秀的设计师</p>
								</div>
							</div>
							<div class="writer-click">
								<p><span>关注</span></p>
								<p>
									<i>2756</i>
									<i>2012</i>
								</p>
							</div>
						</div>
						<div class="main-works">
							<img src="/static/img/pd05.jpg" alt="">
							<img src="/static/img/pd06.jpg" alt="">
							<img src="/static/img/pd07.jpg" alt="">
						</div>
					</li>
					<li>
						<div class="main-writer">
							<div class="writer-info">
								<img src="/static/img/sjs4.jpg" alt="">
								<div class="writer-name">
									<p>Slita</p>
									<p>优秀的设计师</p>
								</div>
							</div>
							<div class="writer-click">
								<p><span>关注</span></p>
								<p>
									<i>2756</i>
									<i>2012</i>
								</p>
							</div>
						</div>
						<div class="main-works">
							<img src="/static/img/pd05.jpg" alt="">
							<img src="/static/img/pd06.jpg" alt="">
							<img src="/static/img/pd07.jpg" alt="">
						</div>
					</li>
					<li>
						<div class="main-writer">
							<div class="writer-info">
								<img src="/static/img/sjs4.jpg" alt="">
								<div class="writer-name">
									<p>Slita</p>
									<p>优秀的设计师</p>
								</div>
							</div>
							<div class="writer-click">
								<p><span>关注</span></p>
								<p>
									<i>2756</i>
									<i>2012</i>
								</p>
							</div>
						</div>
						<div class="main-works">
							<img src="/static/img/pd05.jpg" alt="">
							<img src="/static/img/pd06.jpg" alt="">
							<img src="/static/img/pd07.jpg" alt="">
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	
</script>
<style scoped lang="scss">
	.top-stylist{
		width:100%;
		background:#eee;
		overflow:hidden;
		.stylist-rank{
			width:1200px;
			margin:56px auto 65px auto;
			overflow:hidden;
			h1{
				color: #1c1e20;
    			font-size: 30px;
    			font-weight: 700;
    			margin-bottom:32px;
			}
			.ranking-main{
				width:100%;
				overflow:hidden;
				ul{
					li{
						width:590px;
						height:265px;
						background:#fff;
						float:left;
						margin-right:20px;
						margin-bottom:20px;
						.main-writer{
							width:100%;
							height:110px;
							display:flex;
							.writer-info{
								width:calc(60% - 32px);
								height:calc(100% - 25px);
								padding-top:25px;
								padding-left:32px;
								img{
									width:60px;
									height:60px;
									border-radius:50%;
									float:left;
								}
								.writer-name{
									float:left;
									margin-left:24px;
									p{
										line-height:30px;
									}
									p:last-child{
										color:#666
									}
								}
							}
							.writer-click{
								width:40%;
								height:calc(100% - 20px);
								padding-top:20px;
								p{
									text-align:center;
									span{
										display:inline-block;
										width:88px;
										height:30px;
										line-height:30px;
										color:#fff;
										text-align:center;
										border-radius:15px;
										background:#0078fa;
										cursor: pointer;
									}
									i{
										display:inline-block;
										color:#666;
										margin-top:20px;
									}
									i:before{
										width:20px;
										height:20px;
										display:inline-block;
										content:"";
										background:#0078fa;
										vertical-align:middle;
										margin-right:5px;
									}
								}
							}

						}
						.main-works{
							width:100%;
							height:calc(100% - 110px);
							display:flex;
							img{
								width:calc(100% / 3);
								height:100%;
							}
						}
					}
					li:nth-child(2n+2){
						margin-right:0;
					}
				}
			}
		}
	}
</style>
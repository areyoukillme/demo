<template>
	<div class="wrap">
		<!--repository.wxml-->
		<navbar>滨惠智慧农场知识库</navbar>
		<div class='view_box'>
			<div class='top_img f_pr'>
				<img class='fitimg' src='../../assets/knowledgeimg.png'></img>
				<div class="f_pa search">
					<div class="searchinput f_pa">
						<img src="../../assets/search.png" alt="">
						<input type="text" class="input" v-model.trim="seachkey" @keyup.enter="gorepositoryDetails">
						<span class="gosearch" @click.stop="gorepositoryDetails">搜索</span>
					</div>
					<img src="../../assets/category.png" class="category f_pa" alt="" @click="goClass">
					<span class="categorytext f_pa" @click="goClass">分类</span>
				</div>
			</div>

			<div class='hot_box'>
				<div class='hot_title'>
					<span class='quan'></span>
					<div class='remen'>热门</div>
					<span class='quan'></span>
				</div>
				<div class='hot_content'>
					<div>
						<div v-for='(item,index) in hotlist' :key='index'>
							<div class='li clear' @click.stop='golist(item)' v-if="item">
								<div class='left li_name'>
									<span class='hot_t'>{{item.name}}</span>
									<div class='hot_icon' v-if="index==0">热</div>
								</div>
								<div class='right search_num'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import navbar from '../../components/common/navbar.vue'
	import {
		searchhot,
		searchContent
	} from '../../service/getData.js'
	export default {
		components: {
			navbar
		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				seachkey: '',
				hotlist: '',
				page: 1,
				limit: 1,
				catId: '',
				name: '',
				tokenId: ''
			};
		},

		created() {
			this.tokenId = this.$route.query.tokenId
			this.searchhot()
		},
		methods: {
			async searchhot() {
				let res = await searchhot();
				if (res.code == 0) {
					this.hotlist = res.page
					console.log(this.hotlist)
				}
			},
			goClass() {
				this.$router.push({
					path: 'knowcategory',

				})
			},
			golist(item) {
				this.$router.push({
					path: './searchContent',
					query: {
						catId: item.catId + ''
					}
				})
			},
			gorepositoryDetails() {
				if (this.seachkey) {
					this.$router.push({
						path: './searchContent',
						query: {
							name: this.seachkey,
							tokenId: this.tokenId
						}
					})
				} else {
					return
				}

			}

		},

	}
</script>

<style scoped lang="scss">
	.wrap {
		background: #fff;
	}

	.view_box {
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.top_img {
		width: 100%;
		height: 5.733333rem;
		margin: 0 auto;
	}

	.search {
		width: 9.466666rem;
		height: 2rem;
		box-shadow: 0 0 0.133333rem 0 rgba(0, 0, 0, 0.10);
		border-radius: 0.266666rem;
		left: 0.266666rem;
		bottom: -0.866666rem;
		background: #fff;
		.categorytext{font-size: 0.266666rem;line-height: 0.373333rem;bottom: 0.533333rem;right: 0.386666rem;};
		.category{right: 0.386666rem;bottom:0.906666rem;}
		.searchinput {
			width: 7.466666rem;
			height: 1.04rem;
			top: 0.44rem;
			left: 0.52rem;
			background: #f8f8f8;
			border-radius: 1.333333rem;
			display: flex;
			overflow: hidden;
			padding-right: 1.733333rem;

			img {
				width: 1.066666rem;
				height: 100%;
				padding-left: 0.346666rem;
				padding-top: 0.306666rem;
				box-sizing: border-box;
				padding-bottom: 0.293333rem;
				padding-right: 0.266666rem;
			}

			.input {
				flex: 1;
				height: 100%;
				font-size: 0.373333rem;
			}

			.gosearch {
				width: 1.733333rem;
				background: #2ACC85;
				height: 100%;
				font-size: 0.373333rem;
				position: absolute;
				right: 0;
				top: 0;
				text-align: center;
				line-height: 1.04rem;
				z-index:10;
			}
		}
	}

	.search_box {
		width: 100%;
		margin: 0 auto;
		overflow: hidden;
	}

	.floatbox {
		margin-left: 0.84rem;
		height: 1.88rem;
		padding-top: 0.866666rem;
		overflow: hidden;
	}

	.search_box .in {
		border-left: 1px solid #2acc85;
		border-top: 1px solid #2acc85;
		border-bottom: 1px solid #2acc85;
		width: 5.733333rem;
		height: 1.013333rem;
		position: relative;
		border-bottom-left-radius: 0.133333rem;
		border-top-left-radius: 0.133333rem;
		float: left;
	}

	.search_box input {
		width: 100%;
		height: 100%;
		padding-left: 1.04rem;
		padding-right: 0.266666rem;
		font-size: 0.373333rem;
	}

	.search_box .seek_icon {
		width: 0.48rem;
		height: 0.48rem;
		position: absolute;
		left: 0.4rem;
		top: 50%;
		margin-top: -0.2rem;
	}

	.search_box .ss {
		width: 1.733333rem;
		height: 100%;
		background: #2acc85;
		text-align: center;
		line-height: 1.013333rem;
		font-size: 0.373333rem;
		color: #fff;
		border-bottom-right-radius: 0.133333rem;
		border-top-right-radius: 0.133333rem;
		float: left;
	}

	/* 
分类 */

	/* 分类按钮 */

	.classification {
		margin-left: 0.4rem;
		width: 0.94rem;
		height: 100%;
		float: left;
		position: relative;
	}

	.classification .img_class {
		width: 0.506666rem;
		height: 0.506666rem;
		position: absolute;
		top: 0;
		left: 0.07rem;

	}

	.classification .text_class {
		font-size: 0.266666rem;
		color: #5b5b5b;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	/* 热门 */

	.hot_box {
		width: 100%;
		height: 8.666666rem;
		margin-top: 1.706666rem;
		padding: 0 0.8rem;
		display: flex;
		flex-direction: column;

	}

	.hot_title {
		width: 100%;
		height: 0.56rem;
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.hot_box .quan {
		display: inline-block;
		width: 0.106666rem;
		height: 0.106666rem;
		background: #d8d8d8;
		border-radius: 100%;
	}

	.remen {
		margin: 0 0.32rem;
		font-size: 0.4rem;
		color: #5b5b5b;
		font-weight: bold;
		position: relative;
	}

	.remen::after {
		width: 2rem;
		height: 0.026666rem;
		background: #d8d8d8;
		content: '';
		display: block;
		position: absolute;
		top: 0.266666rem;
		left: 1.333333rem;
	}

	.remen::before {
		width: 2rem;
		height: 0.026666rem;
		background: #d8d8d8;
		content: '';
		display: block;
		position: absolute;
		top: 0.266666rem;
		right: 1.333333rem;
	}

	.hot_content {
		width: 100%;
		margin-top: 0.906666rem;
	}

	.hot_content .li {
		width: 100%;
		padding: 0.4rem 0;
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 0.013333rem solid #F0F0F0;
	}

	.hot_content .li .li_name {
		font-family: PingFangSC-Regular;
		font-size: 0.48rem;
		color: #191919;
		letter-spacing: 0;
	}

	.hot_content .li .search_num {
		flex: 1;
		font-family: PingFangSC-Regular;
		font-size: 0.4rem;
		color: #C0C0C0;
		letter-spacing: 0;
		text-align: right;
	}

	.hot_content .li .hot_t {
		font-size: 0.373333rem;
		color: #191919;
		font-weight: bold;
		margin-right: 0.133333rem;
	}

	.hot_content .li .hot_icon {
		width: 0.666666rem;
		height: 0.453333rem;
		line-height: 0.453333rem;
		text-align: center;
		background: #f2be3f;
		border-radius: 0.266666rem;
		font-size: 0.346666rem;
		color: #fff;
		display: inline-block;
	}
</style>

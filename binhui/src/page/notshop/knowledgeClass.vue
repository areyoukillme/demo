<template>

	<div class="detail">
		<navbar>知识库分类</navbar>

		<div class='search_view' :class="isIphoneX?'isipx':''">
			<div class='in'>
				<input placeholder='请输入关键字' @focus="showcancel" @blur="hidecancel" v-model.trim="name" @keyup.enter="search"></input>
				<div class='seek_icon'>
					<img class='fitimg' :src='imgBaseUrl+"./seek_icon.png"'></img>
				</div>
				<div class='cancel' @click.stop='eliminate' v-if="issearch">
					<img class='fitimg' :src='imgBaseUrl+"./repcancel.png"'></img>
				</div>
				<span class='search_class' @click.stop='search'>搜索</span>
			</div>
		</div>

		<div class="scrolllinkage-container" :class="isIphoneX?'isipx':''">
			<div class="content">
				<div class="left-wrap" ref="leftWarp" :style="styleObj">
					<div>
						<span class="box" :class="isIphoneX?'isipx':''" ref="box"></span>
						<div class="left-item" v-for="(item,index) in categoryList" @click="selectMenu(item,index,$event)" ref="leftItemList"
						 :class="{'current':currentIndex === index}">{{item.name}}</div>
					</div>
				</div>
				<div class="right-wrap" ref="rightWarp">
					<div>
						<span class="box" :class="isIphoneX?'isipx':''"></span>
						<div class="right-item" v-for="(item,index) in categoryList" ref="rightItemList" :style="index==listNum?styleObj:''">
							<div class="detail">
								<div class="title"><span></span>{{item.name}}<span></span></div>
								<ul class="detail-content">
									<li v-for="(item2,index2) in item.childList" @click.stop="gocategoryList(item,item2)"><img :src="item2.imgUrl"
										 alt=""><span>{{item2.name}}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import Bscroll from 'better-scroll';
	import navbar from '../../components/common/navbar.vue'
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import {
		knowCategory
	} from '../../service/getData.js'
	export default {
		components: {
			navbar
		},
		data() {
			return {
				name: '',
				imgBaseUrl: imgBaseUrl,
				isIphoneX: '',
				issearch: '',
				categoryList: '',
				tokenId: '',
				page: 1,
				limit: 20,
				listNum: '',
				listHeight: [],
				styleObj: {
					minHeight: ""
				},
				scrollY: '',
				tokenId: ''
			};
		},
		created() {
			this.judgeIphoneX()
			this.tokenId = this.$route.query.tokenId
			this.getcategory()
		},
		computed: {
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			},
		},
		methods: {
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			gocategoryList(item, item2) {
				this.$router.push({
					path: 'searchContent',
					query: {
						name: item2.name
					}
				})
			},
			search() {
				if (this.name) {
					this.$router.push({
						path: './searchContent',
						query: {
							name: this.name,
							tokenId: this.tokenId
						}
					})
				} else {
					return
				}

			},
			eliminate() {
				this.name = ''
			},
			showcancel() {
				this.issearch = true;
			},
			hidecancel() {
				this.issearch = false;
			},
			async getcategory() {
				let res = await knowCategory(this.page, this.limit, this.tokenId);
				if (res.code == 0) {
					this.categoryList = res.page.list
					this.listNum = res.page.list.length - 1;
				}
			},
			_initScroll() {
				this.leftWarp = new Bscroll(this.$refs.leftWarp, {
					click: true, // better-scroll 默认会阻止浏览器的原生 click 事件
					momentum: true //是否启用动画
				});
				this.rightWarp = new Bscroll(this.$refs.rightWarp, {
					click: true, // better-scroll 默认会阻止浏览器的原生 click 事件
					probeType: 3,
					momentum:true,
				});
				this.rightWarp.on('scroll', pos => {
					if (pos.y <= 0) {
						this.scrollY = Math.abs(Math.round(pos.y));
					}
				});
			},
			_calculateHeight() {
				let rightItemList = this.$refs.rightItemList;
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < rightItemList.length; i++) {
					let item = rightItemList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			selectMenu(item, index, event) {
				if (!event._constructed) {
					return;
				}
				let rightItemList = this.$refs.rightItemList;
				let el = rightItemList[index];
				let box=this.$refs.box.clientHeight;
				this.rightWarp.scrollToElement(el, 100,0,-box);
		
			}

		},
		mounted() {
			let that = this
			this.getcategory().then(function() {
				that._initScroll();
				that._calculateHeight();
				that.$nextTick(function() {
					that.height = this.$refs.rightWarp.clientHeight;
					let box=this.$refs.box.clientHeight;
					that.styleObj.minHeight = that.height - box+ 'px';
				})
			})
		},
	}
</script>

<style scoped lang="scss">
	.search_view {
		z-index: 99;
		width: 100%;
		height: 1.386666rem;
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-bottom: 0.013333rem solid #f1f1f1;
		position: fixed;
		top: 1.706666rem;
		left: 0;

	}

	.search_box {
		height: 1.653333rem;
		background: red;
		z-index: 100;
	}

	.search_view.isipx {
		top: 2.32rem
	}

	.search_view .in {
		width: 9.466666rem;
		height: 0.906666rem;
		position: relative;
	}

	.search_view .search_class {
		display: inline-block;
		border-radius: 0.266666rem;
		padding: 0.133333rem;
		position: absolute;
		right: -0.4rem;
		top: 50%;
		z-index: 100;
		transform: translate(-50%, -50%);
		font-size: 0.373333rem;
		color: #0c0c0c;
	}

	.search_view .cancel {
		width: 0.533333rem;
		height: 0.533333rem;
		padding: 0.133333rem;
		position: absolute;
		right: 0.933333rem;
		top: 50%;
		z-index: 100;
		transform: translate(-50%, -50%);
		font-size: 0.373333rem;
		color: #0c0c0c;
	}

	.search_view input {
		width: 100%;
		height: 100%;
		border-radius: 1.333333rem;
		padding-left: 1.146666rem;
		padding-right: 1.866666rem;
		font-size: 0.373333rem;
		background: #f8f8f8;
	}

	.search_view .seek_icon {
		width: 0.48rem;
		height: 0.48rem;
		position: absolute;
		left: 0.4rem;
		top: 50%;
		margin-top: -0.2rem;
	}

	.scrolllinkage-container.isipx {}

	.scrolllinkage-container {

		left: 0;
		height: 100%;
		width: 100%;

		.content {
			display: flex;
			position: absolute;
			top: 0px;
			bottom: 0px;
			width: 100%;
			overflow: hidden;

			.left-wrap {

				width: 2.48rem;
				background: #f6f6f6;

				.box {
					height: 3.093333rem;
					display: block;
				}
				.box.isipx{height: 3.55rem;}
				;

				.left-item {
					width: 100%;
					height: 1.333333rem;
					font-size: 0.4rem;
					color: #333333;
					line-height: 1.333333rem;
					text-align: center;
					box-sizing: border-box;
					background: #F8F8F8;
				}

				.current {
					background: #fff;
					/* color: #fe3e62;
    border-left: 8rpx solid #fe3e62;  */
					position: relative;
				}

				.current:after {
					content: '';
					left: 0;
					top: 50%;
					width: 0.106666rem;
					height: 0.586666rem;
					background-color: #2acc85;
					transform: translate(0, -50%);
					position: absolute;
				}
			}

			.right-wrap {
				flex: 1;
				background: #fff;

				.box {
					height: 3.093333rem;
					display: block;
				}
				.box.isipx{height: 3.55rem;}
				.right-item {
					.detail {
						padding: 0.266666rem 0;
						border-bottom: 0.026666rem dashed #eaeaea;

						.title {
							font-size: 0.293333rem;
							color: #656363;
							height: 0.733333rem;
							background-color: #fff;
							padding-left: 0.333333rem;
							line-height: 0.733333rem;
							display: flex;
							justify-content: center;
							align-items: center;
							position: relative;

							span {
								display: inline-block;
								width: 0.8rem;
								height: 0.026666rem;
								background: #d9d9d9;
								margin: 0 0.266666rem;
								z-index: 10;
							}

						}

						.detail-content {
							display: flex;
							flex-wrap: wrap;
							padding: 0.533333rem 0.56rem 0 0.56rem;

							li {
								text-align: center;
								min-width: 33.3%;
								max-width: 33.3%;
								display: flex;
								flex-direction: column;
								padding-bottom: 0.386666rem;

								img {
									width: 1.733333rem;
									height: 1.733333rem;
									margin: 0 auto;
									border-radius: 50%;
									
								}

								;

								span {
									margin-top: 0.346666rem;
									font-size: 0.293333rem;
									color: #A4A3A3;
									letter-spacing: 0;
								}


							}
						}
					}
				}
			}
		}
	}
</style>

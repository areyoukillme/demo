<template>
	<div>
		<navbar>
			<img src="../../assets/Homefont.png" alt="" class="title_img f_db f_pa">
			<div class="f_pa cartbox clear">
				<div class="cart left f_pr" @click.stop="gocart">
					<span v-if="cartNum>0" class="cartNum f_pa">{{cartNum}}</span>
					<img src="../../assets/Homecart.png" alt="" class="f_db">
				</div>
				<div class="more left f_pr" @click="gonotice">
					<span v-if="notice==1" class="notice f_pa"> </span>
					<img src="../../assets/notice.png" alt="" class="f_db">
				</div>
			</div>

		</navbar>
		<div class="scrolllinkage-container" :class="isIphoneX?'isipx':''">
			<div class="content">
				<div class="left-wrap" ref="leftWarp">
					<div class="left-box">
						<div class="left-item" v-for="(item,index) in categoryList" @click="selectMenu(item,index)" ref="leftItemList"
						 :class="{'current':currentIndex === index}">{{item.name}}</div>
					</div>
				</div>
				<div class="right-wrap">
					<ul class="detail-content">
						<li v-for="(item2,index2) in rightlist.childList" @click="gocategoryList(item2)"><img :src="item2.imgUrl" alt=""><span>{{item2.name}}</span></li>
					</ul>
				</div>
			</div> 
		</div>
	</div>
</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import {
		getcategory,
		getcartnum,
		havenotice,
	} from '../../service/getData.js'

	export default {
		components: {
			navbar
		},
		data() {
			return {
				/* eslint-disable */
				categoryList: '',
				isIphoneX: '',

				/* eslint-enable */
				listHeight: [],
				scrollY: '',
				heightH: '',
				listNum: '',
				styleObj: {
					minHeight: ""
				},
				currentIndex: 0,
				index: '',
				rightlist: '',
				cartNum: '',
				tokenId: this.$route.query.tokenId,
				notice: ''
			};
		},
		created() {
			this.judgeIphoneX();
			this.getcategory()
			this.getcartnum()
			this.havenotice()
		},


		methods: {
			gonotice() {
				this.$router.push('mailbox')
			},
			gocart() {
				this.$bridge.callhandler('gocart')
			},
			async havenotice() {
				let res = await havenotice();
				if (res.code == 0) {
					this.notice = res.haveNewMsg
				}
			},
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			async getcartnum() {
				let res = await getcartnum(this.tokenId);
				if (res.code == 0) {
					this.cartNum = res.result

				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					});
				}
			},
			gocategoryList(item2) {
				this.$router.push({
					path: 'categoryList',
					query: {
						catId: item2.catId
					}
				})
			},
			async getcategory() {
				let res = await getcategory();
				if (res.code == 0) {
					this.categoryList = res.list;
					this.rightlist = res.list[0]
				}
			},

			selectMenu(item, index) {
				this.currentIndex = index;
				this.rightlist = this.categoryList[index]
			}
		}
	};
</script>



<style lang='scss' scoped>
	.title_img {
		width: 2.133333rem;
		height: 0.653333rem;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.cartbox {
		height: 1.173333rem;
		margin: auto;
		top: 0;
		right: -2.533333rem;
		bottom: 0;

		.cart,
		.more {
			width: 0.56rem;
			height: 0.56rem;
			margin-top: 0.306666rem;

			>img {
				width: 0.56rem;
				height: 0.56rem;
			}

			.cartNum {
				position: absolute;
				background: #FF5555;
				border-radius: 1.333333rem;
				left: 0.24rem;
				top: -0.066666rem;
				padding: 0 0.133333rem;
				font-family: PingFangSC-Semibold;
				font-size: 0.266666rem;
				color: #FFFFFF;
				line-height: 0.24rem;
			}

			.notice {
				width: 0.266666rem;
				height: 0.266666rem;
				background: #ff5555;
				border-radius: 50%;
				top: -0.066666rem;
				left: 0.34rem;
			}
		}

		.more {
			margin-left: 0.8rem;
		}
	}

	.scrolllinkage-container.isipx {

		top: 2.32rem;

	}

	.scrolllinkage-container {
		position: fixed;
		top: 1.633333rem;
		bottom: 0;
		left: 0;
		width: 100%;

		.content {
			display: flex;
			position: absolute;
			top: 0;
			bottom:0;
			width: 100%;
			overflow: hidden;

			.left-wrap {
				width: 2.4rem;
				background: #f8f8f8;
				overflow-y: scroll;
				-webkit-overflow-scrolling: touch;
				.left-box{padding-bottom: 1.066666rem;}
				.left-item {
					width: 100%;
					height: 1.333333rem;
					font-size: 0.4rem;
					color: #333333;
					line-height: 1.333333rem;
					text-align: center;
					box-sizing: border-box;
					background: #F8F8F8;
					border-bottom: 1px solid #d8d8d8;
				}

				.current {
					color: #FF5555;
					border-left: 0.08rem solid #FF5555;
					background: #fff;
				}
			}

			.right-wrap {
				background: #fff;
				border-left: 1px solid #d8d8d8;
				flex: 1;
				overflow: scroll;
				-webkit-overflow-scrolling: touch;

		
					.detail-content {
						padding-bottom:1.066666rem;
						overflow:hidden;
						li {
							float: left;
							text-align: center;
							width:2.52rem;
							display: flex;
							flex-direction: column;

							img {
								width: 1.733333rem;
								height: 1.733333rem;
								margin: 0 auto;
								padding-top: 0.386666rem;
								padding-bottom: 0.346666rem;
								border-radius: 50%;
							}

							;

							span {
								font-size: 0.293333rem;
								color: #A4A3A3;
								letter-spacing: 0;
							}


						}
					

				}
			}
		}
	}
</style>



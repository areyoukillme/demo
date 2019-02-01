<template>
	<div class="ioshome">
		<div class="fixbox">
			<div class="bigbox">
				<div class="topbox">
					<div class="top f_pr">
						<img class="font" src="../../assets/Homefont.png" alt="">
						<div class="noticebox f_pa">
							<div class="f_pr">
								<img src="../../assets/Homemore.png" class="cart f_pa" alt="">
								<span class="cartNum">99</span>
							</div>
						</div>
					</div>
				</div>
				<div class="classfy">
					<div class="item" v-for="(item,index) in classfy" :class="index==idx?'active':''" @click="changeItem(item,index)">
						<div class="itembox"><span>{{item.name}}</span></div>
					</div>
				</div>
				<div class="search f_pr">
					<img class="f_pa category" src="../../assets/Homeclass.png" @click.stop="goCategory" alt="">
					<div class="searchbox">
						<img class="f_pa" src="../../assets/Homesearch.png" alt="">
						<input type="search" v-model.trim="searchKey" @keyup.enter="gocategoryList(searchKey)">
						<span class="f_pa searchtext" @click.stop="gocategoryList(searchKey)">搜索</span>
					</div>
					<img src="../../assets/Homecart.png" class="cart2 f_pa" alt="" @click.stop="gocart">
					<span class="cartNum" v-if="cartNum>0">{{cartNum}}</span>
				</div>
			</div>
		</div>
		<div class="swipe">
			<mt-swipe class="swiper_carousel" :show-indicators='true'>
				<mt-swipe-item v-for="(item,index) in imgArr" :key="item.id">
					<a :href="item.href">
						<img preview="item.imgUrl" :src="item.imgUrl" class="img " />
					</a>
				</mt-swipe-item>
			</mt-swipe>
		</div>
		<div class="allclass" v-if="xiaofenlei.length>0">
			<ul class="bigbox">
				<li class="smallbox" v-for="(item,index) in xiaofenlei" @click.stop="gocategoryList2(item.catId)">
					<img :src="item.imgUrl" alt="">
					<span class="ellipsis">{{item.name }}</span>
				</li>
			</ul>
		</div>
		<div class="today" v-if="sellList">
			<div class="imgbox"><img :src="sellList.zoneImg" alt=""></div>
			<div class="todaylist">
				<ul>
					<li class="libox" v-for="(item,index) in sellList.fruitEntityNVOS" @click.stop="godetail(item)">
						<img class="left" :src="item.mainImage" alt="" />
						<div class="left divbox">
							<h2 class="ellip">{{item.name}}</h2>
							<p class="pricebox f_pr">
								<span class="price f_pa"> <span>¥</span><span class="bignum">{{item.sellPrice | bigprice}}</span><span>.{{item.sellPrice | samllprice}}</span><span
									 class="sellprice" v-if="item.markPrice">¥{{item.markPrice}}</span></span>
								<img src="../../assets/Homecarlist.png" class="f_pa" @click.stop="addcart(item)" alt="">
							</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="fresh" v-if="freshList">
			<div class="imgbox"><img :src="freshList.zoneImg" alt=""></div>
			<ul>
				<li class="libox" v-for="(item,index) in freshList.fruitEntityNVOS" @click="godetail(item)">
					<img class="left" :src="item.mainImage" alt="" />
					<div class="left divbox">
						<h2 class="ellip">{{item.name}}</h2>
						<p class="pricebox f_pr">
							<span class="price f_pa"> <span>¥</span><span class="bignum">{{item.sellPrice | bigprice}}</span><span>.{{item.sellPrice | samllprice}}</span><span
								 class="sellprice" v-if="item.markPrice">¥{{item.markPrice}}</span></span>
							<img src="../../assets/Homecarlist.png" class="f_pa" alt="" @click.stop="addcart(item)">
						</p>
					</div>
				</li>
			</ul>
		</div>
		<div class="famous">
			<div class="imgbox">
				<img src="../../assets/Homefamous.png" alt="">
			</div>
			<ul>
				<li class="f_pr" v-for="(item,index) in famousList">
					<img class="bgimg f_pa" src="http://img1.imgtn.bdimg.com/it/u=2449088133,982794190&fm=26&gp=0.jpg" alt="">
					<img class="people f_pa" :src="item.avatar" alt="">
					<img class="botimg f_pa" src="../../assets/Homeblock.png" alt="">
					<p>{{item.userName}}</p>
				</li>
			</ul>
		</div>
		<div class="know">
			<div class="imgbox"><img src="../../assets/Homeknow.png" alt=""></div>
			<div class="swiper-container show-swiper">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item,index) in konwImgList" @click="goknowlist(item.pltwkId)">
						<div class="goods f_pr">
							<img class="f_pa topimg" :src="item.imgUrl" alt="" width="100%">
							<img class="f_pa bottomimg" src="../../assets/Homekonwbottom.png" alt="">
						</div>
					</div>
				</div>
			</div>
			<div class="imgbox2" @click.stop="goknow">
				<img src="../../assets/moreknow.png" alt="">
			</div>
		</div>
	</div>
</template>

<script>
	import Swiper from 'swiper'
	import {
		firstUrl
	} from '../../config/env.js'
	import {
		swiperlist,
		dafenlei,
		ads,
		xiaofenlei,
		categorygoods,
		getcartnum,
		addcart,
		beanslist,
		getbeans,
		famousShop,
		knowImg
	} from '../../service/getData.js'
	export default {
		data() {
			return {
				classfy: '',
				imgArr: [],
				idx: 0,
				zoneId: 1,
				catId: '2',
				xiaofenlei: '',
				limit: '10',
				sellList: '',
				freshList: '',
				searchKey: '',
				slides: '',
				goods: '',
				tokenId: '',
				amount: 1,
				cartNum: '',
				famousList: '',
				konwImgList: '',
				listFull: [],
				firstUrl: firstUrl,
				adsType: "1",

			};
		},
		created() {
			this.tokenId = this.$route.query.tokenId;
			this.dafenlei()
			this.getxiaofenlei()
			this.categorygoods()
			this.getswiper()
			this.getcartnum()
			this.getfamous()
		},
		mounted() {

			this.getkonwImg().then(function() {
				var swiperShow = new Swiper('.show-swiper', {
					slidesPerView: 'auto',
					watchSlidesProgress: true,
					spaceBetween: 0,
					//20
					resistanceRatio: 1,
					loop: true
				})
			})

		},

		methods: {

			async getfamous() {
				let res = await famousShop();
				if (res.code == 0) {
					this.famousList = res.list;
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
						duration: 1500,
					});
				}
			},
			async getkonwImg() {
				let res = await knowImg();
				if (res.code == 0) {
					this.konwImgList = res.page
				}
			},
			//轮播图跳转
			goswiperurl(){
				let that=this;
				this.$bridge.callhandler('')
			},
			//去购物车
			gocart() {
				let that = this;
				this.$bridge.callhandler('homeGoOther', {
					'url': `${that.firstUrl}bhFarmAppWeb/cartlist?deviceType=ios`
				})
			},
			//去商品详情
			godetail(item) {
				let that = this;
				this.$bridge.callhandler('homeGoOther', {
					'url': `${that.firstUrl}bhFarmAppWeb/goodsdetail?goodstype=${item.type}&goodsId=${item.goodsId}&deviceType=ios`
				})
			},
			//去总分类
			goCategory() {
				let that = this;
				this.$bridge.callhandler('homeGoOther', {
					'url': `${that.firstUrl}bhFarmAppWeb/category?deviceType=ios`
				})
			},
			//搜索跳转
			gocategoryList(key) {
				let that = this;
				let searchKey = encodeURI(encodeURI(key))
				this.$bridge.callhandler('homeGoOther', {
					'url': `${that.firstUrl}bhFarmAppWeb/categoryList?searchKey=${searchKey}&deviceType=ios`
				})
			},
			//小分类跳转
			gocategoryList2(catId) {
				let that = this;
				this.$bridge.callhandler('homeGoOther', {
					'url': `${that.firstUrl}bhFarmAppWeb/categoryList?catId=${catId}&deviceType=ios`
				})
			},
			//查看更多知识库
			goknow() {
				let that = this;
				this.$bridge.callhandler('homeGoOther', {
					'url': `${that.firstUrl}bhFarmAppWeb/knowledge?deviceType=ios`
				})
			},
			//点击知识库轮播图跳转
			goknowlist(catId) {
				let that = this;
				this.$bridge.callhandler('homeGoOther', {
					'url': `${that.firstUrl}bhFarmAppWeb/searchDetail?deviceType=ios&id=${catId}`
				})
			},
			changeItem(item, index) {
				this.idx = index;
				this.zoneId = item.zoneId;
				this.catId = item.catId + '';
				this.getxiaofenlei();
				this.categorygoods();
				this.adsType = index + 1 + '';
				this.getswiper()
			},
			async addcart(item) {
				let that = this;
				let res = await addcart(item.goodsId, this.amount, item.type, this.tokenId);
				if (res.code == 0) {
					this.cartNum++
					that.$bridge.callhandler('alterView')
				} else {}
			},
			async getswiper() {
				let res = await ads(this.adsType);
				let that = this;
				if (res.code == 0) {
					this.imgArr = res.list
					res.list.forEach(function(item, index) {
						that.listFull[item] = item.imgUrl

					})

				} else {}

			},
			async dafenlei() {
				let res = await dafenlei("2");
				if (res.code == 0) {
					this.classfy = res.list
				} else {}
			},
			async getxiaofenlei() {
				let res = await xiaofenlei(this.catId);
				if (res.code == 0) {
					this.xiaofenlei = res.list.slice(0, 10)
				} else {}
			},
			async categorygoods() {
				let res = await categorygoods(this.zoneId + '', this.limit);
				if (res.code == 0) {
					if (res.list) {
						this.sellList = res.list[0];
						this.freshList = res.list[1];

					}

				} else {}
			},
		},
		filters: {
			bigprice: function(myInput) {
				if (!myInput) {
					return
				} else {
					return parseInt(myInput)
				}
			},
			samllprice: function(myInput) {
				if (!myInput) {
					return
				} else {
					let res = (myInput - parseInt(myInput)).toFixed(2) * 100
					return res < 10 ? '0' + res : res;
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.ioshome {
		font-family: PingFangSC-Regular;
		background: #f2f4f8;
		box-sizing: border-box;
	}

	.ellip {
		display: inline-block;
		word-break: break-all;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		text-overflow: ellipsis;

	}

	.top {
		background: #fff;
		width: 100%;
		text-align: center;
		font-family: FZZhengHeiS-DB-GB-;
		font-size: 0.533333rem;
		color: #2ACC85;
		height: 1.333333rem;
		line-height: 1.333333rem;
		border-top-left-radius: 0.266666rem;
		border-top-right-radius: 0.266666rem;

		.font {
			width: 2.133333rem;
			height: 0.653333rem;
			position: absolute;
			top: 0.373333rem;
			left: 3.933333rem
		}

		.cartbox {
			width: 0.56rem;
			height: 0.56rem;
			top: 0.386666rem;
			right: 1.853333rem;

			.cart {
				top: 0;
				left: 0;
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

				.jia {
					font-size: 0.16rem
				}
			}
		}

		.noticebox {
			width: 0.56rem;
			height: 0.56rem;
			top: 0.386666rem;
			right: 0.386666rem;

			.cart {
				top: 0;
				left: 0;
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
				line-height: 0.26rem;
			}
		}

	}

	.classfy {
		display: flex;
		background: #fff;
		font-family: PingFangSC-Regular;

		.item {
			flex: 1;
			text-align: center;
			height: 1.173333rem;
			line-height: 1.133333rem;
			font-size: 0.426666rem;
			color: #333333;
			height: 1.173333rem;
			box-sizing: border-box;

			.itembox {
				width: 45%;
				margin: 0 auto;
			}

			span {

				font-weight: 400;
			}
		}

		.item.active {
			box-sizing: border-box;
			font-family: PingFangSC-Semibold;
			color: #333333;
			z-index: 10000;

			span {
				font-weight: 800;

				font-family: PingFangSC-Semibold;
				font-size: 0.453333rem;
				color: #333333;
			}

			.itembox {
				border-bottom: 0.053333rem solid #333;
			}

		}
	}

	.search {
		background: #fff;
		height: 1.173333rem;

		.category {
			width: 0.56rem;
			height: 0.56rem;
			padding: 0.3rem;
			top: 0.006666rem;
			left: 0.086666rem;

		}

		.cart2 {
			width: 0.56rem;
			height: 0.56rem;
			padding: 0.3rem;
			top: 0.006666rem;
			right: 0.086666rem;
		}

		.cartNum {
			position: absolute;
			background: #FF5555;
			border-radius: 1.333333rem;
			right: 0.24rem;
			top: 0.2rem;
			padding: 0 0.133333rem;
			font-family: PingFangSC-Semibold;
			font-size: 0.266666rem;
			color: #FFFFFF;
			line-height: 0.24rem;

			.jia {
				font-size: 0.16rem
			}
		}

		.searchbox {
			position: absolute;
			width: 7.4rem;
			height: 0.866666rem;
			z-index: 10000;
			background: #EEEEEE;
			border-radius: 1.333333rem;
			left: 1.266666rem;
			top: 0.16rem;
			padding: 0 0.746666rem;

			input {
				display: block;
				width: 90%;
				height: 100%;
				font-size: 0.32rem;
				line-height: 100%;
			}

			img {
				top: 0.24rem;
				left: 0.293333rem;
				width: 0.394666rem;
				height: 0.394666rem;
			}

			.searchtext {
				padding: 0 0.266666rem;
				top: 0;
				right: 0;
				font-size: 0.36rem;
				line-height: 0.866666rem;
			}

			.cartbox {}
		}

	}

	.swipe {
		background: #fff;

		.swiper_carousel {
			width: 100%;
			height: 3.733333rem;
			object-fit: cover;
		}

		.swiper_carousel img {
			min-width: 100%;
			max-width: 100%;
			height: 100%;
			display: block;
			margin: 0 auto;
		}
	}

	.allclass {
		background: #fff;
		padding-top: 0.333333rem;
		padding-bottom: 0.746666rem;
		height: 5.426666rem;

		.bigbox {
			display: flex;
			flex-wrap: wrap;

			.smallbox {
				margin-top: 0.466666rem;
				min-width: 20%;
				max-width: 20%;
				height: 1.706666rem;
				flex: 1;
				display: flex;
				flex-direction: column;
				text-align: center;
				justify-content: space-between;

				img {
					border-radius: 50%;
					background: pink;
					margin: 0 auto;
					width: 1.066666rem;
					height: 1.066666rem;
				}

				span {
					font-size: 0.293333rem;
				}
			}
		}
	}

	.today {
		background: #fff;
		width: 100%;
		border-bottom-left-radius: 0.266666rem;
		border-bottom-right-radius: 0.266666rem;

		.imgbox {
			padding-bottom: 0.453333rem;
			text-align: center;
		}

		img {
			width: 6.093333rem;
			height: 1.613333rem;
		}

	}

	.todaylist {
		background: #fff;
		padding-bottom: 0.133333rem;
		border-bottom-left-radius: 0.266666rem;
		border-bottom-right-radius: 0.266666rem;

		ul li:last-child {
			border-bottom: none;

		}
	}

	.libox {
		height: 3.733333rem;
		border-bottom: 1px solid #D8D8D8;
		padding: 0.133333rem 0.373333rem 0.133333rem 0.133333rem;
		background: #fff;

		img {
			height: 100%;
			width: 3.466666rem;

		}

		.divbox {
			padding-left: 0.266666rem;
			padding-top: 0.146666rem;

			h2 {
				font-size: 0.4rem;
				color: #666666;
				letter-spacing: 0;
				line-height: 0.466666rem;
				height: 0.933333rem;
				width: 5.76rem;
			}

			p {
				padding-top: 2.12rem;

				.price {
					left: 0;
					bottom: -0.026666rem;
					font-family: Geomanist-Book;
					font-size: 0.32rem;
					color: #EF5400;
					letter-spacing: 0;

					span {
						color: #EF5400;
					}

					.bignum {
						font-size: 0.48rem;
					}
				}

				.sellprice {
					bottom: 0;
					font-size: 0.32rem;
					line-height: 0.373333rem;
					color: #999999 !important;
					padding-left: 0.133333rem;
					letter-spacing: 0;
					left: 1.3rem;
					text-decoration: line-through;
				}

				img {
					right: 0;
					bottom: 0;
					padding-top: 0.533333rem;
					padding-left: 0.533333rem;
					width: 0.666666rem;
					height: 0.666666rem;
				}
			}
		}
	}

	.fresh {
		border-top-left-radius: 0.266666rem;
		border-top-right-radius: 0.266666rem;
		background: #fff;
		margin-top: 0.266666rem;

		.imgbox {
			text-align: center;
			padding-top: 0.133333rem;
			padding-bottom: 0.453333rem;

			img {

				width: 6.093333rem;
				height: 1.613333rem;

			}
		}

	}

	.famous {
		background: #fff;
		padding-top: 0.56rem;
		text-align: center;
		padding-bottom: 0.266666rem;
		border-bottom-left-radius: 0.266666rem;
		border-bottom-right-radius: 0.266666rem;

		.imgbox {
			img {
				width: 2.986666rem;
				height: 0.786666rem;
			}
		}

		ul {
			display: flex;
			padding: 0.266666rem 0.133333rem 0 0.266666rem;
			justify-content: space-around;

			li {
				flex: 1;
				width: 3.066666rem;
				margin-right: 0.133333rem;
				height: 3.2rem;

				.bgimg {
					left: 0;
					top: 0;
					width: 3.066666rem;
					height: 2.626666rem;
					background: gray;
					border-top-left-radius: 0.266666rem;
					border-top-right-radius: 0.266666rem;
					z-index: 10;
				}

				.people {
					border: 0.04rem solid #FFFFFF;
					box-shadow: 0 0 0.106666rem 0 rgba(0, 0, 0, 0.50);
					width: 1.466666rem;
					height: 1.466666rem;
					top: 0.986666rem;
					left: 0.8rem;
					background: green;
					border-radius: 50%;
					z-index: 10000000;
				}

				.botimg {
					bottom: 0;
					left: 0;
					width: 100%;
					height: auto;
					z-index: 100;
				}

				p {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 3.066666rem;
					height: 1.066666rem;
					padding-top: 0.466666rem;
					font-size: 0.373333rem;
					font-weight: 600;
					color: #4A9371;
					letter-spacing: 0;
					z-index: 100000;
					overflow: hidden;
				}

			}
		}
	}

	.know {
		img {
			width: 100%;
			height: auto;
		}

		.imgbox {
			text-align: center;
			padding-top: 0.133333rem;
			padding-bottom: 0.16rem;

			img {
				margin: 0 auto;
				width: 7.413333rem;
				height: 0.853333rem;
			}
		}

		.imgbox2 {
			text-align: center;
			padding-top: 0.133333rem;
			padding-bottom: 0.16rem;

			img {
				margin: 0 auto;
				width: 2.4rem;
				height: 0.453333rem;
			}
		}

		.swiper-container {
			.swiper-slide.last {
				width: 1.333333rem;
				margin-left: 5%;
			}

			.swiper-slide {
				width: 80%;
				margin-right: -5%;
				transform: scale(0.8);

				.goods {
					width: 100%;
					height: 5.4rem;

					background: #000000;

					.topimg {
						top: 0;
						left: 0;
						width: 8rem;
						height: 4rem;
						object-fit: cover;
					}

					.bottomimg {
						bottom: 0;
						left: 0;
						width: 8rem;
						height: 2.986666rem;
					}
				}

				p {
					width: 0.48rem;
					font-size: 0.48rem;
				}
			}

			.swiper-slide.swiper-slide-active {
				transform: scale(1);
				margin-left: 0;

				.goods {}

			}
		}
	}
</style>

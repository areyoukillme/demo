<template>
	<div class="bgc">
		<navbar>商品详情</navbar>

		<div class='b_box' :class="isIphoneX?'iphonex':''" scroll-y="true" scroll-top="scrollTop">

			<!-- 轮播图 -->
			<div class='f_pr'>
				<mt-swipe :auto="2000" class="swiper_carousel" :show-indicators='true'>
					<mt-swipe-item v-for="(item,index) in goodsData.imageList" :key="index">
						<a :href="item.href" rel="external nofollow">
							<img preview="item" :src="item" class="fitimg img" />
						</a>
					</mt-swipe-item>
				</mt-swipe>
			</div>
			<!-- 规格 -->
			<div class='size_box'>
				<span class='price'><span class='dollar'>￥</span>{{goodsData.sellPrice}}</span>
				<span class='title f_db'>{{goodsData.name}} </span>
				<!-- 如果type == 1 就是物品商店 显示尺寸/颜色 -->
				<div class='attr f_pr' v-if="goodtype == 6">
					<div class='goodSku'>
						<span>尺寸:</span><span>{{goodsData.size}}m</span>
					</div>
					<div class='goodSku'>
						<span>颜色:</span><span>{{goodsData.spec}}</span>
					</div>
				</div>
				<div class='attr f_pr'>
					<div class='attr_li'>
						<span>{{goodsData.spec}}<span v-if='goodtype!=2'></span></span>
						<span v-if='goodtype==2'>{{goodsData.plantArea}}颗/m²</span>
					</div>
					<div class='attr_li' v-if='goodtype==2'>
						<span>{{goodsData.cycleMin}}天</span>
						<!-- <span>{{goodsData.cycleMin}}~{{goodsData.cycleMax}}天</span> -->
						<span>收成周期</span>
					</div>
					<span class='sales f_pa' v-if="goodsData.type == 2">月销{{goodsData.sale}}笔</span>
					<span class='sales f_pa sale_name' v-if="goodsData.type == 1">卖家<span class='sale_icon'>:</span>{{goodsData.userName}}
					</span>
				</div>
			</div>

			<div class='image_span '>
				<div class='introduction'>
					<span>商品简介</span>
				</div>
				<div class="rich_span" :class="isIphoneX?'iphoneX':''" v-html="goodsDesc" :style='{zoom:richW}'></div>

			</div>

			<!-- 底部按钮 -->
			<div class='prodetail_bottom' :class="isIphoneX?'iphoneX':''">
				<div class='nav'>
					<div class='btn_center' @click.stop='gohome'>
						<img src='../../assets/sale_home.png'></img>
						<span>首页</span>
					</div>
					<div class='btn_center' @click.stop='oncollect("1")' v-if='isFavorite==0'>
						<img src='../../assets/sale_collect.png'></img>
						<span>收藏</span>
					</div>
					<div class='btn_center' @click.stop="oncollect('0')" v-else>
						<img src='../../assets/sale_collect_cur.png'></img>
						<span>收藏</span>
					</div>
					<div class='btn_center f_pr' @click="gocartlist" style="cursor: pointer">
						<img src='../../assets/Homecart.png'></img>
						<span v-if="cartNum>0" class="f_pa cartNum">{{cartNum}}</span>
						<span>购物车</span>
					</div>
				</div>
				<div class="btn">
					<button :disabled='!cartHad||storeNum<1' @click.stop='addcart($event)'>
						<span class='f_db' v-if="cartHad">加入购物车</span>
						<span class='f_db' v-if="!cartHad">已加入购物车</span>
						<span class="buynow">立即购买</span>
					</button>
					<button class="buynow" @click.stop='buynow'>
						<span class="buynow">立即购买</span>
					</button>
				</div>
			</div>
			<div :class="isIphoneX?'ipxbox':''"></div>
			
		</div>
		<loading v-if="showloading"></loading>
	</div>
</template>

<script>
	import loading from '../../components/common/loading.vue'
	import gotop from '../../components/common/gotop.vue'
	import gocart from '../../components/common/gocart.vue'
	import navbar from '../../components/common/navbar.vue'
	import _ from 'lodash'
	import {
		swiperlist,
		categorylist,
		goodsdetail,
		isfav,
		addfav,
		addcart,
		isExist,
		getcartnum,
		isEnough
	} from '../../service/getData.js'
	import {
		mapMutations
	} from "vuex";

	export default {
		components: {
			gotop,
			gocart,
			navbar,
			loading
		},

		data() {
			return {
				isIphoneX: '',
				circular: true,
				indicatorColor: '#fff',
				indicatorActiveColor: '#ed0000',
				autoplay: true,
				interval: 4000,
				duration: 300,
				current: '', //轮播指示点
				richW: 1, // 详情图加载比例
				goodsDesc: '',
				goodsId: '', //传过来的商品id
				goodtype: '', //传过来的商类型
				goodsData: {}, //商品详情总对象
				isFavorite: '0', //是否收藏
				cartHad: true, //判断是否可以加入购物车,true可以加入，false不可以
				//购物车组件变量
				hide_animation_box: true, //加入购物车元素隐藏
				cartNum: '0', //购物车数量
				shopType: '', //商家类型:1为自营其他为农友
				storeNum: '', //库存
				showTop: false,
				userId: "1",
				cartProImg: '',
				x: '',
				y: '',
				cartItemId: '',
				amount: "1",
				cartType: '',
				tokenId: '',
				isIphoneX: '',
				cartNum: '',
				showloading:false,
			}
		},
		created() {
			this.tokenId = this.$route.query.tokenId;
			this.goodsId = this.$route.query.goodsId + '';
			this.goodtype = this.$route.query.goodstype + '';
			this.userId = this.$route.query.userId + '';
			this.goodsdetail()
			this.iscollect()
			this.judgeIphoneX()
			this.getcartnum()
		},
		// beforeRouteLeave(to,from,next){
		// 	this.FETCH_LOADING(false);
		// 	next();
		// },
		methods: {
			...mapMutations([
				'FETCH_LOADING',
			]),
			gocartlist() {
				this.wx.miniProgram.navigateTo({
					url:'../cart/cart'
				})
			},
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			handleScroll() {
				var scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				if (scroll > 1500) {
					this.showTop = true;
				} else {
					this.showTop = false;
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
			//判断是否存在购物车


			//获取商品详情
			async goodsdetail() {
				let res = await goodsdetail(this.goodsId, this.goodtype);
				if (res.code == 0) {
					this.goodsData = res.goodsMsg;
					this.goodsDesc = res.goodsMsg.goodsDesc;
					this.storeNum = res.goodsMsg.storeNums;
					this.shopType = res.goodsMsg.type;
					this.storeNum = res.goodsMsg.storeNums;
					console.log(this.storeNum)
					if (res.goodsMsg.goodsStatus == 0 && this.goodtype == 2) {
						this.$messagebox({
							message: '种子已下架，请重新选择',
							showCancelButton: true,
							confirmButtonText: "返回商城",
							canselButtonText: '取消'
						}).then(action => {
							if (action == 'confirm') {
								this.$router.go(-1)
							} else {
								this.$router.go(-1)
							}
						})
					}
				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}
			},

			//判断是否收藏
			async iscollect() {
				let res = await isfav(this.goodsId, this.goodtype, this.tokenId);
				if (res.code == 0) {
					this.isFavorite = res.isFavorite;
				} else if (res.code != 401) {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}
			},
			//立即购买
			async buynow() {
				let data = {
					'goodsId': this.goodsId,
					'num': '1',
					'type': this.goodtype
				}
				let that=this;
				let res=await isEnough(this.goodsId,this.goodtype,1)
				if (res.code==0){
					that.wx.miniProgram.navigateTo({
						url: "../order/confirmorder/confirmorder?goodsId=" + that.goodsId + "&type=" + that.goodtype + "&orderList=2"
					})
				}
			},

			// 点击收藏或取消收藏
			oncollect: _.throttle(async function(type) {
				let res = await addfav(Number(this.goodsId), Number(this.goodtype), Number(type), this.tokenId);
				if (res.code == 0) {
					this.$toast({
						message: this.isFavorite == 1 ? "取消收藏" : "收藏成功",
						position: 'center',
						duration: 1500
					})
					this.isFavorite = type;
				} else if (res.code != 401) {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				} else {
					this.$toast({})
				}
			}, 1500),
			//去首页
			gohome() {
				this.wx.miniProgram.switchTab({url:'../index/index'})
			},
			async addcart() {
				let res = await addcart(this.goodsId, this.amount, this.goodtype, this.tokenId);
				if (res.code == 0) {
					this.cartNum++;
					this.storeNum--;
					this.$toast({
						message: "成功加入购物车",
						position: 'center',
						duration: 1500
					});
				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					});
				}
			},
		},
		mounted() {
			window.addEventListener('scroll', this.handleScroll)
			let dpr = document.getElementsByTagName('html')[0].getAttribute('data-dpr')
			this.richW = dpr / 2;
		}
	}
</script>

<style scoped lang="scss">
	.rich_span {
		/deep/ img {
			width: 100% !important;
			height: auto;
		}

	}
	.rich_span.iphoneX{
		padding-bottom: 0.8rem;
	}
	.b_box {
		width: 100%;
		height: 100%;
		background: #F2F4F8;
		margin-bottom: 1.333333rem;
	}

	.b_box.iphoneX {
		padding-bottom: 34px !important;
	}

	/* 轮播 */

	.swiper_carousel {
		width: 100%;
		height: 8.266666rem;
		overflow: hidden;
		box-shadow: 0px 0.053333rem 0rem #f8f8f8;
	}

	.swiper_carousel img {
		height: 100%;
		max-width: 100%;
		min-width: 100%;
		margin: 0 auto;
	}

	/* 规格参数 */

	.size_box {
		width: 100%;
		padding: 0 0.266666rem;
		background: #fff;
	}

	.size_box .price {
		display: block;
		font-size: 0.586666rem;
		color: #f00;
		line-height: 1.413333rem;
		padding-top: 0.106666rem;
	}

	.size_box .dollar {
		font-size: 0.4rem;
		color: #f00;
		line-height: 1.4rem;
	}

	.size_box .title {
		font-size: 0.426666rem;
		font-weight: 600;
		margin-bottom: 0.373333rem;
	}

	.size_box .attr {
		width: 100%;
		padding-bottom: 0.266666rem;
		margin-bottom: 0.266666rem;
		display: flex;
		flex-direction: row;
	}

	.size_box .attr .sales {
		color: #999;
		font-size: 0.32rem;
		bottom: 0.266666rem;
		right: 0;
	}

	.size_box .attr .sale_name {
		color: #999;
		font-size: 0.373333rem;
		top: 0;
	}

	.sale_icon {
		padding: 0 0.133333rem 0 0.026666rem;
		color: #999;
	}

	.attr_li {
		display: flex;
		flex-direction: column;
		padding-right: 0.533333rem;
		font-size: 0.373333rem;
	}

	.attr_li:nth-of-type(2) {
		padding-left: 0.533333rem;
		position: relative;
	}

	.attr_li:nth-of-type(2)::after {
		width: 0.013333rem;
		height: 0.8rem;
		background: #dcdcdc;
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		left: 0;
	}

	.attr_li span:nth-of-type(1) {
		font-weight: 600;
		margin-bottom: 0.2rem;
		font-size: 0.4rem;
	}

	.attr_li span:nth-of-type(2) {
		color: #999;
		font-size: 0.32rem;
	}

	/* 图文 */

	.image_text {
		width: 100%;
		display: table;
		padding-bottom: 1.333333rem;
		overflow: hidden;
		background: #fff;
	}

	.introduction {
		width: 100%;
		height: 1.466666rem;
		padding: 0.533333rem 0.266666rem 0.453333rem 0.213333rem;
		background: #fff;
	}

	.introduction span {

		display: inline-block;
		font-size: 0.48rem;
		line-height: 0.133333rem;
		font-weight: 600;
		border-bottom: 0.16rem solid #ff6c3c;
	}

	rich_text {
		width: 100%;
		font-size: 0.24rem;
	}

	/* 底部按钮 */

	.prodetail_bottom {
		/* 权重 */
		z-index: 899;
		width: 100%;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
	}

	.prodetail_bottom.iphoneX {
		background: #fff;
		border-bottom: none !important;
		padding-bottom: 0.8rem !important;
	}

	.prodetail_bottom .nav {
		flex: 1;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.btn_center {
		width: 1.44rem;
		height: 1.28rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-sizing: content-box;

		.cartNum {
			position: absolute;
			background: #FF5555;
			border-radius: 1.333333rem;
			left: 0.64rem;
			top: -0.066666rem;
			padding: 0 0.133333rem;
			font-family: PingFangSC-Semibold;
			font-size: 0.266666rem;
			color: #FFFFFF;
			line-height: 0.24rem;
		}
	}

	.btn_center img {
		width: 0.533333rem;
		height: 0.533333rem;
	}

	.btn_center span {
		font-size: 0.266666rem;
		font-weight: 600;
		color: #999;
		margin-top: 0.133333rem;
	}

	.prodetail_bottom .btn {
		flex: 1;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.prodetail_bottom .btn>button {
		background: -webkit-linear-gradient(left, #ff9422, #ff7039);
		border-top-left-radius: 0.533333rem;
		border-bottom-left-radius: 0.53333rem;
		width: 2.32rem;
		height: 1.066666rem;
		border: none;

	}

	.prodetail_bottom .btn>.buynow {
		background-image: linear-gradient(89deg, #FD7A7A 0%, #FF4949 100%);
		border-top-left-radius: 0rem;
		border-bottom-left-radius: 0rem;
		border-top-right-radius: 0.533333rem;
		border-bottom-right-radius: 0.53333rem;
		width: 2.32rem;
		height: 1.066666rem;
		border: none;

	}

	.prodetail_bottom .btn>button>span {
		font-size: 0.373333rem;
		color: #fff;
		line-height: 1.066666rem;
		text-align: center;
	}

	.prodetail_bottom .btn>button[disabled] {
		background: linear-gradient(to right, rgba(217, 217, 217, 1) 0%, rgba(151, 150, 151, 1) 100%);
		background: -webkit-linear-gradient(left, rgba(217, 217, 217, 1) 0%, rgba(151, 150, 151, 1) 100%);
	}

	.attr .goodSku {
		font-size: 0.4rem;
		font-family: 'PingFangSC-Regular'
	}

	.attr .goodSku span {
		color: #999;
	}

	.attr .goodSku:first-child {
		margin-right: 0.666666rem;
	}

	.ipxbox {
		width: 100%;
		height: 0.866666rem;
		position: fixed;
		bottom: 0;
		left: 50%;
		background: #fff;
		transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
	}
</style>

<template>
	<div class='box f_pr class="bgc"'>
		<navbar>物品商店</navbar>
		<div class='headers' :class="isIphoneX?'ipx':''">
			<div class='search_rule'>
				<div class='lis' v-for="(x,index) in rule" @click.stop='exChange(index)'>
					<span>{{x.name}}</span>
					<img src='../../assets/select_no.png' v-if="x.show=='d'"></img>
					<img src='../../assets/select_top.png' v-if="x.show=='t'"></img>
					<img src='../../assets/select_bottom.png' v-if="x.show=='b'"></img>
				</div>
			</div>

			<div class="slide-box" ref="slidebox">
				<div v-for="(y,idx) in Nav" :key="idx" class="slide-item" :class="currentTab == idx ?'active':''" @click.stop="exchangeClassfical(y,idx,$event)">{{y.name}}</div>
			</div>
			<div class='class_ui_box'>
				<div class='class_li_box' v-for='(item,index) in Nav2.childList' :key='index' @click.stop="exchangeClassficalone(item,index)">
					<span class='ellipsis' :class='currentTabone==index?"class_li_active":""'>{{item.name}}</span>
				</div>
			</div>
		</div>
		<div class='goods_list_box' ref="List">
			<div class='goods f_pr' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
				<div class='item left f_pr' v-for="(x,index) in ShopList" :key="index">
					<div class='f_pr img overflowimg' @click.stop='goprodetail(x,index)'>
						<img class='fitimg2' :src='x.mainImage'></img>
						<img class='f_pa self_icon' src='../../assets/self_shop.png'/>
					</div>
					<div class='f_pr goods_bottom'>
						<div class='name ellipsis'>{{x.name}} </div>
						<div class='detail'>
							<span class='left'>{{x.tagName}}</span>
							<span class='right'>月销{{x.sale}}笔</span>
						</div>
						<div class='price'>
							<span class='price_icon'>￥</span>{{x.sellPrice}}
						</div>
					</div>
					<div class='cart_icon f_pa' @click.stop='touchOnGoods(x,$event)'>
						<img src='../../assets/cart.png'></img>
					</div>
				</div>
			</div>
			<div class="null_list" v-if="allLoaded||ShopList.length==0">没有更多数据了</div>

		</div>
		<gotop :showTop="showTop"></gotop>
		<gocart :left="x" :top="y" :cartProImg="cartProImg" ref="cart"></gocart>
		<div class="animation_box f_pr" v-show="hide_animation_box">
			<img class='fitimg' :src='cartProImg'></img>
		</div>
	</div>
</template>

<script>
	import gotop from '../../components/common/gotop.vue'
	import gocart from '../../components/common/gocart.vue'
	import _ from 'lodash'
	import navbar from '../../components/common/navbar.vue'
	import {
		getcartNum,
		gdslist,
		gdscategory,
		addcart
	} from '../../service/getData.js'
	import {
		imgBaseUrl
	} from '../../config/env.js'
	export default {
		components: {
			gotop,
			gocart,
			navbar
		},
		data() {
			return {
				showTop: false,
				rule: [{
						name: '销量',
						actived: true,
						show: 'b',
						sidx: 'g.sale'
					},
					{
						name: '最新',
						actived: false,
						show: 'd',
						sidx: 'g.add_time'
					},
					{
						name: '价格',
						actived: false,
						show: 'd',
						sidx: 'g.sell_price'
					}
				],
				scrollLeft: 0, //nav滚动
				order: 'desc', //升序asc,降序:desc
				sidx: 'g.sale', //查询条件：按新品查询g.add_time,按销量查询g.sale,按价格查询g.sell_price
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				currentTab: 0, //滑动导航默认
				showmore: false, //显示隐藏更多
				NavList: [{
					name: "全部"
				}], //导航顶部数据
				Nav: [], //导航顶部总数据
				page: "1", //当前页
				limit: "20", //每页数量
				shopList: [], //数据列表
				ShopList: [],
				catId: "99999999", //分类id

				// 分页配置
				isShow: false,
				total: 1, //传给分页组件的大页数
				flag: 10, //大页数取正整数
				routing: '../cart/cart', //跳转到购物车路由
				goodindex: 0, //分页下标
				GoodsList: [], //动态数组
				Nodataing: false, //没有更多数据

				//购物车
				hide_animation_box: true, //加入购物车元素隐藏
				cartProImg: '', //加入购物车的商品图片
				cartNum: 0, //购物车数量
				showloading: false,
				allLoaded: false,
				loading: false,
				x: '',
				y: '',
				cartItemId: '',
				cartType: '',
				amount: 1,
				tokenId: '',
				isIphoneX: '',
				Nav2: '',
				catType: '1',
				currentTabone: 0,
			};

		},
		created() {
			this.tokenId = this.$route.tokenId
			this.gdscategory()
			this.judgeIphoneX()
		},
		methods: {
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			touchOnGoods: _.throttle(function(item, $event) {
				this.cartProImg = item.mainImage;
				this.x = $event.clientX;
				this.y = $event.clientY;
				this.cartItemId = item.goodsId;
				this.cartType = item.type;
				this.addcart();
			}, 600),
			exchangeClassficalone(item, index) {
				this.currentTabone = index;
				this.catId = item.catId;
				this.page = '1';
				this.ShopList = '';
				this.loadMore();
			},
			//加入购物车请求
			async addcart($event) {
				let res = await addcart(this.cartItemId, this.amount, this.cartType, this.tokenId);
				if (res.code == 0) {
					this.$refs.cart.drop($event);
					this.$refs.cart.addOrdel(1)
				} else if(res.code!=401){
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}
			},

			async loadMore() {
				// 获取蔬果列表
				this.allLoaded = false;
				this.loading = true;
				this.showloading = true
				let res = await gdslist(this.page + '', this.limit, this.catId, this.sidx, this.order);
				if (res.code == 0) {
					this.showloading = false;
					this.shopList = res.list.list
					if (res.list.currPage < res.list.totalPage) {
						this.page++;
						let list = [...this.ShopList, ...this.shopList] //解构拼接数组
						this.ShopList = list;
						this.loading = false;
					} else if (res.list.currPage == res.list.totalPage) {
						let list = [...this.ShopList, ...this.shopList] //解构拼接数组
						this.ShopList = list;
						this.loading = true;
						this.allLoaded = true;
					}



				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}

			},
			exChange(index) {
				var _this = this;
				var i = index
				_this.rule.forEach((data, eq) => {
					if (i == eq) {
						data.actived = true;
						data.show = data.show == 'd' ? 'b' : (data.show == 'b' ? 't' : 'b'); //点击商品排序条件后后切换样式
						_this.sidx = data.sidx //选择排序条件
						_this.order = data.show == 'b' ? 'desc' : 'asc' //升降序

					} else {
						data.actived = false;
						data.show = 'd';
					}
				});
				this.page = '1';
				this.ShopList = '';
				this.loadMore()
			},

			// 获取物品分类
			async gdscategory() {
				let res = await gdscategory(this.catType, this.tokenId);
				if (res.code == 0) {
					this.Nav = res.list
					this.Nav2 = res.list[0]
					this.catId = this.Nav2.childList[0].catId;
					this.loadMore()
				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1000
					})
				}
			},
			//选择物品分类

			exchangeClassfical(y, index, $event) {
				this.currentTab = index;
				this.Nav2 = this.Nav[index]
				this.currentTabone = 0;
				if(!this.Nav2.childList){
					this.ShopList=''
					return
				}
				this.catId =this.Nav2.childList? this.Nav2.childList[0].catId:'';
				this.page = '1'
				this.ShopList = '';
				this.loadMore();
				let x1 = document.body.clientWidth;
				let x2 = $event.target.getBoundingClientRect().left;
				let s = $event.target.getBoundingClientRect().width / 2;
				let L = (x2 - x1 / 2 + s) / 20
				let l = 1
				let that = this
				let timer = setInterval(function() {
					l++;
					if (l > 20) {
						clearInterval(timer)
					}
					that.$refs.slidebox.scrollLeft += L;
				}, 10)
			},

			handleScroll() {
				var scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				if (scroll > 1500) {
					this.showTop = true;
				} else {
					this.showTop = false;
				}
			},
			goprodetail(item, index) {
				let type = item.type;
				let goodsId = item.seedId ? item.seedId : item.goodsId
				let userId = item.userId
				let query = {
					'goodsType': type,
					'goodsId': goodsId,
				}
				this.$bridge.callhandler('goodsdetail', query)
			},

		},
		mounted() {
			window.addEventListener('scroll', this.handleScroll)

		}
	}
</script>

<style scoped>
	.box {
		width: 100%;
		height: 100%;
	}

	/* 头部 */
	.headers {
		width: 100%;
		position: fixed;
		top: 1.706666rem;
		left: 0;
		z-index: 99;
	}

	.weui-loadmore {
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}



	.null_list {
		width: 100%;
		height: 1.053333rem;
		text-align: center;
		color: #999;
		font-size: 0.32rem;
		line-height: 1.053333rem;
		margin-top: 0.4rem;
		position: relative;

	}

	.null_list::after {
		width: 3rem;
		height: 1px;
		background: #999;
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 0.533333rem;
	}

	.null_list::before {
		width: 3rem;
		height: 1px;
		background: #999;
		content: '';
		display: block;
		position: absolute;
		right: 0.533333rem;
		top: 50%;
		transform: translateY(-50%);
	}



	.headers .search_rule {
		width: 10rem;
		height: 1.226666rem;
		background: #fff;
		padding: 0 0.4rem;
		border-top: 0.013333rem solid #f1f1f1;
		border-bottom: 0.013333rem solid #f1f1f1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.lis {
		width: 1.066666rem;
		height: 1.066666rem;
		line-height: 1.066666rem;
		text-align: center;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.lis span {
		font-size: 0.373333rem;
	}

	.lis img {
		width: 0.266666rem;
		height: 0.293333rem;
	}

	/* 导航 */



	.slide-item {
		font-size: 0.373333rem;
		height: 0.746666rem;
		line-height: 0.746666rem;
		padding: 0 0.213333rem;
		margin: 0.266666rem 0.066666rem 0.133333rem;
		display: inline-block;
		box-sizing: content-box;
	}

	.slide-box {
		height: 1.066666rem;
		box-shadow: 0 0.006666rem 0.0006666rem #eee;
		-webkit-box-shadow: 0 0.006666rem 0.0006666rem #eee;
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch;
		background: #fff;
		display: -webkit-box;
		white-space: nowrap;
		padding-left: 0.266666rem;
		padding-right: 0.266666rem;
	}

	.slide-item:nth-of-type(1) {
		margin-left: 0;
	}

	.active {
		border-bottom: 0.08rem solid black;
	}

	/* 商品列表 */
	.goods {
		width: 100%;
		margin-top: 3.57rem;
		overflow: hidden;
	}
	.self_icon {
		width: 1.066666rem;
		height: 1.066666rem;
		top: 0;
		left: 0;
	}
	.goods .item {
		width: 50%;
		background: #fff;
		padding-bottom: 0.106666rem;
		border-top: 1px solid #e9e9e9;
		border-bottom: 1px solid #e9e9e9;
	}

	.goods .item .self_icon {
		width: 1.4rem;
		height: 1.4rem;
		top: 0;
		right: 0;
	}

	.goods .item:nth-of-type(2n) {
		border-left: 1px solid #e9e9e9;
	}

	.goods .item:nth-of-type(2n+1) {
		border-right: 1px solid #e9e9e9;
	}

	.goods .img {
		margin: 0.293333rem auto 0.453333rem;
		width: 4.4rem;
		height: 4.4rem;
	}

	.goods .goods_bottom {
		padding: 0 0.24rem;
	}

	.goods .name {
		font-size: 0.373333rem;
		color: #333;
		height: 0.533333rem;
		line-height: 0.533333rem;
		word-break: break-all;
	}

	.goods .detail {
		height: 0.453333rem;
		margin: 0.133333rem 0 0.266666rem;
	}

	.goods .detail>span {
		line-height: 0.453333rem;
		font-size: 0.32rem;
		color: #999;
	}

	.goods .cart_icon {
		width: 0.933333rem;
		height: 0.933333rem;
		right: 0;
		bottom: 0;
	}

	.goods .cart_icon>img {
		width: 0.666666rem;
		height: 0.666666rem;
		display: block;
		position: absolute;
		left: 0;
		bottom: 0.106666rem;
	}

	.goods .goods_more {
		left: 50%;
		bottom: 0.506666rem;
		transform: translateX(-50%);
		border: 0.013333rem solid #666;
		border-radius: 0.106666rem;
		width: 1.866666rem;
		height: 0.533333rem;
		line-height: 0.533333rem;
		text-align: center;
		color: #666;
		font-size: 0.32rem;
	}

	.goods .price {
		height: 0.666666rem;
		line-height: 0.666666rem;
		font-size: 0.453333rem;
		color: #f55;
	}

	.goods .price .price_icon {
		font-size: 0.32rem;
		color: #f55;
	}

	.class_ui_box {
		width: 100%;
		/* height: 200px; */
		background: #FFF;
		padding: 0.32rem 0.266666rem 0 0.266666rem;
		display: flex;
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch;
		background: #fff;
		display: -webkit-box;
		white-space: nowrap;
		border-top: 0.013333rem solid #f1f1f1;
	}

	.class_li_box {
		width: 1.6rem;
		height: 0.64rem;
		border-radius: 0.4rem;
		text-align: center;
		margin-right: 0.346666rem;
		margin-bottom: 0.32rem;
	}



	.class_li_box span {
		padding: 0 0.133333rem;
		display: block;
		width: 1.6rem;
		height: 0.64rem;
		line-height: 0.64rem;
		background: rgba(245, 245, 245, 1);
		border-radius: 0.4rem;
		font-size: 0.373333rem;
		color: rgba(155, 155, 155, 1);
	}

	.class_li_active {
		background: rgba(42, 204, 133, 1) !important;
		color: #FFF !important;
	}
</style>

<template>
	<div>
		<navbar>{{title}}</navbar>
		<!-- 在售商品 -->
		<div class="sale_content" v-if="isSale">
			<defaultpage defaultType="sale" v-if=" goodsList.length==0"></defaultpage>
			<loadmore :infinite="infinite" :disabled="touchend">
				<div slot="content" class="slot_content">
					<div class="sale_list f_pr" v-for="(item,index) in goodsList" :key="index" @click.stop="toDetail(item.expt,item.goodsId)">
						<div class="img_box f_pr">
							<img class="fitimg" :src="item.mainImage">
							<div class="time f_pa" :class="item.expt<1?'warning':''">
								<img class="clock f_pa" src="../../assets/clock.png">
								出售限时:{{item.expt>0?item.expt:0}}天
							</div>
							<div class="send f_pa" v-if="item.expt<1" @click.stop="sendHome(item.goodsId)">
								<span>点击
									<br>寄回家
								</span>
							</div>
						</div>
						<div class="title ellipsis">{{item.name}}</div>
						<div class="price">
							<span class="icon">￥</span>{{item.sellPrice}}
							<span class="size">/{{item.spec}}</span>
						</div>
					</div>
				</div>
			</loadmore>
		</div>
		<!-- 已售订单 -->
		<div class="order_content" v-if="isOrder">
			<defaultpage defaultType="order" v-if="orderList.length==0"></defaultpage>
			<loadmore :infinite="infinite" :disabled="touchend">
				<div slot="content" class="slot_content">
					<div class="order_list" v-for="(item,index) in orderList" :key="index">
						<div class="goodsInfo f_pr">
							<div class="img_box f_pa">
								<img class="fitimg" :src="item.skuImage">
							</div>
							<div class="title f_pr">
								{{item.goodsName}}
								<div class="priceright f_pa">
									<span class="icon">￥</span>{{item.skuSellPrice}}
								</div>
							</div>
							<div class="size">
								x{{item.goodsSpec}}
								<div class="price right">
									<!-- <span class='icon'>￥</span> -->
									{{item.skuNum}}份
								</div>
							</div>
						</div>
						<div class="add f_pr">
							<div class="txtBox">
								<span class="txt">{{item.userName}}</span>购买了
							</div>
							<div class="addFriend" v-if="item.isFriend==0" @click.stop="toAddFriend(item.userId)">
								<img src="../../assets/addFriend.png" />
								<span>
									添加好友
								</span>
							</div>
							<div class="addFriend already" v-if="item.isFriend==1">
								<img src="../../assets/addFriendC.png" />
								<span>
									已添加
								</span>
							</div>
						</div>
					</div>
				</div>
			</loadmore>
		</div>
		<div class="bottom">
			<div>
				<div class="msg" :class="isSale ? 'active':''" @click.stop="changePage(1)">
					<img src="../../assets/onsale.png" class="img f_db" v-if="!isSale">
					<img src="../../assets/onsale_cur.png" class="img f_db" v-if="isSale">
					<span>在售商品</span>
				</div>
			</div>
			<div>
				<div class="msg" :class="isOrder ? 'active':''" @click.stop="changePage(2)">
					<img src="../../assets/outsale.png" class="img f_db" v-if="!isOrder">
					<img src="../../assets/outsale_cur.png" class="img f_db" v-if="isOrder">
					<span>已售订单</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import loadmore from "../../components/common/loadmore";
	import navbar from "../../components/common/navbar";
	import defaultpage from "../../components/common/defaultpage";
	import {
		getSaleGoodsData,
		getSaleOrderData
	} from "../../service/getData";

	export default {
		data() {
			return {
				preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
				touchend: false, //没有更多数据
				banRun: true, //禁止初始上啦加载
				page: 1, //当前页数
				isSale: true, //显示在售商品
				isOrder: false, //显示已售订单
				goodsList: [], //在售商品列表数据
				orderList: [], //已售订单
				limit: 20, //每页大小
				title: "", //标题
				isWeb: false, //判断是否从web页面过来
				urlType: 'iosback', //跳转方法
				tokenId: this.$route.query.tokenId,
			};
		},
		created() {
			this.isWeb = this.$route.query.isWeb;
			if (this.isWeb) {
				this.urlType = "twoback"
			}
			this.title = this.$route.meta.title;
			this.getGoodsList();
		},
		// activated() {
		//   this.myShopScroll = false;
		// },
		// deactivated() {
		//   this.myShopScroll = true;
		// },
		methods: {
			//获取在售商品数据
			async getGoodsList() {
				let res = await getSaleGoodsData(this.page, this.limit, this.tokenId);
				if (res.code == 0) {
					this.goodsList = res.pageUtil.list;
					this.banRun = res.pageUtil.list.length == 0 ? true : false;
				} else {
					this.$toast(res.msg, 1500);
				}
			},
			//获取已售订单数据
			async getOrderList() {
				let res = await getSaleOrderData(this.page, this.limit, this.tokenId);
				if (res.code == 0) {
					this.orderList = res.pageUtil.list;
					this.banRun = res.pageUtil.list.length == 0 ? true : false;
				} else {
					this.$toast(res.msg, 1500);
				}
			},
			//去到商品详情
			toDetail(disabled, id) {
				//判断是否能否去到商品详情
				if (disabled > 0) {
					let query = {
						'goodsType': 1,
						'goodsId': id,
					}
					this.$bridge.callhandler('goodsdetail', query)
				}
			},
			//添加好友
			toAddFriend(userId) {
				this.$bridge.callhandler('addFriend', {
					'userId': String(userId)
				})
			},
			//寄回家
			sendHome(id) {
				this.$bridge.callhandler('myShop', {
					'userSellProduceIds': id
				})
			},
			//在售商品已售订单页面切换
			changePage(type) {
				//防止重复点击
				if (type == 1 && this.isSale) {
					return;
				}
				if (type == 2 && this.isOrder) {
					return;
				}
				//数据初始化
				this.preventRepeatReuqest = false;
				this.touchend = false;
				this.banRun = true;
				this.page = 1;
				if (type == 1) {
					this.isSale = true;
					this.isOrder = false;
					this.title = "在售商品";
					this.getGoodsList();
				}
				if (type == 2) {
					this.isSale = false;
					this.isOrder = true;
					this.title = "已售订单";
					this.getOrderList();
				}
			},
			//到达底部加载更多数据
			infinite() {
				// if(this.myShopScroll){
				// 		return;
				// }
				this.loaderMore();
			},
			async loaderMore() {
				if (this.banRun) {
					return;
				}
				if (this.touchend) {
					return;
				}
				//防止重复请求
				if (this.preventRepeatReuqest) {
					return;
				}
				this.preventRepeatReuqest = true;
				//数据的定位加10位
				this.page++;
				//判断是否已售订单加载还是在售商品加载
				if (this.isSale) {
					let res = await getSaleGoodsData(this.page, this.limit, this.tokenId);
					this.goodsList = [...this.goodsList, ...res.pageUtil.list];
					//当获取数据小于10，说明没有更多数据，不需要再次请求数据
					if (res.pageUtil.list.length < this.limit) {
						this.touchend = true;
						return;
					}
				}
				if (this.isOrder) {
					let res = await getSaleOrderData(this.page, this.limit, this.tokenId);
					this.orderList = [...this.orderList, ...res.pageUtil.list];
					//当获取数据小于10，说明没有更多数据，不需要再次请求数据
					if (res.pageUtil.list.length < this.limit) {
						this.touchend = true;
						return;
					}
				}
				this.preventRepeatReuqest = false;
			}
		},
		components: {
			loadmore,
			navbar,
			defaultpage
		}
	};
</script>
<style lang="scss" scoped>
	@import "../../style/mixin";

	.slot_content {
		overflow: hidden;
	}

	.bottom {
		background: #2acc85;
		box-shadow: 0 0 0.133333rem 0 #2acc85;
		-webkit-box-shadow: 0 0 0.133333rem 0 #2acc85;
		width: 9.2rem;
		height: 2.133333rem;
		position: fixed;
		left: 50%;
		bottom: -2.1333333rem;
		transform: translate(-50%, -100%);
		display: flex;
	}

	.bottom::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0.026666rem;
		height: 0.72rem;
		background: #f4da4d;
	}

	.bottom>div {
		flex: 1;
		text-align: center;
		font-size: 0;
	}

	.msg {
		display: inline-block;
		cursor: pointer;
	}

	.msg>.img {
		width: 0.453333rem;
		height: 0.453333rem;
		margin: 0.506666rem auto 0.266666rem;
	}

	.msg>span {
		font-size: 0.4rem;
		font-weight: 600;
		color: #fff;
		line-height: 0.56rem;
	}

	.active>span {
		color: #ffed8b;
	}

	.sale_content {
		padding: 0.266666rem 0.266666rem 2.133333rem;
		width: 100%;
		overflow: hidden;
		font-size: 0;
	}

	.sale_list {
		width: 48.592%;
		height: 6.533333rem;
		margin: 0 2.8% 2.8% 0;
		background: #fff;
		float: left;
		padding: 0.133333rem;
		border-radius: 0.133333rem;
		cursor: pointer;
	}

	.sale_list:nth-of-type(2n) {
		margin: 0 0 2.8% 0;
	}

	.sale_list .img_box {
		width: 100%;
		height: 4.266666rem;
		margin-bottom: 0.266666rem;
		overflow: hidden;
	}

	.sale_list .time {
		width: 2.933333rem;
		height: 0.693333rem;
		background: #f4da4d;
		border-radius: 0.64rem;
		top: 0.16rem;
		right: 0.106666rem;
		padding-left: 0.64rem;
		font-size: 0.32rem;
		line-height: 0.746666rem;
		color: #333;
	}

	.sale_list .warning {
		color: #d0021b;
	}

	.sale_list .clock {
		width: 0.453333rem;
		height: 0.453333rem;
		top: 0.133333rem;
		left: 0.133333rem;
	}

	.sale_list .title {
		font-size: 0.4rem;
		line-height: 0.56rem;
		height: 0.56rem;
		width: 100%;
		word-break: break-all;
		/* overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; */
		font-weight: 600;
		margin-bottom: 0.293333rem;
	}

	.sale_list .price {
		height: 50;
		width: 100%;
		font-size: 0.48rem;
		line-height: 0.666666rem;
		color: #151515;
	}

	.sale_list .icon {
		font-size: 0.32rem;
	}

	.sale_list .size {
		padding-left: 0.266666rem;
		font-size: 0.32rem;
		color: #999;
	}

	.sale_list .send {
		width: 2.133333rem;
		height: 2.133333rem;
		background: rgba(0, 0, 0, 0.5);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		text-align: center;
		padding-top: 0.613333rem;
		cursor: pointer;
	}

	.send span {
		color: #fff;
		font-size: 0.373333rem;
	}

	.order_content {
		padding: 0.133333rem 0 2.133333rem;
		width: 100%;
		overflow: hidden;
		font-size: 0;
	}

	.order_list {
		width: 9.733333rem;
		background: #fff;
		overflow: hidden;
		margin: 0 auto 0.133333rem;
		border-radius: 0.133333rem;
	}

	.order_list .goodsInfo {
		height: 2.933333rem;
		width: 100%;
		padding: 0 0.48rem 0 3.173333rem;
		overflow: hidden;
	}

	.order_list .add {
		height: 1.066666rem;
		width: 100%;
		border-top: 0.08rem solid #f1f1f1;
		padding: 0 0.16rem 0 0.48rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.order_list .txt {
		color: #ebc246;
		padding-right: 0.133333rem;
	}

	.order_list .txtBox {
		font-size: 0.373333rem;
		color: #2a2a2a;
	}

	.order_list .btn {
		width: 2.293333rem;
		height: 0.693333rem;
		border: 1px solid #ebc246;
		border-radius: 0.186666rem;
		top: 50%;
		right: 0.426666rem;
		transform: translateY(-50%);
		font-size: 0.32rem;
		line-height: 0.693333rem;
		color: #ebc246;
		padding-left: 0.8rem;
	}

	.order_list .btn_img {
		width: 0.426666rem;
		height: 0.426666rem;
		top: 0.106666rem;
		left: 0.186666rem;
	}

	.order_list .exist {
		border: 1px solid #c0c0c0;
		color: #c0c0c0;
	}

	.order_list .img_box {
		width: 2.4rem;
		height: 2.4rem;
		left: 0.4rem;
		top: 50%;
		transform: translateY(-50%);
		overflow: hidden;
	}

	.order_list .title {
		height: 1.066666rem;
		width: 100%;
		margin-top: 0.293333rem;
		font-size: 0.373333rem;
		line-height: 0.533333rem;
		font-weight: 600;
		color: #333;
		word-break: break-all;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		margin-bottom: 0.586666rem;
		padding-right: 0.666666rem;
	}

	.order_list .size {
		width: 100%;
		height: 0.666666rem;
		line-height: 0.666666rem;
		color: #c0c0c0;
		font-size: 0.32rem;
	}

	.order_list .price {
		height: 0.666666rem;
		line-height: 0.666666rem;
		font-size: 0.32rem;
	}

	.order_list .icon {
		font-size: 0.32rem;
	}

	.order_list .priceright {
		height: 0.666666rem;
		font-size: 0.48rem;
		line-height: 0.666666rem;
		right: 0;
		top: 0;
	}

	.priceright .icon {
		font-size: 0.32rem;
	}

	.addFriend {
		border: 1px solid #EBC246;
		border-radius: 0.186666rem;
		width: 2.293333rem;
		height: 0.693333rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.106666rem 0 0.186666rem;
	}

	.addFriend>img {
		width: 0.426666rem;
		height: 0.426666rem;
	}

	.addFriend>span {
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #EBC246;
	}

	.already {
		border: 1px solid #C0C0C0;
		padding-right: 0.293333rem;
	}

	.already>span {
		color: #c0c0c0;
	}
</style>

<template>
	<div>
	<navbar type="orderBack">我的订单</navbar>
	<div class="orderList_content" >
		<div class='header' :class="isIphoneX?'ipx':''" >
			<div class='header_li' v-for="(item,index) in navList" :key="index" @click.stop='choose(item,index)'>
				<span :class='index==activenum?"active":""' >{{item.name}}</span>
			</div>
		</div>
		<div class='goods' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<div class='list ' v-for="(order,index) in GoodsList" :key="index">
				<div class='deatil f_pr' v-for="(orderItem,index) in order.orderSkuList" :key="index">
					<div class='img f_pa' @click.stop='toOrderDetail(order,index)'>
						<img class='fitimg' :src="orderItem.goodsImage"/>
						<img class='f_pa self_icons' src='../../assets/self_shop.png' v-if="orderItem.userId==1"/>
						<img class='f_pa self_icons' src="../../assets/user_shop.png" alt="" v-else>
					</div>
					<div class='list_content'>
						<div class='title' @click.stop='toOrderDetail(order,index)'>
							<span class='left ellipsis'>{{orderItem.goodsName}}</span>
							<span class='right'><span class=''>￥{{orderItem.sellPrice}}</span></span>
						</div>
						<div class='size'>{{orderItem.spec}}*{{orderItem.num}}</div>
					</div>
				</div>
				<div class="price">
					<span class="count">共{{order.goodsAccount}}件商品</span>
					<span class="total">合计:<span class='price_icon'>￥</span>
						<span class='money'>{{order.orderPrice}}</span></span>
					<span class="freight">(含运费<span class='cost'>￥{{order.deliveryPrice}}</span>)</span>
				</div>
				<div class='handle'>
					<span class='status left'>{{order.payStatusName}}</span>
					<div class='right current' v-if="order.orderType==2&&order.status==4" @click.stop='toSow'>去播种</div>
					<div class='right current' v-if="order.orderStatus==1" @click.stop='toPayOrder(order)'>去支付</div>
					<div class='right current' v-if="order.status==1" @click.stop='toPayOrder(order)'>去支付</div>
					<div class='right' @click.stop='toOrderDetail(order)'>查看订单</div>
					<div class='right' v-if="order.status==1" @click.stop='toCancel(order,index)'>取消订单</div>
					<div class='right' v-if="order.status==3" @click.stop='toSure(order)'>确认收货</div>
				</div>
			</div>
			<span class="note_msg f_db f_tac f_pr" v-if="GoodsList.length!=0&&allLoaded">没有更多数据</span>
			<defaultpage v-if="GoodsList.length==0" defaultType="order"></defaultpage>
		</div>
		
		<gotop :showTop="showTop"></gotop>
	</div>
	</div>
</template>

<script>
	import navbar from '../../components/common/navbar'
	import defaultpage from '../../components/common/defaultpage'
	import gotop from '../../components/common/gotop'
	import {
		orderList,
		cancelorder,
		suregoods,
	} from '../../service/getData.js'

	export default {
		components: {
			navbar,
			defaultpage,
			gotop
		},
		data() {
			return {
				activenum: 0,
				order: '',
				isIphoneX: false,
				navList: [{
						name: '全部',
						active: true,
						status: ''
					},
					{
						name: '待付款',
						active: false,
						status: 1
					},
					{
						name: '待发货',
						active: false,
						status: 2
					},
					{
						name: '待收货',
						active: false,
						status: 3
					},
					{
						name: '已完成',
						active: false,
						status: 4
					}
				], //导航栏
				orderList: [], //订单列表
				page: 1, //页码数
				pageSize: 20, //每页加载数量
				orderStatus: '', //订单状态

				// 分页配置
				isShow: false, //分页组件显示控制
				total: 1, //传给分页组件的大页数
				flag: 10, //大页数取正整数
				goodindex: 0, //分页下标
				goodsList:'',
				GoodsList: [], //动态数组
				Nodataing: false, //没有更多数据
				defaultType: '',
				type: 1, //跳转路由类型
				url: '', //跳转路由
				count: 100, //分页组件每页大小
				showTop: false,
				limit: 20,
				tokenId: '',
				showloading: false,
				allLoaded: false,
				loading: false,
				isSe:false
			};
		},
		created() {
			this.tokenId = this.$route.query.tokenId
			this.judgeIphoneX()
		},
		mounted(){
			let that=this;
			this.$bridge.registerhandler("shuaxin",function(){
				that.GoodsList='';
				that.loadMore();
			})
		},
		methods: {
			judgeIphoneX() {
				if(/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)){
					this.isIphoneX=true;
				}else if(/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)){
					this.isSE=true
				}
			},
			async loadMore() {
				// 获取订单列表
				this.allLoaded = false;
				this.loading = true
				this.showloading = true
				let res = await orderList(this.limit, this.page, this.orderStatus, this.tokenId)
				if (res.code == 0) {
					this.showloading = false;
					this.goodsList = res.page.list

					if (res.page.currPage < res.page.totalPage) {
						this.page++
						let list = [...this.GoodsList, ...this.goodsList] //解构拼接数组
						this.GoodsList = list;
						this.loading = false;
					} else if (res.page.currPage >= res.page.totalPage) {
						let list = [...this.GoodsList, ...this.goodsList] //解构拼接数组
						this.GoodsList = list;
						this.allLoaded = true;
						this.loading = true;
						
					}
				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}

			},
		
			choose(item,index) {
				this.orderStatus = item.status;
				this.activenum = index;
				this.page=1;
				this.GoodsList='';
				this.loadMore()
			},
			toOrderDetail(order) {
				console.log(order)
				this.$router.push({
					path: 'shoporderDetail',
					query: {
						orderId: order.orderId,
						orderType:order.orderType
					}
				})
			},
			toCancel(order,index) {
				this.orderId = order.orderId
				this.$messagebox.confirm('确定取消该订单吗',{
					title: '',
				}).then(action => {
					if (action == 'confirm') {
						this.cancel(index)
					}
				}) .catch(error => {
				console.log(error);
				});

			},
			async cancel(index) {
				let res = await cancelorder(this.orderId);
				if (res.code == 0) {
					this.$toast({
						message: '取消成功',
						position: 'center',
						duration: 1500
					});
					this.GoodsList.splice(index,1)
				}
			},
			toSow() {
				this.$bridge.callhandler("toSow")
			},
			toPayOrder(order) {
				console.log(order)
				this.$bridge.callhandler("personalToPay", {
					"orderId": order.orderId+'',
					"orderPrice":order.orderPrice
				})
			},
			toSure(order) {
				this.$messagebox.confirm('确认收货吗',{
					title: '',
				}).then(action => {
					if (action == 'confirm') {
						this.sure(order.orderId);
					}
				}).catch(error => {
				console.log(error);
				});
			},
			async sure(id) {
				let res = await suregoods(id,this.tokenId);
				if (res.code == 0) {
					 if (this.orderStatus == 3) {
							this.GoodsList.forEach((data, index) => {
								if (data.orderId == id) {
									this.GoodsList.splice(index, 1)
								}
							})
						} else {
							this.navList.forEach((data, eq) => {
								if (0 == eq) {
									data.active = true;
									this.page = 1;
									this.orderStatus = data.status;

								} else {
									data.active = false
								}
							})
							this.activenum=0;
							this.GoodsList = [];
							this.loadMore();
						}
				}else{
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}
			}


		}
	}
</script>

<style scoped>
	.orderList_content {
		width: 100%;
	}
	.note_msg{
		width: 100%;
		line-height: 1.066666rem;
		font-size:0.346666rem;
		color:#999;
	}
	.header {
		height: 1.146666rem;
		width: 100%;
		background: #fff;
		display: flex;
		position: fixed;
		top: 1.706666rem;
		left: 50%;
		transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
		width: 100%;
		z-index: 1;
		border-bottom: 0.08rem solid #f1f1f1;
	}

	.header_li {
		flex: 1;
		text-align: center;
		font-size: 0;
	}

	.header_li span {
		height: 1.066666rem;
		line-height: 1.066666rem;
		font-weight: 600;
		font-size: 0.373333rem;
		display: inline-block;
		position: relative;
	}
	.goods{margin-top:1.146666rem;}

	.active:after {
		content: '';
		width: 100%;
		height: 0.053333rem;
		position: absolute;
		bottom: 0.053333rem;
		left: 50%;
		transform: translateX(-50%);
		background: #000;
	}

	.list {
		/* margin-top: 20px; */
		background: #fff;
		overflow: hidden;
		border-radius: 0.133333rem;
		width: 9.733333rem;
		margin: 0.266666rem auto;
	}

	.deatil {
		height: 2.64rem;
		padding: 0 0.266666rem 0 0.533333rem;
		margin-top: 0.373333rem;
		border-bottom: 0.013333rem solid #f1f1f1;
	}

	.img {
		width: 2.4rem;
		height: 2.4rem;
		left: 0.533333rem;
		top: -0.106666rem;
		overflow: hidden;
	}

	.img>img {
		width: auto;
		height: 100%;
		display: block;
	}

	.self_icons {
		width: 1.066666rem !important;
		height: 1.066666rem !important;
		top: 0;
		left: 0;

	}


	.list_content {
		padding-left: 2.88rem;
	}

	.list_content>.title {
		height: 0.4rem;
		margin-top: 0.373333rem;
		overflow: hidden;
	}

	.list_content>.title>span:nth-of-type(1) {
		font-weight: 600;
		font-size: 0.346666rem;
		line-height: 0.426666rem;
		width: 4.666666rem;
		/* overflow: hidden; */
		word-break: break-all;
		/* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:1; */
	}

	.list_content>.title>span:nth-of-type(2) {
		font-size: 0.346666rem;
		line-height: 0.4rem;
		margin-top: 0.053333rem;

	}

	.icon {
		font-size: 0.346666rem;
		line-height: 0.4rem;
	}

	.size {
		font-size: 0.32rem;
		line-height: 0.453333rem;
		margin-top:0.346666rem;
		color: #999;
	}

	.handle {
		height: 1.066666rem;
		padding: 0 0.266666rem 0 0.533333rem;
	}

	.status {
		font-size: 0.32rem;
		line-height: 1.066666rem;
		color: #ff6363;
	}

	.handle>div {
		width: 2rem;
		height: 0.693333rem;
		margin-top: 0.186666rem;
		margin-left: 0.266666rem;
		line-height: 0.693333rem;
		font-size: 0.32rem;
		font-weight: 600;
		text-align: center;
		border-radius: 0.333333rem;
	}

	.handle div.current {
		border: 1px solid #ff0000;
		color: #ff0000;
		margin-left: 0.266666rem;
	}

	.handle div {
		border: 1px solid #bfbfbf;
		color: #666;
	}

	.price {
		height: 1.146666rem;
		line-height: 1.066666rem;
		padding: 0 0.266666rem 0 0.533333rem;
		text-align: right;
		border-bottom: 0.013333rem solid #f1f1f1;
	}

	.price>span {
		font-size: 0.32rem;
		font-weight: 600;
	}

	.total {
		padding-left: 0.053333rem;
	}

	.price_icon {
		font-size: 0.266666rem;
		padding: 0 0.08rem 0.186666rem;
		font-weight: 600;
	}

	.money {
		font-size: 0.373333rem;
		font-weight: 600;
	}

	.freight {
		padding-left: 0.08rem;
	}

	.cost {
		padding-left: 0.08rem;
		font-weight: 600;
	}
</style>

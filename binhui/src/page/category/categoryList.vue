<template>
	<div>
		<navbar>商品分类</navbar>
		<div class="selectbox" :class="isIphoneX?'isipx':''">
			<div class="select">
				<div v-for="(item,index) in rule" :key="index" class='f_pr' :class="[index>0?'padl':'',index==2?'f_tac':'',index=='3'?'f_tar':'']">

					<div class='f_dib select_box' :class='item.actived?"actived":""' @click='exChange(index)'>
						{{item.name}}
						<img src='../../assets/select_no.png' v-if="item.show=='d'"></img>
						<img src='../../assets/select_top.png' v-if="item.show=='t'"></img>
						<img src='../../assets/select_bottom.png' v-if="item.show=='b'"></img>
					</div>
				</div>
			</div>
		</div>
		<div class='goods f_pr' :class="isIphoneX?'isipx':''">
			<loadmore :infinite="infinite" :disabled="touchend">
				<div slot="content" class="slot" ref="goods">
					<div class='item left f_pr' v-for="(item,index) in fruitList" :key="index" @click.stop='toDetail(item,index)' v-if="shopType==1">
						<div class='f_pr img overflowimg '>
							<img class='fitimg2' :src='item.mainImage' />
							<img class='f_pa self_icon' src='../../assets/self_shop.png' v-if="item.userId == 1" />
							<img class="f_pa self_icon" src="../../assets/user_shop.png" v-else>
						</div>
						<div class='f_pr goods_bottom'>
							<div class='name ellipsis'>{{item.name}}</div>
							<div class='detail'>
								<p class='left'>{{item.spec}}</p>
								<p class='right'>月销{{item.sale}}件</p>
							</div>
							<div class='price'>
								<span class='price_icon'>￥</span>{{item.sellPrice}}
							</div>
						</div>
						<div class='cart_icon f_pa' @click.stop='touchOnGoods(item,$event)'>
							<img src='../../assets/cart.png' :index="index"></img>
						</div>
					</div>
				</div>
			</loadmore>

			<defaultpage :defaultType="fruitList.length <= 0 ?'goods':''"></defaultpage>
			<gocart :left="x" :top="y" :cartProImg="cartProImg" ref="cart"></gocart>
		</div>
	</div>
</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import defaultpage from '../../components/common/defaultpage.vue'
	import gocart from '../../components/common/gocart.vue'
	import loadmore from '../../components/common/loadmore.vue'
	import {
		getgoodslist,
		addcart,
		getcategoryList
	} from '../../service/getData.js'
	export default {
		components: {
			navbar,
			defaultpage,
			gocart,
			loadmore,

		},
		created() {
			if (this.$route.query.deviceType == "ios") {
				if (this.$route.query.searchKey) {
					this.searchKey = decodeURI(decodeURI(this.$route.query.searchKey))
				} else {
					this.searchKey = ''
				}

			}

			this.tokenId = this.$route.query.tokenId
			this.catId = this.$route.query.catId
			this.judgeIphoneX()
			console.log(this.searchKey)
			this.getgoodslist()
		},
		data() {
			return {
				title: '',
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
				], //排序字段
				preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
				touchend: false, //没有更多数据
				banRun: true, //禁止初始上啦加载
				page: 1, //分页页数
				limit: 20, //每页大小
				fruitList: '',
				catId: 0,
				page: 1, //当前页数
				sidx: 'g.sale', //g.store_nums全部排序,g.add_time最新排序,g.sell_price价格排序,g.sale销量排序
				order: 'desc', //desc降序,asc升序
				searchKey: "",
				shopType: 1,
				cartItemId: '',
				amount: 1,
				cartType: '',
				tokenId: '',
				x: '',
				y: '',
				cartProImg: '', //加入购物车的商品图片
				isIphoneX: '',
				tokenId: ''
			};
		},
		mounted() {

		},
		methods: {
			infinite() {
				this.loaderMore()
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
				let res = await getcategoryList(this.page, this.limit, this.searchKey, this.catId, this.sidx, this.order);
				this.fruitList = [...this.fruitList, ...res.pageUtils.list];
				//当获取数据小于10，说明没有更多数据，不需要再次请求数据
				if (res.pageUtils.list.length < this.limit) {
					this.touchend = true;
					return;
				}
				this.preventRepeatReuqest = false;

			},
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
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
				this.preventRepeatReuqest = false; //到达底部加载数据，防止重复加载
				this.touchend = false; //没有更多数据
				this.banRun = true; //禁止初始上啦加载
				this.page = 1; //分页页数
				this.getgoodslist().then(function() {

				})
			},
			async getgoodslist() {
				let res = await getcategoryList(this.page, this.limit, this.searchKey, this.catId, this.sidx, this.order);
				if (res.code == 0) {
					this.fruitList = res.pageUtils.list;
					this.banRun = false;
					if (this.fruitList) {}
				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}
			},
			toDetail(item, index) {
				let type = item.type;
				let goodsId = item.seedId ? item.seedId : item.goodsId
				let userId = item.userId
				let query = {
					'goodsType': type,
					'goodsId': goodsId,
				}
				this.$bridge.callhandler('goodsdetail', query)

			},
			touchOnGoods: _.throttle(function(item, $event) {
				this.cartProImg = item.mainImage;
				this.x = $event.clientX;
				this.y = $event.clientY;
				this.cartItemId = item.goodsId;
				this.cartType = item.type;
				this.addcart($event);
			}, 600),

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
		},
	}
</script>

<style scoped lang="scss">
	.selectbox {
		width: 100%;
		height: 1.093333rem;
		position: fixed;
		left: 0;
		top: 1.706666rem;
		z-index: 100;
	}

	.selectbox.isipx {
		top: 2.32rem !important;
	}

	.select {
		padding: 0 0.266666rem;
		height: 1.093333rem;
		background: #fff;
		display: flex;
		border-bottom: 0.026666rem solid #f1f1f1;
	}

	.slot {
		overflow: hidden;
	}

	.select>div {
		flex: 1;
		text-align: center;
		line-height: 1.066666rem;
		font-size: 0.373333rem;
	}

	.select>div>.actived {
		color: #00b25e;
	}

	.select .select_box {
		min-width: 0.8rem;
		line-height: 1.066666rem;
		font-size: 0.373333rem;
	}

	.select .select_box>img {
		width: 0.266666rem;
		height: 0.293333rem;
		margin-left: 0.106666rem;
	}

	.goods {
		padding-top: 1.093333rem;
		width: 100%;
		overflow: hidden;
		padding-bottom: 0.266666rem;
		background: #e9e9e9;
		min-height: 20rem;
	}

	.goods .item {
		width: 50%;
		/* height: 524px; */
		background: #fff;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding-bottom: 0.106666rem;
		border-top: 1px solid #e9e9e9;
		border-bottom: 1px solid #e9e9e9;
	}

	.goods .item .self_icon {
		width: 1.066666rem;
		height: 1.066666rem;
		top: 0;
		left: 0;
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

	.goods .img .fitimg2 {
		width: auto;
		height: 100%;
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
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

	.goods .detail>p {
		line-height: 0.453333rem;
		font-size: 0.32rem;
		color: #999;
	}

	.goods .cart_icon {
		width: 0.933333rem;
		height: 0.933333rem;
		right: 0;
		bottom: 0;
		/* position: relative; */
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
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		bottom: 0.506666rem;
		transform: translateX(-50%);
		border: 1px solid #666;
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

	/* 农友商店列表 */

	.goods_list_box {
		width: 100%;
	}

	.goods_ul {
		overflow: hidden;
	}

	.goods_li {
		width: 48.17%;
		height: 7.333333rem;
		background: #fff;
		padding: 0.133333rem 0.133333rem 0.266666rem;
		overflow: hidden;
		margin-top: 0.266666rem;
	}

	.goods_li:nth-of-type(2n) {
		margin-left: 3.64%;
	}

	.goods_img {
		width: 100%;
		height: 4.266666rem;
		margin: 0 auto;
		overflow: hidden;
	}

	.goods_li .title {
		margin-top: 0.24rem;
		font-size: 0.4rem;
		font-weight: 600;
		word-break: break-all;
		/* display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 1;
	    overflow: hidden; */
	}

	.goods_b {
		width: 100%;
		margin-top: 0.266666rem;
	}

	.goods_b .d {
		font-size: 0.32rem;
		color: #f55;
		line-height: 0.666666rem;
	}

	.goods_b .m {
		font-size: 0.48rem;
		color: #f55;
		font-weight: 600;
		line-height: 0.666666rem;
	}

	.goods_b .g {
		line-height: 0.666666rem;
		font-size: 0.32rem;
		color: #999;
	}

	.goods_b .image_box {
		width: 0.8rem;
		height: 0.666666rem;
		right: 0;
		top: 0.066666rem;
		padding: 0.4rem;
	}

	.goods_b img {
		position: absolute;
		left: 0;
		top: 0;
		width: 0.64rem;
		height: 0.64rem;
		margin: 0 auto;
		margin-top: 0.053333rem;
	}

	.goods_li>.owner {
		width: 100%;
		margin-top: 0.16rem;
		height: 0.72rem;
		padding-left: 1.066666rem;
	}

	.goods_li>.owner>.user_img {
		width: 0.72rem;
		height: 0.72rem;
		top: 0;
		left: 0;
		border-radius: 0.133333rem;
		-webkit-border-radius: 0.133333rem;
		overflow: hidden;
	}

	.goods_li>.owner>p {
		font-size: 0.32rem;
		color: #999;
		line-height: 0.72rem;
	}
</style>

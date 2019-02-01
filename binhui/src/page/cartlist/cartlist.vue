<template>
	<div>
		<navbar>购物车</navbar>
		<div class="cart_content bgc" :class="isIphoneX?'ipx':''">
			<div :class='x.type == 2 ? "seed" : "crop"' v-for="(x,index) in cartList" :key="index">
				<div class='header f_pr' v-if="x.type == 2&&x.list.length>0">
					<div class='header_selecte f_pa' @click.stop="shopSelected(index)">
						<img src='../../assets/tab_icon.png' class='cart_icon f_pa' v-if="!x.itemSelected"></img>
						<img src='../../assets/tab_icon_cur.png' class='cart_icon f_pa' v-else></img>
					</div>
					<img src='../../assets/cart_seed.png' class='cart_seed f_pa'></img>
					优选种子
				</div>
				<div class='header f_pr' v-if="x.type == 1 && x.list.length>0">
					<div class='header_selecte f_pa' @click.stop="shopSelected(index)">
						<img src='../../assets/tab_icon.png' class='cart_icon f_pa' v-if="!x.itemSelected"></img>
						<img src='../../assets/tab_icon_cur.png' class='cart_icon f_pa' v-else></img>
					</div>
					<img src='../../assets/cart_crop.png' class='cart_crop f_pa'></img>
					蔬菜鲜果
				</div>
				<div class='header f_pr' v-if="x.type == 6 && x.list.length>0">
					<div class='header_selecte f_pa' @click.stop="shopSelected(index)">
						<img src='../../assets/tab_icon.png' class='cart_icon f_pa' v-if="!x.itemSelected"></img>
						<img src='../../assets/tab_icon_cur.png' class='cart_icon f_pa' v-else></img>
					</div>
					<img src='../../assets/prop.png' class='cart_crop f_pa'></img>
					道具
				</div>
				<div class='list f_pr' v-if="x.type!=-1" v-for="(y,eq) in x.list" :key="y.cartId">
					<div class='header_selecte f_pa' @click.stop='itemSelected(index,eq)'>
						<img src='../../assets/tab_icon.png' class='cart_icon f_pa' v-if="!y.selected"></img>
						<img src='../../assets/tab_icon_cur.png' class='cart_icon f_pa' v-else></img>
					</div>
					<div class='f_pa cart_del' @click.stop='delCartItem(index,eq)'>
						<img src='../../assets/cart_del.png' class='f_pa'></img>
					</div>
					<div class='img f_pa' @click.stop="toDetail(y)">
						<div class="imgbox f_pr">
							<img :src='y.imageUrl'></img>
							<img class="shopuser f_pa" src="../../assets/self_shop.png" alt="" v-if="y.isSelfSupport == 1">
							<img class="shopuser f_pa" src="../../assets/user_shop.png" alt="" v-else>
						</div>

					</div>
					<div class='title ellipsis' @click.stop="toDetail(y)">
						{{y.title}}
					</div>
					<div class='size' v-if="x.type==1">{{y.spec}}</div>
					<div class='size' v-else>{{y.spec}}</div>
					<div class='price'>
						<span>￥</span>{{y.price}}

					</div>
					<div class="cart_list_num f_pa">
						<div class="buynum_opreate clear">
							<button class="f_db left" :disabled="y.amount<=1" type="button" @click.stop='changeItemAmount(index,eq,"jian")'>-</button>
							<input class="f_db left" max="99" maxlength="2" type="number" v-model="y.amount" @blur.prevent='inputchange(y.amount,y.cartId)' />
							<button icon="search" class="f_db left" @click.stop='changeItemAmount(index,eq,"jia")'>+</button>
						</div>
					</div>
				</div>

			</div>
			<!-- 失效商品--B -->
			<div class='overdue_goods' v-for="(x,index) in cartList" v-if="x.type==-1&&x.list.length>0">
				<div class='header f_pr'>
					<span class='left'>失效商品</span>
					<span class='right clear_goods' @click.stop='toClearOverdue'>清空失效商品</span>
				</div>
				<div class='list f_pr' v-for="(y,index) in x.list" :key="index">
					<div class='overdue_icon f_pa'>失效</div>
					<div class='img f_pa'>
						<img :src='y.imageUrl'></img>
					</div>
					<div class='title'>
						{{y.title}}
					</div>
					<div class='size overdue_size'>商品库存不足</div>
				</div>
			</div>
			<!-- 失效商品--E -->
			<defaultpage :defaultType="havecart?'':'cart'"></defaultpage>
			<!-- 提示-B -->
			<div class='tip f_pr' v-if="false">
				<img src='../../assets/cart_tip.png' class='img f_pa'></img>
				<span class='text'>提示:</span>优选种子和蔬菜鲜果不能同时付款
			</div>
			<!-- 提示-E -->
			<div class='pay f_pr' :class="isIphoneX?'iphoneX':''">
				<div class='header_selecte f_pa' @click.stop="doallSelected">
					<img src='../../assets/tab_icon.png' class='cart_icon f_pa' v-if="!allSelected"></img>
					<img src='../../assets/tab_icon_cur.png' class='cart_icon f_pa' v-else></img>
				</div>
				<span class='f_dib' @click.stop="doallSelected">全选</span>
				<span class='right price'><span class='price_icon'>￥</span>{{allPrice}}</span>
				<span class='right point'>:</span>
				<span class='right text'>合计</span>
				<div class='btn f_pa' @click.stop='toAccounts'>
					结算
				</div>
			</div>
			<div :class="isIphoneX?'ipxbox':''"></div>
		</div>
	</div>
</template>

<script>
	import gocart from '../../components/common/gocart.vue'
	import defaultpage from '../../components/common/defaultpage.vue'
	import navbar from '../../components/common/navbar.vue'
	import _ from 'lodash'
	import {
		categorylist,
		goodsdetail,
		addcart,
		cartlist,
		updatecart,
		deletecart,
		clear,
		isEnough
	} from '../../service/getData.js'
	export default {
		components: {
			gocart,
			defaultpage,
			navbar
		},
		computed: {

		},
		data() {
			return {
				cartList: [],
				allPrice: 0, //全部购物车价格
				allSelected: true, //全选控制
				groupSelected: [],
				cartIds: '', //选中商品的购物车id
				tokenId: '',
				havecart: false,
				isIphoneX: '',
				goodsId: '',
			};
		},
		created() {
			this.tokenId = this.$route.query.tokenId
			this.goodsId = this.$route.query.goodsId
			this.cartlist()
			this.judgeIphoneX()
		},
		//计算属性判断全部选中
		methods: {
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			//获取购物车列表
			async cartlist() {
				let res = await cartlist(this.tokenId);
				if (res.code == 0) {
						let list=res.list
						list.forEach((v1,i)=>{
							if(v1.list.length==0){
								list.splice(i,1)
							}
						})
						this.cartList=list;
					if (this.cartList.length > 0) {
						this.havecart = true
					}
					//默认全部选中
					for (let i = 0; i < this.cartList.length; i++) {
						if(this.cartList[i]!=-1){
							this.cartList[i].itemSelected = true;
						}
						for (let j = 0; j < this.cartList[i].list.length; j++) {
							this.cartList[i].list[j].selected = true;
						}
					}
					this.cartAccountOrSelected()
				} else {}
			},
			//重新计算购物车
			cartAccountOrSelected() {
				this.cartIds = '';
				this.allPrice = 0;
				let countItems = 0;
				let listLen = 0; // 初始化购物车除失效商品以外的
				let listlength = 0;
				this.cartList.forEach((v1) => {
					let items = 0;
					if (v1.type != -1) {
						listLen++;
						v1.list.forEach((v2) => {
							if (v2.selected) {
								items++;
								this.allPrice = Number(this.allPrice) + (Number(v2.price) * Number(v2.amount)); //价格计算
								this.cartIds = String(this.cartIds) + (',' + String(v2.cartId)); //获取选中cartId
							}
						});
					}
					v1.itemSelected = (v1.list.length == items) ? true : false;
					if (v1.itemSelected) countItems++;
					listlength += v1.list.length
				});
				this.cartIds = (this.cartIds == '') ? '' : this.cartIds.substr(1);
				console.log(countItems,listLen)
				this.allSelected = (countItems == listLen) ? true : false;
				this.allPrice = Number(this.allPrice).toFixed(2),
					this.cartList = Object.assign([], this.cartList)
				if (listlength == 0) {
					this.havecart = false
				} else {
					this.havecart = true
				}
			},
			//单选商品
			itemSelected(index, eq) {
				this.cartList[index].list[eq].selected = !this.cartList[index].list[eq].selected;
				this.cartAccountOrSelected()
			},
			//选择店铺
			shopSelected(index) {
				this.cartList[index].itemSelected = !this.cartList[index].itemSelected
				if (this.cartList[index].itemSelected == true) {
					for (let i = 0; i < this.cartList[index].list.length; i++) {
						this.cartList[index].list[i].selected = true
					}
				} else {
					for (let i = 0; i < this.cartList[index].list.length; i++) {
						this.cartList[index].list[i].selected = false
					}
				}
				this.cartAccountOrSelected()
			},
			//点击全选
			doallSelected() {
				this.allSelected = !this.allSelected
				this.cartList = Object.assign([], this.cartList)
				this.cartList.forEach(v1 => {
					if (v1.type != -1) {
						v1.list.forEach(v2 => {
							v2.selected = (this.allSelected) ? true : false;
						});
					}
				});
				this.cartAccountOrSelected()
			},

			//删除商品
			async delCartItem(index, eq) {
				let res = await deletecart(this.cartList[index].list[eq].cartId + '', this.tokenId)
				if (res.code == 0) {
					this.cartList[index].list.splice(eq, 1)
					this.cartAccountOrSelected()

				}
			},

			//加减商品

			async changeItemAmount(x, y, type) {

				if (type == 'jia') {
					this.cartList[x].list[y].amount++
					let res = await updatecart(this.cartList[x].list[y].amount, this.cartList[x].list[y].cartId, this.tokenId);
					if (res.code == 0) {
						this.cartAccountOrSelected()
					}

				}
				if (type == 'jian') {
					this.cartList[x].list[y].amount--
					let res = await updatecart(this.cartList[x].list[y].amount, this.cartList[x].list[y].cartId, this.tokenId);
					if (res.code == 0) {
						this.cartAccountOrSelected()
					}
				}


			},
			async inputchange(x, y) {
				if (x == '') {
					x = 1
				}
				let res = await updatecart(x, y);
				if (res.code == 0) {
					this.cartAccountOrSelected()
				}

			},
			async clear() {
				let res = await clear();
				if (res.code == 0) {
					console.log(res)
				}
			},
			//清除失效商品
			toClearOverdue() {
				this.$messagebox({
					title: '确定要清空失效商品吗',
					message: '',
					showCancelButton: true,
					confirmButtonText: '确定',
					canselButtonText: '取消'
				}).then(action => {
					if (action == 'confirm') {
						this.clearOverdue();
					} else {
						return
					}
				})
			},
			async clearOverdue() {
				let index = '';
				this.cartList.forEach((data, eq) => {
					if (data.type == -1) {
						index = eq
					}

				})
				let res = await clear();
				if (res.code == 0) {
					this.cartList.splice(index, 1)
				}
			},
			//去结算
			async toAccounts() {
				let res = await isEnough('','','',this.cartIds);
				let that = this;
				if (res.code == 0) {
					console.log(that.cartIds)
					console.log(222)
					that.$bridge.callhandler('gopay', {
						cartIds: that.cartIds
					}, function callback(data) {

					})
				} else if (this.cartIds == '') {
					that.$toast({
						message: '还没有选择商品呢',
						position: 'center',
						duration: 1500
					});
				} else {
					that.$toast({
						message: '商品库存不足，请确认当前商品信息！',
						position: 'center',
						duration: 1500
					});
				}

			},



			//跳到商品详情
			toDetail(item) {
				let type = item.cartType;
				let goodsId = item.cartItemId;
				let userId = item.userId
				let query = {
					'goodsType': type,
					'goodsId': goodsId,
				}

				this.$bridge.callhandler('goodsdetail', query)
			}
		},
		mounted() {

		}
	}
</script>

<style scoped lang="scss">
	.cart_content {
		padding: 0 0.133333rem;
		padding-bottom: 1.6rem;
		overflow: hidden;
	}

	.cart_content.ipx {
		padding-bottom: 2.4rem;
	}

	.seed {
		margin-top: 0.266666rem;
		background: #fff;
		overflow: hidden;
		border-radius: 0.133333rem;
	}

	.seed .header {
		padding-left: 1.946666rem;
		width: 10rem;
		height: 1.066666rem;
		line-height: 1.066666rem;
		font-size: 0.373333rem;
		color: #333;
		font-weight: 600;
		border-bottom: 0.013333rem solid #f1f1f1;
	}

	.header_selecte {
		width: 1.066666rem;
		height: 1.066666rem;
		margin: auto;
		left: 0;
		top: 0;
		bottom: 0;
	}

	.cart_icon {
		width: 0.533333rem;
		height: 0.533333rem;
		left: 0.266666rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.cart_seed {
		width: 0.386666rem;
		height: 0.373333rem;
		left: 1.306666rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.crop {
		margin-top: 0.266666rem;
		background: #fff;
		overflow: hidden;
		border-radius: 0.133333rem;
	}

	.crop .header {
		padding-left: 1.946666rem;
		width: 10rem;
		height: 1.066666rem;
		line-height: 1.066666rem;
		font-size: 0.373333rem;
		color: #333;
		font-weight: 600;
		border-bottom: 0.013333rem solid #f1f1f1;

	}

	.cart_crop {
		width: 0.386666rem;
		height: 0.373333rem;
		left: 1.306666rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.tip {
		width: 10rem;
		height: 0.96rem;
		background-color: #ffd8d8;
		position: fixed;
		bottom: 1.306666rem;
		left: 0;
		padding-left: 0.8rem;
		line-height: 0.96rem;
		color: #ff2929;
		font-size: 0.373333rem;
		z-index: 999;
	}

	.tip>.text {
		color: #ff2929;
		padding-right: 0.133333rem;
	}

	.tip>.img {
		width: 0.373333rem;
		height: 0.373333rem;
		left: 0.266666rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.pay {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 10rem;
		height: 1.306666rem;
		background-color: #fff;
		border: solid 1px #eee;
		padding: 0 3.893333rem 0 1.12rem;
		font-size: 0.32rem;
		color: #666;
		line-height: 1.306666rem;
		font-weight: 600;
		z-index: 999;
	}

	.btn {
		width: 3.333333rem;
		height: 1.066666rem;
		background-image: linear-gradient(90deg, #ff7c7c 0%, #ff2828 100%);
		border-radius: 0.533333rem;
		right: 0.266666rem;
		top: 50%;
		transform: translateY(-50%);
		text-align: center;
		color: #fff;
		font-weight: 600;
		line-height: 1.066666rem;
		font-size: 0.373333rem;
	}

	.pay span {
		line-height: 1.306666rem;
		font-weight: 600;
	}

	.pay .text {
		font-size: 0.32rem;
		letter-spacing: 0rem;
		color: #333;
		text-align: right;
	}

	.pay .point {
		font-size: 0.373333rem;
		letter-spacing: 0rem;
		color: #333;
	}

	.pay .price_icon {
		font-size: 0.32rem;
		letter-spacing: 0px;
		color: #f00;
		padding-right: 2px;
	}

	.pay .price {
		font-size: 0.426666rem;
		letter-spacing: 0px;
		color: #f00;
		padding-left: 0.133333rem;
	}

	.list {
		width: 5.786666rem;
		height: 2.933333rem;
		padding: 0 0px 0 4.026666rem;
		box-sizing: content-box;
		border-bottom: 0.013333rem solid #f1f1f1;
	}

	.list>.img {
		left: 1.173333rem;
		top: 50%;
		transform: translateY(-50%);
		width: 2.4rem;
		height: 2.4rem;
		overflow: hidden;

		.imgbox {
			width: 2.4rem;
			height: 2.4rem;

			.shopuser {
				top: 0;
				width: 1.066666rem;
				height: 1.066666rem;
				left: 0;
			}
		}
	}

	.list>.img img {
		width: auto;
		height: 100%;
		display: block;
	}

	.list .title {
		width: 4.713333rem;
		height: 0.453333rem;
		line-height: 0.506666rem;
		margin: 0.293333rem 0 0.24rem;
		font-size: 0.346666rem;
		font-weight: 600;
		/* overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; */
	}

	.list .size {
		font-size: 0.32rem;
		line-height: 0.373333rem;
		color: #999;
		margin-bottom: 0.693333rem;
	}

	.list .price {
		font-size: 0.426666rem;
		font-weight: 600;
		color: #f00;
		padding-top: 0.166666rem;
	}

	.list .price span {
		font-size: 0.32rem;
		font-weight: 600;
		color: #f00;
		padding-right: 0.053333rem;
	}

	.cart_list_num {
		right: 0.266666rem;
		bottom: 0.373333rem;
	}

	.buynum_opreate input,
	.buynum_opreate button {
		height: 0.746666rem;
		line-height: 0.746666rem;
		font-size: 0.266666rem;
		text-align: center;
		border: 2px solid #eee;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}

	.buynum_opreate button {
		width: 0.746666rem;
		color: #bfbfbf;
		font-size: 0.4rem;
		background: none;
	}

	.buynum_opreate button:nth-of-type(1) {
		border-right: 0;
		border-radius: 0.053333rem 0 0 0.053333rem;
	}

	.buynum_opreate button:nth-last-of-type(1) {
		border-left: 0;
		border-radius: 0 0.053333rem 0.053333rem 0;
	}

	.buynum_opreate input[type="number"] {
		width: 0.96rem;
		color: #999;
	}

	.buynum_opreate input[disabled="disabled"] {
		opacity: 0.8;
	}

	.cart_del {
		width: 0.666666rem;
		height: 1.04rem;
		right: 0.16rem;
		top: 0;
	}

	.cart_del img {
		width: 0.426666rem;
		height: 0.426666rem;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.vegitable_num {
		font-size: 0.346666rem;
		color: #999;
		padding-left: 0.013333rem;
	}

	.overdue_goods {
		background: #fff;
		overflow: hidden;
		margin-top: 0.266666rem;
	}

	.overdue_goods .header {
		height: 1.146666rem;
		line-height: 1.066666rem;
		padding: 0 0.266666rem;
		border-bottom: 0.013333rem solid #f1f1f1;
	}

	.overdue_goods .header text {
		line-height: 1.066666rem;
		font-size: 0.373333rem;
		font-weight: 600;
		color: #333;
	}

	.overdue_goods .header .clear_goods {
		color: #f55;
	}

	.overdue_icon {
		font-size: 0.266666rem;
		color: #fff;
		width: 0.773333rem;
		height: 0.426666rem;
		line-height: 0.426666rem;
		text-align: center;
		background-color: #aaa;
		border-radius: 0.213333rem;
		left: 0.266666rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.list .overdue_size {
		margin-top: 0.933333rem;
		margin-bottom: 0;
	}

	.ipxbox {
		width: 100%;
		height: 0.8rem;
		position: fixed;
		bottom: 0;
		left: 50%;
		background: #fff;
		transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
	}

	.pay.iphoneX {
		background: #fff;
		z-index: 10000;
		bottom: 0.7rem !important;
		border-bottom: none !important;
	}
</style>

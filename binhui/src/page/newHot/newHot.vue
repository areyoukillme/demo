<template>
<div class="f_pr">
	<navbar>{{content}}</navbar>
	<div class=' goods f_pr' >
		<div class='item left f_pr' v-for="(item,index) in fruitList" :key="index" @click.stop='toDetail(item)' :obj="item" v-if="shopType==1">
			<div class='f_pr img overflowimg'>
				<img class='fitimg2' :src='item.mainImage'></img>
				<img class='f_pa self_icon' src='../../assets/self_shop.png' v-if="item.userId == 1"></img>
			</div>
			<div class='f_pr goods_bottom'>
				<div class='name ellipsis'>{{item.name}}</div>
				<div class='detail'>
					<span class='left'>{{item.spec}}</span>
					<span class='right'>月销{{item.sale}}件</span>
				</div>
				<div class='price'>
					<span class='price_icon'>￥</span>{{item.sellPrice}}
				</div>
			</div>
			<div class='cart_icon f_pa' @click.stop='touchOnGoods(item,$event)' >
				<img src='../../assets/cart.png'></img>
			</div>
		</div>
		<gocart :left="x" :top="y" :cartProImg="cartProImg" ref="cart"></gocart>
		
	</div>
</div>
	


</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import {
		getgoodslist,
		addcart
	} from '../../service/getData.js'
	import gocart from '../../components/common/gocart.vue'
	
	export default {
		components:{gocart,navbar},
		created(){
			this.tokenId=this.$route.tokenId
			this.sidx=this.$route.query.sidx
			this.getgoodslist()
			if(this.sidx=='g.add_time'){this.content='新品'}
			else{this.content='热销'}
			this.judgeIphoneX()
		},
		data() {
			return {
				content:'',
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				page: 1, //当前页数
				limit: 20, //每页大小
				fruitList:[],
				userId: '1', //1为自营,0为农友商店
				//购物车组件变量
				routing: '../../cart/cart', //跳转到购物车路由
				hide_animation_box: true, //加入购物车元素隐藏
				cartProImg: '', //加入购物车的商品图片
				cartNum: 0, //购物车数量
				shopType: 1, //商家类型:1为自营0为农友
				showSearch: false, //显示搜索框
				navList: [{
					name: "全部"
				}], //筛选栏数据
				sidx: 'g.add_time', //g.store_nums全部排序,g.add_time最新排序,g.sell_price价格排序,g.sale销量排序
				order: 'desc', //desc降序,asc升序
				catId: 0,
				title: '买卖商城',
				cartItemId:'',
				amount:1,
				cartType:'',
				x:'',
				y:'',
				tokenId:'',
				isIphoneX:''
			}
		},
		mounted() {
		
		},
		methods:{
			judgeIphoneX() {
				if(/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)){
					this.isIphoneX=true;
				}else if(/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)){
					this.isSE=true
				}
			},
			async getgoodslist(){
				let res = await getgoodslist(this.catId, this.limit, this.order, this.page, this.sidx);
				if(res.code==0){
					this.fruitList=res.page.pageUtil.list
				}else{
					this.$toast({
						message: response.msg,
						position:'bottom',
						duration: 2000
					});
				}	
			},
			touchOnGoods: _.throttle(function(item, $event) {
				this.cartProImg = item.mainImage;
				this.x = $event.clientX;
				this.y = $event.clientY;
				this.$refs.cart.drop($event);
				this.cartItemId=item.goodsId;
				this.cartType=item.type;	
				this.addcart();
			}, 600),
			//加入购物车请求
			async addcart() {
				let res = await addcart(this.cartItemId,this.amount,this.cartType,this.tokenId );
				if (res.code == 0) {
					this.$refs.cart.addOrdel(1);
				} else {
					this.$refs.cart.addOrdel(1);
				}
			},
			toDetail(item, index) {
				let type = item.type;
				let goodsId = item.seedId ? item.seedId : item.goodsId
				let userId = item.userId
				this.$router.push({
					path: '/goodsdetail',
					query: {
						goodstype: type,
						goodsId: goodsId,
						userId: userId,
						tokenId:this.tokenId
					}
				})
			},
			
		}
	}
</script>

<style scoped>


	/* 商品区 */

	.goods {
		width: 10rem;
		overflow: hidden;
		padding-bottom: 1.6rem;
		background: #e9e9e9;
	}

	.goods .item {
		width: 50%;
		/* height: 524px; */
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

	/* 
.goods .item:nth-last-of-type(2), .goods .item:nth-last-of-type(1) {
    border-bottom: none;
} */

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
		/* overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; */
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

	.goods_li>.owner>span {
		font-size: 0.32rem;
		color: #999;
		line-height: 0.72rem;
	}
</style>

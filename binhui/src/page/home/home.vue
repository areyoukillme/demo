<template>
	<div>
		<navbar type="iosback">买卖商城</navbar>
		<div class="shop_content f_pr">
			<div>
				<mt-swipe class="swiper_carousel" :show-indicators='true'>
					<mt-swipe-item v-for="item in imgArr" :key="item.id">
						<a :href="item.href">
							<img :src="item.imgUrl" class="img" />
						</a>
					</mt-swipe-item>
				</mt-swipe>
			</div>
			<div class='shop f_pr'>
				<div class='f_pr imgbox'>
					<router-link :to='{path:"./seeds",query:{tokenId:tokenId}}'><img :src="imgBaseUrl+'/seed_shop_icon.png'" /></router-link>
				</div>
				<div class='f_pr imgbox'>
					<router-link :to='{path:"./wupin",query:{tokenId:tokenId}}'><img :src="imgBaseUrl+'/goods_shop_icon.png'" /></router-link>
				</div>
			</div>
			<div class='nav f_pr'>
				<div>
					<div class='box f_dib' @click='toOtherPage("guide")'>
						<img src='../../assets/sale_icon_1.png' />
						<p>指南</p>
					</div>
				</div>
				<div>
					<div class='box f_dib' @click='toOtherPage("new")'>
						<img src='../../assets/sale_icon_2.png' />
						<p>新品</p>
					</div>
				</div>
				<div>
					<div class='box f_dib' @click='toOtherPage("hot")'>
						<img src='../../assets/sale_icon_3.png' />
						<p>热销</p>
					</div>
				</div>
				<div>
					<div class='box f_dib' @click='toOtherPage("search")'>
						<img src='../../assets/sale_icon_4.png' />
						<p>客服</p>
					</div>
				</div>
			</div>
			<div class='select f_pr'>
				<div v-for="(item,index) in rule" @click='exChange(index)' :key="index" class='f_pr' :class="[index>0?'padl':'',index==2?'f_tac':'',index=='3'?'f_tar':'']">
					<div class='f_dib select_box' :class='item.actived?"actived":""' v-if="index<1">
						{{item.name}}
					</div>
					<div class='f_dib select_box' :class='item.actived?"actived":""' v-if="index>0">
						{{item.name}}
						<img src='../../assets/select_no.png' v-if="item.show=='d'"></img>
						<img src='../../assets/select_top.png' v-if="item.show=='t'"></img>
						<img src='../../assets/select_bottom.png' v-if="item.show=='b'"></img>
					</div>
				</div>
				<div class='f_pr'>
					<img class='f_db search_icon' src='../../assets/search_icon.png'></img>
					<div class='shade f_pa' @click='toShowSearch'></div>
				</div>

				<div class='search_content f_pa' v-if='showSearch'>
					<div class='search_box f_pr'>
						<input placeholder='搜索' @keyup.enter="toSearch" v-model.trim="searchKey"></input>
						<div class='f_pa icon_shade' @click.stop='toSearch'>
							<i class="mint-toast-icon mintui mintui-search"></i>
						</div>
					</div>
					<div class='classify'>
						<p class='f_db left' :class='currentIndex == index ?"actived":""' v-for="(item,index) in navList" :key="index"
						 @click="exchangeClassfical(item)">{{item.name}}</p>
						<p class='f_db left' @click='closeShowSearch'>收起</p>
					</div>
				</div>
			</div>

			<div class='goods f_pr' ref="beanbox">
				<div class='item left f_pr' v-for="(item,index) in fruitList" :key="index" @click.stop='toDetail(item,index)' v-if="shopType==1">
					<div class='f_pr img overflowimg '>
						<img class='fitimg2' :src='item.mainImage' />
						<img class='f_pa self_icon' src='../../assets/self_shop.png' v-if="item.userId == 1" />
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
				<div v-for="(item,idx) in beanlists"  class='bean_box' :style="{left:item.left+'px',top:item.top+'px'}"
				 @click.stop='gatherbean(item,idx)'>
					<img class='fitimg' src='../../assets/bean_bg.png'></img>
					<span class='t_tdou'>{{item.beanMoney}}</span>
				</div>
				<defaultpage :defaultType="fruitList.length <= 0 ?'goods':''"></defaultpage>
				<button class='goods_more f_pa' v-if="fruitList.length > 0" @click.stop='toFruit'>查看更多</button>

			</div>

			<!-- 购物车 -->
			<gocart :left="x" :top="y" :cartProImg="cartProImg" ref="cart"></gocart>
			<gotop :showTop="showTop"></gotop>
		
		</div>
	</div>
</template>

<script>
	import gotop from '../../components/common/gotop.vue'
	import gocart from '../../components/common/gocart.vue'
	import defaultpage from '../../components/common/defaultpage.vue'
	import navbar from '../../components/common/navbar.vue'
	import _ from 'lodash'
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import {
		swiperlist,
		categorylist,
		getcartnum,
		getgoodslist,
		addcart,
		beanslist,
		getbeans
	} from '../../service/getData.js'
	export default {
		components: {
			top,
			gocart,
			gotop,
			defaultpage,
			navbar
		},
		beforeCreate() {

		},
		data() {
			return {
				x: '',
				y: '',
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				//轮播配置
				circular: true,
				indicatorColor: '#fff',
				indicatorActiveColor: '#ed0000',
				autoplay: true,
				interval: 4000,
				duration: 300,
				imgArr: [], //轮播图数据
				current: '', //轮播指示点
				preIndex: 0, //记录上一次的轮播指示点反正卡顿
				actNavList: [{
						name: '优选种子',
						img: imgBaseUrl + 'sale_icon01.png',
						url: '../seeds/seeds'
					},
					{
						name: '蔬菜鲜果',
						img: imgBaseUrl + 'sale_icon02.png',
						url: '../fruit/fruit'
					},
					{
						name: '换菜',
						img: imgBaseUrl + 'sale_icon03.png',
						url: ''
					},
					{
						name: '偷菜',
						img: imgBaseUrl + 'sale_icon04.png',
						url: ''
					},
				], //活动导航
				page: 1, //当前页数
				limit: 12, //每页大小
				showTop: false, //返回顶部
				seedList: [], //种子列表数据
				fruitList: [], //蔬果列表数据
				userId: '1', //1为自营,0为农友商店
				isLoad: false, //禁止加载
				showMore: false, //显示查看更多按钮
				//购物车组件变量
				routing: '../cart/cart', //跳转到购物车路由
				hide_animation_box: false, //加入购物车元素隐藏
				cartProImg: '', //加入购物车的商品图片
				cartNum: 20, //购物车数量
				shopType: 1, //商家类型:1为自营0为农友
				showSearch: false, //显示搜索框
				navList: [{
					name: "全部"
				}], //筛选栏数据
				currentIndex: 0, //当前点击分类
				catId: 0, //分类id
				sidx: 'g.store_nums', //g.store_nums全部排序,g.add_time最新排序,g.sell_price价格排序,g.sale销量排序
				order: 'desc', //desc降序,asc升序
				rule: [{
						name: '全部',
						actived: true,
						show: 'd',
						sidx: 'g.store_nums'
					},
					{
						name: '销量',
						actived: false,
						show: 'd',
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
				searchKey: '', //搜索关键字
				cartItemId: '',
				amount: 1,
				cartType: '',
				tokenId: '',
				beanlists: [],
				beanboxheight: '',
				beanboxwidth: '',
				isIphoneX:''
			}
		},

		created() {
			this.tokenId = this.$route.query.tokenId;
			this.getswiper()
			this.getgoodslist()
			this.categorylist()
			this.getbeanslist()
			this.judgeIphoneX()
		},
		methods: {
			judgeIphoneX() {
				if(/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)){
					this.isIphoneX=true;
				}else if(/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)){
					this.isSE=true
				}
			},
			async getbeanslist() {
				let res = await beanslist(this.tokenId)
				if (res.code == 0) {
					this.beanlists = res.beans;
					this.beanlists.forEach((data) => {
						data.top = Math.ceil(Math.random() * this.beanboxheight*0.8);
						data.left = Math.ceil(Math.random() * this.beanboxwidth*0.8);
					})
				}
			},
			async gatherbean(item, index) {
				let res = await getbeans(item.beanMoney + '')
				if (res.code == 0) {
					this.beanlists.splice(index, 1)
					this.$toast({
						message: '搜寻成功',
						position: 'center',
						duration: 1500
					});
				} else if (res.code == 403) {
					this.$toast({
						message: '今日搜寻次数已到上限!',
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
			//获取轮播图数据
			async getswiper() {
				let res = await swiperlist("2");
				if (res.code == 0) {
					this.imgArr = res.list
				} else {}
			},
			//获取商品数据
			async getgoodslist() {
				let res = await getgoodslist(this.catId, this.limit, this.order, this.page, this.sidx, this.searchKey);
				if (res.code == 0) {
					this.fruitList = res.page.pageUtil.list
					this.isLoad = true		
				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					})
				}
			},
			// 获取搜索列表
			async categorylist() {
				let res = await categorylist();
				if (res.code == 0) {
					this.navList = res.list
				} else {

				}
			},
			//获取购物车数量
			async getcartnum() {
				let res = await getcartnum(this.tokenId);
				if (res.code == 0) {
					this.cartNum = res.result
					console.log(this.cartNum)
				} else {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					});
				}
			},

			//选择搜索排序条件
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
				this.getgoodslist()
			},
			// 搜索
			toShowSearch() {
				this.showSearch = !this.showSearch;
			},
			closeShowSearch() {
				this.showSearch = false;
			},

			//点击搜索商品
			toSearch() {
				if (!this.searchKey) {
					return;
				}
				console.log(this.searchKey)
				this.showSearch = false;
				this.getgoodslist();
				//清空搜索框
				this.searchKey = ''
			},
			exchangeClassfical(item) {
				this.catId = item.catId;
				this.showSearch = false;
				this.getgoodslist()
			},

			//去到商品详情
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
						tokenId: this.tokenId
					}
				})
			},
			//去到更多页面
			toFruit() {
				this.$router.push({
					path: './moregoods',
					query: {
						tokenId: this.tokenId
					}
				})
			},

			// 跳转其他页面
			toOtherPage(type) {
				if (type == "guide") {
					this.$router.push({
						path: './guide',
						query: {
							tokenId: this.tokenId
						}
					})
				}
				if (type == "new") {
					this.$router.push({
						path: './newHot',
						query: {
							sidx: "g.add_time",
							tokenId: this.tokenId

						}
					})
				}
				if (type == "hot") {
					this.$router.push({
						path: './newHot',
						query: {
							sidx: "g.sale",
							tokenId: this.tokenId
						}
					})
				}
				if (type == "search") {
					this.$toast({
						message: '客服功能暂未开放，敬请期待！',
						position: 'center',
						duration: 1500
					});
				}
			},
			touchOnGoods: _.throttle(function(item, $event) {
				this.cartProImg = item.mainImage;
				this.x = $event.clientX;
				this.y = $event.clientY;
				this.$refs.cart.drop($event);
				this.cartItemId = item.goodsId;
				this.cartType = item.type;
				this.addcart();
			}, 600),

			//加入购物车请求
			async addcart() {
				let res = await addcart(this.cartItemId, this.amount, this.cartType, this.tokenId);
				if (res.code == 0) {
					this.$refs.cart.addOrdel(1)
				} else {}
			},

			// 监听滚动位置
			handleScroll() {
				var scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				if (scroll > 1000) {
					this.showTop = true;
				} else {
					this.showTop = false;
				}
			},
		},
		mounted() {
			window.addEventListener('scroll', this.handleScroll)
		},
		watch:{
			fruitList:function(){
				this.$nextTick(function(){
					let res=this.$refs.beanbox.getBoundingClientRect()//计算豆子盒子高度
					this.beanboxwidth=res.width;
					this.beanboxheight=res.height;
				})
			}
		},


	}
</script>

<style lang="scss" scoped>
	
	.shop_content {
		background: #F2F4F8;
		display: flex;
	}

	// 轮播图样式
	.swiper_carousel {
		width: 100%;
		height: 3.733333rem;

	}

	.swiper_carousel img {
		max-width: 100%;
		height: 100%;
		display: block;
		margin: 0 auto;
	}


	.shop {
		height: 1.786666rem;
		display: flex;
		background: #fff;
		border-bottom: 0.08rem solid #f1f1f1;
		display: flex;

		.imgbox {
			flex: 1;

			img {
				position: absolute;
				width: 3.68rem;
				height: 1.013333rem;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);

			}
		}

	}

	.nav {
		display: flex;
		background: #fff;
	}

	.nav>div {
		flex: 1;
		text-align: center;
	}

	.nav .box>img {
		width: 0.986666rem;
		height: 0.986666rem;
		display: block;
		margin: 0.16rem auto 0.053333rem;
	}

	.nav .box>p {
		display: block;
		height: 0.453333rem;
		line-height: 0.453333rem;
		font-size: 0.32rem;
		text-align: center;
		margin-bottom: 0.08rem;
	}

	.select {
		padding: 0 0.266666rem;
		height: 1.093333rem;
		background: #fff;
		margin-top: 0.266666rem;
		display: flex;
		border-bottom: 0.026666rem solid #f1f1f1;
	}

	.select>div {
		flex: 1;
		line-height: 1.066666rem;
		font-size: 0.373333rem;
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

	.select .shade {
		width: 1.333333rem;
		height: 1.066666rem;
		right: -0.266666rem;
		top: 0;
	}

	.select .search_icon {
		width: 0.48rem;
		height: 0.48rem;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.select .padl {
		padding-left: 0.373333rem;
	}

	.select>div>.actived {
		color: #00b25e;
	}

	.search_content {
		background: rgb(219, 219, 219);
		top: 1.066666rem;
		left: 0;
		width: 10rem;
		z-index: 4;
		overflow: hidden;
	}

	.search_content .search_box {
		margin: 0.24rem auto 0.32rem;
		box-sizing: border-box;
		width: 8.933333rem;
		height: 0.72rem;
		line-height: 0.72rem;
		border-radius: 0.8rem;
		padding: 0 0.906666rem 0 0.533333rem;
		background-color: rgba(255, 255, 255, 1);
		border: 1px solid rgba(192, 192, 192, 1);
		color: #666;
	}


	.search_box .icon_shade {
		top: 0;
		right: 0;
		width: 1.066666rem;
		height: 100%;
	}

	.search_box input {
		display: block;
		width: 100%;
		height: 100%;
		z-index: 10000;
	}

	.place-class {
		font-size: 0.373333rem;
		line-height: 0.72rem;
		color: #666;
	}

	.search_content .search_box>i {
		right: 0.533333rem;
		top: 0rem;
		margin-top: 0.16rem;
	}

	.classify {
		padding-left: 0.213333rem;
		overflow: hidden;
	}

	.classify>p {
		min-width: 1.92rem;
		height: 0.853333rem;
		line-height: 0.853333rem;
		text-align: center;
		color: #666;
		font-size: 0.346666rem;
		margin-bottom: 0.293333rem;
	}

	.classify>.actived {
		height: 0.853333rem;
		line-height: 0.8rem;
		border-radius: 1.173333rem;
		border: 2px solid rgba(42, 204, 133, 1);
	}


	// 商品区
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
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding-bottom: 0.106666rem;
		border-top: 1px solid #e9e9e9;
		border-bottom: 1px solid #e9e9e9;
	}

	.goods .item .self_icon {
		width: 1.1rem;
		height: 1.1rem;

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

	.bean_box {
		width: 1.52rem;
		height: 1.52rem;
		position: absolute;
		z-index: 887;
		animation: blink 1s infinite;
		-webkit-animation: blink 1s infinite;
	}

	.bean_box .t_tdou {
		font-size: 0.266666rem;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0%);
		bottom: 0.266666rem;
		z-index: 888;
		display: inline-block;
		
	}
	
@keyframes blink{
	0%{
		opacity: 0;
	}
	50%{
		opacity: 100;
	}
	100%{
		opacity: 0;
	}
}
@-webkit-keyframes blink{
	0%{
		opacity: 0;
	}
	50%{
		opacity: 100;
	}
	100%{
		opacity: 0;
	}
}

</style>

<template>
	<div class='box f_pr'>
		<navbar>蔬菜鲜果</navbar>
		<div class='headers' :class="isIphoneX?'ipx':''" >
			<div class='search_rule'>
				<div class='lis f_pr' v-for="(x,index) in rule" @click.stop='exChange(index)'>
					<div class="f_dib f_pr">
						<span>{{x.name}}</span>
						<img src='../../assets/search_d.png' v-if="x.show=='d'" class='f_pa d_icon'></img>
						<img src='../../assets/search_t.png' v-if="x.show=='t'" class='f_pa t_icon'></img>
						<img src='../../assets/search_b.png' v-if="x.show=='b'" class='f_pa b_icon'></img>
					</div>
				</div>
			</div>
			<div class="slide-box">
				<div v-for="(y,idx) in Nav" :key="idx" class="slide-item" :class="currentTab == idx ?'active':''" @click.stop="exchangeClassfical(y,idx)">{{y.name}}</div>
			</div>
		</div>
		<div class='goods_list_box' ref='List'>
			<div class='goods_ul'  v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
				<div class='goods_li left' v-for="(x,index) in GoodsList" @click.stop='goprodetail(x,index)'>
					<div class='goods_img f_pr overflowimg'>
						<img class='fitimg2' :src="x.mainImage"></img>
					</div>
					<span class='title f_db ellipsis'>{{x.name}}</span>
					<div class='goods_b border_bottom clear f_pr'>
						<span class='f_db left d'>￥<span class='m'>{{x.sellPrice}}</span></span>
						<span class='f_db right g'>{{x.spec}}</span>
					</div>
					<div class='owner f_pr'>
						<div class='img f_pa'>
							<img class='f_db fitimg' :src='x.avatar'></img>
						</div>
						<span class='f_db ellipsis'>{{x.userName}}</span>
					</div>
				</div>
			</div>
			<div class="null_list" v-if="allLoaded">没有更多数据了</div>
			<!-- 加载菊花图 -->
			<div class="weui-loadmore"  v-if='showloading&&!allLoaded'>
				<mt-spinner type="fading-circle" :size="30" color="green"></mt-spinner>
			</div>
		</div>
		<gotop :showTop="showTop"></gotop>
		<gocart @click.stop='gocart' :cartNum="cartNum"></gocart>

	</div>
</template>

<script>
	import gotop from '../../components/common/gotop.vue'
	import gocart from '../../components/common/gocart.vue'
	import navbar from '../../components/common/navbar.vue'
	import _ from 'lodash'
	import {
		cartNum,
		getgoodslist,
		categorylist,

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
						name: '新品',
						actived: true,
						show: 'b',
						sidx: 'g.add_time'
					},
					{
						name: '价格',
						actived: false,
						show: 'd',
						sidx: 'g.sell_price'
					}
				], //排序字段
				order: 'desc', //升序asc,降序:desc
				sidx: 'g.add_time', //查询条件：综合查询g.sort_num,按新品查询g.add_time,按销量查询g.sale,按价格查询g.sell_price
				currentTab: 0, //滑动导航默认
				showmore: false, //显示隐藏更多
				NavList: [{
					name: "全部"
				}], //导航顶部数据
				Nav: '',
				page: 1, //当前页
				limit: 20, //每页数量
				// 分页配置
				isShow: false,
				total: 1, //传给分页组件的大页数
				flag: 10, //大页数取正整数
				goodindex: 0, //分页下标
				Nodataing: false, //没有更多数据
				catId: 0, //分类id
				goodList: [1, 2, 3], //记录到page为20页就销毁
				GoodsList: [], //动态数组,
				hide_animation_box: false, //加入购物车元素隐藏
				cartProImg: '', //加入购物车的商品图片
				cartNum: 0, //购物车数量
				showloading: false,
				allLoaded: false,
				loading:false,
				tokenId:'',
				isIphoneX:''
			
			};

		},
		created() {
	
			this.tokenId=this.$route.query.tokenId
			this.categorylist()
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
			async loadMore() {
				// 获取蔬果列表
				this.allLoaded=false;
				this.loading=true;
				this.showloading=true
				let res = await getgoodslist(this.catId, this.limit, this.order, this.page, this.sidx);
				if (res.code == 0) {
	
					this.showloading=false;
					this.goodList = res.page.pageUtil.list

					if (res.page.pageUtil.currPage < res.page.pageUtil.totalPage) {
						this.loading=false;
						this.page++;
						let list = [...this.GoodsList, ...this.goodList] //解构拼接数组
						this.GoodsList = list;
					}
					else if(res.page.pageUtil.currPage == res.page.pageUtil.totalPage){
						let list = [...this.GoodsList, ...this.goodList] //解构拼接数组
						this.GoodsList = list;
						this.allLoaded=true;
						this.showloading=false;
						this.loading=true;
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
				this.page=1;
				this.GoodsList='';
				this.loadMore()
			},

			// 获取蔬果分类
			async categorylist() {
				let res = await categorylist();
				if (res.code == 0) {
					this.Nav = res.list;
				} else {}
			},
			//选择蔬果分类

			exchangeClassfical: _.throttle(function(y, index) {
				this.catId = y.catId;
				this.currentTab = index;
				this.page=1;
				this.GoodsList='';
				this.loadMore()
			}, 500),
			
			// 监听滚动位置
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
			



		},
		mounted() {
	
			window.addEventListener('scroll', this.handleScroll);
			

		}
	}
</script>

<style scoped lang="scss">
	.box {
		width: 100%;
		height: 100%;
		background: #F2F4F8;
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
		position:relative;
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

	/* 头部 */
	.headers {
		width: 100%;
		position: fixed;
		top: 1.706666rem;
		left: 0;
		z-index: 99999;
		background: #ccc;
	}

	.headers .search_rule {
		width: 10rem;
		height: 1.226666rem;
		background: #fff;
		padding: 0 0.4rem;
		border-top: 0.04rem solid #f1f1f1;
		border-bottom: 0.04rem solid #f1f1f1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.lis {
		width: 1.066666rem;
		height: 1.066666rem;
		line-height: 1.066666rem;
		text-align: center;
		/* display: flex; */
		/* flex-direction: row; */
		/* justify-content: space-between; */
		/* align-items: center; */
		flex: 1;
	}

	.lis>div {
		min-width: 1.066666rem;
	}

	.lis span {
		display: block;
		font-size: 0.373333rem;
	}

	.lis img {
		width: 0.213333rem;

		right: -0.066666rem;
	}

	.lis .d_icon {
		top: 0.526666rem;
		height: 0.4rem;
		transform: translateY(-50%);
	}

	.lis .t_icon,
	.lis .b_icon {
		top: 0.536666rem;
		height: 0.25rem;
		transform: translateY(-50%);
	}


	/* 导航 */



	.slide-item {
		background: #f5f5f5;
		font-size: 0.32rem;
		height: 0.533333rem;
		line-height: 0.533333rem;
		border-radius: 0.266666rem;
		padding: 0 0.213333rem;
		margin: 0.266666rem 0.066666rem 0.133333rem;
		display: inline-block;
		box-sizing: content-box;
	}

	.slide-box {
		height: 1.066666rem;
		box-shadow: 0 0.026666rem 0.026666rem #eee;
		-webkit-box-shadow: 0 0.026666rem 0.026666rem #eee;
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch;
		background: #fff;
	}

	.slide-item:nth-of-type(1) {
		margin-left: 0;
	}

	.active {
		background: #ed0000 !important;
		color: #fff;
	}

	/* 商品列表 */
	.goods_list_box {
		width: 100%;
		/* background: #fff; */
		margin-top: 2.3rem;

	}

	.goods_ul {
		width: 10rem;
		/* padding: 0 20px; */
		overflow: hidden;

	}

	.goods_li {
		width: 49.5%;
		box-sizing: border-box;
		height: 7.333333rem;
		background: #fff;
		margin: 0 1% 0.7% 0;
		padding: 0 0.266666rem 0.266666rem;
		padding-bottom: 0.133333rem;
		overflow: hidden;
		border-right: 0.026666rem;
	}

	.goods_li:nth-of-type(2n) {
		margin: 0;
	}

	.goods_img {
		width: 100%;
		height: 4.266666rem;
		margin: 0.293333rem auto 0;
		overflow: hidden;
	}

	.goods_li .title {
		margin-top: 0.24rem;
		font-size: 0.4rem;
		font-weight: 600;
		word-break: break-all;
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

	.goods_li>.owner>.img {
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

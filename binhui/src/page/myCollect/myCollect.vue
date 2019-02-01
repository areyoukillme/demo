<template>
	<div class="box" ref="box">
		<navbar type="iosback">{{$route.meta.title}}</navbar>
		<div class="titleBar">
			<div>
				<div class="titleTxt" :class="isGoods?'actived':''" @click.stop="changePage(1)">商品收藏</div>
			</div>
			<div>
				<div class="titleTxt" :class="isFriend?'actived':''" @click.stop="changePage(2)">农友圈收藏</div>
			</div>
		</div>
		<!-- 农友圈收藏界面 -->
		<div v-if="isFriend">
			<defaultpage defaultType="collect" v-if="friendCollectList.length==0"></defaultpage>
			<loadmore :infinite="infinite" :disabled="touchend">
				<div slot="content" class="friendCollect_content">
					<div class="list f_pr" v-for="(x,index) in friendCollectList" :key="index">
						<div class="f_pa img"  :style="{'background':'url('+x.avatar+') no-repeat center center','background-size':'cover'}">
							<!-- <img class="fitimg" :src="x.avatar"> -->
							
						</div>
						<div class="userName ellipsis">{{x.userName}}</div>
						<span class="txt f_db" v-if="x.content">{{x.content}}</span>
						<div class="pictures f_pr" v-if="x.pic!=null&&x.pic.length>0">
							<img v-for="(y,eq) in x.pic" :key="y.articleId" :class="[x.pic.length == 1? 'widthFix' : 'aspectFill',eq<3? 'mrtop':''] "
							 class="f_pr imgBox left" :src="y" preview='y'>
						</div>
						<div class="status">
							<span class="date left">{{x.formatDate}}</span>
							<div class="del right f_pr" @click.stop="toDelete(x.articleId)">删除
								<div class="f_pa shade"></div>
							</div>
						</div>
					</div>
				</div>
			</loadmore>
		</div>
		<!-- 商品收藏界面 -->
		<div v-if="isGoods">
			<defaultpage defaultType="collect" v-if="goodsCollectList.length==0"></defaultpage>
			<loadmore :infinite="infinite" :disabled="touchend">
				<div slot="content" class="goods_collect_content">
					<div class="goods_list f_pr" v-for="(item,index) in goodsCollectList" :key="index" @click.stop="toDetail(item.itemId,item.favType)">
						<div class="goods_img f_pa">
							<img class="fitimg" :src="item.mainImage">
							<img class='f_pa self_icon' src='../../assets/self_shop.png' v-if="item.userId == 1" />
							<img class="f_pa self_icon" src="../../assets/user_shop.png" v-else>
						</div>
						<div class="goods_detail f_pr">
							<div class="goods_del f_pa" @click.stop="toDelGoods(item.goodsFavId)">
								<img class="goods_del_icon" src="../../assets/cart_del.png">
							</div>
							<div class="goods_title">{{item.name}}</div>
							<div class="goods_sku">
								<div class="goods_price left">￥{{item.sellPrice}}</div>
								<div class="goods_size right" v-if="item.favType == 1">{{item.spec}}</div>
								<div class="goods_size right" v-else>{{item.spec}}</div>
							</div>
						</div>
					</div>
				</div>
			</loadmore>
		</div>
	</div>
</template>

<script>
	import loadmore from "../../components/common/loadmore";
	import navbar from "../../components/common/navbar";
	import defaultpage from "../../components/common/defaultpage";
	import {
		getFriendCircleData,
		cancelFriendCollect,
		getGoodsListData,
		delGoodsData
	} from "../../service/getData";

	export default {
		data() {
			return {
				friendCollectList: [], //农友圈收藏数据
				goodsCollectList: [], //商品收藏数据
				preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
				touchend: false, //没有更多数据
				banRun: true, //禁止初始上啦加载
				page: 1, //分页页数
				limit: 10, //每页大小
				isFriend: false, //农友圈收藏界面展示
				isGoods: true, //商品收藏界面展示
				tokenId: this.$route.query.tokenId,
				slide1: [],
				ispreview: ''
			};
		},
		created() {
			//加载商品收藏数据
			this.getGoodsList();
		},
		mounted() {

		},
		methods: {
			handleClose() {},
			//获取商品收藏数据
			async getGoodsList() {
				let res = await getGoodsListData(this.page, this.limit, this.tokenId);
				if (res.code == 0) {
					this.goodsCollectList = res.pageUtil.list;
					this.banRun = res.pageUtil.list.length == 0 ? true : false;
				} else {
					this.$toast(res.msg, 1500);
				}
			},
			//获取农友圈收藏列表数据
			async getFriendCircleList() {
				let res = await getFriendCircleData(this.page, this.limit, this.tokenId);
				if (res.code == 0) {
					//转换图片数据类型
					res.pageUtils.list.forEach(data => {
						if (data.pic) {
							data.pic = data.pic.split(",");
						}
					});
					this.friendCollectList = res.pageUtils.list;
					// console.log(this.friendCollectList);

					this.banRun = res.pageUtils.list.length == 0 ? true : false;
				} else {
					this.$toast(res.msg, 1500);
				}
			},
			//农友圈收藏与商品收藏界切换
			changePage(type) {
				//防重复点击
				if (type == 1 && this.isGoods) {
					return;
				}
				if (type == 2 && this.isFriend) {
					return;
				}
				//初始化
				this.preventRepeatReuqest = false;
				this.touchend = false;
				this.banRun = true;
				this.page = 1;
				if (type == 1) {
					this.isGoods = true;
					this.isFriend = false;
					this.getGoodsList();
				}
				if (type == 2) {
					this.isGoods = false;
					this.isFriend = true;
					this.getFriendCircleList();
					window.scrollTo(0,10)
					setTimeout(function(){
						window.scrollTo(0,-10)
					},5)
				}
			},
			//删除商品收藏
			toDelGoods(id) {
				this.$messagebox.confirm("确定要删除该商品收藏吗?", {
						title: ""
					})
					.then(async action => {
						let res = await delGoodsData(String(id));
						if (res.code == 0) {
							this.goodsCollectList.forEach((data, index) => {
								if (id == data.goodsFavId) {
									this.goodsCollectList.splice(index, 1);
									//   console.log(this.friendCollectList);
								}
							});
							if (this.goodsCollectList == 0 && this.touchend) {
								this.banRun = true;
								this.touchend = false;
								return
							}
							if (this.goodsCollectList.length == 5) {
								this.loaderMore();
							}
						} else {
							this.$toast(res.msg, 1500);
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			//删除农友圈收藏
			toDelete(id) {
				this.$messagebox.confirm("确定要删除该农友圈收藏吗?", {
						title: ""
					})
					.then(async action => {
						let res = await cancelFriendCollect(String(id));
						if (res.code == 0) {
							this.friendCollectList.forEach((data, index) => {
								if (id == data.articleId) {
									this.friendCollectList.splice(index, 1);
									//   console.log(this.friendCollectList);
								}
							});
							if (this.friendCollectList.length == 0 && this.touchend) {
								this.banRun = true;
								this.touchend = false;
								return
							}
							if (this.friendCollectList.length == 4) {
								this.page = 1;
								this.getFriendCircleList();
							}
						} else {
							this.$toast(res.msg, 1500);
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			//去到商品详情
			toDetail(id, type) {
				let query = {
					'goodsType': type,
					'goodsId': id,y
				}
				this.$bridge.callhandler('goodsdetail', query)
			},
			//到达底部加载更多数据
			infinite() {
				// if(this.BanSpellListScroll){
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

				//判断是否是商品收藏加载还是农友圈收藏加载
				if (this.isFriend) {
					let res = await getFriendCircleData(
						this.page,
						this.limit,
						this.tokenId
					);
					//转换图片数据类型
					res.pageUtils.list.forEach(data => {
						if (data.pic) {
							data.pic = data.pic.split(",");
						}
					});
					this.friendCollectList = [
						...this.friendCollectList,
						...res.pageUtils.list
					];

					//当获取数据小于20，说明没有更多数据，不需要再次请求数据
					if (res.pageUtils.list.length < this.limit) {
						this.touchend = true;
						return;
					}
				} else {
					let res = await getGoodsListData(this.page, this.limit, this.tokenId);
					this.goodsCollectList = [
						...this.goodsCollectList,
						...res.pageUtil.list
					];
					if (res.pageUtil.list.length < this.limit) {
						this.touchend = true;
						return;
					}
					//数据为0时显示默认页
					if (res.pageUtil.list.length == 0) {
						this.touchend = false;
						return
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

	.box {
		min-height: inherit;
	}

	.friendCollect_content {
		padding: 0 0.266666rem 0.266666rem;
		overflow: hidden;
	}

	.list {
		background: #fff;
		border-radius: 0.133333rem;
		margin-top: 0.266666rem;
		overflow: hidden;
		padding: 0.266666rem 0.32rem 0.266666rem 1.733333rem;
	}

	.list .img {
		width: 1.146666rem;
		height: 1.146666rem;
		top: 0.266666rem;
		left: 0.32rem;
		border-radius: 100%;
		overflow: hidden;
		/* border: 1 solid #979797; */
	}

	.list .userName {
		height: 0.613333rem;
		font-size: 0.426666rem;
		color: #325489;
		line-height: 0.613333rem;
		word-break: break-all;
		/* overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; */
		/* font-weight: bold; */
	}

	.list .txt {
		margin-top: 0.213333rem;
		font-size: 0.426666rem;
		color: #333;
		line-height: 0.613333rem;
		word-wrap: break-word;
		word-break: normal;
	}

	.pictures {
		width: 100%;
		margin-top: 0.133333rem;
		overflow: hidden;
		z-index: 100;

	}

	.imgBox {
		object-fit: cover;
		z-index: 100;
	}


	.pictures>.widthFix {
		vertical-align: middle;
		//   max-width: 60%;
		height: 4.8rem;
		width: 4.4rem;
		z-index: 100;
	}

	.pictures>.aspectFill {
		vertical-align: middle;
		width: 2.106666rem;
		height: 2.106666rem;
		margin: 0.133333rem 0 0 0.133333rem;
		z-index: 100;
	}

	.pictures>.aspectFill:nth-of-type(3n-2) {
		margin-left: 0;
	}

	.pictures>.mrtop {
		margin-top: 0;
	}

	.status,
	.date,
	.del {
		font-size: 0.32rem;
		color: #999;
		line-height: 0.453333rem;
		height: 0.453333rem;
		cursor: pointer;
	}

	.status {
		margin-top: 0.16rem;
	}

	.shade {
		width: 0.8rem;
		height: 0.8rem;
		left: -0.053333rem;
		top: -0.186666rem;
	}

	// 商品收藏样式

	.goods_collect_content {
		padding: 0 0.133333rem;
		width: 100%;
		overflow: hidden;
	}

	.goods_list {
		width: 100%;
		height: 2.933333rem;
		background: #fff;
		margin-top: 0.133333rem;
		border-radius: 0.133333rem;
		cursor: pointer;
	}

	.goods_list:first-of-type {
		margin-top: 0.266666rem;
	}

	.goods_img {
		width: 2.4rem;
		height: 2.4rem;
		top: 50%;
		left: 0.266666rem;
		transform: translateY(-50%);
		overflow: hidden;
		background: #c0c0c0;
		z-index: 100;
	}

	.goods_detail {
		width: 100%;
		padding: 0 0.72rem 0 3.04rem;
		height: 100%;
		overflow: hidden;
	}

	.goods_title {
		font-size: 0.373333rem;
		font-weight: 600;
		color: #333;
		line-height: 0.533333rem;
		height: 1.066666rem;
		width: 100%;
		margin: 0.16rem 0 0.693333rem 0;
		word-break: break-all;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.goods_sku {
		width: 100%;
		height: 0.533333rem;
	}

	.goods_price {
		font-size: 0.373333rem;
		font-weight: 600;
		line-height: 0.533333rem;
		color: #ff5555;
	}

	.goods_size {
		font-size: 0.32rem;
		color: #c0c0c0;
		line-height: 0.533333rem;
	}

	.goods_del {
		width: 0.8rem;
		height: 0.8rem;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
		cursor: pointer;
	}

	.goods_del_icon {
		width: 0.426666rem;
		height: 0.426666rem;
		margin-top: 0.186666rem;
		margin-left: 0.24rem;
		display: block;
	}

	.titleBar {
		height: 1.173333rem;
		width: 100%;
		background: #fff;
		display: flex;
	}

	.titleBar>div {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.titleBar .titleTxt {
		height: 1.173333rem;
		line-height: 1.173333rem;
		text-align: center;
		min-width: 2rem;
		font-size: 0.4rem;
		color: #666;
		cursor: pointer;
	}

	.titleBar .actived {
		color: #2acc85;
		border-bottom: solid 0.053333rem #2acc85;
	}
</style>

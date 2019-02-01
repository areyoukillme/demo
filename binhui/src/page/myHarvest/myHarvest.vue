<template>
	<div>
		<navbar>{{$route.meta.title}}</navbar>
		<defaultpage defaultType="harvest" v-if="goodsList.length==0"></defaultpage>
		<div class="myHarvest_content">
			<div class="box" v-for="(item,index) in goodsList" :key="index">
				<span class="date f_db" v-if="item.expired == 1">已过期</span>
				<span class="date f_db" v-else>{{item.addTime}}</span>
				<div class="list f_pr" v-for="(x,index) in item.produceList" :key="index">
					<div class="goods_time f_pa" :class="x.expiredDay>=0?'':'time_color'" v-if="x.expiredDay>0">可存放: {{x.expiredDay}}天</div>
					<div class="choose f_pa" v-if="isSell?isChoose&&x.expiredDay>0:isChoose&&item.expired == 0" @click.stop="chooseGoods(x.uspdId)">
						<img src="../../assets/mine_harvest_03.png" v-if="x.active">
						<img src="../../assets/mine_harvest_04.png" v-if="!x.active">
					</div>
					<div class="img f_pr">
						<img :src="x.imageUrl" class="fitimg">
						<div class="f_pa shade" v-if="item.expired == 1"></div>
					</div>
					<div class="name ellipsis" :class="item.expired == 1 ? 'expired':''">{{x.prodName}}</div>
					<div class="size">
						<span class="icon">X</span>{{x.remain}}g
					</div>
				</div>
			</div>
		</div>
		<div class="myHarvest_bottom">
			<div class="mhb_content">
				<div v-if="isSell">
					<div class="msg" :class="isSell&&!isHome?'active':''" @click.stop="sale">
						<img src="../../assets/mine_harvest_01.png" class="img f_db" v-if="isSell&&isHome">
						<img src="../../assets/mine_harvest_01_cur.png" class="img f_db" v-if="isSell&&!isHome">
						<span>出售</span>
					</div>
				</div>
				<div v-if="isHome">
					<div class="msg" :class="isHome&&!isSell ? 'active':''" @click.stop="sendHome">
						<img src="../../assets/mine_harvest_02.png" class="img f_db" v-if="isSell&&isHome">
						<img src="../../assets/mine_harvest_02_cur.png" class="img f_db" v-if="!isSell&&isHome">
						<span>寄回家</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 提醒弹框 -->
		<div class="tixing" v-if="isnew">
			<div class="nei_view">
				<div class="title_view f_pr">
					<img class="fitimg" src="../../assets/xingxing.png">
					<span>新收获</span>
				</div>
				<span class="nm_t">农民伯伯已经帮你收获了</span>
				<div class="shop_view">
					<div class="shop_li" v-for="(x,index) in remindList" :key="index">
						<div class="img f_pr">
							<img class="fitimg f_pa" :src="x.imageUrl">
						</div>
						<span class="t_name ellipsis">{{x.prodName}}</span>
						<span class="t_shu ellipsis">x{{x.yield}}g</span>
					</div>
				</div>
				<span class="nm_tx">作物存放有限，请及时处理</span>
				<div class="read">
					<button @click.stop="readclose" style="cursor: pointer">查看收获</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import navbar from "../../components/common/navbar";
	import defaultpage from "../../components/common/defaultpage";
	import {
		getMyHarvestData,
		getHarvestMSGData
	} from "../../service/getData";

	export default {
		data() {
			return {
				goodsList: [], //种子列表数据
				isSell: true, //展示出售按钮
				isChoose: false, //勾选框显示
				isHome: true, //显示寄回家按钮
				goodsList: [], //收获商品数据
				remindList: [], //收获提醒商品数据
				uspdIds: [], //存储选中的商品id
				isnew: false, //收获提醒弹框
				tokenId: this.$route.query.tokenId,
			};
		},
		created() {
			this.getMyHarvestList();
			this.harvestremind();
		},
		mounted() {
		},
		distroyed() {
			//数据初始化
			this.goodsList.forEach(item => {
				item.produceList.forEach(data => {
					data.active = false; //设置是否选中状态
				});
			});
			this.uspdIds = [];
		},
		methods: {
			//获取我的收获数据
			async getMyHarvestList() {
				let res = await getMyHarvestData(this.tokenId);
				if (res.code == 0) {
					// console.log(res)
					res.data.forEach(item => {
						item.produceList.forEach(data => {
							data.active = false; //设置是否选中状态
						});
					});
					this.goodsList = res.data;
				} else {

				}
			},
			//获取收获提醒数据
			async harvestremind() {
				let res = await getHarvestMSGData(this.tokenId);
				if (res.code == 0) {
					let data = res.data;
					this.isnew = data.length == 0 ? false : true;
					this.remindList = res.data;
				} else {

				}
			},
			//选择商品
			chooseGoods(id) {
				this.goodsList.forEach(item => {
					item.produceList.forEach((data, eq) => {
						if (id == data.uspdId) {
							data.active = !data.active; //改变是否选中状态
							if (data.active) {
								//若为选中状态则存储uspdId
								this.uspdIds.push(data.uspdId);
							} else {
								//若为不选中状态则移除uspdId
								let index = this.uspdIds.indexOf(data.uspdId);
								if (index != -1) {
									//判断在数组中是否存在
									this.uspdIds.splice(index, 1);
								}
							}
						}
					});
				});
			},
			//  查看收获提醒关闭弹框
			readclose() {
				this.isnew = false;
			},

			//寄回家
			sendHome() {
				this.isSell = !this.isSell;
				this.isChoose = true;
				if (this.isSell && this.isHome) {
					if (this.uspdIds.length > 0) {
						//判断是否有选中的商品
						// console.log(this.uspdIds);
						let userProduceIds = this.uspdIds.join(',');
						this.$bridge.callhandler('myHarvest', {
							'userProduceIds': userProduceIds
						});
					}
					//数据初始化
					this.goodsList.forEach(item => {
						item.produceList.forEach(data => {
							data.active = false; //设置是否选中状态
						});
					});
					this.uspdIds = [];
					this.isChoose = false;
				}
			},
			//出售
			sale() {
				this.isHome = !this.isHome;
				this.isChoose = true;
				if (this.isSell && this.isHome) {
					if (this.uspdIds.length > 0) {
						//判断是否有选中的商品
						// console.log(this.uspdIds);
						this.$router.push({
							path: 'mySale',
							query: {
								'uspdId': this.uspdIds,
								tokenId: this.tokenId
							}
						});
					}
					this.isChoose = false;
				}
			}
		},
		components: {
			navbar,
			defaultpage
		}
	};
</script>
<style lang="scss" scoped>
	@import "../../style/mixin";

	.myHarvest_content {
		width: 100%;
		padding: 0 0.266666rem 2.666666rem;
		overflow: hidden;
	}

	.list {
		margin: 0.266666rem 0 0 3.338%;
		background: #fff;
		width: 31.08%;
		height: 4.266666rem;
		float: left;
		padding: 0.133333rem;
		border-radius: 0.133333rem;
	}

	.choose {
		top: -0.053333rem;
		right: 0;
		width: 0.8rem;
		height: 0.8rem;
		z-index: 2;
		cursor: pointer;
	}

	.choose img {
		width: 0.453333rem;
		height: 0.453333rem;
		display: block;
		margin: 0.213333rem 0 0 0.213333rem;
	}

	.list:nth-of-type(3n-2) {
		margin-left: 0;
	}

	.list>.img {
		margin: 0 auto 0.133333rem;
		width: 2.666666rem;
		height: 2.666666rem;
		overflow: hidden;
	}

	.list>.img>img {
		width: auto;
		height: 100%;
		display: block;
	}

	.name {
		height: 0.64rem;
		line-height: 0.64rem;
		font-size: 0.373333rem;
		font-weight: 600;
		word-break: break-all;
		/* display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden; */
	}

	.expired {
		color: #999;
	}

	.size {
		height: 0.533333rem;
		line-height: 0.533333rem;
		font-size: 0.32rem;
		color: #999;
	}

	.size>.icon {
		color: #999;
		padding: 0 0.08rem 0 0.026666rem;
		font-size: 0.24rem;
	}

	.myHarvest_bottom {
		position: fixed;
		bottom: 0;
		left: 50%;
		background: #f8f8f8;
		width: 100%;
		height: 2.133333rem;
		padding: 0 0.4rem;
		z-index: 4;
		transform: translateX(-50%);
	}

	.mhb_content {
		width: 100%;
		height: 100%;
		background: #2acc85;
		display: flex;
		box-shadow: 0 0 0.133333rem 0 #2acc85;
		-webkit-box-shadow: 0 0 0.133333rem 0 #2acc85;
	}

	.mhb_content>div {
		flex: 1;
		text-align: center;
		font-size: 0;
	}

	.msg {
		display: inline-block;
		cursor: pointer;
	}

	.img {
		width: 0.453333rem;
		height: 0.453333rem;
		margin: 0.48rem auto 0;
		overflow: hidden;
	}

	.msg>span {
		font-size: 0.346666rem;
		font-weight: 600;
		color: #fff;
		line-height: 1.146666rem;
	}

	.active>span {
		color: #ffed8b;
	}

	.date {
		font-size: 0.373333rem;
		height: 0.533333rem;
		line-height: 0.533333rem;
		margin-top: 0.373333rem;
		color: #333;
		font-weight: 600;
	}

	.box {
		overflow: hidden;
	}

	.goods_time {
		background: rgba(244, 218, 77, 0.9);
		min-width: 2rem;
		height: 0.533333rem;
		top: 0.133333rem;
		left: 0;
		font-size: 0.32rem;
		color: #333;
		line-height: 0.533333rem;
		padding: 0 0.16rem;
		border-top-right-radius: 0.266666rem;
		border-bottom-right-radius: 0.266666rem;
		z-index: 2;
	}

	.time_color {
		color: #f55;
	}

	.shade {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(192, 192, 192, 0.5);
	}

	.tixing {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99;
	}

	.nei_view {
		width: 5.6rem;
		height: 7.466666rem;
		background: #fff;
		border-radius: 0.133333rem;
	}

	.title_view {
		width: 100%;
		height: 0.666666rem;
		padding: 0 0.986666rem;
		margin-top: 0.4rem;
	}

	.title_view img {
		width: 3.626666rem;
		height: 0.373333rem;
	}

	.title_view span {
		display: block;
		font-size: 0.48rem;
		color: #2acc85;
		font-weight: bold;
		text-align: center;
	}

	.nm_t {
		display: block;
		height: 0.533333rem;
		font-size: 0.373333rem;
		color: #666;
		text-align: center;
		margin-top: 0.24rem;
	}

	.shop_view {
		width: 100%;
		height: 3.653333rem;
		padding: 0 0.693333rem 0.333333rem 0.693333rem;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.shop_li {
		width: 1.866666rem;
		height: 100%;
		/* background: red; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.shop_li .img {
		width: 1.866666rem;
		height: 1.866666rem;
	}

	.shop_li .t_name {
		display: block;
		text-align: center;
		font-size: 0.32rem;
		color: #333;
		word-break: break-all;
		overflow: hidden;
		margin-top: 0.106666rem;
		width: 100%;
	}

	.shop_li .t_shu {
		display: block;
		text-align: center;
		font-size: 0.266666rem;
		color: #666;
		word-break: break-all;
		overflow: hidden;
	}

	.nm_tx {
		display: block;
		height: 0.533333rem;
		font-size: 0.32rem;
		color: #999;
		text-align: center;
	}

	.read {
		margin-top: 0.32rem;
		width: 100%;
		height: 0.853333rem;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.read button {
		width: 3.733333rem;
		height: 0.853333rem;
		background: #2acc85;
		border-radius: 1.333333rem;
		font-size: 0.373333rem;
		color: #ffffff;
	}
</style>

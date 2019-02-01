<template>
	<div>
		<navbar>订单详情</navbar>
		<div class='seedsorder_box'>
			<div class='seed_title f_pr'>
				<span>{{orderInfo.statusName}}</span>
				<div class='time f_pa' v-if="orderInfo.status == 1">
					<img class='f_pa' src='../../assets/countDown.png'></img>
					倒计时：{{countDown}}
				</div>
			</div>
			<div class='address_box' v-if="orderInfo.orderType!=2">
				<div class='site_box orderType' v-if='orderInfo.status!=1&&orderInfo.status==3' @click.stop='gologisticsDetails()'>
					<div class='tu_icon f_pr overflowimg'>
						<img class='s_left fitimg2' :src='imgBaseUrl+"cart_l.png"'></img>
					</div>
					<div class='site_content site_content_m'>
						<div class='admin'>
							<span class='stext'>{{orderInfo.logistics.lastExpStatus}}</span>
						</div>
						<span class='stime'>{{orderInfo.logistics.time}}</span>
					</div>
					<div class='tu_icon f_pr overflowimg'>
						<img class='s_rigth fitimg2' :src='imgBaseUrl+"site_left.png"'></img>
					</div>
				</div>
				<div class='site_box' v-if="orderInfo.orderType==1||orderInfo.orderType==5">
					<div class='tu_icon f_pr overflowimg'>
						<img class='s_left fitimg2' :src='imgBaseUrl+"site_icon.png"'></img>
					</div>
					<div class='site_content'>
						<div class='admin'>
							<span>收货人：{{orderInfo.orderAddress.userName}}</span>
							<span>{{orderInfo.orderAddress.mobile}}</span>
						</div>
						<span class='address'>收货地址：{{orderInfo.orderAddress.fullAddr}}</span>
					</div>
					<div class='tu_icon f_pr'>

					</div>
				</div>
			</div>
			<div class='seed_content'>
				<div class='seed_box'>
					<div class='seed_item' v-for="(pro,index) in orderInfo.orderSkuList" :key="pro.goodsId">
						<div class='seed_img f_pr' @click.stop='toDetail(pro)'>
							<img class='fitimg2' :src='pro.goodsImage'></img>
							<img class='f_pa self_icons' src='../../assets/self_shop.png' v-if="pro.userId == 1"></img>
						</div>
						<div class='parameter'>
							<div class='parameter_top'>
								<div class='title' @click.stop='toDetail(pro)'>
									<span>{{pro.goodsName}}
									</span>
								</div>
								<span class='m'>¥ {{pro.sellPrice}}</span>
							</div>
							<div class='parameter_center'>
								<span>{{pro.amount}}x{{pro.spec}}</span>
								<div v-if="orderInfo.orderType==2&&orderInfo.status==4" @click.stop='toSow'>去播种</div>
							</div>
						</div>
					</div>
					<div class='shop_m'>
						<div class='shop_j'>
							<span>商品总价</span>
							<span>¥ {{orderInfo.totalPrice}}</span>
						</div>
						<div class='shop_j' v-if="orderInfo.orderType==1||orderInfo.orderType==5">
							<span>运费</span>
							<span>¥ {{orderInfo.deliveryPrice}}</span>
						</div>
					</div>
				</div>
				<div class='shishu'>
					<span>实付款: </span>
					<span>¥ {{orderInfo.payPrice}}</span>
				</div>
			</div>
			<div class='tiem_box'>
				<div class='t'>
					<span>订单编号：{{orderInfo.orderNum}}</span>
					<span>下单时间：{{orderInfo.addTime}}</span>
				</div>
				<div class='fangshi' v-if="orderInfo.status!=1">
					<span class='f_db'>支付方式: {{orderInfo.payType}}</span>
				</div>
				<div class='fangshi b_top'>
					<span class='f_db'>订单类型: {{orderInfo.orderTypeName}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import {
		shoporderDetail
	} from '../../service/getData.js'
	import navbar from '../../components/common/navbar.vue'
	export default {
		components: {
			navbar
		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				orderId: '', //订单Id
				orderInfo: {
					orderSkuList: [],
					orderAddress: {}
				},
				countDown: "00:00:00", //倒计时
				time: '',
				orderType:this.$route.query.orderType
			};
		},
		created() {
			this.orderId = this.$route.query.orderId
			this.getdetail()
		},
		methods: {
			async getdetail() {
				let res = await shoporderDetail(this.orderId)
				if (res.code == 0) {
					this.orderInfo = res.result;
					this.time = res.result.countDown;
					if (res.result.status == 1) {
						this.formatSecondsTime();
					}
				}
			},
			formatSecondsTime() {
				let seconds = 0;
				let minutes = 0;
				let _this = this
				let second = Math.floor(this.time / 1000) //转换总秒数
				minutes = Math.floor(second / 60) //转换成分钟
				if (minutes < 10) {
					minutes = '0' + minutes
				}
				seconds = Math.floor(second % 60) //转换成秒
				if (seconds < 10) {
					seconds = '0' + seconds
				}
				let date = "00:" + minutes + ':' + seconds
				this.countDown = date;
				var timer = setInterval(() => {
					second--
					if (second > 0) {
						minutes = Math.floor(second / 60) //转换成分钟
						if (minutes < 10) {
							minutes = '0' + minutes
						}
						seconds = Math.floor(second % 60) //转换成秒
						if (seconds < 10) {
							seconds = '0' + seconds
						}
						let date = "00:" + minutes + ':' + seconds

						this.countDown = date

					}
					if (second == 0 && minutes == 0) {
						this.getdetail();
						clearInterval(timer)
					}

				}, 1000)

			},
			//查看物流
			gologisticsDetails() {
				this.$router.push({
					path: 'logisticsDetails',
					query: {
						orderId: this.orderId
					}
				})
			},
			toDetail(pro){
				let query = {
					'goodsType': this.orderType,
					'goodsId': pro.goodsId,
				}
				this.$bridge.callhandler('goodsdetail', query)
			}
		}
	}
</script>

<style scoped>
	.seedsorder_box {
		width: 100%;
		margin-bottom: 2rem;
	}

	.seed_title {
		width: 100%;
		height: 1.6rem;
		background-image: linear-gradient(90deg, #96d673 0%, #7cc65e 76%);
		padding: 0 0.4rem;

	}

	.seed_title span {
		display: block;
		color: #fff;
		line-height: 1.6rem;
		font-size: 0.4rem;
	}

	.seed_content {
		width: 100%;
		box-shadow: 0 1px 0 #e0e0e0;
		background: #fff;
		margin-top: 0.266666rem;
		border-radius: 0.133333rem;
	}

	.seed_box {
		width: 100%;
		padding: 0 0.4rem;
	}

	.self_icons {
		width: 1.066666rem !important;
		height: 1.066666rem !important;
		top: 0;
		left: 0;

	}

	.seed_item {
		padding-top: 0.266666rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-bottom: 0.266666rem;
		border-bottom: 0.013333rem solid #f1f1f1;
	}

	.seed_item:last-of-type {
		border-bottom: 1px solid #e0e0e0 !important;
	}

	.seed_img {
		width: 2.4rem;
		height: 2.4rem;
		overflow: hidden;
	}

	.parameter {
		width: 6.666666rem;
		height: 2.4rem;
	}

	.parameter_top {
		width: 100%;
		height: 1.066666rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.parameter_top .title {
		width: 4.48rem;
		height: 1.066666rem;
		font-size: 0.373333rem;
		line-height: 0.533333rem;
	}

	.parameter_top .title span {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		/* autoprefixer: off */
    -webkit-box-orient:vertical;
    /* autoprefixer: on */

	}

	.parameter_top .m {
		font-size: 0.373333rem;
		color: #666;
	}

	.parameter_center {
		width: 100%;
		height: 0.693333rem;
		margin-top: 0.613333rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.32rem;
	}

	.parameter_center span {
		color: #c0c0c0;
	}

	.parameter_center div {
		width: 1.973333rem;
		height: 0.693333rem;
		line-height: 0.693333rem;
		border: 1px solid #f55;
		border-radius: 0.293333rem;
		text-align: center;
		color: #f55;
	}

	.shop_m {
		/* height: 80px; */
		width: 100%;
		margin-top: 0.4rem;
		font-size: 0.32rem;
		border-bottom: 0.013333rem solid #f1f1f1;
		padding-bottom: 0.266666rem;
	}

	.shop_j {
		height: 0.533333rem;
		width: 100%;
		padding: 0.053333rem 0 0.053333rem 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.32rem;
	}

	.shop_m span {
		color: #999;
	}

	.shishu {
		width: 100%;
		height: 1.146666rem;
		padding: 0 0.4rem;
		font-size: 0.32rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.shishu span:nth-of-type(2) {
		color: #f55;
		margin-left: 0.266666rem;
	}

	.tiem_box {
		margin-top: 0.266666rem;
		width: 100%;
		/* height: 220px; */
		background: #fff;
		padding: 0 0.4rem;
		border-radius: 0.133333rem;
	}

	.tiem_box .t {
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		width: 100%;
		height: 1.866666rem;
		font-size: 0.32rem;
		border-bottom: 0.013333rem solid #f1f1f1;
		padding: 0.32rem 0 0.346666rem 0;
		color: #999;
	}

	.tiem_box .t span {
		color: #999;
	}

	.tiem_box .fangshi span {
		display: block;
		font-size: 0.32rem;
		line-height: 1.093333rem;
		color: #999;
	}

	.address_box {
		width: 100%;
		/* height: 292px; */
		background: #fff;
		padding: 0 0.4rem;
	}

	.site_box {
		width: 100%;
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 0.013333rem solid #f1f1f1;
	}

	.site_box:nth-last-of-type(1) {

		border-bottom: none;
	}

	.site_box .admin {
		width: 100%;
		height: 0.88rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 0.346666rem;
		font-size: 0.373333rem;
		border-bottom: 0px solid #f1f1f1 !important;
	}

	.site_box .admin .stext {
		color: #2acc85;
		font-size: 0.373333rem;
	}

	.site_box .site_content .stime {
		color: #c0c0c0;
		font-size: 0.266666rem;
		margin-top: 0.266666rem;
	}

	.site_box .address {
		font-size: 0.32rem;
		color: #666;
		line-height: 0.453333rem;
	}

	.site_box .tu_icon {
		height: 0.426666rem;
		width: 0.426666rem;

	}

	.site_box .tu_icon .s_left {
		height: 0.426666rem;
		width: 0.426666rem;
	}

	.site_box .tu_icon .s_rigth {
		height: 0.426666rem;
		width: 0.24rem;
	}

	/* .site_box image:nth-of-type(2) {
        display: block;
        height: auto;
        width: 18px;
} */

	/* .site_box image:nth-of-type(1) {
        display: block;
        height: auto;
        width: 32px;
}

.site_box image:nth-of-type(2) {
        display: block;
        height: auto;
        width: 18px;
} */

	.site_content {
		width: 7.68rem;
		height: 100%;
		margin-bottom: 0.48rem;
	}

	.site_content_m {
		margin-bottom: 0.213333rem;
	}

	.site_content_m .admin {
		width: 7.68rem;
		height: 100%;
		margin-bottom: 0.4rem;
	}

	.site_content .txt {
		display: block;
		height: 1.066666rem;
		width: 100%;
		line-height: 1.066666rem;
		font-size: 0.346666rem;
		margin-top: 0.48rem;
	}

	.time {
		height: 0.453333rem;
		right: 0.533333rem;
		top: 50%;
		transform: translateY(-50%);
		line-height: 0.453333rem;
		padding-left: 0.586666rem;
		font-size: 0.32rem;
		color: #fff;
	}

	.time>img {
		width: 0.373333rem;
		height: 0.373333rem;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.b_top {
		border-top: 0.013333rem solid #f1f1f1;
	}
</style>

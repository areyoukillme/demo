<template>
	<div class="fixbox" :class="isIphoneX?'isipx':''">
		<div class="bigbox" :class="isIphoneX?'isipx':''">
			<div class="topbox">
				<div class="newtop f_pr">
					<div class='icon fpa' @click='_back'>
						<img src='../../assets/navbar_icon.png' />
					</div>
					<img class="font" src="../../assets/Homefont.png" alt="">
					<div class="cartbox f_pa">
						<div class="f_pr">
							<img src="../../assets/Homecart.png" class="cart f_pa" @click.stop="gocart" alt="">
							
						</div>
					</div>
					<div class="noticebox f_pa">
						<div class="f_pr">
							<img src="../../assets/Homemore.png" class="cart f_pa" alt="">
							
						</div>
					</div>
					<div class="newsbox f_pa">
						<ul>
							<li><img src="" alt=""><span></span></li>
							<li><img src="" alt=""><span></span></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		getcartnum,
	} from '../../service/getData.js'
	export default {
		props: {
			type: ''
		},
		data() {
			return {
				isIphoneX: '',
				cartNum: '',
				tokenId: '',
				deviceType: ''
			}
		},
		created() {
			this.deviceType = this.$route.query.deviceType;
			this.tokenId = this.$route.query.tokenId;
			this.judgeIphoneX();
			this.getcartnum()
		},
		methods: {
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			
			gocart() {

				this.$router.push({
					path: 'cartlist'
				})

			},
			_back() {
			
				if (this.deviceType == 'ios') {
					this.$bridge.callhandler('iosback', {
						'go': 'true'
					});
					return;
				}
				if (this.deviceType == 'wx') {
					this.wx.miniProgram.navigateBack({
						delta: 1
					});
				}
				switch (this.type) {
					case 'iosback':
						this.$bridge.callhandler('iosback', {
							'go': 'true'
						});
						break;
					case 'backpay':
						this.$bridge.callhandler('backpay');
						break;
					case 'addressback':
						this.$bridge.callhandler('addressback');
						break;
					case 'orderBack':
						this.$bridge.callhandler('orderBack');
						break;
					case 'twoback':
						this.$router.go(-2);
						break;
					default:
						this.$router.back();
				
						break;
				}

			}

		},
	}
</script>

<style scoped lang="scss">
	.newsbox{
		width:3.466666rem;
		height: 2.133333rem;
		top:1.333333rem;
		right:0.133333rem;
		z-index:100;
		box-shadow: #ccc;
	}
	.icon {
		width: 30%;
		height: 100%;
		top: 0;
		left: 0;
		text-align: left;
		padding-left: 0.266666rem;

		img {
			width: 0.56rem;
			height: 0.56rem;
		}
	}

	.fixbox {
		width: 100%;
		height: 1.706666rem;
		box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
		z-index: 10000000;
		background: #fff;
	}

	.fixbox.isipx {
		height: 2.4rem;
		z-index: 10000000;
	}

	.bigbox {
		width: 100%;
		position: fixed;
		top: 0;
		background: #fff;
		padding-top: 0.3rem;
	}

	.bigbox.isipx {
		padding-top: 1.066666rem;
	}

	.newtop {
		background: #fff;
		width: 100%;
		text-align: center;
		font-family: FZZhengHeiS-DB-GB-;
		font-size: 0.533333rem;
		color: #2ACC85;
		height: 1.333333rem;
		line-height: 1.333333rem;

		.font {
			width: 2.133333rem;
			height: 0.653333rem;
			position: absolute;
			top: 0.373333rem;
			left: 3.933333rem
		}

		.cartbox {
			width: 0.56rem;
			height: 0.56rem;
			top: 0.386666rem;
			right: 1.853333rem;

			.cart {
				top: 0;
				left: 0;
				width: 0.56rem;
				height: 0.56rem;
			}

			.cartNum {
				position: absolute;
				background: #FF5555;
				border-radius: 1.333333rem;
				left: 0.24rem;
				top: -0.066666rem;
				padding: 0 0.133333rem;
				font-family: PingFangSC-Semibold;
				font-size: 0.266666rem;
				color: #FFFFFF;
				line-height: 0.24rem;

				.jia {
					font-size: 0.16rem
				}
			}
		}

		.noticebox {
			width: 0.56rem;
			height: 0.56rem;
			top: 0.386666rem;
			right: 0.386666rem;

			.cart {
				top: 0;
				left: 0;
				width: 0.56rem;
				height: 0.56rem;
			}

			.cartNum {
				position: absolute;
				background: #FF5555;
				border-radius: 100px;
				left: 0.24rem;
				top: -0.066666rem;
				padding: 0 0.133333rem;
				font-family: PingFangSC-Semibold;
				font-size: 0.266666rem;
				color: #FFFFFF;
				line-height: 0.26rem;
			}
		}

	}
</style>

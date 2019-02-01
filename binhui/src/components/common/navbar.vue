<template>
	<div class="navbar_content" :class="isIphoneX?'iphoneX':''" v-if="havetop">
		<div class='navbar_box  ellipsis' :class='isSE?"se":""'>
			<span class="f_db text f_pr">
				<slot></slot>
			</span>
			<button class='icon' id='returnPre' style="cursor: pointer" @click.stop="_back">
				<img src='../../assets/navbar_icon.png' />
			</button>
		</div>

	</div>
</template>

<script>
	export default {
		props: {
			type: '',
		},
		computed: {
			havetop() {
				return this.$store.state.havetop;
			}
		},
		created() {
			if (this.$route.query.havetop) {
				if (this.$route.query.havetop == 'hide') {
					this.$store.state.havetop = false;
				}
			}
			this.judgeIphoneX()
			this.deviceType = this.$route.query.deviceType
		},
		mounted(){
			
		},
		data() {
			return {
				isIphoneX: '',
				isSE: '',
				content: '',
				deviceType: '',

			}
		},
		methods: {
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			_back() {
				if(this.type=="addressback"){
					this.$bridge.callhandler('addressback')
				}
				if(this.type=="iosback"){
					this.$bridge.callhandler('iosback', {
						'go': 'true'
					});
					return;
				}
				if(this.type=="backpay"){
					this.$bridge.callhandler('backpay');
					return
				}
				
				if(this.type=='orderBack'){
					this.$bridge.callhandler('orderBack')
				}
				if(this.type=="twoback"){
					this.$router.go(-2)
				}
				if(this.deviceType){
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
					if (this.deviceType=='android'){
						window.postMessage('androidback')
					}
				}else if(this.type == 'createOrederBack'){
					this.$router.push({
	                    path: './game'
	                }) 
				}else if(this.type == 'chestPrizeList'){
					this.$router.push({
	                    path: './chestPrize'
	                })
				}else{
					this.$router.go(-1)
				}
			}
		},
	}
</script>

<style scoped>
	.navbar_content {
		height: 1.706666rem;
		width: 100%;
		background: #FFFFFF;
		z-index: 1000;
	}
	.text{
		height: 1.173333rem;
	}
	.navbar_box {
		width: 100%;
		padding: 0 2.933333rem;
		height: 1.706666rem;
		padding-top: 0.533333rem;
		line-height: 1.173333rem;
		font-size: 0.453333rem;
		color: #030303;
		text-align: center;
		z-index: 999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-bottom: 1px solid #bfbfbf;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
		top: 0;
		background: #fff;
		.text{
			
		}
	}

	.iphoneX {
		height: 2.32rem;
		background: #fff;
		z-index: 999;
	}

	.iphoneX .navbar_box {
		background: #fff;
		height: 2.32rem;
		padding-top: 1.066666rem;
		z-index: 999;
	}


	.flex {
		height: 1.866666rem;
	}

	.flex .navbar_box {
		height: 1.866666rem;
		line-height: 1.52rem;
	}

	.navbar_box>.icon {
		width: 2.666666rem;
		height: 1.173333rem;
		bottom: 0;
		left: 0;
		position: absolute;
		z-index: 1000;
	}

	.iphoneX .navbar_box>.icon {
		bottom: 0.08rem;
	}

	.navbar_box>.icon>img {
		width: 0.48rem;
		height: 0.48rem;
		position: absolute;
		left: 0.266666rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.se {
		font-size: 0.533333rem;
	}

	.shade {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 2.666666rem;
		z-index: 999;
	}
</style>

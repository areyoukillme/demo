<template>
	<div>

		<div ref='cart' class='cart' :class='showPulse?"pulse":""' @click.stop='_gocart'>
			<button class='f_db' v-if="cartNum>0">{{cartNum}}</button>
			<img :src="imgBaseUrl+'sale_cart.png'"></img>
		</div>

		<!--小球-->
		<div v-for="ball in balls">
			<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
				<div :class="ballclass" v-show="ball.show">
					<div class="inner inner-hook">
						<img :src="cartProImg" alt="">
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
	import {
		imgBaseUrl
	} from '../../config/env.js';
	import {
		getcartnum
	} from '../../service/getData.js'
	import _ from 'lodash'
	export default {
		props: {
			left: '',
			top: '',
			cartProImg: ''
		},
		data() {
			return {
				cartNum: '',
				showPulse: '',
				imgBaseUrl: imgBaseUrl,
				balls: [ //小球
					{
						show: false
					},
				],
				dropBalls: [],
				cartleft: '',
				carttop: '',
				tokenId: '',
				ballclass:'ball',
			}
		},
		created() {
			this.tokenId = this.$route.query.tokenId?this.$route.query.tokenId:'';
			this.getcartnum()
					
		},
		methods: {
			_gocart() {
				this.$bridge.callhandler('gocart')
			},
			drop: _.throttle(function(el) {
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			}, 600),
			beforeDrop: _.throttle(function(el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let x = this.left - this.cartleft;
						let y = -(this.carttop - this.top);
						if(y>0){this.ballclass='Ball'}
						else{this.ballclass='ball'}
						//获取y轴移动距离，方向向下为负
						el.style.display = '';
						el.style.webkitTransform = 'translateY(' + y + 'px)'; //translateY
						el.style.transform = 'translateY(' + y + 'px)';
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = 'translateX(' + x + 'px)';
						inner.style.transform = 'translateX(' + x + 'px)';
					}
				}
			}, 600),

			dropping(el, done) { /*重置小球数量  样式重置*/
				this.showPulse = false;
				let rf = el.offsetHeight;
				el.style.webkitTransform = 'translate3d(0,0,0)';
				el.style.transform = 'translate3d(0,0,0)';
				let inner = el.getElementsByClassName('inner-hook')[0];
				inner.style.webkitTransform = 'translate3d(0,0,0)';
				inner.style.transform = 'translate3d(0,0,0)';
				el.addEventListener('transitionend', done);

			},
			afterDrop(el) { /*初始化小球*/
				this.showPulse = true;
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}

			},
			//删除或增加商品
			addOrdel(type) {
				if (type == 1) {
					this.cartNum++
				}
				if (type == 0 && this.cartNum > 0) {
					this.cartNum--
				}
			},
			async getcartnum() {
				let res = await getcartnum(this.tokenId);
				if (res.code == 0) {
					this.cartNum = res.result
					console.log(this.cartNum)
				} else {
					this.$messagebox({
						title: '温馨提示',
						message: '太长时间没有登录了哦',
						showCancelButton: true,
						confirmButtonText: '去登录',
						canselButtonText: '取消'
					}).then(action => {
						if (action == 'confirm') {
							this.$bridge.callhandler("gologin")
						} else {
							this.$bridge.callhandler("iosback")
						}
					})
				}
			},
		},
		mounted() {
			this.carttop = this.$refs.cart.getBoundingClientRect().bottom;
			this.cartleft = this.$refs.cart.getBoundingClientRect().left;			
		}
	}
</script>

<style scoped lang="scss">
	.cart {
		width: 1.093333rem;
		height: 1.093333rem;
		position: fixed;
		bottom: 2.666666rem;
		left: 0.266666rem;
		border-radius: 50%;
		z-index: 501;
		background: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-direction: column;
		/* box-shadow: 0 0 8px #999; */
		transition: all 0.6s;
	}


	.ball {
		position: fixed;
		left: 0.266666rem;
		bottom: 2.666666rem;
		z-index: 2000;
		transition: all 0.6s cubic-bezier(0.35,-0.64,0.89,0.33);
		/*贝塞尔曲线*/
	}
	.Ball{
		position: fixed;
		left: 0.266666rem;
		bottom: 2.666666rem;
		z-index: 2000;
		transition: all 0.6s cubic-bezier(0,.62,.68,1.92);
	}
	.inner {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		border: 1px solid #bf0000;
		background: #fff;
		transition: all 0.6s linear;
	}

	.inner img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.cart img {
		width: 1.1rem;
		height: 1.1rem;
	}

	.cart p {
		display: block;
		font-size: 0.266666rem;
		color: #ff5a00;
		line-height: 0.346666rem;
		position: relative;
		top: -0.08rem;
	}

	.slide {
		bottom: 2.666666rem;
		transition: all 0.5s;
	}

	.cart button {
		min-width: 0.4rem;
		padding: 0 0.053333rem;
		height: 0.4rem;
		background: #fff;
		line-height: 0.4rem;
		border-radius: 0.2rem;
		border: 1px solid #bf0000;
		font-size: 0.32rem;
		color: #bf0000;
		right: 0;
		top: -0.106666rem;
		z-index: 52;
		position: absolute;
	}

	@-webkit-keyframes pulse {
		from {
			-webkit-transform: scale3d(1, 1, 1);
			transform: scale3d(1, 1, 1);
		}

		50% {
			-webkit-transform: scale3d(1.1, 1.1, 1.1);
			transform: scale3d(1.1, 1.1, 1.1);
		}

		to {
			-webkit-transform: scale3d(1, 1, 1);
			transform: scale3d(1, 1, 1);
		}
	}

	@keyframes pulse {
		from {
			-webkit-transform: scale3d(1, 1, 1);
			transform: scale3d(1, 1, 1);
		}

		50% {
			-webkit-transform: scale3d(1.1, 1.1, 1.1);
			transform: scale3d(1.1, 1.1, 1.1);
		}

		to {
			-webkit-transform: scale3d(1, 1, 1);
			transform: scale3d(1, 1, 1);
		}
	}

	.pulse {
		animation: pulse 0.3s ease;
		-webkit-animation: pulse 0.3s ease;
	}
</style>

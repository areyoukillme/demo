<template>
	<div class="share_container">
		<!-- <navbar>答题偷菜</navbar> -->
		<div class="share_content">
			<div class="load">
				<div class="logo"><img :src="imgBaseUrl+'/logo@2x.png'" alt="" /></div>
				<div class="txt">
					<h1>下载APP体验在线耕种乐趣</h1>
					<div>滨惠智慧农场</div>
				</div>
				<div class="btn">立即打开</div>
			</div>

			<div class="friends">
				<!-- 别人 -->
				<div class="opacity" v-if="shareInfo.isYourself == 1">
					<div class="friend_content">
						<div class="txt">
							<p>差一点就开到宝箱啦！</p>
							<p>快来帮我<span>助力吧！</span></p>
						</div>
						<div class="head_img">
							<img :src="shareInfo.url" alt="" />
						</div>
					</div>
					<div class="collect_state">
						<div class="collect_btn" @click.stop='help()'>帮Ta助力</div>
					</div>
					<div class="last_state">
						<div class="collect_btn" @click.stop="location()">我也要玩</div>
					</div>
				</div>
				<!-- 自己 -->
				<div class="opacity" v-if="shareInfo.isYourself == 0">
					<div class="friend_content f_number">
						<h3>已有<span>{{shareInfo.url.length}}位</span>好友助力</h3>
						<ul v-if="shareInfo.url.length != 0">
							<li v-for="(item,index) in shareInfo.url">
								<div class="headerUrl_img">
									<img :src="item" alt="" />
								</div>
							</li>
							<li>
								<div class="headerUrl_img">
									<img src="../../assets/gameImg/add.png" alt="" />
								</div>
							</li>
						</ul>
						<ul v-if="shareInfo.url.length == 0">
							<li v-for="(item)  in arr">
								<div class="headerUrl_img">
									<img src="../../assets/gameImg/add.png" alt="" />
								</div>
							</li>
						</ul>
					</div>
					<div class="collect_state" v-if="shareInfo.isRevival == 1">
						<div class="collect_btn" @click="sendMessage">转发给好友</div>
						<p>还没有集齐哦！快转给好友吧！</p>
					</div>
					<div class="collect_state" v-if="shareInfo.isRevival == 0">
						<div class="collect_btn" @click="contin()">继续答题</div>
						<p>已经集齐啦！快去APP里继续答题吧！</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		Toast
	} from 'mint-ui';
	import navbar from '../../components/common/navbar.vue'
	import {
		imgBaseUrl,
		firstUrl
	} from '../../config/env.js';
	import {
		sharePage,
		helpT,
		getShare,
		// play
	} from '../../service/getData.js';
	export default {
		components: {
			navbar
		},
		data() {
			return {
				appid: '',
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				firstUrl: firstUrl, //域名
				tokenId: '',
				url: '',
				queTreId: '', //宝箱id
				unionid: '', //unionid
				headImgUrl: '', //头像
				shareInfo: {}, //数据
				arr: [{}, {}, {}]
			}
		},
		created() {
			this.url = window.location.href;
			this.queTreId = this.getQueryString('queTreId'); //获取Url中参数queTreId的值
			this.unionid = this.getQueryString('unionid'); //获取Url中参数unionid的值
			this.headImgUrl = this.getQueryString('headImgUrl'); //获取Url中参数头像的值
			this.getData();
		},
		methods: {
			//获取数据
			async getData() {
				let _this = this;
				let res = await sharePage(_this.queTreId, _this.unionid, _this.headImgUrl);
				if (res.code == 0) {
					_this.shareInfo = res;
					_this.flag = res.flag;
				} else if (res.code == 403) {
					Toast('此链接已过期~');
					return false;
				}
			},
			//点击帮Ta助力
			async help() {
				let _this = this;
				let res = await helpT(_this.queTreId, _this.unionid, _this.headImgUrl);
				if (res.code == 0) {
					Toast('成功帮他(她)助力~');
				} else if (res.code == 403) {
					Toast('亲，已经帮他(她)助力了~');
					return false;
				}
			},
			//点击转发好友
			share(){
				Toast('点击右上角就可以分享给好友了哦');
				this.sendMessage();
			},
			//点击继续答题
			contin() {
				this.$router.push({
					path: './game'
				})
			},
			//获取url后面的参数
			getQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			},
			//点击我也要玩
			async location() {
				this.$router.push({
					path: './bootLoad'
				})
			},
			//再分享接口
			async getD() {
				let _this = this;
				let res = await getShare(this.url);
				if (res.code == 0) {
					_this.appid = res.data.appid;
					_this.wx.config({
						debug: true,
						appId: res.data.appid,
						timestamp: res.data.timestamp,
						nonceStr: res.data.noncestr,
						signature: res.data.signature,
						jsApiList: ['onMenuShareAppMessage']
					});
				}
			},
			sendMessage() {
				let _this = this;
					WeixinJSBridge.on('menu:share:appmessage', function (argv) {
						WeixinJSBridge.invoke('sendAppMessage', {
							"appid": _this.appid,
							"img_url": _this.imgBaseUrl + 'chest@2x.png', // 分享图标,
							"img_width": "112",
							"img_height": "88",
							"link": _this.firstUrl + '/farm-activity/wechat/share/answer?queTreId=' + _this.queTreId, // 分享链接
							"desc": '快来体验智能农场吧~', // 分享描述
							"title": '答题偷菜', // 分享标题
						}, function(res) {
							Toast('分享成功~')
						})
					})
					
			}
		},
		mounted() {
			this.getD();
			let that=this;
			window.document.addEventListener('WeixinJSBridgeReady',()=>{
				that.sendMessage();
			})
		}
	}
</script>
<style scoped>
	@import "share.css";
</style>

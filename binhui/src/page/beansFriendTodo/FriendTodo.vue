<template>
	<div class="beans_container mine">
		<!-- 导航栏部分 -->
		<navbar>{{message}}</navbar>
		<div class="beans_content">
			<div class="nav word_color">{{beansNum}}
				<div><img :src="headUrl" alt="" /></div>
			</div>
			<div class="tree_img">
				<div class="tree_bg">
					<!-- <img src="https://bhmall.zhiyesoft.cn/mp_images/farm/treebg.png" alt="" /> -->
				</div>
				<ul class="ball_box" ref="ul">
					<li v-for="(item, index) in list" :style="{left:item.left+'px',top:item.top+'px'}" @click="pickZj(item.ubeanId)">
						<div><img :src="imgBaseUrl+'/abeans.png'" alt="" /></div>
						<p>{{item.beanMoney}}</p>
					</li>
				</ul>
				<div class="opter">
					<div class="opter_l"></div>
					<ul class="opter_r">
						<li>
							<div @click="goNext($event,'index')">
								<img :src="imgBaseUrl+'/search.png'" alt="" />
							</div>
						</li>
						<li @click="sneak">
							<div>
								<img :src="imgBaseUrl+'/sneak.png'" alt="" />
							</div>
						</li>
						<li @click="exchange">
							<div>
								<img :src="imgBaseUrl +'/dui.png'" alt="" />
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="all_con">
				<!-- 好友动态 -->
				<div class="friend_todo">
					<p class="friend">滨惠豆动态</p>
					<ul>
						<li v-if="trendsList.length > 0" v-for="(item) in trendsList">
							<div class="friend_name">
								<div class="img"><img :src="item.handerImage" alt="" /></div>
								<p>{{item.userName}}</p>
								<div><span>摘取</span><span>　{{item.beanMoney}}</span></div>
							</div>
							<div class="pick">
								<p>{{item.min}}分钟前</p>
							</div>
						</li>
					</ul>
					<p class="more" @click="loadMore">{{loadmore}}</p>
				</div>
				<!-- 每日任务 -->
				<div class="every_day">
					<p class="friend">每日任务</p>
					<div class="li">
						<div class="img"><img :src="imgBaseUrl+'/friends.png'" alt="" /></div>
						<div class="txt">
							<p>发农友圈</p>
							<p>可获得{{everyDayState.momentCount}}个豆豆</p>
						</div>
						<div class="list_r">
							<div class="completed btn" v-if="everyDayState.moment">已完成</div>
							<div class="friends_btn btn" v-else @click="goNext($event,'moment',false)" data-type="moment">去完成</div>
						</div>
					</div>
					<div class="li">
						<div class="img"><img :src="imgBaseUrl+'/cart.png'" alt="" /></div>
						<div class="txt">
							<p>购买商品确认收货</p>
							<p>根据购物金额，可获得豆豆</p>
						</div>
						<div class="list_r">
							<div class="completed btn" v-if="everyDayState.receipt">已完成</div>
							<div class="cart_btn btn" v-else @click="goNext($event,'receipt',false)" data-type="receipt">去完成</div>
						</div>
					</div>
					<div class="li">
						<div class="img"><img :src="imgBaseUrl+'/weixin.png'" alt="" /></div>
						<div class="txt">
							<p>分享智慧农场到微信好友</p>
							<p>分享成功可获得{{everyDayState.shareCount}}个豆豆，</p>
						</div>
						<div class="list_r">
							<div class="completed btn" v-if="everyDayState.share">已完成</div>
							<div class="weixin_btn btn" v-else @click="goNext($event,'share',true)" data-type="share">去完成</div>
						</div>
					</div>
					<div class="li">
						<div class="img"><img :src="imgBaseUrl+'/regi.png'" alt="" /></div>
						<div class="txt">
							<p>微信好友注册</p>
							<p>分享到微信后，好友注册可获得{{everyDayState.registerCount}}个豆豆</p>
						</div>
						<div class="list_r">
							<div class="completed btn" v-if="everyDayState.register">已完成</div>
							<div class="regis_btn btn" v-else @click="goNext($event,'register',true)" data-type="register">去完成</div>
						</div>
					</div>
					<div class="li">
						<div class="img"><img :src="imgBaseUrl+'/talk.png'" alt="" /></div>
						<div class="txt">
							<p>每天聊天</p>
							<p>每天进行聊天，可获得{{everyDayState.chatCount}}个豆豆</p>
						</div>
						<div class="list_r">
							<div class="completed btn" v-if="everyDayState.chat">已完成</div>
							<div class="talk_btn btn" v-else @click="goNext($event,'chat',false)" data-type="chat">去完成</div>
						</div>
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
		imgBaseUrl
	} from '../../config/env.js';
	import {
		beansList,
		friendsList,
		trendsList,
		pickzjbeans,
		beansMoney,
		everyDayTask,
		newbeans
	} from '../../service/getData.js';
	export default {
		components: {
			navbar
		},
		data() {
			return {
				message: '摘豆游戏',
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				headUrl: '', //头像
				beansNum: '', //豆豆数量
				userId: '', //id
				friendUserId: '', //好友id
				page: '1', //页码
				limit: '10', //每页数量
				list: [], //豆豆列表数据
				trendsList: [], //动态列表
				everyDayState: {}, // 判断每日任务的状态
				loadmore: '展开查看更多',
				arr: [], //传给后台的参数对象
				pWidth: 0, //屏幕宽度
				pHeight: 0, //屏幕高度
				divWidth: 90, //div宽度
				divHeight: 100, //div高度
				maxWidth: 0, //最大宽度
				maxHeight: 0, //最大高度
				divLeft: '',
				divTop: '',
				dataArray: new Array(),
				flag: false,
				tokenId: '',
				deviceType: ''
			}
		},

		created() {
			this.tokenId = this.$route.query.tokenId;
			this.deviceType = this.$route.query.deviceType;
			this.getData();
			this.getTrend();
			this.beansMoney();
			this.getEveryDay();
		},
		methods: {
			random(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			},
			//获取豆豆数据
			async getData() {
				let res = await beansList(this.tokenId);
				if (res.code == 0) {
					res.beans.forEach((item) => {
						console.log(item)
						item.left = this.random(0, 7) * this.maxWidth / 8 + this.random(0, 70)
						item.top = this.random(0, 6) * this.maxHeight / 7 + this.random(0, 100)
					})
					this.list = res.beans;
					console.log(this.list)
				}
			},
			//总金额
			async beansMoney() {
				let res = await beansMoney(this.tokenId);
				this.headUrl = res.handerImage;
				this.beansNum = res.beanMoney;
				this.userId = res.userId;
			},
			//动态列表
			async getTrend() {
				let _this = this;
				let res = await trendsList(1, this.limit, this.tokenId);
				if (res.code == 0) {
					if (res.page.list == 0) _this.loadmore = '没有好友动态~';
					if (res.page.totalCount > 0 && res.page.list.length < 10) {
						_this.loadmore = '没有更多数据了~';
					}
					_this.trendsList = res.page.list;
					res.page.list.forEach((data) => {
						_this.$set(data, 'min', this.formatDuring(data.beforeTime))
					})
				} else {
					Toast(res.msg);
					return false;
				}
			},
			//每日任务
			async getEveryDay() {
				let res = await everyDayTask(this.tokenId);
				if (res.code == 0) {
					this.everyDayState = res.taskStatus
				}
			},
			//点击偷取跳转
			async sneak() {
				let res = await friendsList(this.page, this.limit);
				if (res.code == 0) {
					if (res.page.list.length > 0) {
						this.friendUserId = res.page.list[0].friendUserId;
						this.$router.push({
							path: './beans',
							query: {
								friendUserId: this.friendUserId
							}
						})
					} else {
						Toast('暂无好友，请添加好友');
						return false;
					}
				}
			},
			//点击兑换跳转
			async exchange() {
				this.$router.push({
					path: './beansList',
				})
			},
			//摘取
			async pickZj(ubeanId) {
				let res = await pickzjbeans(String(ubeanId), '0');
				if (res.code == 0) {
					var newArr = this.list.filter(item => item.ubeanId != ubeanId)
					this.list = newArr;
					this.beansMoney();
				} else if (res.code == 403) {
					Toast('收取次数已上限');
					return false;
				} else {
					Toast(res.msg);
					return false;
				}
			},
			//将毫秒转换化分钟
			formatDuring(mss) {
				var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
				return minutes;
			},
			//跳转
			goNext(e, type, param) {
				let _this = this;
				let obj = {
					url: 'pages/share/share?userId=' + _this.userId,
					img: _this.imgBaseUrl + 'Artboard2.png', //图片的地址 to do
					title: '滨惠农场', //标题
					content: '快来体验智能农场吧~', //要分享的内容
					types: 3
				}
				
				if (this.deviceType == 'wx' && param) {
					let that = this;
					this.wx.miniProgram.navigateTo({
						url: '../sharepage/sharepage?img=' + that.imgBaseUrl + 'Artboard2.png&title=滨惠农场&content=快来体验智能农场吧&types=3'
					})
				
				}
				else if (this.deviceType == "android" && param) {
					window.postMessage(JSON.stringify(obj))
				
				}
				else if (this.deviceType = 'ios' && param) {
					console.log(111)
					this.$bridge.callhandler('shareGames', {
						types: type,
						obj: {
							"url": 'pages/share/share?userId=' + _this.userId,
							"img": _this.imgBaseUrl + 'Artboard2.png', //图片的地址 to do
							"title": '滨惠农场', //标题
							"content": '快来体验智能农场吧~', //要分享的内容
						}
					}, async function(res){ //刷新了
						if (res.shared == 1) {
							_this.getData();
							_this.getEveryDay();
						} else {
							Toast('分享失败!');
							return false;
						}
					})
				} else {
					console.log(222)
					this.$bridge.callhandler('shareGames', {
						types: type
					},async function(res){
						Toast('回调')
						_this.getData();
						_this.getEveryDay();
					})
				}



			},
			//加载更多数据
			async loadMore() {
				let _this = this;
				_this.page++;
				let res = await trendsList(_this.page, _this.limit, _this.tokenId);
				if (res.code == 0) {
					let arr = [..._this.trendsList, ...res.page.list];
					arr.forEach((data) => {
						this.$set(data, 'min', this.formatDuring(data.beforeTime))
					})
					this.trendsList = arr;
					if (_this.page == res.page.totalPage) {
						_this.loadmore = '没有更多数据了~';
						return false;
					}
				}
			},
			//刷新豆豆
			async newbeans() {
				let that = this;
				let res = await newbeans(this.tokenId)
				if (res.code == 0) {
					that.getData()
					that.getEveryDay()
				}
			}
		},
		mounted() {
			let that = this;
			this.maxHeight = this.$refs.ul.clientHeight;
			this.maxWidth = this.$refs.ul.clientWidth;
			console.log(this.maxHeight, this.maxWidth)
			window.document.addEventListener('message', function(e) {
				if (e.data == 'shared') {
					Toast('分享成功~')
					that.newbeans()
				}
				if (e.data == 'noinstall') {
					Toast('请先安装微信')
				}
				if (e.data == 'lose') {
					Toast('分享失败~');
				}
			})
			this.$bridge.registerhandler('refresh',function(){
				Toast('ios调js')
				that.getData()
				that.getEveryDay()
			})
		}
	}
</script>
<style scoped>
	@import "FriendTodo.css";
</style>

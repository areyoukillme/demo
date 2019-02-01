<template>
	<div class="game_container">
		<!-- 导航栏部分 -->
		<navbar>{{message}}</navbar>
		<!-- 内容部分 -->
		<div class="game_content">
			<div class="friends">好友助力剩余 {{reliveNum}} 次</div>
			<ul class="content_list">
				<li v-for="(item,index) in chestList" :key="index">
					<!-- 复活revive -->
					<div class="revive" v-if="revive">
						<div class="revive_btn" v-if="item.treStatus == 4" @click="Revive()">复活</div>
						<div class="revive_btn disabled" v-if="item.treStatus == 4 && reliveNum == 0">复活</div>
					</div>
					<div class="bgimg"><img :src="item.uri" alt="" /></div>
					<div class="txt">
						<div class="win">
							<div>答中即可获得</div>
							<div @click="showModel(item)">奖品</div>
						</div>
						<div>
							{{item.gamBox}}
						</div>
					</div>
					<div class="btn" v-if="item.treStatus == 3">挑战成功</div>
					<div class="btn" v-if="item.treStatus == 2" @click="goAnswer(index,item.queTreId)">开始答题</div>
					<div class="btn disabled" v-if="item.treStatus == 1">
						<img src="../../assets/gameImg/disable@2x.png" alt="">
					</div>
					<div class="disable_model" v-if="item.treStatus == 1"></div>
				</li>
			</ul>
			<!-- 题目 -->
			<div class="marsk" v-if='showChest'>
				<div class="subject">
					<div class="subject_content">
						<div class="title">
							<h3>{{question}}</h3>
							<ul v-if="type == 0">
								<li v-for="(item) in subject" @click="selected(chestId,queId,item.optionKey)">
									<span>{{item.optionKey}}</span>{{item.optionValue}}
								</li>
							</ul>
							<div class="input_num" v-else>
								<input type="text" vaule="" ref="input1" v-model="input1" />
								<div class="confim" @click="confim">
									<div>确定</div>
								</div>
							</div>
						</div>
						<div class="demo1-bg1 outer">{{remainingTime}}</div>
					</div>
				</div>
			</div>
			<!-- 回答正确 -->
			<div class="marsk" v-if='correctState'>
				<div class="subject">
					<div class="subject_content">
						<div class="correct">
							<h1>回答正确</h1>
							<div class="go" @click="continueAnswer(chestId)">继续挑战</div>
						</div>
						<div class="outer">
							<div class="check_right">
								<div class="check_img">
									<img :src="imgBaseUrl+'check@2x.png'" alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 回答错误  -->
			<div class="marsk" v-if='errorState'>
				<div class="subject">
					<div class="subject_content">
						<div class="error">
							<h1>很遗憾，回答错误</h1>
							<div>请好友助力复活</div>
							<ul>
								<li @click="shareGroup(0,firstUrl+'farm-activity/wechat/share/answer?queTreId='+reviveId,'error')">转发微信好友继续答题
									<span>{{friends.friendNum}}</span></li>
								<li @click="shareGroup(1,firstUrl+'farm-activity/wechat/share/answer?queTreId='+reviveId,'error')">转发朋友圈继续答题
									<span>{{friends.groupNum}}</span></li>
								<li class="cancel_btn" @click="errorCancle">取消</li>
							</ul>
						</div>
						<div class="outer">
							<div class="error_box">
								<div class="error_img">
									<img :src="imgBaseUrl +'/error@2x.png'" alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 除第1、2个宝箱前提示 -->
			<div class="marsk" v-if="beforeState">
				<div class="prompt">
					<div class="title">
						回答错误则只能获得<br>
						第 1个宝箱奖品
					</div>
					<div class="begin" @click="begin">开始答题</div>
					<div class="begin abandon" @click="getUp">放弃</div>
				</div>
			</div>

			<!-- 请求好友复活 reviveState-->
			<div class="marsk" v-if="reviveState">
				<div class="prompt">
					<div class="title">请好友助力复活</div>
					<div class="begin" @click="shareGroup(0,firstUrl+'farm-activity/wechat/share/answer?queTreId='+reviveId,'right')">转发微信好友继续答题
						<span>({{friends.friendNum}})</span></div>
					<div class="begin mtb" @click="shareGroup(1,firstUrl+'farm-activity/wechat/share/answer?queTreId='+reviveId,'right')">转发朋友圈继续答题
						<span>({{friends.groupNum}})</span></div>
					<div class="begin abandon" @click="shareCancle">取消</div>
				</div>
			</div>
		</div>
		<!-- 宝箱 -->
		<div class="Chest" @click="toChestPage">
			<img :src="imgBaseUrl+'chest@2x.png'" alt="" />
			<div class="chest_num">{{chestNum}}</div>
		</div>
		<!-- 奖品弹窗 -->
		<div class="marsk_model" v-if="model" @click="hideModel">
			<div class="model">
				<div class="j_img">
					<img :src="prList.uri" alt="" />
				</div>
				<p class="title">奖品包含：</p>
				<p class="content">{{prList.gamBox}}</p>
			</div>
		</div>
		<!-- 返回顶部 -->
		<gotop :showTop="showTop"></gotop>
	</div>
</template>
<script>
	import {
		Toast
	} from 'mint-ui';
	import gotop from '../../components/common/gotop.vue';
	import {
		imgBaseUrl,
		firstUrl
	} from '../../config/env.js';
	import navbar from '../../components/common/navbar.vue'
	import {
		gameList,
		beginAnswer,
		submitKey,
		rondomShareNo,
		nextAnswer,
		isRevival,
		revivalNew,
		shareFriends
	} from '../../service/getData.js';
	export default {
		components: {
			gotop,
			navbar
		},
		data() {
			return {
				message: '答题偷菜',
				showTop: false, //返回顶部
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				firstUrl: firstUrl, //域名
				revive: false, //控制复活状态
				reliveNum: '0', //好友助力数量
				chestId: '', //宝箱Id
				reviveId: '', //复活宝箱id
				queId: '', //题目Id
				chestNum: '', //宝箱数量
				chestList: [], // 宝箱列表、
				type: '', //答题类型
				showChest: false, //显示题目
				input1: '', //input的值 
				remainingTime: '', //时间倒计时
				correctState: false, //回答正确
				errorState: false, //回答错误
				beforeState: false, //回答第二个宝箱之前
				model: false, //弹层
				prList: [], //奖品内容
				question: '', //题目
				subject: [], //答案
				reviveState: false, //请求好友复活
				boxIndex: '', //宝箱索引
				friends: {},
				tokenId: '',
				deviceType:this.$route.query.deviceType
			}
		},
		created() {
			this.tokenId = this.$route.query.tokenId;
			this.gameList();
		},
		methods: {
			//分享到朋友圈
			async shareFriends(){
				let res=await shareFriends(this.reviveId,this.tokenId)
			},
			//点击弹层让其隐藏
			hideModel() {
				this.model = false;
			},
			//点击奖品显示奖品内容
			showModel(item) {
				this.model = true;
				this.prList = item;
			},
			//获取宝箱列表
			async gameList() {
				let res = await gameList(this.tokenId);
				console.log(res)
				if (res.code == 0) {
					this.chestList = res.box;
					this.reliveNum = res.reliveNum;
					this.chestNum = res.boxGot;
					res.box.forEach((v1) => {
						if (v1.treStatus == 4) {
							this.reviveId = v1.queTreId;
							this.revive = true;
						}
					})
				}
			},
			//开始答题前判断如果是回答的宝箱不是第一个时，弹出提示框
			async goAnswer(index, id) {
				this.chestId = id;
				this.boxIndex = index;
				if (index != 0 && index != 1) {
					this.beforeState = !this.beforeState;
				} else {
					this.begin();
				}
			},
			//开始答题=>定时器开始
			async begin() {
				let res = await beginAnswer(String(this.chestId));
				if (res.code == 0) {
					if (this.boxIndex != 0 && this.boxIndex != 1) {
						this.beforeState = !this.beforeState;
						this.showChest = !this.showChest;
					} else {
						this.showChest = !this.showChest;
					}
					this.queId = res.question.queId;
					this.question = res.question.question;
					this.type = res.question.type;
					this.subject = res.question.gamQueOpts;
					this.remainingTime = res.remainingTime;
					this.countTime();
				} else {
					Toast(res.msg);
					return false;
				}
			},
			//放弃
			getUp() {
				this.beforeState = !this.beforeState;
			},
			//input输入值
			async confim() {
				//this.submitValue(this.chestId, this.queId, this.$refs.input1.value);
				let res = await submitKey(this.chestId,this.queId,this.$refs.input1.value);
				if(res.resCode == 0){
				    clearInterval(this.timer);
				    this.showChest = !this.showChest;
				    this.input1 = '';
				    this.gameList();
				}else if(res.resCode == 1){
				    this.showChest = !this.showChest;
				    this.correctState = !this.correctState;
				    this.input1 = '';
				}else if(res.resCode == 2){
				    this.showChest = !this.showChest;
				    this.errorState = !this.errorState;
				    this.input1 = '';
				    this.gameList();
				    let res = await isRevival(String(this.reviveId));
				    if(res.map.flag){
				        this.gameList();
				    }else{
				        this.friends = res.map;
				    }
				}
			},
			//单击选择答案并提交
			async selected(chestId, queId, optionKey) {
				//this.submitValue(chestId, queId, optionKey);
				let _this = this;
				let res = await submitKey(chestId,queId,optionKey);
				if(res.resCode == 0){ //完成
				    clearInterval(this.timer);
				    this.input1 = '';
				    this.showChest = !this.showChest; 
				    this.gameList();
				}else if(res.resCode == 1){//正确
				    this.input1 = '';
				    this.showChest = !this.showChest;
				    this.correctState = !this.correctState;
				}else if(res.resCode == 2){//错误
				    this.input1 = '';
				    this.gameList();
				    this.showChest = !this.showChest;
				    this.errorState = !this.errorState;
				    let res = await isRevival(String(this.reviveId));
				    if(res.map.flag){
				        _this.gameList();
				    }else{
				        _this.friends = res.map;
				    }
				}
			},
			//分享成功继续
			async sharesuccess(_this){
				let res = await isRevival(_this.reviveId+'');
				alert(JSON.stringify(res))
				if (res.map.flag) {
					alert(222)
					let res = await revivalNew();
					alert(JSON.stringify(res))
					if (res.code == 0) {
						Toast(status);
						if (status == 'error') _this.errorState = !_this.errorState;
						else _this.reviveState = !_this.reviveState;
						_this.gameList();
					}
				} else {
					_this.friends = res.map;
				}
			},
			//继续挑战
			async continueAnswer(id) {
				let res = await nextAnswer(String(id));
				console.log(res)
				if (res.code == 0) {
					this.correctState = !this.correctState;
					this.showChest = !this.showChest;
					this.question = res.question.question;
					this.queId = res.question.queId;
					this.type = res.question.type;
					this.subject = res.question.gamQueOpts;
					this.remainingTime = res.remainingTime;
					clearInterval(this.timer); //此处要先清除定时器，不然定时器不准确
					this.countTime();
				}
			},
			//回答错误取消
			errorCancle() {
				this.errorState = !this.errorState;
				this.gameList();
			},

			/***********************************复活***********************/
			//点击复活弹好友助力复活
			async Revive() {
				let _this = this;
				let res = await isRevival(String(this.reviveId));
				if (res.map.flag) {
					_this.revive = false;
					let res = await revivalNew();
					if (res.code == 0) _this.gameList();
				} else {
					this.revive = !this.revive;
					this.reviveState = !this.reviveState;
					this.friends = res.map;
				}
			},
			//转发微信好友或朋友圈
			shareGroup(type, url, status) {
				let _this = this;
				if(this.deviceType=="android"){
					let obj={
						url: url, //需要分享的Url
						img: _this.imgBaseUrl + 'chest@2x.png', //图片的地址
						title: '答题偷菜', //标题
						content: '快来体验智能农场吧~', //要分享的内容
						types: type, //类型 0分享到微信好友，1分享到朋友圈
					}
					window.postMessage(JSON.stringify(obj))
					return
				}
				this.$bridge.callhandler('shareGroup', {
					"url": url, //需要分享的Url
					"img": _this.imgBaseUrl + 'chest@2x.png', //图片的地址
					"title": '答题偷菜', //标题
					"content": '快来体验智能农场吧~', //要分享的内容
					"types": type, //类型 0分享到微信好友，1分享到朋友圈
					"queTreId": _this.reviveId
				}, async function(res) {
					if (res.shared == 1) {
						let res = await isRevival(String(_this.reviveId));
						if (res.map.flag) {
							let res = await revivalNew();
							if (res.code == 0) {
                                _this.revive = false;
								_this.errorState = false;
								_this.reviveState = false;
								_this.gameList();
							}
						} else {
							_this.friends = res.map;
						}
					} else {
						Toast('分享失败~');
						return false;
					}
				})
			},
			//点击(复活)取消
			shareCancle() {
				this.revive = true;
				this.reviveState = !this.reviveState;
			},
			//去宝箱奖品页面
			toChestPage() {
				this.$router.push({
					path: './chestPrize'
				})
			},
			//定时器方法
			async countTime() {
				this.timer = setInterval(async () => {
					if (this.remainingTime > 0) {
						this.remainingTime--;
					} else {
						clearInterval(this.timer);
						let res = await submitKey(this.chestId, this.queId, '');
						if (res.resCode == 0) {
							this.showChest = !this.showChest;
							this.input1 = '';
							this.gameList();
						} else if (res.resCode == 1) {
							this.showChest = !this.showChest;
							this.correctState = !this.correctState;
							this.input1 = '';
							this.gameList();
						} else if (res.resCode == 2) {
							this.showChest = !this.showChest;
							this.errorState = !this.errorState;
							this.input1 = '';
							this.gameList();
							let res = await isRevival(String(this.reviveId));
							if (res.map.flag) {
								this.gameList();
							} else {
								this.friends = res.map;
							}
						}
					}
				}, 1000)
			},
			//提交答案&&并判断是否复活
			// async submitValue(chest_d, que_id, key) {
			// 	let res = await submitKey(chest_d, que_id, key);
			// 	if (res.resCode == 0) {
			// 		this.showChest = !this.showChest;
			// 		this.input1 = '';
			// 		this.gameList();
			// 	} else if (res.resCode == 1) {
			// 		this.showChest = !this.showChest;
			// 		this.correctState = !this.correctState;
			// 		this.input1 = '';
			// 		this.gameList();
			// 	} else if (res.resCode == 2) {
			// 		this.showChest = !this.showChest;
			// 		this.errorState = !this.errorState;
			// 		this.input1 = '';
			// 		this.gameList();
			// 		let res = await isRevival(String(this.reviveId));
			// 		if (res.map.flag) {
			// 			this.gameList();
			// 		} else {
			// 			this.friends = res.map;
			// 		}
			// 	}
			// },
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
			window.addEventListener('scroll', this.handleScroll);
			let that=this;
			window.document.addEventListener('message',function(e){
				if(e.data=='shared'){
					Toast('分享成功~')
					that.shareFriends();
					that.sharesuccess(that)
				}
				if(e.data=='shared0'){
					Toast('分享成功~')
				}
				if(e.data=='noinstall'){
					Toast('请先安装微信')
				}
				if(e.data=='lose'){
					Toast('分享失败~')
				}
				
			})
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	}
</script>
<style scoped>
	@import "game.css";
</style>

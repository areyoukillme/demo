<template>
	<div>
		<navbar title="iosback">设置</navbar>
		<div class="set_content" :class="isSE?'se':''">
			<div class='header f_pr'>
				头像
				<div class='img f_pa'>
					<img class='fitimg tx' :src='userInfo.avatar'></img>
					<chooseimg :inputStyle="inputStyle" class="chooseimg f_pr" @getImg="getImg($event)"></chooseimg>
				</div>
			</div>
			<div class='phone'>
				手机号
				<span class='right'>{{userInfo.mobile}}</span>
			</div>
			<div class='name f_pr'>
				<span>昵称</span>
				<input ref="name" maxlength="8" placeholder='还是空的，快来取个高大上的名字吧' placeholder-class v-model.trim='userName' @change="changename" />
				<!-- <img src='../../imgs/set_right.png' class='set_right f_pa'></img> -->
			</div>
			<div class='f_pr code_item' @click.stop="showCode">
				<img class='code f_pa' src='../../assets/mineCode.png'></img>
				<img class='arrows f_pa' src='../../assets/mine_arrows.png'></img>
				二维码
			</div>
			<div class='phone' :class='!userInfo.rename?"":"farmnum"'>
				农友号
				<span class='right' v-if="!userInfo.rename">{{userInfo.account}}</span>
				<input v-if="userInfo.rename" maxlength="20" placeholder-class v-model='userInfo.account' @change="toSaveAccount(userInfo.account)" />
			</div>
			<div class='signature'>
				<span class='t_qm'>个性签名</span>
				<input maxlength="12" placeholder='个性签名' placeholder-class v-model='userInfo.signature' @change="changeqm(userInfo.signature)" />
			</div>
		</div>
		<div class="f_pr  code_item setPass " :class="isSE?'seSet':''" @click.stop="goaddlist">
			<img class='arrows f_pa' src='../../assets/mine_arrows.png'></img>
			地址管理
		</div>
	</div>
</template>

<script>
	import chooseimg from '../../components/common/chooseImg.vue'
	import navbar from '../../components/common/navbar.vue'
	import {
		userInfo,
		changeUserName,
		modifyaccount,
		modifyqm,
		modifytx,
	} from '../../service/getData.js'
	import fetchImage from '../../config/uploadImg.js'
	export default {
		components: {
			navbar,
			chooseimg
		},
		created() {
			this.tokenId = this.$route.query.tokenId
			this.getUserInfo()
		},
		data() {
			return {
				userInfo: {}, //用户信息
				header: '', //本地头像路径
				avatar: '', //云服务图像路径
				userName: '', //本地昵称
				signatureName: '', //个性签名
				isSE: false, //判断是否为SE
				flag: false,
				nyh: '',
				qm:'',
				isDisabled: false, //判断是否可以点击修改昵称
				tokenId: '',
				inputStyle: {
					position:'absolute',
					top:0,
					width: "1.2rem",
					height: "1.2rem"
				},
				webImg:'',
				timer:''
			}
		},
		mounted(){ 
		
		},
		destroyed(){
			clearTimeout(this.timer)
		},
		methods: {
			
			getImg($event){
				
				this.geturl($event)
					
			},
			async geturl(val){
				console.log(val)
				let _this = this;
	
				_this.getWebImg(val)
				
			},
			async getWebImg(img){
				console.log(img)
				this.webImg=await fetchImage(img,this.tokenId,this)
				if(this.webImg){
					this.changetx(this.webImg[0])
				}
			},
			async changetx(val){
				let res=await modifytx(val);
				if(res.code==0){
					this.userInfo.avatar=this.webImg[0]
					this.$toast({
						message: '修改头像成功',
						position: 'center',
						duration: 1500
					});
				}
			},
			async getUserInfo() {
				let res = await userInfo(this.tokenId)
				if (res.code == 0) {
					this.userInfo = res.data
					this.userName = res.data.userName
					this.nyh = res.data.account;
					this.qm=res.data.signature;
				}
			},
			changename() {
				if (!this.userName) {
					this.$toast({
						message: '昵称不能为空',
						position: 'center',
						duration: 1500
					});
					this.userName = this.userInfo.userName

				} else {
					this.changeUserName()
				}
			},
			async changeUserName() {
				let res = await changeUserName(this.userName)
				if (res.code == 0) {
					this.$toast({
						message: '修改昵称成功',
						position: 'center',
						duration: 1500
					});
				}
			},
			showCode() {
				this.$router.push({
					path: 'mycode'
				})
			},
			goaddlist() {
				this.$router.push({
					path: 'myadd',
					query: {
						tokenId: this.tokenId
					}
				})
			},
			async modifyqm(){
				let res=await modifyqm(this.userInfo.signature);
				if(res.code==0){
					this.$toast({
						message: '修改个性签名成功',
						position: 'center',
						duration: 1500
					});
				}
			},
			
			async modifyaccount(){
				let res=await modifyaccount(this.userInfo.account);
				if(res.code==0){
					this.userInfo.rename=false;
					this.$toast({
						message: '修改农友号成功',
						position: 'center',
						duration: 1500
					});
				}
			},
			//修改签名
			changeqm(val){
				if(!val){
					this.$toast({
						message: '签名不能为空',
						position: 'center',
						duration: 1500
					});
					this.userInfo.signature=this.qm;
					
				}else{
					this.modifyqm()
				}
			},
			//修改农友号
			toSaveAccount(val) {
				if (!val) {
					this.$toast({
						message: '农友号不能为空',
						position: 'center',
						duration: 1500
					});
					this.flag = false
					this.userInfo.account = this.nyh;

				} else if (val == this.nyh) {
					//弹框时禁止操作其他事件
					this.flag = false;
					return
				} else if (!val.match(/^[a-zA-Z][a-zA-Z0-9]{6,19}$/) || val.length < 6) {
					this.$toast({
						message: '农友号为以字母开头由数字或字母组成的6~20位长度的字符串',
						position: 'center',
						duration: 1500
					});
					this.flag = false;
					this.userInfo.account = this.nyh;
				} else {
					this.$messagebox.confirm('农友号只能修改一次，确定要修改吗?',{title:''}).then(action => {
						if (action == 'confirm') {
							this.modifyaccount()	
						} else {
							return
						}
					})
				}
			},
		},
	}
</script>

<style scoped lang="scss">
	.chooseimg{
		width: 100%;
		height: 100%;
		input{display: block;width: 1.2rem;height: 1.2rem;}
	}
	.set_content {
		background: #fff;
		width: 9.733333rem;
		padding: 0 0.4rem;
		border-radius: 0.133333rem;
		margin: 0.266666rem auto;
	}

	.set_content>div {
		color: #333;
		font-size: 0.426666rem;
		font-weight: 600;
	}

	.header {
		height: 1.546666rem;
		line-height: 1.546666rem;
	}

	.phone {
		height: 1.253333rem;
		line-height: 1.173333rem;
		border-top: 0.013333rem solid #f1f1f1;
	}

	.name {
		width: 100%;
		height: 1.333333rem;
		line-height: 1.173333rem;
		display: flex;
		justify-content: left;
		align-items: center;
		border-bottom: 0.013333rem solid #f1f1f1;
		border-top: 0.013333rem solid #f1f1f1;
	}

	.img {
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 50%;
		right: 0.346666rem;
		top: 50%;
		transform: translateY(-50%);
		background: #d8d8d8;
		overflow: hidden;
		z-index: 100;
	}

	.phone>span {
		color: #c0c0c0;
		font-size: 0.373333rem;
		/* font-weight: 600; */
		line-height: 1.146666rem;
	}

	.name>span {
		color: #333;
		font-size: 0.426666rem;
		font-weight: 600;
		line-height: 1.173333rem;
	}

	.signature {
		width: 100%;
		height: 1.333333rem;
		line-height: 1.173333rem;
		display: flex;
		justify-content: left;
		align-items: center;
		border-top: 0.013333rem solid #f1f1f1;
	}

	.signature span {
		color: #333;
		font-size: 0.426666rem;
		font-weight: 600;
		line-height: 1.173333rem;

	}

	.signature>input {
		margin-left: 0.346666rem;
	}
	.tx{object-fit: cover;}
	input {
		width: 6.666666rem;
		height: 0.533333rem;
		font-size: 0.373333rem;
		line-height: 0.533333rem;
		color: #666;
		margin-left: 1.413333rem;
		text-align: right;
	}

	.input-placeholder {
		font-size: 0.373333rem;
		color: #666;
		line-height: 0.533333rem;
	}

	.set_right {
		width: 0.426666rem;
		height: 0.426666rem;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}

	.code_item {
		height: 1.173333rem;
		line-height: 1.173333rem;
		font-size: 0.426666rem;
		color: #333;
		/* font-weight: 600; */
	}

	.arrows {
		width: 0.573333rem;
		height: 0.573333rem;
		right: 0px;
		top: 50%;
		transform: translateY(-50%);
	}

	.code {
		width: 0.453333rem;
		height: 0.453333rem;
		right: 0.64rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.farmnum {
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.farmnum>input {
		width: 5.973333rem;
	}

	.setPass {
		width: 9.733333rem;
		padding: 0 0.4rem;
		margin: 0 auto;
		background: #fff;
		font-weight: 600;
		border-radius: 0.133333rem;
	}


	.setPass>image {
		right: 0.4rem;
	}

	/* iphoneSE */

	.se .set_content {
		background: #fff;
		width: 10rem;
		padding: 0 0.48rem;
	}

	.se>view {
		color: #000;
		font-size: 0.533333rem;
		font-weight: normal;
	}

	.se .header {
		height: 2.666666rem;
		line-height: 2.666666rem;
	}

	.se .phone,
	.seSet {
		height: 1.4rem;
		line-height: 1.4rem;
	}

	.se .name {
		width: 100%;
		height: 1.4rem;
		line-height: 1.4rem;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.se .img {
		width: 2.186666rem;
		height: 2.186666rem;
		border-radius: 50%;
		right: 0.4rem;
		top: 50%;
		transform: translateY(-50%);
		background: #d8d8d8;
		overflow: hidden;
	}

	.se .phone>text {
		color: #c0c0c0;
		font-size: 0.453333rem;
		/* font-weight: 600; */
		line-height: 1.373333rem;
	}

	.se .name>text {
		color: #333;
		font-size: 0.533333rem;
		line-height: 1.4rem;
		font-weight: normal;
	}

	.se input {
		width: 7.253333rem;
		height: 0.64rem;
		font-size: 0.453333rem;
		line-height: 0.64rem;
		color: #666;
		margin-left: 0.666666rem;
		text-align: right;
	}

	.se .input-placeholder {
		font-size: 0.453333rem;
		color: #666;
		line-height: 0.64rem;
	}

	.se .set_right {
		width: 0.506666rem;
		height: 0.506666rem;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}

	.se .code_item {
		height: 1.4rem;
		line-height: 1.4rem;
		font-size: 0.533333rem;
		color: #333;
		/* font-weight: 600; */
	}

	.se .arrows {
		width: 0.64rem;
		height: 0.64rem;
		right: -0.053333rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.se .code {
		width: 0.533333rem;
		height: 0.533333rem;
		right: 0.693333rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.se .farmnum>input {
		width: 6.666666rem;
	}



	.seSet {
		color: #000;
		font-size: 0.533333rem;
		font-weight: normal;
	}

	.t_qm {
		display: inline-block;
		width: 2.666666rem;
	}
</style>

<template>
	<div class="qkl-info">
		<div class="info-setting">
			<div class="setting-collect">
				<div class="collect-left">
					<span>1920</span>
					<span>453</span>
				</div>
				<div class="collect-right">
					<span>658</span>
					<span>20</span>
				</div>
			</div>
		</div>
		<div class="info-user">
			<div class="user-face">
				<img :src="userInfo.image" alt="">
				<!-- <img src="../../../../static/img/pd1.jpg" alt=""> -->
			</div>
			<div class="user-datum">
				<p class="datum-name">{{userInfo.userName}}</p>
				<p class="datum-introduce">
				{{userInfo.userDescription}}</p>
				<div class="datum-operation">
					<router-link to="upload">上传作品</router-link>	
					<!-- <router-link to="rightsCenter">申请维权</router-link> -->
				</div>	
			</div>
			<div class="user-nav">
				<ul>
					<li @click="selectTab(works)" :class="{active:current == works}"><span>我的作品</span></li>
					<li @click="selectTab(account)" :class="{active:current == account}"><span>账号管理</span></li> 
					<li><span>我的收藏</span></li>
					<li><span>维权记录</span></li>
					<li><span>交易记录</span></li>
					<!-- <li @click="selectTab(collect)" :class="{active:current == collect}"><span>我的收藏</span></li> -->
					
					<!-- <li @click="selectTab(safeguard)" :class="{active:current == safeguard}"><span>维权记录</span></li> -->
					<!-- <li @click="selectTab()"><span>交易记录</span></li> -->
				</ul>
			</div>
		</div>
		<div class="info-content">
			<div :is="current" keep-alive :userInfo="userInfo"></div>
		</div>
		
	</div>
</template>

<script> 
	import Works from "./works"
	import Collect from "./collect"
	import Safeguard from "./safeguard"
	import Account from "./account"
	import {getStorage,setStorage} from "../../../assets/cookie.js"
	export default{
		data(){
			return {
				current:"works",
				works:"works",
				collect:"collect",
				safeguard:"safeguard",
				account:"account",
				dialog:false,
				userInfo:"",
				userface:""
			}
		},
		components:{
			Works,
			Collect,
			Safeguard,
			Account
		},
		methods:{
			selectTab(name){
				this.current = name;
			},
			getUser(){
				var self = this;
				const data = {
					userId:getStorage("userId")
				}
				this.$post("getUser",data).then(data=>{
					self.userInfo = data.data;
					
					// self.userface = "http://192.168.0.125:3000/"+self.userInfo.image.substring(7);
				})
			},
			islogin(){
				if(getStorage("islogin") == "true"){	
				}else{
					this.$router.push({path:"/login"})
				}
			},
		},
		mounted(){
			this.getUser()
			this.islogin()

		},
		// computed:{
		// 	user(){
		// 		return this.userInfo
		// 	}
		// }

	}
</script>

<style scoped lang="scss">
	.qkl-info{
		width:100%;
		overflow:hidden;
	}
	.info-setting{
		height:550px;
		width:100%;
		background:url(../../../../static/images/user_bg.jpg) no-repeat;
		background-size:100% 100%;
		position:relative;
		.setting-collect{
			height:90px;
			width:1120px;
			position:absolute;
			bottom:0;
			left:20%;
			.collect-left,.collect-right{
				width:400px;
				height:100%;
				span{
					display:inline-block;
					width:200px;
					height:100%;
					line-height:45px;
					text-align:center;
					font-size:24px;
					color:#fff;
					float:left;
				}
				span:after{
					display:inline-block;
					content:"";
					width:100%;
					height:45px;
					text-align:center;
					line-height:45px;
				}
			}
			.collect-left{
				float:left;
				span:nth-child(1):after{
					content:"人气"
				}
				span:nth-child(2):after{
					content:"积分"
				}
			}
			.collect-right{
				float:right;
				span:nth-child(1):after{
					content:"关注"
				}
				span:nth-child(2):after{
					content:"粉丝"
				}
			}
		}

	}
	.info-user{
		height:290px;
		background:#fff;
		position:relative;
		.user-face{
			width:125px;
			height:125px;
			border:5px solid #fff;
			border-radius:50%;
			position:absolute;
			top: -70px;
			left: 46%;
			overflow:hidden;
			img{
				width:125px;
				height:125px;
			}
		}
		.user-datum{
			text-align:center;
			width:400px;
			height:170px;
			padding-top:70px;
			margin:0 auto;
			.datum-name{
				font-size:20px;
				font-weight:bold;
				line-height:50px;
			}
			.datum-introduce{
				color:#4d5256;
				height:60px;
			}
			.datum-operation{
				margin-top:10px;
				a{
					padding: 10px 36px;
					background:#0078ff;
					color:#fff;
					border-radius:4px;
				}
			}
		}
		.user-nav{
			width:700px;
			height:50px;
			margin:0 auto;
			ul{
				width:100%;
				height:100%;
				li{
					width:140px;
					height:50px;
					line-height:50px;
					float:left;
					text-align:center;
					font-size:14px;
					cursor: pointer;
					span{
						display:inline-block;
						height:48px;
					}
				}
				.active span{
					border-bottom:2px solid #0078ff;
				}
			}
		}
	}
	.info-content{
		width:100%;
		background:#eee;
		.content-works{
			width:1200px;
			margin:0 auto;
			padding:20px 0; 
			h3{
				font-weight:bold;
			}
		}
	}
</style>
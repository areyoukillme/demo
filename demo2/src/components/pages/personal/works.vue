<template>
	<div class="content-works">
		<h3>共上传<em>{{long}}</em>组作品</h3>
		<div class="works-show">
			<ul>
				<li v-for="item in data">
					<div class="works-cover">
						<img :src="item.cover | sum" alt="">
					</div>
					<div class="works-intro">
						<h4>{{item.name}}</h4>
						<p class="intro-height">区块高度:{{item.height | hash}}</p>
						<p>区块摘要:{{item.blockhash}}</p>
					</div>
					<div class="works-time">
						<span>{{item.userName}}</span>
						<router-link :to="{
						path: 'design', 
						query: {
							name: item.propertyId, 
						}}">查看作品详情</router-link>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import {getStorage,setStorage} from "../../../assets/cookie.js"
	export default{
		data(){
			return {
				data:"",
				long:""
			}
		},
		methods:{
			property(){
				let self = this;
				const data = {userId:getStorage("userId")}
				this.$post("getProperty",{userId:getStorage("userId")}).then(data=>{
					self.data = data.data;
					self.long = self.data.length
				})
			}
		},
		mounted(){
			this.property()
		}
	}
</script>
<style scoped lang="scss"> 
	.works-show{
		width:100%;
		padding-top:20px;
		ul{
			width:100%;
			height:800px;
			overflow:auto;
			li{
				width:265px;
				height:390px;
				float:left;
				border-radius:4px;
				overflow:hidden;
				margin-right:20px;
				margin-bottom:10px;
				background:#fff;
				.works-cover{
					width:100%;
					height:200px;
					img{
						width:100%;
						height:100%;
					}
				}
				.works-intro{
					height:139px;
					border-bottom:1px solid #eee;
					padding:0 10px;
					color:#b8b8b8;
					h4{
						font-size:14px;
						line-height:40px;
						color:#000;
					}
					.intro-height{
						line-height:30px;
					}
					p{
						word-break: break-all;
					}
				}
				.works-time{
					height:50px;
					line-height:50px;
					margin-right:25px;
					margin-left:15px;
					color:#999;
					span:first-child{
						float:left;
					}
					a{
						color:#0078ff;
						float:right;
					}
				}
			}
		}
	}
</style>
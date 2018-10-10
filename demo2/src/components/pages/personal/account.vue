<template>
	<div class="content-works">
		<div class="account-information">
			<p><span>个人资料</span></p>
			<div class="information-amend">
				<h4>基本资料</h4>
				<div class="amend-form">
					<div class="form-basic">
						<p><label class="basic-type">昵称</label><input type="text" class="basic-input" v-model="userInfo.userName"></p>
						<p><label class="basic-type" style="float:none">性别</label>
						<el-radio v-model="userInfo.gender" label="1">男</el-radio>
  						<el-radio v-model="userInfo.gender" label="2">女</el-radio></p>
  						<p><label class="basic-type">所在城市</label>
							<el-select v-model="sheng" placeholder="请选择" @change="choseProvince">
								<el-option
								v-for="item in province"
						        :key="item.id"
						        :label="item.value"
						        :value="item.id">
								</el-option>
							</el-select>
							<el-select v-model="shi" @change="choseCity" placeholder="市级地区">
								<el-option
								v-for="item in shi1"
								:key="item.id"
								:label="item.value"
								:value="item.id">
								</el-option>
							</el-select>
							<el-select v-model="qu" @change="choseBlock" placeholder="区级地区">
								<el-option
								v-for="item in qu1"
								:key="item.id"
								:label="item.value"
								:value="item.id">
								</el-option>
							</el-select>
  						</p>
  						<p><label class="basic-type">职业</label><input type="text" class="basic-input" v-model="userInfo.occupation"></p>
					</div>
					<div class="form-face">
						<div class="face-change">
							<img :src="userInfo.image"  alt="">
							<!-- <img :src="preview" v-if="preview" alt=""> -->
						</div>
						<p>
							<span>修改头像<input type="file" @change="getFile"></span>
						</p>
					</div>	
					<div class="form-selfdom">
						<p>
							<label class="basic-type">签名</label>

							<input type="text" class="basic-input" @input="signatureChange" v-model="userInfo.signature">
							<span >{{40 - signLength}}</span>
						</p>
						<p>
							<label class="basic-type">简介</label>
							<input type="text" class="basic-input" @input="descriptionChange" v-model="userInfo.userDescription">
							<span>{{200 - descriptionLength}}</span>
						</p>
					</div>
					<button class="form-save" @click="revamp">保存</button>
				</div>
			</div>
		</div>
		<div class="account-security">
			<p><span>账号安全</span></p>
			<div class="security-setting">
				<p>
					<label class="basic-type">实名认证</label>
					<span>什么是实名认证</span>
					<button @click="change(true,1)">认证</button>
				</p>
				<p>
					<label class="basic-type">手机号码</label>
					<span>13642658827</span>
					<button @click="change(true,2)">更换</button>
				</p>
				<p>
					<label class="basic-type">登陆密码</label>
					<span>密码为6-16个字符,由数字或英文组成</span>
					<button @click="change(true,3)">修改</button>
				</p>
			</div>
		</div>
		<div class="info-dialog" v-if="dialog == true">
			<div class="dialog-autonym" v-if="dialog == true,id == 1">
				<h2>实名认证</h2>
				<el-input placeholder="请输入身份证" v-model="input3">
					<template slot="prepend">身份证件</template>
				</el-input>
				<el-input placeholder="请输入姓名" v-model="input3">
					<template slot="prepend">真实姓名</template>
				</el-input>
				<p>您的个人信息仅用于实名认证</p>
				<el-button>确定</el-button>
			</div>
			<div class="dialog-phone" v-if="dialog == true,id == 2">
				<h2>更换手机</h2>
				<el-input placeholder="请输入手机号" v-model="input4">
					<template slot="prepend">原手机号</template>
				</el-input>
				<el-input placeholder="请修改手机号" v-model="input4">
					<template slot="prepend">新手机号</template>
				</el-input>
				<el-button>确定</el-button>
			</div>
			<div class="dialog-password" v-if="dialog == true,id == 3">
				<h2>修改密码</h2>
				<el-input placeholder="请输入密码" type="password" v-model="input4">
					<template slot="prepend">旧密码</template>
				</el-input>
				<el-input placeholder="请修改密码" type="password" v-model="input4">
					<template slot="prepend">新密码</template>
				</el-input>
				<el-button>确定</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import cityData from "../../../../static/json/map.json";
	import {getStorage,setStorage} from "../../../assets/cookie.js"
	export default {
		data(){
			return {
			    dialog:false,  
			    id:0,// 实名认证 更换手机 修改密码
			    city:[],
			    province:[],
			    polis:[],
      			block:[],
      			sheng:this.userInfo.city.split(",")[0],
      			shi:this.userInfo.city.split(",")[1],
      			qu:this.userInfo.city.split(",")[2],
      			shi1:[],
      			qu1:[],
      			// 城市选择
			    signLength:0,
			    descriptionLength:0,

			    preview:"",
			    face:"",
			    photos:false,
			}
		},
		methods:{
			change(value,id){
				this.dialog = value;
				this.id = id;
			},//弹窗切换
			signatureChange(){
				return this.signLength = this.userInfo.signature.length;
			},//签名字符数计算
			descriptionChange(){
				return this.descriptionLength = this.userInfo.userDescription.length;
			},//简介字符数计算
			revamp(){
				var self = this;
				const home = this.sheng+","+this.shi+","+this.qu;
				const data = {
					username:this.userInfo.userName,
					gender:this.userInfo.gender,
					userDescription:this.userInfo.userDescription,
					occupation:this.userInfo.occupation,
					signature:this.userInfo.signature,
					userId:12,
					city:home
				}
				this.$post("userEdition",data).then(data=>{
					if(data.status == 200){
						this.open("资料修改成功");

					}
				})
			},//修改个人资料
			open(message) {
			    this.$alert(message, '温馨提示', {
			    });
		    },//修改成功后 弹窗提醒
		    filtrate(){
		    	for(let i in cityData){
		    		let cityJson = {id:i,value:cityData[i]};
		    		this.city.push(cityJson);
		    	}
		    	for(let i in this.city){ //省
		    		if(this.city[i].id.match(/0000$/)){
		    			this.province.push({id:this.city[i].id,value:this.city[i].value,children:[]});
		    		}else if(this.city[i].id.match(/00$/)){ //市
		    			this.polis.push({id:this.city[i].id,value:this.city[i].value,children:[]})
		    		}else{ //区
		    			this.block.push(this.city[i])
		    		}
		    	}
		    	for(let i in this.province){
		    		for(let j in this.polis){
		    			if(this.province[i].id.slice(0,2) == this.polis[j].id.slice(0,2)){
		    				this.province[i].children.push(this.polis[j])
		    			}
		    		}
		    	}
		    	for(let i in this.polis){
		    		for(let l in this.block){
		    			if(this.polis[i].id.slice(0,4) == this.block[l].id.slice(0,4)){
		    				this.polis[i].children.push(this.block[l])
		    			}
		    		}
		    	}
		    },//解析地区json数据
		    choseProvince(e){
		    	for(let i in this.province){
		    		if(e == this.province[i].id){
		    			this.sheng = this.province[i].value;
		    			this.shi1 = this.province[i].children;
		    			this.shi = this.shi1[0].value;
		    			this.qu = this.shi1[0].children[0].value
		    		}
		    	}
		    },//选择省
		    choseCity:function(e) {
		        for (let i in this.polis) {
		          if (e === this.polis[i].id) {
		          	this.shi = this.polis[i].value
		            this.qu1 = this.polis[i].children
		           	this.qu = this.qu1[0].value;
		          }
		        }
	      	},//选择市
		    choseBlock(e){
		    	for(let i in this.block){
		    		if(e === this.block[i].id){
		    			this.qu = this.block[i].value
		    		}
		    	}

		    },//选择区
		    getFile (e) {
		    	let self = this;
		    	let params = new FormData();
		        var files = e.target.files[0]
		        if (!e || !window.FileReader) return  // 看支持不支持FileReader
		        let reader = new FileReader()
		        reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
		        reader.onloadend = function () {
					self.face = self.imgBase(this.result);
					params.append('image',self.face,"image/jpg");
					params.append("userId",getStorage("userId"));
					self.upFile(params).then(data=>{
						if(JSON.parse(data).status == 200){
							setStorage("face",JSON.parse(data).data);
							self.open("头像修改成功");
							self.$store.dispatch("setuser",JSON.parse(data).data);
							self.userInfo.image = self.$store.state.userInfo.face
						}
					})
		        }
		    },
		    upFile(json){
		    	var deferred = $.Deferred();
		    	$.ajax({
		    		url:"http://47.107.82.59:3000/uploadImg",
		    		type:"post",
		    		data:json,
		            contentType:false,
		            processData:false,
		            async:false,
		            mimeType:"multipart/form-data",
		            success:function(data){
		                deferred.resolve(data)
		            }
				})
				return deferred.promise()
		    },
			imgBase(base64Data) {
				var byteString;
				if(base64Data.split(',')[0].indexOf('base64') >= 0) {
					byteString = atob(base64Data.split(',')[1]);
				} else {
					byteString = unescape(base64Data.split(',')[1]);
				}
				var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
				var ia = new Uint8Array(byteString.length);
				for(var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ia], {
					type: mimeString
				});
			}
		},
		props:["userInfo"], //父组件传递过来的数据
		mounted(){
			this.filtrate();
		},
		computed:{
			filterSheng:{
				get:function(){
					return this.sheng = this.userInfo.city.split(",")[0]
				},
				set:function(value){
					this.sheng = value
				}
			},
			filterCity:{
				get:function(){
					return this.shi = this.userInfo.city.split(",")[1]
				},
				set:function(value){
					this.shi = value
				}
			},
			filterBlock:{
				get:function(){
					return this.qu = this.userInfo.city.split(",")[2]
				},
				set:function(value){
					this.qu = value
				}
			},		
		}
	}
</script>
<style scoped lang="scss">
	.account-information{
		height:650px;
		width:870px;
		padding:0 130px;
		background:#fff;
		border-radius:4px;
		margin:0 auto;
		>p{
			line-height:68px;
			border-bottom:1px solid #eee;
			padding-left:50px;
			span{
				display: inline-block;
			    width: 80px;
			    height: 67px;
			    text-align: center;
			    border-bottom: 2px solid #0078ff;
			    color:#0078ff;
			    font-size:16px;
			}
		}
	}
	.information-amend{
		padding:30px 0 0 50px;
		h4{
			font-size:14px;
		}
		.amend-form{
			width:800px;
			display:flex;
			flex-wrap:wrap;
			margin-top:10px;
			.basic-type{
				display:inline-block;
				height:40px;
				width:50px;
				line-height:40px;
				text-align:right;
				margin-right:20px;
				float:left;
			}
			.basic-input{
				width:330px;
				height:40px;
				background:#f4f4f4;
				border-radius:4px;
				padding-left:10px;
				float:left;
				vertical-align:top;
			}
			.form-basic{
				width:435px;
				height:210px;
				color:#999;
				>p{
					margin:10px 0;
					width:100%;
					height:40px;
				}
				.el-select{
					width:111px;
				}
			}
			.form-face{
				width:365px;
				height:210px;
				.face-change{
					width:125px;
					height:125px;
					border-radius:50%;
					margin:0 auto;
					overflow:hidden;
					position:relative;
					img{
						width:100%;
						height:100%;
					}
				}
				p{
					text-align:center;
					margin-top:10px;
					span{
						line-height:30px;
						color:#000;
						display:inline-block;
						width:80px;
						height:30px;
						position:relative;
						cursor:pointer;
						font-size:14px;
						background:#0078ff;
						color:#fff;
						border-radius:4px;
						input{
							font-size:0;
							width:100%;
							height:100%;
							position:absolute;
							top:0;
							left:0;
							opacity:0;
						}
					}
				}
			}
			.form-selfdom{
				width:100%;
				height:100px;
				color:#999;
				>p{
					margin:10px 0;
					width:100%;
					height:40px;
					position:relative;
					.basic-input{
						width:660px;
						padding-right:40px;
						color:#999;
					}
					span{
						position:absolute;
						top:0;
						right: 35px;
					    height: 40px;
					    line-height: 40px;
					}
				}
			}
			.form-save{
				width:120px;
				height:35px;
				background:#0078ff;
				text-align:center;
				line-height:35px;
				border-radius:4px;
				color:#fff;
				margin:80px auto;
			}
		}
	}
	.account-security{
		width:870px;
		height:300px;
		padding:0 130px;
		background:#fff;
		border-radius:4px;
		margin:20px auto 0 auto;
		>p{
			line-height:68px;
			border-bottom:1px solid #eee;
			padding-left:50px;
			span{
				display: inline-block;
			    width: 80px;
			    height: 67px;
			    text-align: center;
			    border-bottom: 2px solid #0078ff;
			    color:#0078ff;
			    font-size:16px;
			}
		}
		.security-setting{
			padding:30px;
			>p{
				width:100%;
				height:40px;
				margin:10px 0;
			}
			.basic-type{
				display:inline-block;
				height:40px;
				width:50px;
				line-height:40px;
				text-align:right;
				margin-right:20px;
				float:left;
			}
			span{
				display:inline-block;
				line-height:40px;
			}
			button{
				width:80px;
				height:30px;
				float:right;
				background:#0078ff;
				border-radius:4px;
				color:#fff;
				margin-top:5px;
			}
			.basic-input{
				width:330px;
				height:40px;
				background:#f4f4f4;
				border-radius:4px;
				padding-left:10px;
				float:left;
				vertical-align:top;
			}
		}
	}
	.info-dialog{
		width:100%;
		height:100%;
		background:rgba(0,0,0,.4);
		position:fixed;
		top:0;
		left:0;
		.dialog-autonym,.dialog-phone,.dialog-password{
			width:330px;
			height:360px;
			background:#fff;
			position:fixed;
			top:30%;
			left:40%;
			border-radius:4px;
			padding:0 35px;
			h2{
				line-height:79px;
				border-bottom:1px solid #eee;
				font-size:16px;
			}
			.el-input-group,p,.el-button{
				margin-top:15px;
			}
			.el-button{
				width:100%;
				background:#0078ff;
				color:#fff;
			}
		}
	}

</style>
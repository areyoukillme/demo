<template>
	<div class="qkl-login ">

		<div class="login-info qkl-info">
			<div class="login-title">
				<h2>HASH | 通行证</h2>
				<div><div></div></div>
				<p>加入Hash版权认证网，已有10000+设计师在这里维护版权</p>
			</div>
			<div class="infobox">
				<h3>登录<a href="#/register">立即注册</a></h3>
				
				<el-form :model="userInfo" ref="userInfo" :rules="rules">
                    <el-form-item prop="phone">
                        <el-input placeholder="请输入手机号/用户名/邮箱" v-model="userInfo.phone"><template slot="prepend"><i class="el-icon-edit"></i></template></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="请输入密码" type="password"  v-model="userInfo.password"><template slot="prepend"><i class="el-icon-edit-outline"></i></template></el-input>
                    </el-form-item>
                </el-form>
				<div>
					 <input type="checkbox" checked="checked"  @click="check">已阅读并同意网站用户协议
				</div>
				<div class="makecenter"><el-button type="primary" class="abutton" :disabled="disabled" @click="submitLogin">登录</el-button></div>  
                <div class="three">第三方登录</div>
                <div class="others"></div>
			</div>
		</div>
	</div>
</template>

<script>
  import {getStorage,setStorage} from "../../../assets/cookie.js"
  export default {
    data(){
    	return{
			disabled:false,
            islogin:"",
    		userInfo:{
                phone:"",
                password:""
            },
            rules:{
                password:[
                    {required:true,message:"请输入密码",trigger:"blur"},
                    {min:6,max:16,message:"密码长度在6-16位之间",trigger:"blur"}
                ]
            }
    	}
    },
    methods:{
		check(){this.disabled=!this.disabled},
		open() {
			this.$alert(this.islogin, '登录结果', {
				confirmButtonText: "确定",
				callback: action => {
		
				}
			})
		},	
    
		submitLogin(){
            let self = this;
            const data = {
                useremail:this.userInfo.phone,
                password:this.userInfo.password
            }
            this.$post("loginauth",data).then(data=>{
                if(data.status == 200){
                   setStorage("islogin","true")
                   setStorage("userId",data.data.userId) 
                   self.islogin="登录成功，2秒后返回主页"
                   self.open()
                   self.$store.dispatch('login',data.data.userId);
                   this.$post("getUser",{userId:getStorage("userId")}).then(data=>{
                   		setStorage("face",data.data.image.substring(7));
                   		setStorage("name",data.data.userName);
                   })
                   setTimeout(function(){window.location.href="./"},2000)
                }else if(data.status==403){
                    self.inlogin="账号或密码错误，请重新输入"
                    self.open()
                }
            }).catch(error=>{
                self.islogin="网络好像开小差了"
                self.open()
            })
         }
      }
  }
</script>

<style lang="scss" scoped>
	.qkl-login{background: url("../../../../static/images/reister.jpg");height: 1080px;}
	.login-title{padding:130px 130px 0px 130px;color:#fff;
		h2{padding-left:200px;}
		div{ div{width:30px;height: 30px;background: #fff;transform: rotate(40deg);margin: 20px auto}}
		p{width: 100%;text-align: center;}
	
	}
	.infobox{
	
		width:400px;padding:30px 25px;border:1px solid #ccc;border-radius: 5px;margin: 20px auto;background:#fff;box-sizing: border-box;
		h3{font-size:15px;height: 30px;border-bottom: 1px solid #ccc;a{font-size:12px;color:blue;float: right;}}
		div{margin-top:10px;}
        .makecenter{text-align: center;margin-top:30px;.abutton{width:100%;height: 100%;}}
        .three{text-align: center;margin:30px;}
        .others{background:url("../../../../static/images/sprite.png");width:320px; height: 60px;margin:0 auto;background-position: -57px -130px;}
	}
  .el-icon-edit{
      display:inline-block;
      width:22px;
      height:22px;
      background:url(../../../../static/images/qkl_icon.png) no-repeat -84px -266px;  
  }
  .el-icon-edit-outline{
      display:inline-block;
      width:22px;
      height:22px;
      background:url(../../../../static/images/qkl_icon.png) no-repeat -248px -267px;
  }
  .el-icon-edit-outline:before,.el-icon-edit:before{
      content:""
  }

</style>
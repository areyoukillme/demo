<template>
	<div class="qkl-register ">	
			<div class="infobox">
				<h3><i class="el-icon-star-on"></i></h3>
				<p>在xx网注册我的账户</p>
				<div class="phone">
					<input placeholder="用户名" v-model="userInfo.username">
				</div>
				<div class="password">
					<input placeholder="手机号码" v-model="userInfo.useremail">
				</div>
				<div class="password">
					<input placeholder="密码" type="password" v-model="userInfo.password">
				</div>
				<div class="agreet">
					 <input type="checkbox" checked="checked" @click="check">同意 <a>用户协议</a>
				</div>
				<div class="login"><button  @click="submitRegister">注册账号</button></div>  
				<h4>已有账户？</h4>
        		<h5>登录</h5> 
			</div>
			<div class="close"><i class="el-icon-circle-close-outline" @click="closechild"></i></div>
		
	</div>
</template>

<script>
import { getStorage, setStorage } from "../../../assets/cookie.js";
export default {
  data() {
    return {
      disabled: false,
      isregister: "",
      userInfo: {
        username: "",
        password: "",
        phone: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度在6-16位之间", trigger: "blur" }
        ],
        name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "注册账号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
	closechild(){
      this.$emit('childMethod');
    },  
    check() {
      this.disabled = !this.disabled;
    },
    open() {
      this.$alert(this.isregister, "注册结果", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    submitRegister() {
      let self = this;
      var params = {};
      params.useremail = self.userInfo.useremail;
      params.username = self.userInfo.username;
      params.password = self.userInfo.password;
      this.$post("registerauth", params)
        .then(function(data) {
          if (data.status == 200) {
            self.isregister = "注册成功,2秒后进入首页";
            self.open();
            self.$store.dispatch("login");
            setStorage("islogin", "true");
            setStorage("userId", data.data.userId);
            self
              .$post("getUser", { userId: getStorage("userId") })
              .then(data => {
                setStorage("face", data.data.image.substring(7));
                setStorage("name", data.data.userName);
                setTimeout(function() {
                  window.location.href = "./";
                }, 2000);
              });
          } else if (data.status == 403) {
            self.isregister = "注册失败，该账号已被注册";
            self.open();
          } else if (data.status == 402) {
            self.isregister = "密码错误,请重新输入";
            self.open();
          }
        })
        .catch(function(error) {
          self.isregister = "注册失败，请检查网络";
          self.open();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.qkl-register{width:600px;}
.infobox {
  box-sizing: border-box;
  width: 600px;
  padding: 30px 58px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  box-sizing: border-box;
  h3 {
    font-size: 46px;
    height: 46px;
    text-align: center;
    padding-top: 10px;
  }
  p {
    text-align: center;
    font-size: 28px;
    margin-top: 30px;
  }
  .phone {
    margin-top: 40px;
  }
  .password {
    margin-top: 16px;
  }
  .agreet{font-size:14px;input{width:16px;};margin-top:20px;a{color:blue;}}
  input {
    line-height: 52px;
    font-size: 18px;
    padding: 0 32px;
    background: #eee;
    border-radius: 4px;
    width: 418px;
  }
  .goregister {
    height: 14px;
    a {
      color: blue;
      font-size: 14px;
      float: right;
    }
    margin-top: 20px;
  }
  .login {
    margin: 25px 0;
    button {
      width: 100%;
      height: 52px;
      font-size: 18px;
      background: #0078ff;
      border-radius: 4px;
    }
  }
  h4 {
    margin-top: 24px;
    font-size: 14px;
    text-align: center;
  }
  h5 {
    margin-top: 10px;
    font-size: 14px;
    text-align: center;
	color: blue;
	cursor: pointer;
  }
}
.close {
  font-size: 52px;
  color: black;
  margin-top: 32px;
  text-align: center;
}
</style>
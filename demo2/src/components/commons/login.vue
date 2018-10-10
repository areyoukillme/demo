<template>
	
		<div id="login">	
			<div class="infobox">
				<h3><i ><img src="static/icons/da.png" alt=""></i></h3>
				<p>登录xx网账户</p>
				<div class="phone">
                    <input placeholder="输入手机号/用户名/邮箱" v-model="userInfo.phone" required/> 
                </div>
                <div class="password">
                    <input placeholder="输入密码" type="password"  v-model="userInfo.password" required/>
                </div>
				<div class="goregister">
                    <a href="/">忘记密码?</a>
				</div>
				<div class="login">
            <button  @click="submitLogin">登录</button>
        </div>
        <h4>还没有账户</h4>
        <h5 @click="change">注册</h5>  
			</div>
            <div class="close"><i class="el-icon-circle-close-outline" @click="closechild"></i></div>
        </div>
</template>

<script>
import { getStorage, setStorage } from "../../assets/cookie.js";
export default {
  data() {
    return {
      disabled: false,
      islogin: "",
      userInfo: {
        phone: "",
        password: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度在6-16位之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    change() {
      this.$emit("change");
    },
    closechild() {
      this.$emit("childMethod");
    },
    check() {
      this.disabled = !this.disabled;
    },
    open() {
      this.$alert(this.islogin, "登录结果", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },

    submitLogin() {
      console.log(111)
      
      let self = this;
      const data = {
        useremail: this.userInfo.phone,
        password: this.userInfo.password
      };
      this.$post("loginauth", data)
        .then(data => {
          if (data.status == 200) {
            setStorage("islogin", "true");
            setStorage("userId", data.data.userId);
            self.islogin = "登录成功";
            self.open();
            console.log(data)
            self.$store.dispatch("login", data.data.userId);
            this.$post("getUser", { userId: getStorage("userId") }).then(
              data => {
                setStorage("face", data.data.image.substring(7));
                setStorage("name", data.data.userName);

                this.$store.dispatch("setuser",data.data.image.substring(7))
                setInterval(function(){location.reload()},1000)
           
              }
            );
           self.$emit("childMethod")
          } else if (data.status == 402) {
            alert("账号或密码错误，请重新输入")
          }
        })
        .catch(error => {
          alert("网络好像开小差了")
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  width: 600px;
  cursor: pointer;
  z-index:2000;
}
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
  }
}
.close {
  font-size: 52px;
  color: #fff;
  margin-top: 32px;
  text-align: center;
}
</style>
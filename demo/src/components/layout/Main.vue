<template>
  <div class="app-wrapper">
    <!-- 主头部 -->
    <main-header>
    </main-header>
    <!-- 主头部 /-->
    <!-- 主体 -->
    <div class="main-wrapper" :class="{open:!this.$store.state.app.sidebar.opened || this.$store.state.app.subMenu === ''}">
      <!-- 左侧 -->
      <div class="side-wrapper light">
        <!-- 左侧导航 -->
        <nav-bar></nav-bar>
        <!-- 左侧导航 /-->
      </div>
      <!-- 左侧 /-->
      <!-- 右侧 -->
      <div class="main-container">
        <div class="container" id="container">
          <div id="sticker" class="container-inner">
            <div id="stickerCon" class="container-inner-con">
              <!-- 面包屑 -->
           
              <!-- 面包屑 /-->
              <!-- 路由 -->
              <div class="main-container-box">
                <transition name="fade" mode="out-in">
                  <router-view></router-view>
                </transition>
              </div>
              <!-- 路由/ -->
            </div>
          </div>
          <div class="footer">SPIRAL Technology 2014-2020 Copy Right 斯拜若科技版权所有</div>
        </div>
      </div>
      <!-- 右侧 /-->
    </div>
  </div>
</template>
<script>
import MainHeader from '@/components/layout/common/MainHeader'
import NavBar from '@/components/layout/common/CNav'
import Container from '@/components/layout/common/Container'
import Cookies from 'js-cookie'

export default {
  name: 'full',
  components: {
    MainHeader,
    NavBar,
    Container
  },
  data () {
    const validatePass = (rule, value, callback) => {
      let password = Cookies.get('token')
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== password) {
        callback(new Error('密码错误'))
      } else {
        callback()
      }
    }
    return {
      theme: 'dark', // 主题
      themeBool: true,
      modal_loading: false,
      lang: 'CN',
      formValidate: {
        check_password: ''
      },
      // menu: menu, // 导航菜单
      ruleValidate: {
        check_password: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ]
      }
    }
  }
}
</script>

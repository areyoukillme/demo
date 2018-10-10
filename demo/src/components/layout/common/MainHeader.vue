<template>
  <div class="main-header">
    <!-- logo -->
    <div class="logo-box">
      <img :src="require('@/assets/images/logo.png')" alt="" style="width:40px 
      height: 40px">
      <div>
        <p>运营管理系统</p>
        <h2>iAccount</h2>  
      </div>
    </div>
    <!-- logo /-->
    <!-- 右侧内容 -->
    <div class="header-inner">
      <!-- 伸缩按钮 -->
      <div class="nav-icon" @click="toggleSideBar">
      
      </div>
      <!-- 伸缩按钮 /-->
      <!-- 主菜单 -->
      <div class="header-menu">
        
        <Menu mode='' @on-select="changeSub" :active-name="menuActive">
          <Row>      
            <Col span='3'><MenuItem name="index" key="-1">首页</MenuItem></Col>
            <MenuItem :name="item.name" v-for="(item,index) in menu" :key="index" v-if="item.children !== null"><Col span='3'> {{item.alias}}</Col></MenuItem>
          </Row>  
        </Menu>
      </div>
      <!-- 主菜单 /-->
      <!-- 消息类按钮 -->
      <div class="login-out">  
          <Icon type="power" @click="logout" class="out"></Icon> 
      </div>
      <!-- 消息类按钮 /-->
    </div>
  </div>
</template>

<script>
// import menu from '@/router/menu'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      screen: false,
      menu: JSON.parse(sessionStorage.getItem('MENUS')).slice(0,-1), // menu, // 导航菜单
      menuActive: 'index',
      homeJson: { alias: '首页', name: 'index', url: '/index', children: '' }
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    /**
     *退出
     */
    logout () {
      this.$Modal.confirm({
        title: '提醒',
        content: '<p>您确定退出？</p>',
        onOk: () => {
          Cookies.remove('token')
          Cookies.remove('userId')
          Cookies.remove('currentUrl')
          Cookies.remove('sidebarStatus')
          this.$store.commit('CLEAR_STORE')
          this.$router.push('/login')
          this.$Message.success('退出成功')
        },
        onCancel: () => {
        }
      })
    },
    /**
     * 点击菜单
     * **/
    changeSub (value) {
      let getJson = this.getMenu(value)
      let subInfo = this.getSubInfo(getJson.index)
      this.windonToTop()
      this.$store.commit('OPEN_SUBMENU', getJson.menu)
      this.$store.commit('GET_CURRENT_PATH_INFO', subInfo)
      Cookies.set('currentUrl', subInfo.currentUrl, {path: '/'})
      this.$router.push({
        path: subInfo.currentUrl
      })
    },
    getMenu: function (key) {
      let index = -1
      var getOpenNames = function (menus) {
        let openNames = []
        for (var i = 0; i < menus.length; i++) {
          if (menus[i].children) {
            openNames.push(menus[i].name)
          }
        }
        return openNames
      }
      for (var m = 0; m < this.menu.length; m++) {
        if (this.menu[m].name === key && this.menu[m].children) {
          index = m
          this.$store.dispatch('getOpenName', getOpenNames(this.menu[m].children))
        }
      }
      let subMenus = index === -1 ? this.homeJson : this.menu[index]
      return {menu: subMenus, index: index}
    },
    getSubInfo: function (index, key) {
      let currentMenu = index === -1 ? this.homeJson : this.menu[index]
      let currentMainPathName = currentMenu.alias
      let currentPathSubName = ''
      let currentUrl = '/index'
      let activeName = ''
      let openName = []
      let subSonName = ''
      let loose = true
      let setInfoByKey = (array, name) => {
        for (var i = 0; i < array.length; i++) {
          if (array[i].name === name) {
            subSonName += ' / ' + array[i].alias
            activeName = currentUrl = array[i].url
            currentPathSubName += subSonName
            subSonName = ''
            if (array[i].children) {
              this.$store.commit('GET_MENU_OPTION', array[i].children)
            }
            return false
          }
        }
      }
      let getCurrentInfoByKey = (array) => {
        for (var i = 0; i < array.length; i++) {
          subSonName = ' / ' + array[i].alias
          if (loose && array[i].children && array[i].children.length > 0) {
            if ((!key && array[i].url !== null) || (key && array[i].name === key)) {
              setInfoByKey(array, array[i].name)
              loose = false
              return false
            } else {
              getCurrentInfoByKey(array[i].children)
            }
          }
        }
      }

      if (currentMenu.children === '') {
        currentUrl = '/index'
        currentMainPathName = '首页'
        currentPathSubName = ''
      } else {
        getCurrentInfoByKey(currentMenu.children)
      }
      return {currentPathName: currentMainPathName, currentPathSubName: currentPathSubName, currentUrl: currentUrl, openName: openName, activeName: activeName}
    },
    windonToTop: function () {
      document.getElementById('container').scrollTop = 0
    }
  },
  created () {
    /**
     * 初始化菜单
     * **/
    let path = Cookies.get('currentUrl') || '/index'
    let pathArray = path.split('/')
    this.menuActive = pathArray[1]
    if (this.menuActive === 'index') {
      this.$router.push('/index')
      return false
    }
    let getJson = this.getMenu(this.menuActive)
    let subInfo = this.getSubInfo(getJson.index, pathArray[3])
    this.$store.commit('OPEN_SUBMENU', getJson.menu)
    this.$store.commit('GET_CURRENT_PATH_INFO', subInfo)
  }
}
</script>

</script>
<style lang="less" scoped>
  .header-menu{width: 100%;}
  .item{height: 80px;}
</style>


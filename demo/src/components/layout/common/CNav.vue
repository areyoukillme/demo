<template>
  <div class="nav-bar-inner">
    <div class="nav-bar">
      <Menu width="220" ref="side_menu" :theme="theme" @on-select="selectFn" :active-name="activeName" :open-names="openName" :accordion="accordion">
        <div  v-for="(item,index) in this.$store.state.app.subMenu.children" :key="index">
          <Submenu :name="item.name" v-if="item.children && item.children.length > 0">
            <template slot="title">
              <Icon :type="item.icon ? item.icon :'icon-collection'" class="nav-icon"></Icon>
              {{item.alias}}
            </template>
            <Menu-item :name="sub.url" v-for="(sub,i) in item.children" :key="i" v-if="sub.children !== null">
              {{sub.alias}}
            </Menu-item>
          </Submenu>
        </div>
      </Menu>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  created () {
    this.activeName = this.$store.state.app.sidebar.activeName
    this.openName = this.$store.state.app.openName || []
    this.subMenu = this.$store.state.app.subMenu || []
    this.subMenuChildren = this.subMenu.children ? this.subMenu.children : []
  },
  data () {
    return {
      theme: 'light', // 主题
      themeBool: true,
      activeName: '',
      openName: [],
      subMenu: [],
      subMenuChildren: [],
      accordion: false
    }
  },
  methods: {
    /**
     * 选择菜单
     */
    selectFn: function (url) {
      let currentMenu = this.subMenu.children
      let currentUrl = url
      let activeName = ''
      let currentPathSubName = ' / ' + this.subMenu.alias
      let looseTag = true
      let getCurrentInfo = (array) => {
        for (var k = 0, len = array.length; k < len; k++) {
          if (array[k].url && array[k].url === url) {
            activeName = currentUrl = url
            currentPathSubName += ' / ' + array[k].alias
            looseTag = false
            this.$store.commit('GET_MENU_OPTION', array[k].children)
            return false
          } else if (array[k].children && array[k].children !== '' && looseTag) {
            getCurrentInfo(array[k].children)
          }
        }
      }
      for (var i = 0; i < currentMenu.length; i++) {
        if (looseTag) {
          currentPathSubName = ' / ' + currentMenu[i].alias
          if (currentMenu[i].url && currentMenu[i].url === url) {
            currentUrl = url
            activeName = currentMenu[i].name
            this.$store.commit('GET_MENU_OPTION', currentMenu[i].children)
          } else {
            getCurrentInfo(currentMenu[i].children)
          }
        }
      }
      document.getElementById('container').scrollTop = 0
      this.$store.dispatch('getCurrentPathInfo', {currentPathSubName: currentPathSubName, activeName: activeName})
      Cookies.set('currentUrl', currentUrl, {path: '/'})
      this.$router.push({
        path: currentUrl
      })
    }
  },
  updated () {
    this.activeName = this.$store.state.app.sidebar.activeName
    this.openName = this.$store.state.app.openName
    this.subMenu = this.$store.state.app.subMenu
    if (this.openName.length > 0 && this.subMenu) {
      this.$nextTick(() => {
        this.$refs.side_menu.updateOpened()
        this.$refs.side_menu.updateActiveName()
      })
    }
  },
  watch: {
    $route (now, old) {
      let nowPath = now.path
      let oldPath = old.path
      if (nowPath !== oldPath) {
        // let pathArray = nowPath.split('/')
        // let url = '/' + [pathArray[1], pathArray[2], pathArray[3]].join('/')
        // this.selectFn(url)
      }
    }
  }
}
</script>

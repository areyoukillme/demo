import Cookies from 'js-cookie'
import iView from 'iview'
import Vue from 'vue'
Vue.use(iView)

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'), // 0:隐藏导航， 1、展开导航
      minOpen: false, // 小屏时菜单状态
      activeName: '',
      openName: []
    },
    router: {
      currentPathName: '首页',
      currentPathSubName: '',
      subPathName: ''
    },
    subMenu: [], // 存储当前的右侧子菜单
    ownMenus: {},
    openName: [],
    menuOptions: []
  },
  getters: {
    getCodeMenu: (state, code) => {
      // return (code ? state.ownMenus.find(menu => menu.code === code) : state.ownMenus)
      return state.ownMenus
    }
  },
  mutations: {
    /**
     * 左侧菜单的缩展
     */
    TOGGLE_SIDEBAR: state => {
      let winWidth = document.documentElement.clientWidth
      if (winWidth <= 600) {
        state.sidebar.minOpen = !state.sidebar.minOpen
        state.sidebar.opened = false
        Cookies.set('sidebarStatus', 0)
        return false
      } else {
        if (state.sidebar.opened) {
          Cookies.set('sidebarStatus', 1)
        } else {
          Cookies.set('sidebarStatus', 0)
        }
        state.sidebar.opened = !state.sidebar.opened
      }
    },
    CLOSE_SLIDEBAR: state => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.minOpen = false
    },
    OPEN_SLIDEBAR: state => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = true
    },
    OPEN_SUBMENU: (state, payload) => {
      state.subMenu = payload
    },
    /**
     * 面包屑
     */
    GET_CURRENT_PATH_INFO: (state, payload) => {
      state.router.currentPathName = payload.currentPathName ? payload.currentPathName : state.router.currentPathName
      state.router.currentPathSubName = payload.currentPathSubName ? payload.currentPathSubName : ''
      state.sidebar.activeName = payload.activeName ? payload.activeName : state.sidebar.activeName
      state.sidebar.openName = payload.openName ? payload.openName : state.sidebar.openName
    },
    // 清除数据
    CLEAR_STORE: (state) => {
      state.subMenu = []
      state.router.currentPathName = ''
      state.router.currentPathSubName = ''
      state.sidebar.activeName = ''
      // state.sidebar.openName = []
      state.openName = []
    },
    // 获取权限下的所有树列表
    OWN_MENUS: (state, payload) => {
      state.ownMenus = payload
    },
    GET_NAME_MENU: (state, payload) => {
      state.ownMenus.forEach((value, index, array) => {
        if (payload === value.name) {
          return value
        }
      })
    },
    GET_OPNE_NAME: (state, payload) => {
      state.openName = payload
    },
    GET_MENU_OPTION: (state, payload) => {
      state.menuOptions = payload
    }
  },
  actions: {
    toggleSideBar: ({commit}) => {
      commit('TOGGLE_SIDEBAR')
    },
    getSubMenu: ({commit}, payload) => {
      commit('OPEN_SUBMENU', payload)
    },
    getCurrentPathInfo: ({commit}, payload) => {
      commit('GET_CURRENT_PATH_INFO', payload)
    },
    getCleatStore: ({commit}) => {
      commit('CLEAR_STORE')
    },
    ownMenus: ({commit}, payload) => {
      commit('OWN_MENUS', payload)
    },
    getOpenName: ({commit}, payload) => { 
      commit('GET_OPNE_NAME', payload)
    },
    getMenuOption: ({commit}, payload) => {
      commit('GET_MENU_OPTION', payload)
    }
  }
}

export default app

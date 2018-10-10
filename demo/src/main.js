// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import Cookies from 'js-cookie'
import api from './api/index'
import * as filters from './common/filter'
import 'iview/dist/styles/iview.css'
import './assets/styles/common/layout.less'
import './assets/styles/common/cover.less'
import './assets/styles/common/base.less'
import echarts from 'echarts'

Vue.prototype.$echarts=echarts
Vue.use(api)
Vue.use(iView)
Vue.config.productionTip = false

// register global utility filters.
var winWidth = document.documentElement.clientWidth
if (winWidth <= 600) {
  store.commit('CLOSE_SLIDEBAR')
} else {
  store.commit('OPEN_SLIDEBAR')
}
window.onresize = function () {
  if (Cookies.set('sidebarStatus')) {
    return false
  }
  winWidth = document.documentElement.clientWidth
  if (winWidth <= 600) {
    store.commit('CLOSE_SLIDEBAR')
  } else {
    store.commit('OPEN_SLIDEBAR')
  }
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

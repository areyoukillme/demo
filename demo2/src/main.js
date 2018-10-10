// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//路由管理
import router from './router'
//状态管理
import Vuex from 'vuex'
import store from './vuex/store.js'
Vue.use(Vuex);
//公共样式
import './stylesheets/main.scss';
//引入swiper
// import Swiper from 'swiper'
// import 'swiper/dist/css/swiper.min.css';
// import Swiper from 'swiper'
// import 'swiper/dist/css/swiper.min.css';
// 引入elui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 引入axios
import axios from 'axios'
import {post,fetch,patch,put} from './components/utils/http'
//定义全局变量
Vue.prototype.$post=post
Vue.prototype.$fetch=fetch
Vue.prototype.$patch=patch
Vue.prototype.$put=put
Vue.prototype.$=axios
// 引入htmlToPdf
import htmltopdf from './components/utils/htmltopdf'
Vue.use(htmltopdf)
// 引入jquery
import $ from 'jquery'

// 引入过滤器
import filters from "./filter";
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

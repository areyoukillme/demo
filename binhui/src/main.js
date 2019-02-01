// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import './config/flexible'
import FastClick from 'fastclick'
import './config/touch'
import wx from 'weixin-js-sdk'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import { getPositionY } from './config/mUtils'
import './style/mixin.scss';
import './style/common.scss';
Vue.prototype.wx = wx;
Vue.use(Mint);
import Bridge from './config/bridge.js'
Vue.prototype.$bridge = Bridge
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
Vue.component(Mint.IndexList.name, Mint.IndexList);
Vue.component(Mint.IndexSection.name, Mint.IndexSection);

Vue.use(require('vue-wechat-title')) //兼容ios  支持document.title = xxx 的方式修改 

if('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.getElementById('app'));  //解决300ms延迟
	}, false);
}

Vue.config.productionTip = false  //设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示

Vue.use(VueRouter)

const router = new VueRouter({
	routes,
	mode: 'history', 
	base: '/bhFarmAppWeb',
	//	scrollBehavior (to, from, savedPosition) {
	//	   return { x: 0, y: 0 }
	//	}
})
// VueRouter.prototype.goBack = function () {
//   store.state.transitionName='slide-right'
//   window.history.go(-1)
//   
// }
router.afterEach((to, from, next) => {
	if(from.meta.keepAlive){
		from.meta.scrollY=getPositionY();
	};
	if(to.meta.keepAlive){
		Vue.nextTick(() => {
		   window.scrollTo(0,to.meta.scrollY);
	 	});
	};
	Vue.nextTick(() => {
		// store.state.transitionName='slide-left'
	   setTimeout(()=>{
		window.scrollTo(0,0);
	   },50)
 	});
});

/* eslint-disable no-new */
new Vue({
	router,
	store,
}).$mount('#app')

//保留两位小数
Vue.filter('keepTwoNum', function (value) {
    return Number(value).toFixed(2)
})
import Vue from 'vue'
import Router from 'vue-router'

import iView, { Notice } from 'iview'
import routers from './routers'
import Cookies from 'js-cookie'
// let common = require('@/common/utils/index.js')
Vue.use(iView)
Vue.use(Router)
var BaseCommon = require('../common/utils/index.js')
const router = new Router({
  // mode: 'history',
  base: BaseCommon.GetServerBase().assetsPublicPath,
  scrollBehavior: () => ({y: 0}),
  routes: routers
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (Cookies.get('token') && sessionStorage.getItem('MENUS')) {   
      next()
    } else {

      next({
        path: '/login'
        }
      )    
 
    }
  } else {
    next()
  }
})
export default router

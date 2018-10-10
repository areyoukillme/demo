// 导入模块

import axios from 'axios'
import Vue from 'vue'
import iView, { Notice } from 'iview'
import Cookies from 'js-cookie'
Vue.use(iView)
var Qs = require('qs')

var common = require('../common/utils/index.js')
const SERVER_BASE = common.GetServerBase()

export default function fetch (options) {
  // let baseUrl = /mock/i.test(options.url) ? 'http://localhost:3000' : SERVER_BASE.baseServerUrl
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: SERVER_BASE.baseServerUrl,
      timeout: 10000,
      url: (options.urlType ? options.urlType.replace(/(^\s*)|(\s*$)/g, '') : '/api') + options.url, // options.url,
      method: options.method,

      transformRequest: [function (data) {

        return data
      }],
   
      transformResponse: [function (data) {
        return data
      }],
 
      data: (/json/gi.test(JSON.stringify(options.headers)) ? JSON.stringify(options.data) : Qs.stringify(options.data)),
      params: options.params,
    
      responseType: options.responseType || 'json', // default
      headers: options.headers || {'X-Requested-With': 'XMLHttpRequest'}
    })
  
    instance.interceptors.request.use(
      config => {
        iView.LoadingBar.start()
        return config
      },
      err => {
        iView.LoadingBar.error()
        return Promise.reject(err)
      })

    instance.interceptors.response.use(
      response => {

        return response
      },
      error => {

        if (error) {
        }
        return Promise.reject(error)
      })


    instance()
      .then((res) => {
        if (res.data && res.data.code && res.data.code === '0722'||
        res.data && res.data.code && res.data.code === '4307'||
        res.data && res.data.returnCode && res.data.returnCode === '0722'||
        res.data && res.data.returnCode && res.data.returnCode === '4307') 
        {
          Cookies.remove('token')
          Cookies.remove('currentUrl')
          Cookies.remove('sidebarStatus')
          Notice.error({
            title:"登陆超时了",
            desc:"请重新登陆",
            duration:1.5
          })
          setTimeout(()=>{location.href = '/admin/'},1500)
        } 
        if(res.code&&res.code=='0722'){
          Cookies.remove('token')
          Cookies.remove('currentUrl')
          Cookies.remove('sidebarStatus')
          Notice.error({
            title:"登陆超时了",
            desc:"请重新登陆",
            duration:1.5
          })
          setTimeout(()=>{location.href = '/admin/'},1500)
        }
        else if(res.data&&res.data.returnCode&&res.data.returnCode!='0000'){
          Notice.error({
            title:"出错了",
            desc:'出错原因:'+res.data.returnMsg,
            duration:2
          })
        }
        
        else {
          resolve(res.data)
        }
        return false
      })
      .catch((error) => {
        console.log(error)
        Notice.error({
          title: '出错了！',
          desc: '错误原因 ' + error.message,
          duration: 2
        })
        reject(error)
      })
  })
}

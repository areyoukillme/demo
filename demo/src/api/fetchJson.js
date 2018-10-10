// 导入模块

import axios from 'axios'
import Vue from 'vue'

import iView, { Notice } from 'iview'
Vue.use(iView)
var config = require('../../config')
// var Qs = require('qs')
var isProduction = process.env.NODE_ENV === 'production'
export const SERVER_BASE_URL = isProduction ? config.build.baseServerUrl : config.dev.baseServerUrl

export default function fetchJson (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: SERVER_BASE_URL,
      timeout: 10000,
      headers: {'Content-Type': 'application/json'}, // modify from z
      url: (options.urlType ? options.urlType : '/api') + options.url,
      method: options.method,
      // `transformRequest` 允许在向服务器发送前，修改请求数据
      // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
      // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return data
      }],
      // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
      transformResponse: [function (data) {
        return data
      }],
      /*
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      },
      */
      data: JSON.stringify(options.data),
      params: options.params,
      responseType: 'json' // default
    })
    // options.baseURL = SERVER_BASE_URL
    // http request 拦截器
    instance.interceptors.request.use(
      config => {
        if (!isProduction) {
          iView.LoadingBar.start()
        }
        //
        return config
      },
      err => {
        if (!isProduction) {
          iView.LoadingBar.error()
        }
        return Promise.reject(err)
      })

    // http response 拦截器
    instance.interceptors.response.use(
      response => {
        if (!isProduction) {
          iView.LoadingBar.finish()
        }
        // View.LoadingBar.finish()
        return response
      },
      error => {
        if (!isProduction) {
          iView.LoadingBar.error()
        }
        if (error) {
        }
        return Promise.reject(error) // 返回接口返回的错误信息
      })

    // 请求处理
    instance()
      .then((res) => {
        // 请求成功时,根据业务判断状态
        if (res.data && res.data.code && res.data.code === '0704'||res.data&&res.data.code&&res.data.code=='0722'||res.data&&res.data.code&&res.data.code=='4307') {
          location.href = '/admin/'
        } else {
          resolve(res.data)
        }
        return false
      })
      .catch((error) => {
        // 请求失败时,根据业务判断状态
        Notice.error({
          title: '出错了！',
          desc: '错误原因 ' + error.message,
          duration: 1
        })
        reject(error)
      })
  })
}

import fetch from './../fetch.js'
// import fetchJson from './../fetchJson.js'

/**
 * obj -> queryStr
 * eg: {a:1,b:2} -> a=1&b=2
 */
function getQueryStr (obj) {
  if (!obj) return ''
  return cleanArray(Object.keys(obj).map(key => {
    if (obj[key] === undefined) return ''
    return key + '=' + obj[key]
  })).join('&')
}
function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}
// 分润管理
const frManage = {
  getFrList: (params) => {
    var queryStr = getQueryStr(params)
    return fetch({
      url: '/pas/frManage?' + queryStr,
      method: 'get'
    })
  }
}
// 账户管理，提现
const accountWithDraw = params => {
  return fetch({
    url: '/account/xxxxxxxxx',
    method: 'get',
    params: params
  })
}
// 账户查询
const getAccountList = params => {
  return fetch({
    url: '/acc/account/queryAccount',
    method: 'get',
    params: params
    // urlType: 'dev'// 如是dev 则url 不加上dev
  })
}

export default {
  frManage,
  accountWithDraw,
  getAccountList
}

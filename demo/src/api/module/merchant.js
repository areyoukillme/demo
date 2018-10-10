import fetch from './../fetch.js'

// 待审核列表
const getWaitAuditList = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerAuditInfo/waitAudit?' + queryStr,
    method: 'get'
  })
}

// 被拒绝审核列表
const getRejectAuditList = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerAuditInfo/refusal?' + queryStr,
    method: 'get'
  })
}

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

// 查询商户列表
const getQueryDataList = params => {
  var queryStr = getQueryStr(params)
  return fetch({
    url: '/pas/Customer?' + queryStr,
    method: 'get'
  })
}

/**
 * 商户证书管理
 */
const certificate = {
  queryList: (params) => {
    return fetch({
      url: '/pas/Certificate',
      method: 'get',
      params: params
    })
  },
  view: (params) => {
    return fetch({
      url: '/pas/Certificate/detail',
      method: 'get',
      params: params
    })
  },
  save: (params) => {
    return fetch({
      url: '/pas/Certificate',
      method: 'post',
      params: params
    })
  },
  delete: (params) => {
    return fetch({
      url: '/pas/Certificate?attachmentId=' + params.attachmentId,
      method: 'delete',
      responseType: 'text'
    })
  },
  getCustDetailByCustomerCode: (params) => {
    return fetch({
      url: '/pas/CustomerInfo/detailByCustomerCode?customerCode=' + params.customerCode,
      method: 'get'
    })
  }
}

export default {
  getWaitAuditList,
  getRejectAuditList,
  getQueryDataList,
  certificate
}

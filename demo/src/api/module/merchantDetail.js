import fetch from './../fetch.js'
import fetchJson from './../fetchJson.js'

const initMerchantBasicInfo4View = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerInfo/detail?' + queryStr,
    method: 'get'
  })
}

const initMerchantBasicInfo4Edit = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerInfo/init' + (queryStr ? ('?' + queryStr) : ''),
    // params: queryStr,
    method: 'get'
  })
}

// const initMerchantBasicInfo4Add = options => {
//   return fetch({
//     url: '/pas/CustomerInfo/init',
//     method: 'get'
//   })
// }

const saveMerchantBasicInfo = params => {
  return fetchJson({
    url: '/pas/CustomerInfo',
    method: 'put',
    data: params
  })
}

const initMerchantSettleInfo = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerSettleInfo/detail?' + queryStr,
    method: 'get'
  })
}

const initMerchantBusinessInfo = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerBusinessInst?' + queryStr,
    method: 'get'
  })
}

const initMerchantContactInfo = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerContactsInfo/detail?' + queryStr,
    method: 'get'
  })
}

const initMerchantAttachmentInfo = options => {
  var queryStr = getQueryStr(options)
  return fetch({
    url: '/pas/CustomerAttachment?' + queryStr,
    method: 'get'
  })
}

const saveSettleDetail = params => {
  // var queryStr = getQueryStr(params)
  // alert(JSON.stringify(params))
  return fetchJson({
    url: '/pas/CustomerSettleInfo',
    data: params,
    method: 'put',
    // emulateJSON: false,
    headers: { // 请求头（可以是Headers对象，也可是JSON对象）
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json'
    }
    // body: JSON.stringify(
    // params
    // )
  })
}

// 保存管理员信息
const saveContactInfo = params => {
  return fetchJson({
    url: '/pas/CustomerContactsInfo',
    data: params,
    method: 'put'
  })
  // return fetch({
  //   url: '/pas/CustomerContactsInfo',
  //   data: params,
  //   method: 'put',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
}

// 保存业务信息
const saveCustomerBusinessInfo = params => {
  return fetchJson({
    url: '/pas/CustomerBusinessInst',
    data: params,
    headers: { // 请求头（可以是Headers对象，也可是JSON对象）
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
// 获取业务名称
const getBusinessName = params => {
  var queryStr = getQueryStr(params)
  return fetchJson({
    url: '/pas/Business/selectBySelective?' + queryStr,
    // url: '/branch/query?pageNum=1&pageSize=1&',
    data: params,
    // headers: {'Content-Type': 'application/json'},
    method: 'get'
  })
}
const deleteBusinessById = params => {
  var queryStr = getQueryStr(params)
  return fetchJson({
    url: '/pas/CustomerBusinessInst?' + queryStr,
    data: params,
    headers: { // 请求头（可以是Headers对象，也可是JSON对象）
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })
}
const getBankBranch = params => {
  var queryStr = getQueryStr(params)
  return fetchJson({
    url: '/pas/branch/query?pageNum=1&pageSize=1&' + queryStr,
    data: params,
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

const getUploadToken = params => {
  return fetch({
    url: '/fs/UploadToken',
    method: 'post',
    data: params,
    urlType: ' ',
    responseType: 'text'
  })
}

const getUploadFile = params => {
  return fetch({
    url: params.url,
    method: 'post',
    data: params.data,
    headers: params.headers
  })
}

const fileAttach = {
  getCustomerAttachment: (params) => {
    return fetch({
      url: '/pas/CustomerAttachment/upload',
      method: 'post',
      data: params,
      responseType: 'text'
    })
  },
  getFilePath: (params) => {
    return fetch({
      url: '/fs/FilePath',
      method: 'post',
      urlType: ' ',
      data: params,
      responseType: 'text'
    })
  },
  // 删除图片
  deleteFile: (params) => {
    return fetch({
      url: '/pas/CustomerAttachment?attachmentId=' + params.attachmentId,
      method: 'delete',
      responseType: 'text'
    })
  },
  // 获取提交审核信息
  getCustomerBusinessInfo: (params) => {
    return fetch({
      url: '/pas/CustomerBusinessInst/count?customerInfoId=' + params.customerInfoId,
      method: 'get',
      responseType: 'text'
    })
  },
  // 提交审核
  submitAudit: (params) => {
    return fetch({
      // url: '/pas/CustomerInfo/auditSubmit?customerInfoId=' + params.customerInfoId,
      url: '/pas/CustomerInfo/auditSubmit',
      data: params,
      method: 'post'
    })
  }
}
const freezingMerchant = params => {
  var queryStr = getQueryStr(params)
  return fetch({
    url: '/pas/Customer/state?' + queryStr,
    method: 'put'
  })
}

const merchantAudit = {
  // 审核
  saveAudit: (params) => {
    return fetch({
      url: '/pas/CustomerAuditInfo/audit',
      method: 'post',
      data: params
    })
  },
  getAudit: (params) => {
    return fetch({
      url: '/pas/CustomerAuditInfo/detail?auditInfoId=' + params.auditInfoId,
      method: 'get'
    })
  }
}

const getParentCustomerName = params => {
  var queryStr = getQueryStr(params)
  return fetch({
    url: '/pas/CustomerInfo/detailByCustomerCode?' + queryStr,
    method: 'get'
  })
}

// 商户业务管理
const merchantBusiness = {
  // 获取上级代理商列表
  getParentCustomer: (params) => {
    return fetch({
      url: '/pas/CustomerInfo/xxxxxx',
      method: 'post',
      data: params
    })
  },
  getAudit: (params) => {
    return fetch({
      url: '/pas/CustomerAuditInfo/detail?auditInfoId=' + params.auditInfoId,
      method: 'get'
    })
  }
}
// 取业务实例
const getBusinessInst = params => {
  var queryStr = getQueryStr(params)
  return fetch({
    url: '/pas/BusinessParam/getByBueinessCode?' + queryStr,
    method: 'get'
  }).then((resJson) => {
    // for (var r = 0; r < resJson.length; r++) {
    //   alert(resJson.length + resJson[r].type + r)
    //   if (resJson[r].type === 'Select') {
    //     resJson[r].value = [{'customerCode': '222', 'name': 'fddddd'}]
    //     // Promise(getBusinessDetail(params, '/dev/cum' + resJson[r].dataUrl).then(res => {
    //     //   alert(JSON.stringify(res) + r)
    //     //   // resJson[r].value = res
    //     // })
    //     // )
    //   } else {
    //     resJson[r].value = ''
    //   }
    // }
    // alert(JSON.stringify(resJson) + 'fdddddd')
    return resJson
  })
}

const getBusinessDetail = (params, url) => {
  // var queryStr = getQueryStr(params)
  return fetch({
    url: url,
    method: 'get'
  })
}

const sendInletEmail = params => {
  return fetch({
    url: '/pas/sendInletEmail',
    method: 'post',
    data: params
  })
}

const getBusinessCategories = params => {
  return fetch({
    url: '/pas/businesscategories',
    method: 'get'
  })
}

export default {
  initMerchantBasicInfo4View,
  initMerchantBasicInfo4Edit,
  // initMerchantBasicInfo4Add,
  saveMerchantBasicInfo,
  initMerchantSettleInfo,
  initMerchantBusinessInfo,
  initMerchantContactInfo,
  initMerchantAttachmentInfo,
  saveSettleDetail,
  getBankBranch,
  getUploadToken,
  getUploadFile,
  fileAttach,
  saveContactInfo,
  saveCustomerBusinessInfo,
  getBusinessName,
  deleteBusinessById,
  freezingMerchant,
  merchantAudit,
  getParentCustomerName,
  merchantBusiness,
  getBusinessInst,
  getBusinessDetail,
  sendInletEmail,
  getBusinessCategories
}

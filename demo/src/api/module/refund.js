import fetch from './../fetch.js'
import fetchJson from './../fetchJson.js'

// 退款审核查询
const getRefundAuditDetail = params => {
  return fetch({
    url: '/pas/refundQuery',
    method: 'get',
    params: params
  })
}
// 退款历史记录
const getRefundHistory = params => {
  return fetch({
    url: '/pas/refundQuery',
    method: 'get',
    params: params
  })
}
// 获取已退款金额
const getTotalRefundAmount = params => {
  return fetch({
    url: '/pas/getTotalRefundAmount',
    method: 'get',
    params: params
  })
}
// 退款审核
const refundApprove = params => {
  return fetchJson({
    url: '/pas/refund/approve',
    data: params,
    headers: { // 请求头（可以是Headers对象，也可是JSON对象）
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}

export default {
  getRefundAuditDetail,
  getRefundHistory,
  getTotalRefundAmount,
  refundApprove
}

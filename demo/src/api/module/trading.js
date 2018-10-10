import fetch from './../fetch.js'

// 查询支付订单列表
const getPlayList = params => {
  return fetch({
    url: '/txs/preOrder',
    params: params,
    method: 'get'
  })
}
// 查询分账明细
const getDetail = params => {
  return fetch({
    url: '/txs/splitRecord',
    params: params,
    method: 'get'
  })
}
// 查询提现订单
const getWithdraw = params => {
  return fetch({
    url: '/txs/withdrawOrder',
    method: 'get',
    params: params
  })
}
// 重复订单
const getRepayOrder = params => {
  return fetch({
    url: '/txs/repayTradeOrder',
    method: 'get',
    params: params
  })
}
// 退款查询
const getRefundList = params => {
  return fetch({
    // url: '/pas/refundQuery',
    url: '/txs/refundPreOrder/V2',
    method: 'get',
    params: params
  })
}
// 退款审核查询
const getRefundAuditList = params => {
  return fetch({
    url: '/pas/refundQuery',
    method: 'get',
    params: params
  })
}

// 人工处理订单
const getNeedPersonalTradeQuery = params => {
  return fetch({
    url: '/txs/needPersonalTrade',
    method: 'get',
    params: params
  })
}

export default {
  getPlayList,
  getWithdraw,
  getRepayOrder,
  getRefundList,
  getRefundAuditList,
  getNeedPersonalTradeQuery,
  getDetail // 查看分账明细的url
}

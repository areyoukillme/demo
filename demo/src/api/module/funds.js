import fetch from './../fetch.js'

// 查询
const getNoticeList = params => {
  return fetch({
    url: '',
    params: params,
    method: 'get'
  })
}

// 获取EFPS需备款总额
const getWithDrawAmount = params => {
  return fetch({
    url: '/sett/sett/withDrawAmount',
    params: params,
    method: 'get'
  })
}

// 银联虚拟账户实时余额查询
const getRealTimeBalanceQuery = () => {
  return fetch({
    url: '/clr/union/fundSett/realTimeBalanceQuery',
    method: 'get'
  })
}

// 备款
const saveMoney = (params) => {
  return fetch({
    url: '/clr/union/fundSett/beikuan',
    method: 'post',
    data: params,
    headers: {'Content-Type': 'application/json'}
  })
}

// 来账
const getBackNotice = (params) => {
  return fetch({
    url: '/clr/union/fundSett/laizhangNoticeQuery',
    method: 'get',
    params: params,
    headers: {'Content-Type': 'application/json'}
  })
}

// 退汇
const getreturnNotice = (params) => {
  return fetch({
    url: '/clr/union/fundSett/tuihuiNoticeQuery',
    method: 'get',
    params: params,
    headers: {'Content-Type': 'application/json'}
  })
}

export default {
  getNoticeList,
  getWithDrawAmount,
  getRealTimeBalanceQuery,
  saveMoney,
  getBackNotice,
  getreturnNotice
}

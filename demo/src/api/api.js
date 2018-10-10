import fetch from './fetch.js'
import trading from './module/trading'
import merchant from './module/merchant'
import system from './module/system'
import business from './module/business'
import merchantDetail from './module/merchantDetail'
import accountManage from './module/accountManage'
import refund from './module/refund'
import funds from './module/funds'

const login = params => {
  return fetch({
    url: '/pas/user/Session/login',
    data: params,
    method: 'post'
  })
}

const apiList = {
  login, // 登录接口
  trading, // 交易管理
  merchant, // 商户资料管理
  system, // 系统管理
  funds, // 出金管理
  merchantDetail: merchantDetail, // 商户资料详情
  business: business, // 业务管理
  accountManage, // 账户管理
  refund // 交易管理--退款管理
}

export default apiList

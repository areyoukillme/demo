var trading = {
  payDownload: '/api/txs/pay/payquery', // 支付订单，充值订单 导出地址
  repayDownload: '/api/txs/payQuery/repayTradeOrderQuery', // 重复订单
  withdrawDownload: '/api/txs/pay/withdrawquery', // 提现订单 导出地址
  refundDownload: '/api/txs/payQuery/refundV2Query' // 退款订单 导出地址
}
var merchant = {
  attachmentUpload: '/fs/File' // 上传图片
}

export default {
  trading,
  merchant
}

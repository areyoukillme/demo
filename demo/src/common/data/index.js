export default {
  // 充值状态
  statusList: [
    {code: '-1', name: '全部'},
    {code: '0', name: '处理中'},
    {code: '1', name: '交易成功'},
    {code: '2', name: '交易失败'},
    {code: '3', name: '订单超时失败'},
    {code: '4', name: '待支付'}
  ],
  // 支付方式
  payList: [
    {code: '-1', name: '全部'},
    {code: '0', name: '账号支付'},
    {code: '1', name: '微信公众号支付'},
    {code: '2', name: '个人网银_贷记卡'},
    {code: '3', name: '个人网银_借记卡'},
    {code: '4', name: '支付宝生活号支付'},
    {code: '5', name: '代付'},
    {code: '6', name: '微信扫码支付'},
    {code: '7', name: '支付宝扫码支付'},
    {code: '8', name: '快捷支付'},
    {code: '9', name: '微信app支付'},
    {code: '10', name: '微信H5支付'},
    {code: '13', name: '微信被扫'},
    {code: '14', name: '支付宝被扫'},
    {code: '20', name: '手机银联支付'}
  ],
  // 支付渠道
  channelList: [
    {name: '全部'},
    {name: '广东银联'},
    {name: '银联总部'},
    {name: '平安银行深圳支行'},
    {name: '中国银行广东省分行营业部'},
    {name: '网联总部'},
    {name: '上海浦东发展银行股份有限公司厦门分行'},
    {name: '上海浦东发展银行股份有限公司广州分行'},
    {name: '天翼电子商务有限公司广东分公司'},
    {name: '(渤海银行)中国银联天津分公司'}
  ],
  // 通知类型
  noticeList: [
    {code: '0', name: '来账'},
    {code: '1', name: '退汇'}
  ],
  // 上游渠道
  upStreamList: [
    {name: '全部'},
    {name: '广东银联'},
    {name: '银联总部'},
    {name: '平安银行深圳支行'},
    {name: '中国银行广东省分行营业部'},
    {name: '网联总部'},
    {name: '上海浦东发展银行股份有限公司厦门分行'},
    {name: '上海浦东发展银行股份有限公司广州分行'},
    {name: '天翼电子商务有限公司广东分公司'},
    {name: '(渤海银行)中国银联天津分公司'}
  ],
  // 提现状态
  withdrawList: [
    {code: '-1', name: '全部'},
    {code: '00', name: '成功'},
    {code: '01', name: '失败'},
    {code: '02', name: '未支付'},
    {code: '03', name: '处理中'}
  ],
  // 系统管理 - 用户管理 - 状态
  systemUserState: [
    {code: '', name: '请选择'},
    {code: 'Y', name: '启用'},
    {code: 'N', name: '禁用'}
  ],
  // 商户性质
  customerTypeList: [
    {code: 10, name: '个体商户'},
    {code: 20, name: '企业（集团）客户'},
    {code: 30, name: '渠道客户'},
    {code: 40, name: '内部商户'},
    {code: 50, name: '小微商户'}
  ],
  leaPersoniDentificationTypeList: [
    {code: 0, name: '身份证'},
    {code: 1, name: '户口本'},
    {code: 2, name: '护照'},
    {code: 3, name: '工商营业执照'},
    {code: 4, name: '组织机构代码证'},
    {code: 5, name: '法人证书'},
    {code: 6, name: '港澳居民往来内地通行证'},
    {code: 7, name: '台湾居民来往大陆通行证'},
    {code: 8, name: '军人身份证'},
    {code: 9, name: '其它'}
  ],
  chainSelectList: [
    {code: '1', name: '总店'},
    {code: '2', name: '分店'}
  ],
  ATTACHMENTCODE_DOMID_MAP: {
    'idCardFront': '01', // 01:身份证正面
    'idCardBack': '02', // 02:身份证背面
    'businessLicense': '03', // 组织机构代码
    'organStructCode': '04', // 营业执照
    'sign': '05', // 店铺招牌
    'interiorOne': '0601', // 店铺内景1
    'interiorTwo': '0602', // 店铺内景2
    'interiorThree': '0603', // 店铺内景3
    'cooperationAgreement': '0701', // 合作协议1
    'cooperationAgreementTwo': '0702', // 合作协议2
    'attorney': '08', // 授权委托书
    'signedBankCard': '09', // 签约银行卡图片
    'idPhoto': '10', // 手持证件照
    'entryCertificate': '11', // 入境证明
    'bankAccount': '12', // 银行账户信息
    'otherDocuments': '13' // 其它证件/文件
  },
  ATTACHMENTCODE_CODE_MAP: {
    '01': 'idCardFront',
    '02': 'idCardBack',
    '03': 'businessLicense',
    '04': 'organStructCode',
    '05': 'sign',
    '0601': 'interiorOne',
    '0602': 'interiorTwo',
    '0603': 'interiorThree',
    '0701': 'cooperationAgreement',
    '0702': 'cooperationAgreementTwo',
    '08': 'attorney',
    '09': 'signedBankCard',
    '10': 'idPhoto',
    '11': 'entryCertificate',
    '12': 'bankAccount',
    '13': 'otherDocuments'
  },
  // 商户管理 行为类型
  operationTypeList: [
    {code: '3', name: '商户新增'},
    {code: '2', name: '商户修改'}
  ],
  auditStatusList: [
    {code: '01', name: '初审未通过'},
    {code: '03', name: '复审未通过'}
  ],
  auditOperationTypeList: [
    {code: '1', name: '运营门户-客户状态变更'},
    {code: '2', name: '运营门户-客户资料修改'},
    {code: '3', name: '运营门户-客户资料新增'},
    {code: '4', name: '客户门户-客户结算账户修改'}
  ],
  auditStatus: [
    {code: '00', name: '待初审'},
    {code: '01', name: '初审未通过'},
    {code: '02', name: '待复审'},
    {code: '03', name: '复审未通过'},
    {code: '04', name: '审核成功'}
  ],
  businessInforTypes: [
    {code: '', name: '请选择'},
    {code: '1', name: '互联网支付'},
    {code: '2', name: 'DSP账户服务'}
  ],
  businessRatioMode: [
    {code: '1', name: '按单笔收费'},
    {code: '2', name: '按比例收费'}
  ],
  certificateStatus: [
    {code: '', name: '全部'},
    {code: '0', name: '数据校验失败'},
    {code: '1', name: '进件成功'},
    {code: '2', name: '审核中'},
    {code: '3', name: '进件失败'}
  ],
  transactionType: [
    {code: 'all', name: '全部'},
    {code: 'ZF', name: '支付'},
    {code: 'CZ', name: '普通充值'},
    {code: 'HYCZ', name: '会员充值'},
    {code: 'FZ', name: '分账'}
  ],
  refundStateList: [
    { code: '-1', name: '全部' },
    { code: '00', name: '退款成功' },
    { code: '01', name: '退款失败' },
    { code: '02', name: '未退款' },
    { code: '03', name: '退款中' }
  ],
  auditStateList: [
    { code: '', name: '全部' },
    { code: '1', name: '商户审核通过待平台处理' },
    { code: '3', name: '平台审核通过' },
    { code: '4', name: '平台审核拒绝' }
  ],
  manualState: [
    { code: '-1', name: '全部' },
    { code: '0', name: '待处理' },
    { code: '1', name: '已处理' }
  ]
}

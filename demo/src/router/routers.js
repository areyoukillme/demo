const MainFrame = resolve => require(['@/components/layout/Main'], resolve)

const Index = resolve => require(['@/components/views/Index'], resolve)
// 商户管理
const MerchantFileAudit = resolve => require(['@/components/views/merchant/file/audit'], resolve)
const MerchantFileReject = resolve => require(['@/components/views/merchant/file/reject'], resolve)
const MerchantFileList = resolve => require(['@/components/views/merchant/file/list'], resolve)
const MerchantFileDetail = resolve => require(['@/components/views/merchant/file/detail'], resolve)
const MerchantEntryQuery = resolve => require(['@/components/views/merchant/entry/query'], resolve)
const MerchantCertificateList = resolve => require(['@/components/views/merchant/certificate/list'], resolve)

// 账户管理
const AccountManageQuery = resolve => require(['@/components/views/account/manage/query'], resolve)
const AccountManageDetail = resolve => require(['@/components/views/account/manage/detail'], resolve)
const AccountProfitDetail = resolve => require(['@/components/views/account/profit/detail'], resolve)
const accountProfitRecord = resolve => require(['@/components/views/account/profit/record'], resolve)

// 交易管理
const TradingOrderPay = resolve => require(['@/components/views/trading/order/pay'], resolve)
const TradingOrderRechange = resolve => require(['@/components/views/trading/order/rechange'], resolve)
const TradingOrderWithdraw = resolve => require(['@/components/views/trading/order/withdraw'], resolve)
const TradingOrderManual = resolve => require(['@/components/views/trading/order/manual'], resolve)
// S:weiGodY
const TradingOrderRepay = resolve => require(['@/components/views/trading/order/pay'], resolve)
// E:weiGodY
const TradingRefundQuery = resolve => require(['@/components/views/trading/refund/query'], resolve)
const TradingRefundAudit = resolve => require(['@/components/views/trading/refund/audit'], resolve)
const TradingRefundDetail = resolve => require(['@/components/views/trading/refund/detail'], resolve)

// 出金管理
const FundsManageProvisions = resolve => require(['@/components/views/funds/manage/provisions'], resolve)
const FundsManageNotice = resolve => require(['@/components/views/funds/manage/notice'], resolve)

// 登录
const Login = resolve => require(['@/components/views/Login'], resolve)

// 渠道管理
const PartnerManage = resolve => require(['@/components/views/channel/manage/partner'], resolve)
const PayChannelManage = resolve => require(['@/components/views/channel/manage/payChannel'], resolve)

// 业务管理
const BusinesInformationInfo = resolve => require(['@/components/views/business/information/info'], resolve)

// 系统管理
const SystemManageUser = resolve => require(['@/components/views/system/manage/user'], resolve)
const SystemManageRole = resolve => require(['@/components/views/system/manage/role'], resolve)
const SystemManageDepartment = resolve => require(['@/components/views/system/manage/department'], resolve)

const routers = [
  {
    path: '/',
    name: 'mainFrame',
    component: MainFrame,
    redirect: '/index',
    children: [
      // 首页
      {
        path: '/index',
        name: 'index',
        component: Index
      },
      // 查看商户资料
      {
        path: '/merchant/file/list',
        name: 'merchant-file',
        component: MerchantFileList
      },
      // 商户资料录入(查看，编辑)
      {
        path: '/merchant/file/detail/:opt/:cid',
        name: 'merchantDetail',
        component: MerchantFileDetail
      },
      {
        path: '/merchant/file/detail/:opt/:cid/:auditId/:auditModule',
        name: 'merchantDetailAudit',
        component: MerchantFileDetail
      },
      // 商户资料录入
      {
        path: '/merchant/file/detail',
        name: 'merchant-detail',
        component: MerchantFileDetail
      },
      // 商户审核
      {
        path: '/merchant/file/audit',
        name: 'merchant-audit',
        component: MerchantFileAudit
      },
      // 已拒绝商户
      {
        path: '/merchant/file/reject',
        name: 'merchant-reject',
        component: MerchantFileReject
      },
      // 商户证书管理
      {
        path: '/merchant/certificate/list',
        name: 'merchant-certificate-list',
        component: MerchantCertificateList
      },
      // 账户管理
      {
        path: '/account/manage/query',
        name: 'account-list',
        component: AccountManageQuery
      },
      {
        path: '/account/manage/detail',
        name: 'account-detail',
        component: AccountManageDetail
      },

      {
        path: '/account/profit/detail',
        name: 'fr-list',
        component: AccountProfitDetail
      },
      {
        path: '/account/profit/record',
        name: 'fr-Summary',
        component: accountProfitRecord
      },
      // 交易管理
      {
        path: '/trading',
        name: 'trading',
        component: TradingOrderPay
      },
      {
        path: '/trading/order/pay',
        name: 'trading-order-pay',
        component: TradingOrderPay
      },
      // 充值订单
      {
        path: '/trading/order/rechange',
        name: 'trading-order-rechange',
        component: TradingOrderRechange
      },
      // 提现订单
      {
        path: '/trading/order/withdraw',
        name: 'trading-order-withdraw',
        component: TradingOrderWithdraw
      },
      // 人工处理的交易表
      {
        path: '/trading/order/manual',
        name: 'trading-order-manual',
        component: TradingOrderManual
      },
      // 重复订单
      {
        path: '/trading/order/repeat',
        name: 'trading-order-repeat',
        component: TradingOrderRepay
      },
      // 退款订单查询
      {
        path: '/trading/refund/query',
        name: 'trading-refund-query',
        component: TradingRefundQuery
      },
      // 退款订单审核
      {
        path: '/trading/refund/audit',
        name: 'trading-refund-audit',
        component: TradingRefundAudit
      },
      // 审核
      {
        path: '/trading/refund/auditDetail/:refundApplyNo/:orgiTransactionNo/:customerCode',
        name: 'trading-refund-audit-detail',
        component: TradingRefundDetail
      },
      // 出金管理 - 备款
      {
        path: '/funds/manage/provisions',
        name: 'funds-manage-provisions',
        component: FundsManageProvisions
      },
      // 出金管理 - 通知
      {
        path: '/funds/manage/notice',
        name: 'funds-manage-notice',
        component: FundsManageNotice
      },
      // 合作机构管理
      {
        path: '/channel/manage/partner',
        name: 'channel-manage-partner',
        component: PartnerManage
      },
      // 支付渠道管理
      {
        path: '/channel/manage/payChannel',
        name: 'channel-manage-payChannel',
        component: PayChannelManage
      },
      // 业务管理
      {
        path: '/business/information/info',
        name: 'business',
        component: BusinesInformationInfo
      },
      // 系统管理
      {
        path: '/system',
        name: 'system',
        component: SystemManageUser
      },
      // 系统管理 - 用户管理
      // {
      //   path: '/system/manage/user/:roleName',
      //   name: 'system-manage-user-role',
      //   component: SystemManageUser
      // },
      {
        path: '/system/manage/user',
        name: 'system-manage-user',
        component: SystemManageUser
      },
      // 系统管理 - 角色管理
      {
        path: '/system/manage/role',
        name: 'system-manage-role',
        component: SystemManageRole
      },
      // 系统管理 - 角色管理
      // {
      //   path: '/system/manage/auth',
      //   name: 'system-manage-auth',
      //   component: SystemManageAuth
      // },
      // 系统管理 - 部门管理
      {
        path: '/system/manage/department',
        name: 'system-manage-department',
        component: SystemManageDepartment
      },
      {
        path: '/merchant/entry/query',
        name: 'merchant-entry-query',
        component: MerchantEntryQuery
      }
    ]
  },
  // login
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

export default routers

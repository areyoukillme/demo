
const menus = [
  {
    name: '首页',
    value: 'index',
    url: '/index',
    isParent: true,
    children: ''
  },
  {
    name: '商户管理',
    value: 'merchant',
    isParent: true,
    children: [
      {
        name: '商户资料管理',
        icon: 'android-document',
        value: 'file',
        children: [
          {
            name: '查看商户资料',
            value: 'list',
            url: '/merchant/file/list'
          },
          {
            name: '商户资料录入',
            value: 'detail',
            url: '/merchant/file/detail'
          },
          // {
          //   name: '测试测试',
          //   url: '/merchant/test'
          // },
          {
            name: '商户审核',
            value: 'audit',
            url: '/merchant/file/audit'
          },
          {
            name: '已拒绝商户',
            value: 'reject',
            url: '/merchant/file/reject'
          }
        ]
      },
      {
        name: '商户进件管理',
        icon: 'social-usd',
        value: 'entry',
        children: [
          {
            name: '商户进件查询',
            value: 'query',
            url: '/merchant/entry/query'
          }
        ]
      },
      {
        name: '商户证书管理',
        icon: 'android-textsms',
        value: 'certificate',
        children: [
          {
            name: '商户证书查询',
            // value: 'certList',
            value: 'list',
            url: '/merchant/certificate/list'
          }
        ]
      }
    ]
  },
  {
    name: '账户管理',
    value: 'account',
    isParent: true,
    children: [
      {
        name: '账户管理',
        icon: 'social-usd',
        value: 'manage',
        children: [
          {
            name: '账户查询',
            icon: 'android-boat',
            value: 'query',
            url: '/account/manage/query'
          },
          {
            name: '账户详情',
            icon: 'android-boat',
            value: 'detail',
            url: '/account/manage/detail'
          }
        ]
      },
      {
        name: '分润管理',
        icon: 'android-boat',
        value: 'profit',
        children: [
          {
            name: '分润记录明细',
            value: 'detail',
            url: '/account/profit/detail'
          },
          {
            name: '分润汇总记录',
            value: 'record',
            url: '/account/profit/record'
          }
        ]
      }
    ]
  },
  {
    name: '交易管理',
    value: 'trading',
    isParent: true,
    children: [
      {
        name: '交易管理',
        value: 'order',
        icon: 'android-list',
        children: [
          {
          // name: '支付订单',
            name: '交易订单',
            value: 'pay',
            url: '/trading/order/pay',
            children: []
          },
          {
            name: '提现订单',
            value: 'withdraw',
            url: '/trading/order/withdraw'
          },
          // {
          //   name: '重复订单',
          //   value: 'repeat',
          //   url: '/trading/order/repeat'
          // },
          {
            name: '人工处理订单',
            value: 'manual',
            url: '/trading/order/manual'
          }
        ]
      },
      {
        name: '退款管理',
        icon: 'cash',
        value: 'refund',
        children: [
          {
            name: '退款订单查询',
            value: 'query',
            url: '/trading/refund/query'
          },
          {
            name: '退款审核',
            value: 'audit',
            url: '/trading/refund/audit'
          }
        ]
      }
    ]
  },
  {
    name: '渠道管理',
    value: 'channel',
    isParent: true,
    children: [
      {
        name: '渠道管理',
        value: 'manage',
        icon: 'android-list',
        children: [
          {
            name: '合作机构管理',
            value: 'partner',
            url: '/channel/manage/partner'
          },
          {
            name: '支付渠道管理',
            value: 'payChannel',
            url: '/channel/manage/payChannel'
          }
        ]
      }
    ]
  },
  {
    name: '业务管理',
    value: 'business',
    isParent: true,
    children: [
      {
        name: '业务管理',
        value: 'information',
        icon: 'android-list',
        children: [
          {
            name: '业务信息',
            value: 'info',
            url: '/business/information/info'
          }
        ]
      }
    ]
  },
  {
    name: '出金管理',
    value: 'funds',
    isParent: true,
    children: [
      {
        name: '银联出金管理',
        value: 'manage',
        icon: 'android-list',
        children: [
          {
            name: '备款',
            value: 'provisions',
            url: '/funds/manage/provisions'
          },
          {
            name: '通知',
            value: 'notice',
            url: '/funds/manage/notice'
          }
        ]
      }
    ]
  },
  {
    name: '系统管理',
    value: 'system',
    isParent: true,
    children: [
      {
        name: '系统管理',
        value: 'manage',
        icon: 'social-windows',
        children: [
          {
            name: '用户管理',
            value: 'user',
            url: '/system/manage/user'
          },
          {
            name: '角色管理',
            value: 'role',
            url: '/system/manage/role'
          },
          {
            name: '权限管理',
            value: 'auth',
            url: '/system/manage/auth'
          }
        ]
      }
    ]
  }
]

export default menus

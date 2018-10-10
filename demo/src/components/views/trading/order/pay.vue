<template>
  <div class="trading-order-pay common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="payFormItem" :label-width="100">
            <c-date-picker ref="cdatepicker" isLast="true" @on-change="changeDate" @searchdata="getPayList" ></c-date-picker>
            <Row>
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="payFormItem.customerName" placeholder="请输入商户名称" />
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户编号" class="pay-line-input">
                  <Input v-model="payFormItem.customerCode" placeholder="请输入商户编号" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="DSP订单号" class="pay-line-input">
                  <Input v-model="payFormItem.transactionNo" placeholder="请输入DSP订单号" />
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户订单号" class="pay-line-input">
                  <Input v-model="payFormItem.outTradeNo" placeholder="请输入商户订单号" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="支付方式" class="pay-line-input">
                  <Select v-model="payMethod">
                    <Option v-for="p in payList" :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="支付状态" class="pay-line-input">
                  <Select v-model="payState">
                    <Option v-for="s in statusList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hashQuery != 'pay'">
              <Col span="10">
                <FormItem label="退款状态" class="pay-line-input">
                  <Select v-model="refundState">
                    <Option v-for="r in refundStateList" :value="r.code" :key="r.code">{{ r.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hashQuery == 'pay'">
              <Col span="10">
                <FormItem label="支付渠道" class="pay-line-input">
                  <Select v-model="channelName">
                    <Option v-for="c in channelList" :value="c.name" :key="c.name">{{ c.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="交易类型" class="pay-line-input">
                  <RadioGroup v-model="transactionType" @on-change="changeState">
                    <Radio  v-for="t in transactionTypeList" :label="t.code" :key="t.code">
                      <span>{{ t.name }}</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <!-- <Row>
              <Col span="12">
                <FormItem label="业务类型" class="pay-line-input">
                  <RadioGroup v-model="businessCode" @on-change="changebusiness">
                    <Radio v-for="b in businessList" :label="b.code" :key="b.code">
                      <span>{{ b.name }}</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row> -->
            <Row>
              <div class="common-check-button">
                  <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getPayList(1)">查询</Button>
                  <Button v-if="this.hasExport" type="success" size="large" :loading="download_loading" icon="arrow-right-a" @click="getDownload">导出</Button>
                  <Button size="large" type="success" icon="refresh" @click="getReset">清空</Button>
              </div>
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row class="pay-inner">
    <!-- 列表 -->
      <Col span="24">
        <Table border :columns="columnsName" :data="payDataList" ></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row class="pay-inner">
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal / payFormItem.pageSize > 1" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getPayList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
    <!-- 新增模态框 -->
    <Modal v-model="isShowDetailModal" width="1200px" >
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>查看明细</span>
      </p>
      <Row class="pay-inner">
        <!-- 列表 -->
        <Col span="24">
          <Table  :columns="detailCol" :data="detailDataList" ></Table>
        </Col>
        <!-- 列表 /-->
      </Row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import '@/assets/styles/tranding.less'
import CDatePicker from '@/components/layout/common/CDatePicker'
import CommonData from '@/common/data/index'
import Common from '@/assets/js/common'
import {GetServerBase, GetEvn} from '@/common/utils/index'
import Url from '@/assets/js/url'
export default {
  name: 'tradingOrderPay',
  components: {
    CDatePicker
  },
  data () {
    let auth = this.$store.state.app.menuOptions // 取出权限按钮
    return {
      loading: true,
      // S:weiGodY
      baseUrl: '',
      hashQuery: '', // 判断当前页面是重复订单还是交易订单
      optionsAuth: auth, // 权限按钮
      // E:weiGodY
      modal_loading: false,
      download_loading: false,
      payList: CommonData.payList,
      statusList: CommonData.statusList,
      channelList: CommonData.channelList,
      transactionTypeList: CommonData.transactionType,
      refundStateList: CommonData.refundStateList, // 退款状态
      isActive: false,
      currentIndex: '',
      hasExport: Common.getOperationNumber(this.$store.state.app.menuOptions) > 0,
      columnsName: [
        {
          key: 'index',
          title: '序号',
          width: 40
        },
        {
          key: 'createTime',
          title: '交易时间',
          width: 140
        },
        {
          key: 'endTime',
          title: '支付时间',
          width: 140
        },
        {
          key: 'customerCode',
          title: '商户编号',
          width: 140
        },
        {
          key: 'customerName',
          title: '商户名称'
        },
        {
          key: 'outTradeNo',
          title: '商户订单号'
        },
        {
          key: 'channelOrder',
          title: '上游订单号'
        },
        {
          key: 'channelName',
          title: '上游渠道'
        },
        {
          key: 'transactionNo',
          title: 'DSP订单号'
        },
        {
          key: 'amount',
          title: '订单金额（元）',
          width: 100
        },
        {
          key: 'procedureFee',
          title: '手续费（元）',
          width: 100
        },
        {
          key: 'payState',
          title: '支付状态'
        },
        {
          key: 'payMethod',
          title: '支付方式'
        },
        {
          key: 'refundState',
          title: '退款状态'
        },
        {
          key: 'refundTime',
          title: '退款成功时间'
        }
      ],
      payDataList: [],
      listTotal: 0,
      pageShowSizer: 50,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: 1,
      payState: '',
      payMethod: '',
      channelName: '', // 支付渠道
      refundState: '', // 退款状态
      transactionType: 'all',
      payFormItem: {
        pageSize: 50,
        pageNum: 1,
        transactionType: 'all',
        payState: '',
        channelName: '', // 支付渠道
        refundState: '', // 退款状态
        beginTime: new Date(),
        endTime: new Date(),
        customerCode: '',
        customerName: '',
        outTradeNo: '',
        transactionNo: '',
        payMethod: ''
      },
      beginTime: new Date(),
      endTime: new Date(),
      // downloadBaseUrl: (GetEvn() ? location.origin : (GetServerBase().baseServerUrl)) + baseUrl + '?download=true&type=csv',
      downloadBaseUrl: '',
      downloadUrl: '',
      /**
       * 模态框（新增/查看）
       */
      isShowDetailModal: false,
      curOperateType: '查看分账', // 查看分账
      detailDataList: [], // 分账明细中的表格数据
      detailListTotal: 0, // 记录总数
      detailCol: [
        {
          key: 'index',
          title: '序号',
          width: 40
        },
        {
          key: 'createTime',
          title: '分账时间',
          width: 140
        },
        {
          key: 'customerCode',
          title: '商户编号'
        },
        {
          key: 'customerName',
          title: '商户名称'
        },
        {
          key: 'transactionNo',
          title: 'DSP订单号'
        },
        {
          key: 'amount',
          title: '分账金额(元)'
        },
        {
          key: 'state',
          title: '分账状态'
        }
      ]
    }
  },
  watch: {
    '$route' () {
      this.init()
    }
  },
  methods: {
    open (nodesc) {
                this.$Notice.open({
                    title: 'Notification title',
                    desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
            },
    init () {
      this.changeState()
      let hash = this.getHash()
      // 当不是交易订单页面的时候，去除交易渠道
      this.columnsName = hash === 'pay' ? this.handleArr(1) : this.handleArr(0)
      this.hashQuery = hash
      let baseUrl = hash === 'pay' ? Url.trading.payDownload : Url.trading.repayDownload
      this.baseUrl = baseUrl
      this.hash = hash
      this.downloadBaseUrl = (GetEvn() ? location.origin : (GetServerBase().baseServerUrl)) + baseUrl + '?download=true&type=csv'
      this.getReset()
    },
    // 查看明细
    viewAll (params) {
      this.isShowDetailModal = true // 显示模态框
      let options = {
        customerCode: params.row.customerCode,
        outTradeNo: params.row.outTradeNo
      }
      this.$api.trading.getDetail(options).then((resJson) => {
        let list = []
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = r + 1
            json['createTime'] = resArray[r].createTime
            json['customerCode'] = resArray[r].customerCode
            json['customerName'] = resArray[r].customerName
            json['transactionNo'] = resArray[r].transactionNo
            json['amount'] = resArray[r].amount
            json['state'] = resArray[r].state === '3' ? '分账成功' : (resArray[r].state === '2' ? '分账失败' : '未执行')
            list.push(json)
          }
          this.detailDataList = list
          this.detailListTotal = resJson.total
        }
      })
    },
    // 改变交易类型
    changeState (val) {
      this.transactionType = val || this.transactionType
      if (Common.getOperationNumber(this.optionsAuth, 'list') > 0) {
        if ((this.transactionType === 'FZ' || this.transactionType === 'all') && Common.getOperationAuth('querySplitRecord', this.optionsAuth)) {
          this.handleArr(3)
          this.columnsName.push(
            {
              title: '操作',
              key: 'action',
              // fixed: 'right',
              width: 100,
              render: (h, params) => {
                if (params.row.transactionType === 'FZ') {
                  return h('div', [
                    h('Button', {
                      props: {
                        type:'primary'
                      },
                      on: {
                        click: () => {
                          this.viewAll(params)
                        }
                      }
                    }, '查看分账')
                  ])
                }
              }
            }
          )
        } else {
          this.handleArr(3)
        }
      }
      this.getPayList()
    },
    getPayList (currentPage) {
      this.loading = true
      this.modal_loading = true
      
      this.queryAllList((resJson) => {
        
        let list = []
        let resArray = resJson.rows
     
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = (this.payFormItem.pageNum - 1) * this.payFormItem.pageSize + r + 1
            json['createTime'] = resArray[r].createTime
            json['endTime'] = resArray[r].endTime
            json['customerCode'] = resArray[r].customerCode
            json['customerName'] = resArray[r].customerName
            json['outTradeNo'] = resArray[r].outTradeNo
            json['transactionNo'] = resArray[r].transactionNo
            json['channelOrder'] = resArray[r].channelOrder ? resArray[r].channelOrder : '-'
            json['channelName'] = resArray[r].channelName ? resArray[r].channelName : '-'
            json['refundState'] = resArray[r].refundState ? resArray[r].refundState : '-'
            json['refundTime'] = resArray[r].refundTime
            json['amount'] = resArray[r].amount ? (resArray[r].amount / 100).toFixed(2) : '-'
            if (resArray[r].procedureFee) {
              json['procedureFee'] = (resArray[r].procedureFee / 100).toFixed(2)
            } else if (resArray[r].procedureFee === 0) {
              json['procedureFee'] = '0.00'
            } else {
              json['procedureFee'] = '-'
            }
            json['transactionType'] = resArray[r].transactionType
            json['payState'] = Common.getTypeName(resArray[r].payState, 'statusList') || '-'
            json['payMethod'] = Common.getTypeName(resArray[r].payMethod, 'payList') || '-'
            json['refundState'] = Common.getTypeName(resArray[r].refundState, 'refundStateList') || '-'
            list.push(json)
          }
        }
        this.payDataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = this.download_loading = false
      }, currentPage)
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.payFormItem.pageSize = pageSize
      this.getPayList()
    },
    // 查询列表
    getCheckList () {
      if (!(this.payFormItem.customerName || this.payFormItem.customerCode || this.payFormItem.outTradeNo || this.payFormItem.transactionNo || this.beginTime || this.endTime || this.payMethod || this.payState || this.transactionType || this.channelName || this.refundState)) {
        this.$Message.error('请至少输入一条查询条件！')
        return false
      }
      if ((new Date(this.endTime) - new Date(this.beginTime)) / 24 / 60 / 60 / 1000 + 1 > 31) {
        this.$Message.error('只允许查看31天范围订单')
        return false
      }
      return true
    },
    queryAllList (callBack, currentPage) {
      if (!this.getCheckList()) {
        this.modal_loading = true
        this.download_loading = true
        this.loading = false
        return false
      }
      let options = this.payFormItem
      let beginTime = this.beginTime
      let endTime = this.endTime
      let fileName = 'EFPS-' + (this.hashQuery === 'pay' ? '交易' : '重复') + '订单导出-' + Common.getTimeFormat(new Date(), 'YYYYMMDD', 0, false)
      this.pageCurrent = this.payFormItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.beginTime = Common.getTimeFormat(beginTime, 'YYYYMMDD', 0, true)
      options.endTime = Common.getTimeFormat(endTime, 'YYYYMMDD', 1, true)
      this.payFormItem.payMethod = this.payMethod === '-1' ? '' : this.payMethod
      this.payFormItem.payState = this.payState === '-1' ? '' : this.payState
      this.payFormItem.channelName = this.channelName === '全部' ? '' : this.channelName
      this.payFormItem.refundState = this.refundState === '-1' ? '' : this.refundState
      this.payFormItem.transactionType = this.transactionType === 'all' ? '' : this.transactionType
      this.downloadUrl = this.downloadBaseUrl + '&beginTime=' + options.beginTime + '&endTime=' + options.endTime + '&customerCode=' + options.customerCode + '&payState=' + this.payFormItem.payState + '&customerName=' + options.customerName + '&outTradeNo=' + options.outTradeNo + '&transactionNo=' + options.transactionNo + '&payMethod=' + this.payFormItem.payMethod + '&refundState=' + this.payFormItem.refundState + '&channelName=' + this.payFormItem.channelName + '&transactionType=' + ((this.payFormItem.transactionType === 'all') ? '' : this.payFormItem.transactionType) + '&fileName=' + fileName + '.csv&'
      this.$api.trading[(this.hashQuery === 'pay' ? 'getPlayList' : 'getRepayOrder')](options).then((resJson) => {
        callBack(resJson)
      })
    },
    // 导出
    getDownload () {
      if (!(this.payFormItem.customerName || this.payFormItem.customerCode || this.payFormItem.outTradeNo || this.payFormItem.transactionNo || this.beginTime || this.endTime || this.payMethod || this.payState || this.transactionType || this.channelName || this.refundState)) {
        this.$Message.error('请至少输入一条查询条件！')
        return
      }
      this.download_loading = true
      this.queryAllList((resJson) => {
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          var node = document.createElement('a')
          node.setAttribute('href', encodeURI(this.downloadUrl))
          if (document.getElementById('tradeDownload')) {
            document.getElementById('tradeDownload').remove()
          }
          node.setAttribute('id', 'tradeDownload')
          node.setAttribute('download', '支付订单')
          document.body.appendChild(node)
          node.click()
        } else {
          this.$Message.error('很抱歉，暂无数据导出！')
        }
        setTimeout(() => {
          this.download_loading = false
        }, this.listTotal)
      })
    },
    // 时间切换
    getDateChange (num) {
      let date = new Date()
      let now = date.getTime()
      this.endTime = date
      let beginTime = now - num * 24 * 60 * 60 * 1000
      this.beginTime = new Date(beginTime)
      this.currentIndex = num
    },
    // 清空条件
    getReset () {
      this.payFormItem = {
        pageSize: 50,
        pageNum: 1,
        transactionType: 'all',
        payState: '',
        beginTime: '',
        endTime: '',
        customerCode: '',
        customerName: '',
        outTradeNo: '',
        transactionNo: '',
        payMethod: '',
        channelName: '' // 支付渠道
      }
      this.payState = ''
      this.payMethod = ''
      this.channelName = '' // 支付渠道
      this.transactionType = 'all'
      this.beginTime = new Date()
      this.endTime = new Date()
      this.currentIndex = 0
      this.$refs.cdatepicker.currentIndex = 0
      this.$refs.cdatepicker.currentLast = ''
      this.$refs.cdatepicker.bTime = this.$refs.cdatepicker.eTime = new Date()
      this.getPayList()
    },
    changeDate (type, time) {
      if (type === '1') {
        this.beginTime = time
      } else {
        this.endTime = time
      }
    },
    getHash () {
      return this.$route.path.split('/')[3]
    },
    // 对columnsName数组的处理
    handleArr (num) {
      let item1 = {
        key: 'refundState',
        title: '退款状态'
      }
      let item2 = {
        key: 'refundTime',
        title: '退款成功时间'
      }
      let arr = this.columnsName
      let refundIndex = -1 // 标记支付渠道的位置
      let methodIndex = -1 // 标记支付方式的位置
      let actionIndex = -1 // 标记操作的位置，判断此时是否有操作这个选项
      for (let i = 0, length = arr.length; i < length; i++) {
        if (arr[i].key === 'refundState') {
          refundIndex = i
        }
        if (arr[i].key === 'payMethod') {
          methodIndex = i
        }
        if (arr[i].key === 'action') {
          actionIndex = i
        }
      }
      if (num === 0) { // 为重复订单页面
        if (refundIndex === -1) {
          arr.splice(methodIndex + 1, 0, item1, item2) // 添加支付渠道
        }
      } else if (num === 1) { // 为交易订单页面,此时进行的是处理删除退款字段显示的操作
        if (refundIndex !== -1) {
          arr.splice(methodIndex + 1, 2) // 删除退款
        }
      } else { // 处理的是表格中操作的显示
        if (actionIndex !== -1) {
          arr.pop()
        }
      }
      return arr
    }
  },
  mounted () {
    this.init(),

    this.getPayList();
  }
}
</script>

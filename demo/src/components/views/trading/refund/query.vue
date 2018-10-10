<template>
  <div class="trading-order-manage common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="formItem" :label-width="100">
            <c-date-picker ref="cdatepicker" @on-change="changeDate" :label="titmeTitle"></c-date-picker>
            <Row>
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入商户名称"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户编号" class="pay-line-input">
                  <Input v-model="formItem.customerCode" placeholder="请输入商户编号"/>
                </FormItem>
              </Col>
            </Row>
             <Row>
              <Col span="10">
                <FormItem label="退款申请号" class="pay-line-input">
                  <Input v-model="formItem.outRefundNo" placeholder="请输入退款申请号"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="DSP退款单号" class="pay-line-input">
                  <Input v-model="formItem.transactionNo" placeholder="请输入DSP退款单号"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- <Col span="10">
                <FormItem label="退款审核状态" class="pay-line-input">
                  <Select v-model="formItem.auditState">
                    <Option v-for="p in auditStateList" :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col> -->
              <Col span="10">
                <FormItem label="原订单编号" class="pay-line-input">
                  <Input v-model="formItem.outTradeNo" placeholder="请输入原订单编号"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="退款状态" class="pay-line-input">
                  <Select v-model="refundState">
                    <Option v-for="p in refundStateList" :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <div class="common-check-button">
                <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="search" class="pay-check-button">查询</Button>
                <Button v-if="this.hasExport" type="ghost" size="large" :loading="download_loading" icon="arrow-right-a" @click="exportData">导出</Button>
                <Button size="large" icon="refresh" @click="getReset" class="pay-check-button">清空</Button>
              </div>
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row>
      <!-- 列表 -->
      <Col span="24">
        <Table border :columns="columnsName" :data="dataList"  ref="selection"  class="order-tab"></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row>
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal / pageShowSizer > 1" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total @on-change="getList" @on-page-size-change="getPageSizeChange" class="common-page-box"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
  </div>
</template>

<script>
import '@/assets/styles/tranding.less'
import Common from '@/assets/js/common'
import CommonData from '@/common/data/index'
import CDatePicker from '@/components/layout/common/CDatePicker'
import {GetServerBase, GetEvn} from '@/common/utils/index'
import Url from '@/assets/js/url'
export default {
  name: 'query',
  components: {
    CDatePicker
  },
  data () {
    let pageCurrent = 1
    let baseUrl = Url.trading.refundDownload
    return {
      selection: [],
      loading: false,
      modal_loading: false,
      download_loading: false, // 导出操作的
      auditStateList: CommonData.auditStateList,
      refundStateList: CommonData.refundStateList,
      refundState: '',
      hasExport: Common.getOperationNumber(this.$store.state.app.menuOptions) > 0,
      titmeTitle: '退款时间',
      downloadBaseUrl: (GetEvn() ? location.origin : (GetServerBase().baseServerUrl)) + baseUrl + '?download=true&type=csv', // 导出使用的地址
      downloadUrl: '', // 导出使用的地址
      refundMethodList: [
        { code: '1', name: '原路退回' },
        { code: '2', name: '其它（暂不支持）' }
      ],
      columnsName: [
        {
          key: 'index',
          title: '序号',
          width: 40
        },
        {
          key: 'createTime',
          title: '退款时间',
          width: 75
        },
        {
          key: 'updateTime',
          title: '状态更新时间',
          width: 120
        },
        {
          key: 'customerCode',
          title: '商户编号'
        },
        {
          key: 'customername',
          title: '商户名称'
        },
        {
          key: 'outRefundNo',
          title: '退款申请号'
        },
        {
          key: 'outTradeNo',
          title: '原订单编号'
        },
        {
          key: 'transactionNo',
          title: 'DSP退款单号'
        },
        {
          key: 'refundFee',
          title: '申请退款金额（元）',
          width: 120
        },
        {
          key: 'procedureFee',
          title: '退回收单手续费（元）',
          width: 130
        },
        {
          key: 'payState',
          title: '退款状态'
        }
        // 后续可能会用到，先不要删除
        // {
        //   title: '操作',
        //   key: 'action',
        //   fixed: 'right',
        //   width: 50,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('Button', {
        //         props: {
        //           size: 'small'
        //         },
        //         on: {
        //           click: () => {
        //           }
        //         }
        //       }, '详情')
        //     ])
        //   }
        // }
      ],
      dataList: [],
      listTotal: 0,
      startTimeOptions: {
        disabledDate: (time) => {
          return time && time.valueOf() > Date.now()
        }
      },
      endTimeOptions: {
        disabledDate: (time) => {
          return time && time.valueOf() > Date.now()
        }
      },
      pageShowSizer: 10,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      beginCreateTime: '',
      endCreateTime: '',
      formItem: {
        pageSize: 10,
        pageNum: 1,
        customerName: '',
        customerCode: '',
        beginTime: '',
        endTime: '',
        // refundApplyNo: '',
        refundTransactionNo: '',
        refundState: '',
        // auditState: '',
        outRefundNo: '',
        transactionNo: '',
        outTradeNo: '' // 原订单编号
      },
      // 弹出模态框
      modal: {
        isOpen: false,
        accountFormItem: [{}, {}]
      }
    }
  },
  methods: {
    getList (currentPage) {
      this.loading = true
      this.queryAllList((resJson) => {
        let list = []
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = this.formItem.pageSize * (this.formItem.pageNum - 1) + 1 + r
            json['createTime'] = resArray[r].createTime
            json['updateTime'] = resArray[r].updateTime
            json['customerCode'] = resArray[r].customerCode
            json['customername'] = resArray[r].customername
            json['transactionNo'] = resArray[r].transactionNo
            json['outTradeNo'] = resArray[r].outTradeNo
            json['refundTransactionNo'] = resArray[r].refundTransactionNo
            json['refundFee'] = (resArray[r].refundFee / 100).toFixed(2)
            json['procedureFee'] = (resArray[r].procedureFee / 100).toFixed(2)
            json['payState'] = Common.getTypeName(resArray[r].payState, 'refundStateList')
            json['outRefundNo'] = resArray[r].outRefundNo

            list.push(json)
          }
        }
        this.dataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
        this.download_loading = false
      }, currentPage)
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.formItem.pageSize = pageSize
      this.getList()
    },
    // 查询列表
    search () {
      if (!(this.formItem.customerName || this.formItem.customerCode || this.formItem.outRefundNo || this.formItem.transactionNo || this.formItem.outTradeNo || this.beginCreateTime || this.endCreateTime || this.refundState)) {
        this.$Message.error('请至少输入一条查询条件！')
        return
      }
      this.modal_loading = true
      this.getList()
    },
    // 获取数据
    queryAllList (callback, currentPage) {
      let options = this.formItem
      options.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      this.pageCurrent = this.formItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.payState = this.refundState === '-1' ? '' : this.refundState
      options.beginTime = Common.getTimeFormat(this.beginCreateTime, 'YYYYMMDD', 0, true)
      options.endTime = Common.getTimeFormat(this.endCreateTime, 'YYYYMMDD', 1, true)
      let fileName = 'EFPS-退款订单导出-' + Common.getTimeFormat(new Date(), 'YYYYMMDD', 0, false)
      this.downloadUrl = this.downloadBaseUrl + '&beginTime=' + options.beginTime + '&endTime=' + options.endTime + '&customerCode=' + options.customerCode + '&payState=' + options.payState + '&refundTransactionNo=' + options.refundTransactionNo + '&refundState=' + options.refundState + '&outRefundNo=' + options.outRefundNo + '&customerName=' + options.customerName + '&transactionNo=' + options.transactionNo + '&outTradeNo=' + options.outTradeNo + '&fileName=' + fileName + '.csv'
      this.$api.trading.getRefundList(options).then(resJson => {
        callback(resJson)
      })
    },
    // 导出
    exportData () {
      if (!(this.formItem.customerName || this.formItem.customerCode || this.formItem.outRefundNo || this.formItem.transactionNo || this.formItem.outTradeNo || this.beginCreateTime || this.endCreateTime || this.refundState)) {
        this.$Message.error('请至少输入一条查询条件！')
        return
      }
      this.download_loading = true
      this.queryAllList((resJson) => {
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          var node = document.createElement('a')
          node.setAttribute('href', encodeURI(this.downloadUrl))
          console.log(this.downloadUrl)
          if (document.getElementById('tradeDownload')) {
            document.getElementById('tradeDownload').remove()
          }
          node.setAttribute('id', 'tradeDownload')
          node.setAttribute('download', '退款订单')
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
    // 查看账户详情
    viewDetail (data, index) {
      let params = {
        refundApplyNo: data.outRefundNo,
        orgiTransactionNo: data.orgiTransactionNo,
        customerCode: data.customerCode,
        currType: 'view'
      }
      this.$router.push({name: 'trading-refund-audit-detail', params: params})
    },
    changeDate (type, time) {
      if (type === '1') {
        this.beginCreateTime = time
      } else {
        this.endCreateTime = time
      }
    },
    // 清空条件
    getReset () {
      // this.beginCreateTime = ''
      // this.endCreateTime = ''
      this.pageCurrent = 1
      this.refundState = ''
      this.formItem = {
        pageSize: 10,
        pageNum: 1,
        customerName: '',
        customerCode: '',
        beginTime: '',
        endTime: '',
        refundApplyNo: '',
        refundTransactionNo: '',
        refundState: '',
        auditState: '',
        outRefundNo: '',
        transactionNo: '',
        outTradeNo: ''
      }
      // this.$refs.cdatepicker.clear()
      this.$refs.cdatepicker.currentIndex = 0
      this.beginCreateTime =
      this.endCreateTime =
      this.$refs.cdatepicker.bTime =
      this.$refs.cdatepicker.eTime = new Date()
      this.getList(1)
    }
  },
  mounted () {
    // this.$refs.cdatepicker.timeLabel = '退款时间'
    this.$refs.cdatepicker.currentIndex = 0
    this.$refs.cdatepicker.bTime =
    this.$refs.cdatepicker.eTime =
    this.beginCreateTime =
    this.endCreateTime = new Date()
    this.getList()
  }
}
</script>

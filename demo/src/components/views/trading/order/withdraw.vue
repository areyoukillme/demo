<template>
  <div class="trading-order-pay common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="payFormItem" :label-width="100">
            <c-date-picker ref="cdatepicker" @on-change="changeDate"></c-date-picker>
            <Row>
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="payFormItem.customerName" placeholder="请输入商户名称"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户编号" class="pay-line-input">
                  <Input v-model="payFormItem.customerCode" placeholder="请输入商户编号"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="DSP订单号" class="pay-line-input">
                  <Input v-model="payFormItem.transactionNo" placeholder="请输入DSP订单号"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户订单号" class="pay-line-input">
                  <Input v-model="payFormItem.outTradeNo" placeholder="请输入商户订单号"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="上游渠道" class="pay-line-input">
                  <Select v-model="channelName">
                    <Option v-for="c in upStreamList" :value="c.name" :key="c.name">{{ c.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="提现状态" class="pay-line-input">
                  <Select v-model="payState">
                    <Option v-for="s in statusList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <div class="common-check-button">
                <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getCheckList">查询</Button>
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
    let baseUrl = Url.trading.withdrawDownload
    return {
      loading: false,
      modal_loading: false,
      payList: CommonData.payList,
      statusList: CommonData.withdrawList,
      upStreamList: CommonData.upStreamList, // 上游渠道
      download_loading: false,
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
          width: 130
        },
        {
          key: 'customerCode',
          title: '商户编号',
          width: 130
        },
        {
          key: 'customerName',
          title: '商户名称'
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
          key: 'outTradeNo',
          title: '商户订单号'
        },
        {
          key: 'transactionNo',
          title: 'DSP订单号'
        },
        {
          key: 'totalFee',
          title: '提现金额（元）'
        },
        {
          key: 'procedureFee',
          title: '手续费（元）',
          width: 90
        },
        {
          key: 'payState',
          title: '提现状态',
          width: 80
        },
        {
          key: 'cardNo',
          title: '提现到银行卡账户',
          width: 130
        },
        {
          key: 'arrivalType',
          title: '到账类型'
        }
      ],
      payDataList: [],
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
      payState: '',
      channelName: '', // 上游渠道
      pageCurrent: 1,
      payFormItem: {
        pageSize: 10,
        pageNum: 1,
        beginTime: new Date(),
        endTime: new Date(),
        customerCode: '',
        customerName: '',
        outTradeNo: '',
        transactionNo: '',
        payState: '',
        channelName: ''
      },
      beginTime: new Date(),
      endTime: new Date(),
      downloadBaseUrl: (GetEvn() ? location.origin : (GetServerBase().baseServerUrl)) + baseUrl + '?download=true&fileName=EFPS-提现订单导出-' + Common.getTimeFormat(new Date(), 'YYYYMMDD', 0, false) + '.csv&type=csv',
      downloadUrl: ''
    }
  },
  methods: {
    getPayList (currentPage) {
      this.loading = true
      this.queryAllList((resJson) => {
        let list = []
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = (this.payFormItem.pageNum - 1) * this.payFormItem.pageSize + r + 1
            json['createTime'] = resArray[r].createTime || '-'
            json['customerCode'] = resArray[r].customerCode || '-'
            json['customerName'] = resArray[r].customerName || '-'
            json['outTradeNo'] = resArray[r].outTradeNo || '-'
            json['transactionNo'] = resArray[r].transactionNo || '-'
            json['totalFee'] = resArray[r].totalFee ? (resArray[r].totalFee / 100).toFixed(2) : '-'
            json['channelOrder'] = resArray[r].channelOrder ? resArray[r].channelOrder : '-'
            json['channelName'] = resArray[r].channelName ? resArray[r].channelName : '-'
            if (resArray[r].procedureFee) {
              json['procedureFee'] = (resArray[r].procedureFee / 100).toFixed(2)
            } else if (resArray[r].procedureFee === 0) {
              json['procedureFee'] = '0.00'
            } else {
              json['procedureFee'] = '-'
            }
            json['payState'] = Common.getTypeName(resArray[r].payState, 'withdrawList') || '-'
            json['cardNo'] = resArray[r].cardNo || '-'
            let arrivalType = resArray[r].arrivalType.trim()
            if (arrivalType === '0') {
              json['arrivalType'] = '实时到账'
            } else if (arrivalType === '1') {
              json['arrivalType'] = 'T+1到账'
            } else if (arrivalType === '2') {
              json['arrivalType'] = 'D0到账'
            } else {
              json['arrivalType'] = '-'
            }
            list.push(json)
          }
        }
        this.payDataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
      }, currentPage)
    },
    // 获取方式或者状态名 index 0: 支付方式 1： 支付状态
    getTypeName (typeCode, index) {
      let typeArray = (index === 0) ? this.payList : this.statusList
      for (var i = 0; i < typeArray.length; i++) {
        if (parseInt(typeArray[i].code) === parseInt(typeCode)) {
          return typeArray[i].name
        }
      }
      return ''
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.payFormItem.pageSize = pageSize
      this.getPayList()
    },
    // 查询列表
    getCheckList () {
      if (!(this.payFormItem.customerName || this.payFormItem.customerCode || this.payFormItem.outTradeNo || this.payFormItem.transactionNo || this.beginTime || this.endTime || this.payState || this.channelName)) {
        this.$Message.error('请至少输入一条查询条件！')
        return
      }
      this.modal_loading = true
      this.payFormItem.payState = this.payFormItem.payState.trim()
      this.pageCurrent = 1
      this.getPayList()
    },
    // 选择结束的开始时间
    chooseStartTime (date) {
      this.startTimeOptions = Common.chooseStartTime(date)
    },
    // 选择开始的结束时间
    chooseStartEndTime (date) {
      this.endTimeOptions = Common.chooseStartEndTime(date)
    },
    formatterStatus (value) {
      if (value === '0') {
        return '成功'
      } else if (value === '1') {
        return '失败'
      } else if (value === '2') {
        return '未支付'
      } else if (value === '3') {
        return '处理中'
      }
    },
    queryAllList (callBack, currentPage) {
      let options = this.payFormItem
      this.pageCurrent = this.payFormItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.beginTime = Common.getTimeFormat(this.beginTime, 'YYYYMMDD', 0, true)
      options.endTime = Common.getTimeFormat(this.endTime, 'YYYYMMDD', 1, true)
      this.payFormItem.payState = this.payState === '-1' ? '' : this.payState
      this.payFormItem.channelName = this.channelName === '全部' ? '' : this.channelName
      this.downloadUrl = this.downloadBaseUrl + '&beginTime=' + options.beginTime + '&endTime=' + options.endTime + '&customerCode=' + options.customerCode + '&channelName=' + this.payFormItem.channelName + '&payState=' + this.payFormItem.payState + '&customerName=' + options.customerName + '&outTradeNo=' + options.outTradeNo + '&transactionNo=' + options.transactionNo
      this.$api.trading.getWithdraw(options).then((resJson) => {
        callBack(resJson)
      })
    },
    // 导出
    getDownload () {
      if (!(this.payFormItem.customerName || this.payFormItem.customerCode || this.payFormItem.outTradeNo || this.payFormItem.transactionNo || this.beginTime || this.endTime || this.payMethod || this.payState || this.transactionType || this.channelName)) {
        this.$Message.error('请至少输入一条查询条件！')
        return
      }
      this.download_loading = true
      this.queryAllList((resJson) => {
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          var node = document.createElement('a')
          node.setAttribute('href', encodeURI(this.downloadUrl))
          if (document.getElementById('tradeDownload') !== null) {
            document.getElementById('tradeDownload').remove()
          }
          node.setAttribute('id', 'tradeDownload')
          node.setAttribute('download', '提现订单')
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
    // 清空条件
    getReset () {
      this.payState = ''
      this.channelName = ''
      this.payFormItem = {
        pageSize: 10,
        pageNum: 1,
        beginTime: '',
        endTime: '',
        customerCode: '',
        customerName: '',
        outTradeNo: '',
        transactionNo: '',
        payState: '',
        channelName: ''
      }
      this.pageCurrent = 1
      // this.$refs.cdatepicker.clear()
      this.beginTime = new Date()
      this.endTime = new Date()
      this.currentIndex = 0
      this.$refs.cdatepicker.currentIndex = 0
      this.$refs.cdatepicker.bTime = this.$refs.cdatepicker.eTime = new Date()
      this.getPayList(1)
    },
    changeDate (type, time) {
      if (type === '1') {
        this.beginTime = time
      } else {
        this.endTime = time
      }
    }
  },
  mounted () {
    this.getPayList()
    this.$refs.cdatepicker.currentIndex = 0
    this.$refs.cdatepicker.bTime = this.$refs.cdatepicker.eTime = new Date()
  }
}
</script>

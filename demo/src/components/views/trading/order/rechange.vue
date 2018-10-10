<template>
  <div class="trading-order-pay">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="pay-hd-inner">
          <Form :model="payFormItem" :label-width="100">
            <c-date-picker ref="cdatepicker" @on-change="changeDate"></c-date-picker>
            <Row>
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="payFormItem.customerName" placeholder="请输入商户名称"></Input>
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
                <FormItem label="DSP订单号" class="pay-line-input">
                  <Input v-model="payFormItem.transactionNo" placeholder="请输入DSP订单号"></Input>
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
                <FormItem label="充值状态" class="pay-line-input">
                  <Select v-model="payState">
                    <Option v-for="s in statusList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="支付方式" class="pay-line-input">
                  <Select v-model="payMethod">
                    <Option v-for="p in payList" :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <div class="pay-opt-inner">
                <Col span="2">
                  <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getCheckList" class="pay-check-button">查询</Button>
                </Col>
                <Col span="2">
                  <Button type="ghost" size="large" :loading="download_loading" icon="arrow-right-a" class="pay-check-button" @click="getDownload">导出</Button>
                </Col>
                <Col span="2">
                  <Button size="large" icon="refresh" @click="getReset" class="pay-check-button">清空</Button>
                </Col>
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
        <Page v-if="listTotal / payFormItem.pageSize > 1" ref="pages"  :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="pay-page" @on-change="getPayList" @on-page-size-change="getPageSizeChange"></Page>
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
    let baseUrl = Url.trading.payDownload
    return {
      loading: false,
      modal_loading: false,
      download_loading: false,
      payList: CommonData.payList,
      statusList: CommonData.statusList,
      columnsName: [
        {
          key: 'index',
          title: '序号',
          width: 50
        },
        {
          key: 'createTime',
          title: '交易时间',
          width: 75
        },
        {
          key: 'endTime',
          title: '支付时间',
          width: 75
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
          key: 'merchantName',
          title: '银行订单号'
        },
        {
          key: 'amount',
          title: '充值金额（元）',
          width: 100
        },
        {
          key: 'procedureFee',
          title: '手续费（元）',
          width: 100
        },
        {
          key: 'payState',
          title: '充值状态',
          width: 80
        },
        {
          key: 'payMethod',
          title: '支付方式',
          width: 120
        },
        {
          key: 'srcChannelType',
          title: '支付渠道'
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
      pageCurrent: 1,
      payState: '',
      payMethod: '',
      payFormItem: {
        pageSize: 10,
        pageNum: 1,
        transactionType: 'CZ',
        payState: '',
        beginTime: '',
        endTime: '',
        customerCode: '',
        customerName: '',
        outTradeNo: '',
        transactionNo: '',
        payMethod: '',
        merchantName: '',
        srcChannelType: ''
      },
      beginTime: '',
      endTime: '',
      downloadBaseUrl: (GetEvn() ? location.origin : (GetServerBase().baseServerUrl)) + baseUrl + '?transactionType=CZ&download=true&fileName=充值订单.csv&type=csv',
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
            json['endTime'] = resArray[r].endTime || '-'
            json['customerCode'] = resArray[r].customerCode || '-'
            json['customerName'] = resArray[r].customerName || '-'
            json['outTradeNo'] = resArray[r].outTradeNo || '-'
            json['transactionNo'] = resArray[r].transactionNo || '-'
            json['channelOrder'] = resArray[r].channelOrder ? resArray[r].channelOrder : '-'
            json['channelName'] = resArray[r].channelName ? resArray[r].channelName : '-'
            json['amount'] = resArray[r].amount ? (resArray[r].amount / 100).toFixed(2) : '-'
            if (resArray[r].procedureFee) {
              json['procedureFee'] = (resArray[r].procedureFee / 100).toFixed(2)
            } else if (resArray[r].procedureFee === 0) {
              json['procedureFee'] = '0.00'
            } else {
              json['procedureFee'] = '-'
            }
            json['payState'] = Common.getTypeName(resArray[r].payState, 'statusList') || '-'
            json['payMethod'] = Common.getTypeName(resArray[r].payMethod, 'payList') || '-'
            json['merchantName'] = resArray[r].merchantName || '-'
            json['srcChannelType'] = resArray[r].srcChannelType === '01' ? '移动支付' : '互联网支付'
            list.push(json)
          }
        }
        this.payDataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
        this.payFormItem.beginTime = this.beginTime
        this.payFormItem.endTime = this.endTime
      }, currentPage)
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.payFormItem.pageSize = pageSize
      this.getPayList()
    },
    // 查询列表
    getCheckList () {
      this.modal_loading = true
      this.payFormItem.beginTime = this.beginTime
      this.payFormItem.endTime = this.endTime
      this.payFormItem.payMethod = this.payFormItem.payMethod.trim()
      this.payFormItem.payState = this.payFormItem.payState.trim()
      this.pageCurrent = 1
      this.getPayList()
    },
    queryAllList (callBack, currentPage) {
      let options = this.payFormItem
      this.payFormItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.beginTime = Common.getTimeFormat(options.beginTime, 'YYYYMMDD', 0)
      options.endTime = Common.getTimeFormat(options.endTime, 'YYYYMMDD', 1)
      this.payFormItem.payMethod = this.payMethod === '-1' ? '' : this.payMethod
      this.payFormItem.payState = this.payState === '-1' ? '' : this.payState
      this.downloadUrl = this.downloadBaseUrl + '&beginTime=' + options.beginTime + '&endTime=' + options.endTime + '&customerCode=' + options.customerCode + '&payState=' + this.payFormItem.payState + '&customerName=' + options.customerName + '&outTradeNo=' + options.outTradeNo + '&transactionNo=' + options.transactionNo + '&payMethod=' + this.payFormItem.payMethod
      this.$api.trading.getPlayList(options).then((resJson) => {
        callBack(resJson)
      })
    },
    // 导出
    getDownload () {
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
          node.setAttribute('download', '充值订单')
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
      this.beginTime = ''
      this.endTime = ''
      this.payState = ''
      this.payMethod = ''
      this.payFormItem = {
        pageSize: 10,
        pageNum: 1,
        transactionType: 'CZ',
        payState: '',
        beginTime: '',
        endTime: '',
        customerCode: '',
        customerName: '',
        outTradeNo: '',
        transactionNo: '',
        payMethod: ''
      }
      this.pageCurrent = 1
      this.$refs.cdatepicker.clear()
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
  }
}
</script>

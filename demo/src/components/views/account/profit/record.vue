<template>
  <div class="trading-order-pay common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="formItem" :label-width="100">
            <Row>
              <Col span="10">
                <FormItem label="交易时间">
                  <Row>
                    <Col span="11">
                      <DatePicker type="date" placeholder="建立时间" v-model="formItem.startTime" :options="startTimeOptions" @on-change="chooseStartEndTime"></DatePicker>
                    </Col>
                    <Col span="2" class="text-center">-</Col>
                    <Col span="11">
                      <DatePicker type="date" placeholder="结束时间" v-model="formItem.endTime" :options="endTimeOptions" @on-change="chooseStartTime"></DatePicker>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="代理商名称" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入代理商名称"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="代理商编号" class="pay-line-input">
                  <Input v-model="formItem.customerCode" placeholder="请输入代理商编号"></Input>
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getList" class="common-check-button">查询</Button>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row>
      <!-- 列表 -->
      <Col span="24" class="merchant-list-tab">
        <Table border :columns="columnsName" :data="dataList" :loading="loading" ref="selection" @on-selection-change="selectMerchantSelection"></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row>
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal > 0" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getDataList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
  </div>
</template>

<script>
// import Common from '@/assets/js/common'
import moment from 'moment'
export default {
  name: 'accountList',
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      loading: false,
      modal_loading: false,
      businessTypeList: [
        { code: '', name: '请选择' },
        { code: '1', name: '互联网支付' }
      ],
      businessNameList: [
        { code: '', name: '请选择' },
        { code: '1', name: '快捷支付' }
      ],
      payMethodList: [
        { code: '', name: '请选择' },
        { code: '1', name: '快捷支付' }
      ],
      columnsName: [
        {
          key: 'profileCycleTime',
          title: '分润统计周期',
          width: 150
        },
        {
          key: 'customerCode',
          title: '代理商编号'
        },
        {
          key: 'customerName',
          title: '代理商名称'
        },
        {
          key: 'totalProfileAmountForPay',
          title: '总分润基准金额'
        },
        {
          key: 'profileRatioPercent',
          title: '分润比例'
        },
        {
          key: 'totalProfileAmountForRefund',
          title: '因退款需收回分润金额'
        },
        {
          key: 'actualTotalProfileAmount',
          title: '分润总金额'
        },
        {
          key: 'settedTime',
          title: '记账日期'
        }
      ],
      dataList: [],
      listTotal: 0,
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      formItem: {
        pageSize: pageShowSizer,
        pageNum: pageCurrent,
        startTime: '',
        endTime: '',
        customerName: '',
        customerCode: '',
        businessType: '',
        businessName: '',
        payMethod: ''
      }
    }
  },
  methods: {
    getList (currentPage) {
      this.loading = true
      let options = this.formItem
      options.startTime = this.getDateFormat(this.formItem.startTime, 'YYYYMMDD')
      options.endTime = this.getDateFormat(this.formItem.startTime, 'YYYYMMDD')
      this.formItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      this.$api.accountManage.getFrList(options).then((resJson) => {
      // this.$api.merchant.getRejectAuditList(options).then((resJson) => {
        let list = []
        let resArray = resJson.rows
        // for (var r = 0; r < 10; r++) {
        //   let json = {}
        //   json['customerCode'] = '561520036587100' + r
        //   json['customerName'] = '商户名称' + r
        //   list.push(json)
        // }
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['profileCycleTime'] = resArray[r].profileCycleStartTime + '-' + resArray[r].profileCycleEndTime
            json['customerCode'] = resArray[r].customerCode
            json['customerName'] = resArray[r].customerName
            json['totalProfileAmountForPay'] = resArray[r].totalProfileAmountForPay
            json['profileRatioPercent'] = resArray[r].profileRatioPercent
            json['totalProfileAmountForRefund'] = resArray[r].totalProfileAmountForRefund
            json['actualTotalProfileAmount'] = resArray[r].actualTotalProfileAmount // 分润总金额
            json['settedTime'] = resArray[r].settleDate
            // json['payState'] = Common.getTypeName(resArray[r].procedureFee, 'statusList') || '-'
            // json['payMethod'] = Common.getTypeName(resArray[r].payMethod, 'payList') || '-'
            list.push(json)
          }
        }
        this.dataList = list
        this.listTotal = resJson.total
        // this.listTotal = 10
        this.loading = false
        this.modal_loading = false
      })
    },
    getDateFormat (time, format) {
      if (!time) return ''
      format = format !== null ? format : 'YYYY-MM-DD'
      return moment(time).format(format)
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.formItem.pageSize = pageSize
      this.getList()
    },
    // 查询列表
    search () {
      this.modal_loading = true
      this.getList()
    }
  },
  mounted () {
    this.formItem.startTime =
    this.formItem.endTime = new Date()
    this.getList()
  }
}
</script>

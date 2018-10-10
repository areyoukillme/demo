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
                      <DatePicker type="date" placeholder="建立时间" v-model="formItem.transactionCreateDate" :options="startTimeOptions" @on-change="chooseStartEndTime"></DatePicker>
                    </Col>
                    <Col span="2" class="text-center">-</Col>
                    <Col span="11">
                      <DatePicker type="date" placeholder="结束时间" v-model="formItem.transactionEndDate" :options="endTimeOptions" @on-change="chooseStartTime"></DatePicker>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="支付方式" class="pay-line-input">
                  <Select v-model="formItem.payMethod" placeholder="请选择" >
                    <Option v-for="s in payMethodList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
               </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="代理商名称" class="pay-line-input">
                  <Input v-model="formItem.agentCustomerName" placeholder="请输入代理商名称"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="代理商编号" class="pay-line-input">
                  <Input v-model="formItem.agentCustomerCode" placeholder="请输入代理商编号"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
               <FormItem label="业务名称" class="pay-line-input">
                  <Select v-model="formItem.businessCode" placeholder="请选择" >
                    <Option v-for="s in businessCodeList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
               </Col>
               <Col span="10">
                <FormItem label="业务类型" class="pay-line-input">
                  <Select v-model="formItem.businessType" placeholder="请选择" >
                    <Option v-for="s in businessTypeList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
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
      businessCodeList: [
        { code: '', name: '请选择' },
        { code: '1', name: '快捷支付' }
      ],
      payMethodList: [
        { code: '', name: '请选择' },
        { code: '1', name: '快捷支付' }
      ],
      columnsName: [
        {
          key: 'createTime',
          title: '交易时间',
          width: 150
        },
        {
          key: 'agentCustomerCode',
          title: '代理商编号'
        },
        {
          key: 'agentCustomerName',
          title: '代理商名称'
        },
        {
          key: 'customerCode',
          title: '拓展商户编号'
        },
        {
          key: 'customerName',
          title: '拓展商户名称'
        },
        {
          key: 'outTradeNo',
          title: '商户订单号'
        },
        {
          key: 'transactionNo',
          title: '易票联订单号'
        },
        // {
        //   key: 'businessType',
        //   title: '业务类型'
        // },
        {
          key: 'businessCode',
          title: '业务名称'
        },
        {
          key: 'payMethod',
          title: '支付方式'
        },
        {
          key: 'payAmount',
          title: '订单金额（元）'
        },
        {
          key: 'payProcedure',
          title: '手续费（元）'
        },
        {
          key: 'profileAmount',
          title: '单笔分润基准金额（元）'
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
        transactionCreateDate: '',
        transactionEndDate: '',
        customerName: '',
        customerCode: '',
        businessType: '',
        businessCode: '',
        payMethod: ''
      }
    }
  },
  methods: {
    getList (currentPage) {
      this.loading = true
      let options = this.formItem
      options.transactionCreateDate = this.getDateFormat(options.transactionCreateDate, 'YYYYMMDD')
      options.transactionEndDate = this.getDateFormat(options.transactionEndDate, 'YYYYMMDD')
      this.formItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      this.$api.accountManage.getFrList(options).then((resJson) => {
        let list = []
        // let resArray = resJson.rows
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['transactionCreateTime'] = resArray[r].transactionCreateTime
            json['agentCustomerCode'] = resArray[r].agentCustomerCode
            json['agentCustomerName'] = resArray[r].agentCustomerName
            json['customerCode'] = resArray[r].customerCode
            json['customerName'] = resArray[r].customerName
            json['outTradeNo'] = resArray[r].outTradeNo
            json['transactionNo'] = resArray[r].transactionNo
            // json['businessType'] = resArray[r].businessType
            json['payMethod'] = resArray[r].payMethod
            // json['payMethod'] = resArray[r].payMethod
            json['payAmount'] = (resArray[r].payAmount / 100).toFixed(2)
            json['payProcedure'] = (resArray[r].payProcedure / 100).toFixed(2)
            json['profileAmount'] = (resArray[r].profileAmount / 100).toFixed(2)
            // json['payState'] = Common.getTypeName(resArray[r].procedureFee, 'statusList') || '-'
            // json['payMethod'] = Common.getTypeName(resArray[r].payMethod, 'payList') || '-'
            list.push(json)
          }
        }
        this.dataList = list
        // this.listTotal = resJson.total
        this.listTotal = 10
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
    this.formItem.transactionCreateDate =
    this.formItem.transactionEndDate = new Date()
    this.getList()
  }
}
</script>

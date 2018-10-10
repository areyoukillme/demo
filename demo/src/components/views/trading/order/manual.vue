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
                <FormItem label="DSP订单号" class="pay-line-input">
                  <Input v-model="payFormItem.transactionNo" placeholder="请输入DSP订单号"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="订单处理状态" class="pay-line-input">
                  <Select v-model="state">
                    <Option v-for="s in manualState" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <div class="common-check-button">
                <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getCheckList">查询</Button>
                <Button size="large" icon="refresh" type="success" @click="getReset">清空</Button>
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
export default {
  name: 'tradingOrderPay',
  components: {
    CDatePicker
  },
  data () {
    return {
      loading: false,
      modal_loading: false,
      manualState: CommonData.manualState,
      columnsName: [
        {
          key: 'index',
          title: '序号',
          width: 40,
          render: (h, params) => {
            let index = this.payFormItem.pageSize * (this.payFormItem.pageNum - 1) + params.index + 1
            return h('span', index)
          }
        },
        {
          key: 'createTime',
          title: '处理时间'
        },
        {
          key: 'transactionNo',
          title: 'DSP订单号'
        },
        {
          key: 'state',
          title: '处理状态',
          width: 80,
          render: (h, params) => {
            let state = Common.getTypeName(params.row.state, 'manualState')
            return h('span', state)
          }
        },
        {
          key: 'updateUserName',
          title: '操作人',
          width: 80
        },
        {
          key: 'remark',
          title: '备注'
        }
      ],
      payDataList: [],
      listTotal: 0,
      pageShowSizer: 10,
      pageSizeOpts: [10, 50, 100],
      state: '',
      pageCurrent: 1,
      payFormItem: {
        pageSize: 10,
        pageNum: 1,
        beginTime: '',
        endTime: '',
        transactionNo: '',
        state: ''
      },
      beginTime: new Date(),
      endTime: new Date()
    }
  },
  methods: {
    getPayList (currentPage) {
      if (!(this.payFormItem.transactionNo || this.beginTime || this.endTime || this.state)) {
        this.$Message.error('请至少输入一条查询条件！')
        return
      }
      this.loading = true
      let options = this.payFormItem
      this.pageCurrent = this.payFormItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.beginTime = Common.getTimeFormat(this.beginTime, 'YYYYMMDD', 0, true)
      options.endTime = Common.getTimeFormat(this.endTime, 'YYYYMMDD', 1, true)
      this.payFormItem.state = this.state === '-1' ? '' : this.state
      this.$api.trading.getNeedPersonalTradeQuery(options).then((resJson) => {
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          this.payDataList = resArray
        }
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
      })
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.payFormItem.pageSize = pageSize
      this.getPayList()
    },
    // 查询列表
    getCheckList () {
      // if (!(this.payFormItem.customerName || this.payFormItem.customerCode || this.payFormItem.outTradeNo || this.payFormItem.transactionNo || this.beginTime || this.endTime || this.state)) {
      //   this.$Message.error('请至少输入一条查询条件！')
      //   return
      // }
      this.modal_loading = true
      this.payFormItem.state = this.payFormItem.state.trim()
      this.pageCurrent = 1
      this.getPayList()
    },
    // 清空条件
    getReset () {
      this.state = ''
      this.payFormItem = {
        pageSize: 10,
        pageNum: 1,
        beginTime: '',
        endTime: '',
        transactionNo: '',
        state: ''
      }
      this.pageCurrent = 1
      this.beginTime = new Date()
      this.endTime = new Date()
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

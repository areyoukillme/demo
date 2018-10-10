<template>
  <div class="trading-order-pay common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="formItem" :label-width="100">
              <FormItem label="退款时间">
                  <Row>
                    <Col span="4">
                      <DatePicker type="date" placeholder="开始时间" v-model="formItem.beginCreateTime" :options="startTimeOptions" @on-change="chooseStartEndTime"></DatePicker>
                    </Col>
                    <Col span="1" class="text-center">-</Col>
                    <Col span="4">
                      <DatePicker type="date" placeholder="结束时间" v-model="formItem.endCreateTime" @on-change="chooseStartTime"></DatePicker>
                    </Col>
                  </Row>
                </FormItem>
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
                  <Input v-model="formItem.refundApplyNo" placeholder="请输入退款申请号"/>
                </FormItem>
              </Col>
             <Col span="10">
                <FormItem label="退款审核状态" class="pay-line-input">
                  <Select v-model="formItem.auditState">
                    <Option v-for="p in auditStateList"  :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="search" class="common-check-button">查询</Button>
            <!-- <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="exportData" class="pay-check-button">导出</Button> -->
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
      <!-- 按钮组 -->
    <!-- <Row>
      <Col span="24" class="merchant-list-group-btn">
        <ButtonGroup>
          <Button type="ghost" icon="edit" @click="audit" :disabled="selection.length != 1">审核</Button>
        </ButtonGroup>
      </Col>
    </Row> -->
    <!-- 按钮组 /-->
    <Row>
      <!-- 列表 -->
      <Col span="24" class="merchant-list-tab">
        <Table border :columns="columnsName" :data="dataList"  ref="selection" @on-selection-change="selectTableRow"></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row>
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal > 0" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
  </div>
</template>

<script>
import Common from '@/assets/js/common'
import '@/assets/styles/merchant.less'
import moment from 'moment'
export default {
  name: 'query',
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      selection: [],
      loading: false,
      modal_loading: false,
      auditStateList: [
        // { code: '', name: '全部' },
        { code: '1', name: '商户审核通过待平台处理' }
        // { code: '3', name: '平台审核通过' },
        // { code: '4', name: '平台审核拒绝' }
      ],
      refundMethodList: [
        { code: '1', name: '原路退回' },
        { code: '2', name: '其它（暂不支持）' }
      ],
      columnsName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key: 'index',
          title: '序号',
          width: 40
        },
        {
          key: 'applyDateTime',
          title: '退款时间'
        },
        {
          key: 'orgiTransactionNo',
          title: '原DSP订单号'
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
          key: 'refundApplyNo',
          title: '退款申请号'
        },
        {
          key: 'refundTransactionNo',
          title: '退款订单号'
        },
        {
          key: 'refundAmount',
          title: '申请退款金额（元）'
        },
        {
          key: 'refundFee',
          title: '退回收单手续费（元）'
        },
        {
          key: 'refundMethod',
          title: '退款方式'
        },
        {
          key: 'auditState',
          title: '退款审核状态'
        },
        {
          title: '操作',
          key: 'action',
          // fixed: 'right',
          width: 60,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    let refundApplyNo = params.row.refundApplyNo
                    let orgiTransactionNo = params.row.orgiTransactionNo
                    let customerCode = params.row.customerCode
                    this.audit(refundApplyNo, orgiTransactionNo, customerCode)
                  }
                }
              }, '审核')
            ])
          }
        }
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
      formItem: {
        pageSize: pageShowSizer,
        pageNum: pageCurrent,
        customerName: '',
        customerCode: '',
        beginCreateTime: '', //
        endCreateTime: '', //
        refundApplyNo: '', //
        refundTransactionNo: '', //
        refundState: '', //
        auditState: '1' //
      },
      // 弹出模态框
      modal: {
        isOpen: false,
        accountFormItem: [{}, {}]
      }
    }
  },
  methods: {
    // 选择结束的开始时间
    chooseStartTime (date) {
      this.startTimeOptions = Common.chooseStartTime(date)
    },
    // 选择开始的结束时间
    chooseStartEndTime (date) {
      this.endTimeOptions = Common.chooseStartEndTime(date)
    },
    /**
     * @param {string} typeCode code名
     * @param {string} typeName 数组名
     * **/
    getTypeName (typeCode, typeName) {
      let typeArray = typeName
      for (var i = 0; i < typeArray.length; i++) {
        if (parseInt(typeArray[i].code) === parseInt(typeCode)) {
          return typeArray[i].name
        }
      }
      return ''
    },
    audit (refundApplyNo, orgiTransactionNo, customerCode) {
      // this.$router.push({name: 'trading-refund-audit-detail', params: {refundApplyNo: this.selection[0].refundApplyNo, orgiTransactionNo: this.selection[0].orgiTransactionNo, customerCode: this.selection[0].customerCode, currType: 'edit'}})
      this.$router.push({name: 'trading-refund-audit-detail', params: {refundApplyNo: refundApplyNo, orgiTransactionNo: orgiTransactionNo, customerCode: customerCode, currType: 'edit'}})
    },
    getList (currentPage) {
      this.loading = true
      // let options = this.formItem
      let options = this.formItem
      options.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      //   let beginCreateTime = this.beginCreateTime
      //   let endCreateTime = this.endCreateTime
      this.formItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.beginCreateTime = this.getDateFormat(this.formItem.beginCreateTime, 'YYYYMMDD')
      options.endCreateTime = this.getDateFormat(this.formItem.endCreateTime, 'YYYYMMDD')
      // this.payFormItem.payMethod = this.payMethod === '-1' ? '' : this.payMethod
      // this.payFormItem.payState = this.payState === '-1' ? '' : this.payState
      // alert(JSON.stringify(options))
      console.log(options.beginCreateTime)
      this.$api.trading.getRefundAuditList(options).then(resJson => {
        // if (resJson.result === '0000') {
        console.log(resJson)
        let list = []
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = this.formItem.pageSize * (this.formItem.pageNum - 1) + 1 + r
            json['applyDateTime'] = this.getDateFormat(resArray[r].applyDateTime, 'YYYY-MM-DD HH:mm:ss')
            json['customerCode'] = resArray[r].customerCode
            json['customerName'] = resArray[r].customerName
            json['refundApplyNo'] = resArray[r].refundApplyNo
            json['orgiTransactionNo'] = resArray[r].orgiTransactionNo
            json['refundTransactionNo'] = resArray[r].refundTransactionNo
            json['refundAmount'] = (resArray[r].refundAmount / 100).toFixed(2)
            json['refundFee'] = (resArray[r].refundFee / 100).toFixed(2)
            json['refundMethod'] = this.getTypeName(resArray[r].refundMethod, this.refundMethodList) || '-'
            json['auditState'] = this.getTypeName(resArray[r].auditState, this.auditStateList) || '-'
            list.push(json)
          }
        }
        this.dataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
        // }
      })
    },
    // 时间格式转化
    getTimeFormat (time, format, type) {
      if (!time) return ''
      format = format !== null ? format : 'YYYY-MM-DD HH:mm:ss'
      return moment(time).format(format) + (type === 0 ? '000000' : '235959')
    },
    getDateFormat (time, format) {
      if (!time) return ''
      format = format !== null ? format : 'YYYY-MM-DD'
      return moment(time).format(format)
    },
    // 表格选中行
    selectTableRow (selection) {
      this.selection = selection
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
    },
    // 导出
    exportData () {
      alert('TODO 导出未实现')
    },
    // 查看账户详情
    viewDetail (params) {
      // let customerCode = params.row.customerCode
      this.modal.isOpen = true
    }
  },
  mounted () {
    this.formItem.beginCreateTime =
    this.formItem.endCreateTime = new Date()
    this.getList()
  }
}
</script>

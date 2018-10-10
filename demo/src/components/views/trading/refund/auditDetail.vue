<template>
  <div class="merchant-basic-detail merchant-detail-inner">
    <Form :model="dataObj" ref="formData" :rules="formValidate" :label-width="140">
      <Collapse v-model="defaultShowPanel">
        <Panel name="1">
          <span class="merchant-basic-title">退款订单</span>
          <div slot="content">
            <Row>
              <Col span="10">
                <FormItem label="退款时间" prop="name">
                  <Input v-model="dataObj.applyDateTime" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户编号" prop="customerCode">
                  <Input v-model="dataObj.customerCode" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="商户名称" prop="customerName">
                  <Input v-model="dataObj.customerName" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="退款申请号" prop="refundApplyNo">
                  <Input v-model="dataObj.refundApplyNo" :disabled="inputDisabled" :maxlength="maxLength"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="申请退款金额" prop="refundAmount">
                  <Input v-model="dataObj.refundAmount" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="退回收单手续费" prop="refundFee">
                  <Input v-model="dataObj.refundFee" :disabled="inputDisabled" :maxlength="maxLength"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="退款方式" prop="refundMethod">
                  <Input v-model="dataObj.refundMethod" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="退款审核状态" prop="auditState">
                  <Input v-model="dataObj.auditState" :disabled="inputDisabled" :maxlength="maxLength"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="退款状态" prop="refundState">
                  <Input v-model="dataObj.refundState" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户审核备注" prop="adminAuditRemark">
                  <Input v-model="dataObj.adminAuditRemark" :disabled="inputDisabled" :maxlength="maxLength"/>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Panel>
        <Panel name="2">
          <span class="merchant-basic-title">原交易订单信息</span>
          <div slot="content">
            <div  :label-width="140">
              <Row>
                <Col span="10">
                  <FormItem label="原商户订单号" >
                    <Input v-model="dataObj.orgiOutTradeNo" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="原DSP订单号">
                    <Input v-model="dataObj.orgiTransactionNo" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
             <Row>
                <Col span="10">
                  <FormItem label="原银行订单号" >
                    <Input v-model="dataObj.bankNo" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="原订单金额">
                    <Input v-model="dataObj.oriAmount" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="原收单手续费" >
                    <Input v-model="dataObj.oriProcedureFee" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="原支付方式">
                    <Input v-model="dataObj.oriPayMethod" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="可退款金额" >
                    <Input v-model="dataObj.canRefundPayAmount" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                </Col>
              </Row>
            </div>
          </div>
        </Panel>
        <Panel name="3">
          <span class="merchant-basic-title">退款历史记录：（如无记录，不显示内容）</span>
          <div slot="content">
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
        <Page v-if="listTotal > 0" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="pay-page" @on-change="getRefundHistory" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
          </div>
        </Panel>
         <Panel name="4" v-if="this.currType=='edit'">
          <span class="merchant-basic-title">退款审核</span>
          <div slot="content">
            <Row>
             <FormItem label="审核说明" class="ivu-form-item-required" prop="operatorAuditRemark">
                    <Input v-model="dataObj.operatorAuditRemark" />
             </FormItem>
            </Row>
            <Row>
            <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="save" class="pay-check-button">审核通过</Button>
            <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="unAudit" class="pay-check-button">审核不通过</Button>
            </Row>
          </div>
        </Panel>
      </Collapse>
    </Form>
  </div>
</template>
<script>
import '@/assets/styles/merchant.less'
import moment from 'moment'
// import CommonData from '@/common/data/index'
export default {
  name: 'refund-detail',
  // props: ['refundApplyNo', 'orgiTransactionNo'],
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      refundApplyNo: this.$route.params.refundApplyNo || -1,
      orgiTransactionNo: this.$route.params.orgiTransactionNo || -1,
      currType: this.$route.params.currType,
      modal_loading: false,
      custCode: this.$route.params.customerCode || -1,
      // 显示第几个折叠面板
      defaultShowPanel: ['1', '4'],
      inputDisabled: true,
      maxLength: 11,
      textareaMax: 200,
      // 初始及最终变量
      dataObj: {
      },
      dataList: [],
      loading: false,
      listTotal: 0,
      data: {
        refundApplyNo: '',
        operatorAuditRemark: '',
        auditState: ''
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
        auditState: '' //
      },
      refundMethodList: [
        { code: '1', name: '原路退回' },
        { code: '2', name: '其它（暂不支持）' }
      ],
      refundStateList: [
        { code: '0', name: '-' },
        { code: '1', name: '退款失败' },
        { code: '2', name: '退款成功' },
        { code: '23', name: '退款中' }
      ],
      auditStateList: [
        { code: '', name: '全部' },
        { code: '1', name: '商户审核通过待平台处理' },
        { code: '3', name: '平台审核通过' },
        { code: '4', name: '平台审核拒绝' }
      ],
      // 原交易支付方式
      paymethodList: [
        {code: '0', name: '账号支付'},
        {code: '1', name: '微信公众号支付'},
        {code: '2', name: '个人网银_贷记卡'},
        {code: '3', name: '个人网银_借记卡'},
        {code: '4', name: '支付宝生活号支付'},
        {code: '5', name: '代付'},
        {code: '6', name: '微信扫码支付'},
        {code: '7', name: '支付宝扫码支付'},
        {code: '8', name: '快捷支付'},
        {code: '9', name: '微信app支付'},
        {code: '10', name: '微信H5支付'},
        {code: '11', name: '分账'},
        {code: '12', name: '被分账'},
        {code: '13', name: '微信被扫'},
        {code: '14', name: '支付宝被扫'},
        {code: '20', name: '手机银联支付'}
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
          key: 'refundApplyNo',
          title: '退款申请号'
        },
        {
          key: 'refundApplyUserId',
          title: '退款申请人'
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
          key: 'refundState',
          title: '退款状态'
        }
      ],
      // 审核信息
      auditObj: {},
      formValidate: {
        operatorAuditRemark: [
          {required: true, message: '请输入审核说明', trigger: 'blur'}
        ]
      },
      showUscc: true
    }
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      this.inputDisabled = false
      // 查出待审数据，或者查询详情
      this.getRefundForAudit()
      this.getRefundHistory()
      if (this.auditId) {
        // this.defaultShowPanel = ['1', '2', '3', '4']
        this.defaultShowPanel = ['1', '4']
      }
    },
    // 审核不通过
    unAudit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.data.refundApplyNo = this.dataObj.refundApplyNo
          this.data.operatorAuditRemark = this.dataObj.operatorAuditRemark
          this.data.auditState = 4
          this.$api.refund.refundApprove(this.data).then((res) => {
            this.$Message.info(res.message)
          })
        }
      })
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
    getRefundHistory (currentPage) {
      let options = {
        // refundApplyNo: this.refundApplyNo,
        pageSize: 10, // 页面大小
        // pageNum: 1, // 页码
        pageNum: this.currentPage !== undefined ? parseInt(this.currentPage) : 1,
        orgiTransactionNo: this.orgiTransactionNo
        // auditState: '0'
      }
      this.$api.refund.getRefundHistory(options).then(resJson => {
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
            json['refundApplyUserId'] = resArray[r].refundApplyUserId
            json['orgiTransactionNo'] = resArray[r].orgiTransactionNo
            json['refundTransactionNo'] = resArray[r].refundTransactionNo
            json['refundAmount'] = (resArray[r].refundAmount / 100).toFixed(2)
            json['refundFee'] = (resArray[r].refundFee / 100).toFixed(2)
            json['refundMethod'] = this.getTypeName(resArray[r].refundMethod, this.refundMethodList) || '-'
            json['auditState'] = this.getTypeName(resArray[r].auditState, this.auditStateList) || '-'
            json['refundState'] = this.getTypeName(resArray[r].refundState, this.refundStateList) || '-'
            list.push(json)
          }
        }
        this.dataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
      })
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
    // 取得已退款金额 算可退金额
    getTotalRefundAmount () {
      let options = {orgiTransactionNo: this.orgiTransactionNo,
        customerCode: this.custCode // 页面大小
      }
      this.$api.refund.getTotalRefundAmount(options).then(resJson => {
        this.dataObj.canRefundPayAmount = (parseFloat(this.dataObj.oriAmount) - parseFloat(resJson / 100)).toFixed(2)
        // alert(this.dataObj.canRefundPayAmount)
      })
    },
    getRefundForAudit () {
      let options = {refundApplyNo: this.refundApplyNo,
        pageSize: 1, // 页面大小
        pageNum: 1 // 页码
        // orgiTransactionNo: this.orgiTransactionNo
      }
      this.$api.refund.getRefundAuditDetail(options).then(resJson => {
        let rowData = resJson.rows[0]
        this.dataObj = rowData
        this.dataObj.applyDateTime = this.getDateFormat(rowData.applyDateTime, 'YYYY-MM-DD HH:mm:ss')
        this.dataObj.refundAmount = (rowData.refundAmount / 100).toFixed(2)
        this.dataObj.refundFee = (rowData.refundFee / 100).toFixed(2)
        this.dataObj.oriAmount = (rowData.oriAmount / 100).toFixed(2)
        this.dataObj.oriProcedureFee = (rowData.oriProcedureFee / 100).toFixed(2)
        this.dataObj.refundMethod = this.getTypeName(rowData.refundMethod, this.refundMethodList) || '-'
        this.dataObj.auditState = this.getTypeName(rowData.auditState, this.auditStateList) || '-'
        this.dataObj.refundState = this.getTypeName(rowData.refundState, this.refundStateList) || '-'
        this.dataObj.oriPayMethod = this.getTypeName(rowData.oriPayMethod, this.paymethodList) || '-'
        this.getTotalRefundAmount()
        this.inputDisabled = true
      })
    },
    save () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.data.refundApplyNo = this.dataObj.refundApplyNo
          this.data.operatorAuditRemark = this.dataObj.operatorAuditRemark
          this.data.auditState = 3
          // let data1 = {
          //   refundApplyNo: this.dataObj.refundApplyNo,
          //   auditState: 3,
          //   operatorAuditRemark: this.dataObj.operatorAuditRemark
          // }
          this.$api.refund.refundApprove(this.data).then((res) => {
            this.$Message.info(res.message)
          })
        }
      })
    },
    getDateFormat (time, format) {
      if (!time) return ''
      format = format !== null ? format : 'YYYY-MM-DD'
      return moment(time).format(format)
    },
    // 时间戳转化
    tampsToDate (str) {
      var newDate = new Date()
      newDate.setTime(str)
      let y = newDate.getFullYear()
      let m = newDate.getMonth() + 1
      let d = newDate.getDate()
      return new Date(y + '-' + m + '-' + d)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

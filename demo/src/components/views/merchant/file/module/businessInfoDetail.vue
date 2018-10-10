<template>
  <div class="merchant-detail-business merchant-detail-inner">
    <!-- 按钮组 -->
    <div class="merchant-detail-business-hd" v-if="!inputDisabled">
      <ButtonGroup>
        <Button type="ghost" icon="plus-round" @click="addBusiness">新增</Button>
        <!-- <Button type="ghost" icon="close-round" @click="deleteBusinessTip=true" :disabled="selection.length != 1">删除</Button> -->
      </ButtonGroup>
    </div>
    <!-- 按钮组 /-->
    <Row>
      <!-- 列表 -->
      <Col span="24" class="merchant-detail-business-tab">
        <Table :columns="columnsName" ref="selection" :data="dataList"></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row>
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal / pageShowSizer  > 1" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page" @on-change="getList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
    <!--删除提示  -->
    <Modal v-model="deleteBusinessTip" width="250" class="pas-delete-box">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="deleteBatch">删除</Button>
      </div>
    </Modal>
    <!--删除提示 / -->
    <!-- 新增模态框 -->
    <Modal v-model="editModal">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>新增</span>
      </p>
      <div>
        <Form ref="formItem" :model="formItem" :label-width="120"  :rules="ruleValidate">
          <Form-item label="业务类型" prop="businessType">
            <Select v-model="formItem.businessType" placeholder="请选择" :disabled="inputDisabled" @on-change="getBusinessType">
              <Option v-for="s in businessTypeList" :value="s.code" :key="s.code">{{ s.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="业务名称" prop="businessName">
            <Select v-model="formItem.businessName" placeholder="请选择" :disabled="inputDisabled" >
              <Option v-for="s in businessNameList" :value="s.code" :key="s.code">{{ s.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="收单计费方式">
            <Select v-model="formItem.rateMode" placeholder="请选择" :disabled="inputDisabled" style="width:100%">
              <Option v-for="s in rateModeList" :value="s.code" :key="s.code">{{ s.name }}</Option>
            </Select>
          </Form-item>
          <Form-item prop="rateParam">
            <Input v-model="formItem.rateParam" placeholder="请输入" type="text" :disabled="inputDisabled" style="width: 90%" />
            <span v-if="formItem.rateMode === '1'">元</span>
            <span v-if="formItem.rateMode === '2'">%</span>
          </Form-item>
          <Form-item label="收单封顶手续费" v-if="formItem.rateMode === '2'">
            <Input v-model="formItem.topProducureFee" placeholder="请输入收单封顶手续费" type="text" :disabled="inputDisabled" style="width: 90%;"/>
            <span>元</span>
          </Form-item>
          <FormItem
              v-for="(item) in formItem.businessParamInst"
              :key="item.code"
              :code="item.code"
              :type="item.type"
              :label="item.name"
              :prop="item.code"
              >
                <span v-if="item.type === 'Text'">
                  <InputNumber v-if="item.code === 'maxTxsAmount' || item.code === 'minTxsAmount'" :max="2000000" :min="2"  v-model="formItem[item.code]"  :disabled="inputDisabled"  placeholder="请输入..." style="width: 100%;" />
                  <Input v-else type="text" v-model="formItem[item.code]"  :disabled="inputDisabled"  placeholder="请输入..." />
                </span>
                <Select v-if="item.type === 'Select'" v-model="formItem[item.code]" placeholder="请选择" :disabled="inputDisabled" style="width:100%">
                  <Option v-for="s in item.selectOptions" :value="s.customerCode" :key="s.customerCode">{{ s.name }}</Option>
                </Select>
           </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="onCancel">
          关闭
        </Button>
        <Button type="primary" size="large" @click="onSave('formItem')" :loading="loading" :disabled="saveDisabled">
          保存
        </Button>
      </div>
    </Modal>
    <!-- 新增模态框 /-->
    <Row class="merchant-common-footer mg-tp-20" v-if="this.curOperateType !== 'view'">
      <Col span="22">
        <Button @click="goBack" type='success'>上一步</Button>
      </Col>
      <Col span="2">
        <Button type="primary" size="large" class="pay-check-button" @click="onNextStep">下一步</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
import { GetEvn } from '@/common/utils/index'
export default {
  name: 'merchantDetail-businessInfo',
  props: ['curInfoId', 'curOperateType', 'tabPaneDisable'],
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      index: 1,
      dataObj: {},
      deleteBusinessTip: false,
      editModal: false,
      loading: false,
      currModelIndex: 0,
      inputDisabled: false,
      modalLoading: false,
      saveDisabled: false,
      businessNameList: [],
      businessId: '',
      formItem: {
        businessParamInst: [],
        businessType: '',
        businessName: '',
        rateMode: '1',
        rateParam: '',
        topProducureFee: '',
        refundProducureFee: '1',
        refundRateMode: '1',
        refundRateParam: '',
        topRefundRateParam: '',
        beginTime: '',
        endTime: '',
        businessParamInstDtl: {},
        businessParamInstList: [], // 调用保存接口参数
        selectOptions: []
      },
      settCircleRuleInstVo: {
        validStartTime: '',
        validEndTime: '',
        ruleCode: '' // 结算周期规则编码，目前支持T+1/T+2/T+3/T+4/T+5,D+1~D+5，D0
      },
      // 业务参数实例
      businessParamInstDTO: {
        code: '',
        name: '',
        type: '',
        value: ''
      },
      ruleValidate: {
        businessType: [
          {required: true, message: '请输入业务类型', trigger: 'change'}
        ],
        businessName: [
          {required: true, message: '请输入业务名称', trigger: 'change'}
        ],
        rateParam: [
          {required: true, message: '请输入收单计费方式', trigger: 'blur'}
        ],
        refundRateParam: [
          {required: true, message: '请输入退款收费计费方式', trigger: 'blur'}
        ]
      },
      columnsName: [
        {
          key: 'index',
          width: 60,
          title: '序号',
          align: 'center'
        },
        {
          key: 'businessName',
          title: '业务名称',
          width: 150
        },
        {
          key: 'payMethodNames',
          title: '支付方式',
          width: 150
        },
        {
          key: 'rateMode',
          title: '收单计费方式'
        },
        {
          key: 'rateParam',
          title: '费率'
        },
        {
          key: 'rateParam1',
          title: '收单封顶手续费'
        },
        {
          key: 'refundProducureFee',
          title: '退回收单手续费'
        },
        {
          key: 'businessParamInsts',
          title: '业务实例参数',
          width: 150
        },
        {
          key: 'businessId',
          title: '操作',
          align:'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
           
                  type:'error'
                },
                on: {
                  click: () => {
                    this.deleteBusinessTip = true
                    this.businessId = params.row.businessId;
                    
                  }
                }
              }, '删除')
            ])
          }

        }
      ],
      dataList: [],
      listTotal: 0,
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      rateModeList: [
        {code: '1', name: '按单笔收费'},
        {code: '2', name: '按比例收费'}
      ],
      refundRateModeList: [
        {code: '1', name: '按单笔收费'},
        {code: '2', name: '按比例收费'}
      ],
      businessTypeList: [],
      // businessTypeList: [
      //   // { code: '', name: '请选择' },
      //   { code: '1', name: '互联网支付' },
      //   { code: '2', name: '易票联账户服务' }
      // ],
      refundProducureFeeList: [
        {code: '0', name: '否'},
        {code: '1', name: '是'}
      ],
      profitSettDateList: [
        { code: '', name: '请选择' },
        { code: 'D+0', name: 'D+0' },
        { code: 'D+1', name: 'D+1' },
        { code: 'D+5', name: 'D+5' },
        { code: 'D+10', name: 'D+10' },
        { code: 'T+5', name: 'T+5' },
        { code: 'T+10', name: 'T+10' },
        { code: 'T+15', name: 'T+15' }
      ]
    }
  },
  methods: {
    async getList (currentPage) {
      let options = {
        pageSize: this.pageShowSizer,
        pageNum: currentPage !== undefined ? parseInt(currentPage) : 1,
        customerInfoId: this.curInfoId
      }
      this.pageCurrent = options.pageNum
      this.$api.merchantDetail.initMerchantBusinessInfo(options).then((resJson) => {
        let list = []
        let resArray = resJson.rows
        console.log(resJson)
        for (var r = 0; r < resArray.length; r++) {
          
          let json = {}
          json['businessName'] = resArray[r].businessName
          if(resArray[r].payMethods[0]){
            json['payMethodNames'] =resArray[r].payMethods[0].payMethodName
          }
          json['rateMode'] = this.getTypeName(resArray[r].rateMode, 0)
          json['rateParam'] = this.getRateParam(resArray[r].rateMode, resArray[r].rateParam)
          json['rateParam1'] = this.getRateParam1(resArray[r].rateMode, resArray[r].rateParam)
          json['refundProducureFee'] = this.getTypeName(resArray[r].refundProducureFee, 1)
          json['businessId'] = resArray[r].id
          json['index'] = this.pageShowSizer * (this.pageCurrent - 1) + 1 + r
          // json['businessParamInsts'] = resArray[r].businessParamInsts
          let businessParamInsts = resArray[r].businessParamInstList
          let inner = ''
          if (businessParamInsts.length > 0) {
            businessParamInsts.forEach((item) => {      
              inner += item.name + ' : ' + item.value + '\n'
            })
          }
          json['businessParamInsts'] = inner
          list.push(json)
        }
        this.dataList = list
        this.listTotal = resJson.total
        // 表单元素disabled等
        if (this.curOperateType === 'view') {
          this.inputDisabled = true
        }
      })
    },
    // 费率
    getRateParam (rateMode, rateVal) {
      var mode = rateMode
      var unit = ''
      if (mode === 1) {
        unit = '元'
      } else if (mode === 2) {
        unit = '%'
      }
      var v = rateVal.split('_')
      return v[0] / 100 + unit
    },
    // 封顶手续费
    getRateParam1 (rateMode, rateVal) {
      var v = rateVal.split('_')
      if (v.length > 1) {
        return v[1] / 100 + '元'
      } else {
        return '-'
      }
    },
    // 获取枚举值 index 0：收单计费方式 1：是否退款退回手续费
    getTypeName (typeCode, index) {
      let typeArray = (index === 0) ? this.rateModeList : this.refundProducureFeeList
      for (var i = 0; i < typeArray.length; i++) {
        if (parseInt(typeArray[i].code) === parseInt(typeCode)) {
          return typeArray[i].name
        }
      }
      return ''
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.pageShowSizer = pageSize
      this.getList()
    },
    getBusinessType (value) {
      var businessType = this.formItem.businessType
      this.formItem.businessName=""
      if (businessType !== '') {
        // this.$api.merchantDetail.getBusinessName({type: businessType}).then(resJson => {
        this.$api.merchantDetail.getBusinessName({businessCategory: businessType}).then(resJson => {
          this.businessNameList = resJson
        })
      }
    },
    getBusinessInst (value) {
      var businessCode = this.formItem.businessName
      if (businessCode !== '') {
        this.$api.merchantDetail
          .getBusinessInst({businessCode: businessCode})
          .then(resJson => {
            this.index++
            let list = []
            for (var r = 0; r < resJson.length; r++) {
              let json = {}
              json['id'] = resJson[r].id
              json['name'] = resJson[r].name
              json['code'] = resJson[r].code
              json['must'] = resJson[r].must
              json['required'] = resJson[r].must === '1' //
              json['type'] = resJson[r].type
              json['businessId'] = resJson[r].businessId
              json['createTime'] = resJson[r].createTime
              json['createtor'] = resJson[r].createtor
              json['updateTime'] = resJson[r].updateTime
              json['updator'] = resJson[r].updator
              json['defaultValue'] = resJson[r].defaultValue
              json['dataUrl'] = resJson[r].dataUrl
              json['selectOptions'] = []
              if (resJson[r].type === 'Text') {
                json['value'] = resJson[r].defaultValue
              } else {
                json['value'] = ''
              }
              list.push(json)
              let key = resJson[r].code
              // this.modelList.push(key)

              this.formItem[key] = resJson[r].type === 'Text' ? ((resJson[r].code === 'maxTxsAmount' || resJson[r].code === 'minTxsAmount') ? parseInt(resJson[r].defaultValue) : resJson[r].defaultValue) : ''
              if (resJson[r].must === '1') {
                this.ruleValidate[key] = []
                let validateJson = {required: true, message: ((resJson[r].type === 'Text' ? '请输入' : '请选择') + resJson[r].name), trigger: 'change', type: ((resJson[r].code === 'maxTxsAmount' || resJson[r].code === 'minTxsAmount') ? 'number' : '')}
                this.ruleValidate[key].push(validateJson)
              }
            }
            this.formItem.businessParamInst = list
            return list
          })
          .then((list) => {
            list.forEach((currentValue, index, arr) => {
              if (currentValue.dataUrl !== null && currentValue.dataUrl !== '') {
                this.getMerchantBusinessDetail(businessCode, currentValue)
              }
            })
          })
      }
    },
    getMerchantBusinessDetail (businessCode, json) { // businessCode no need
      let url = (GetEvn() ? '' : '') + '/cum' + json.dataUrl
      // this.$api.merchantDetail.getBusinessDetail({businessCode: businessCode}, url).then(res => {
      this.$api.merchantDetail.getBusinessDetail('', url).then(res => {
        json.selectOptions = res
      })
    },
    // 选择
    // selectSelection (selection) {
    //   this.selection = selection
    // },
    // 删除
    deleteBatch () {
      let businessId = this.businessId
      this.deleteBusinessTip = false
      this.$api.merchantDetail.deleteBusinessById({id: businessId}).then((res) => {
       console.log(res)
        if (res.returnCode === '0000') {
          this.$Message.info('删除成功')
          console.log(1111111)
          this.getList(1)
          this.businessId = ''
          
        } else {
          this.$Message.error(res.returnMsg)
        }
      })
    },
    // 保存
    onSave (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // let successTxt = '新增成功'
          this.formItem.customerInfoId = this.curInfoId
          this.formItem.businessCode = this.formItem.businessName
          this.formItem.status = 1
          var rateMode = this.formItem.rateMode
          var tempRateParam = this.formItem.rateParam
          var tempTopProducureFee = this.formItem.topProducureFee
          var tempRefundRateParam = this.formItem.refundRateParam
          var tempTopRefundRateParam = this.formItem.topRefundRateParam
          var rateParam = Math.round(parseFloat(this.formItem.rateParam).toFixed(2) * 100)
          if (rateMode === '2') { // 按比例
            if (this.formItem.topProducureFee) {
              rateParam += '_' + Math.round(parseFloat(this.formItem.topProducureFee).toFixed(2) * 100)
            }
          }
         
          this.formItem.rateParam = rateParam
          var refundRateMode = this.formItem.refundRateMode
          var refundRateParam = Math.round(parseFloat(this.formItem.refundRateParam).toFixed(2) * 100)
          if (refundRateMode === '2') { // 按比例
            if (this.formItem.topRefundRateParam) {
              refundRateParam += '_' + Math.round(parseFloat(this.formItem.topRefundRateParam).toFixed(2) * 100)
            }
          }
          this.formItem.refundRateParam = refundRateParam
          var json = JSON.parse(JSON.stringify(this.formItem))
          let tempList = []
          for (var r = 0; r < json.businessParamInst.length; r++) {
            var paramJson = JSON.parse(JSON.stringify(json.businessParamInst[r]))
            var code = paramJson.code
            let businessJson = {}
            businessJson.code = code
            businessJson.value = json[code]
            tempList.push(businessJson)
          }
          this.formItem = json
          this.formItem.businessParamInstList = tempList
          this.$api.merchantDetail.saveCustomerBusinessInfo(this.formItem).then((res) => {
            if (res && res.returnCode && res.returnCode !== '0000') {
              this.formItem.rateParam = tempRateParam // 重置该字段数据
              this.formItem.topProducureFee = tempTopProducureFee // 重置该字段数据
              this.formItem.refundRateParam = tempRefundRateParam
              this.formItem.topRefundRateParam = tempTopRefundRateParam
              if (res.returnCode === '4424') {
                let errTxt = '不允许开通重复的业务'
                this.$Message.error(errTxt)
                return
              } else if (res.returnCode === '4406') {
                let errTxt = '拓展商户的费率需大于代理商的费率,请重新设置'
                this.$Message.error(errTxt)
                return
              } else {
                this.$Message.error('系统错误：' + res.returnMsg)
                return
              }
            }
            if(res&&res.returnCode&&res.returnCode=='0000'){
              let successTxt = '新增成功'
              this.$Message.info(successTxt)
              this.getList(1);
              this.onCancel();
            }
            
          })
        }
      })
    },
    // 取消
    onCancel () {
      this.businessNameList = []
      this.ruleValidate.businessName[0].required = false
      this.ruleValidate.businessType[0].required = false
      this.editModal = false
      this.formItem = {
        businessType: '',
        businessName: '',
        rateMode: '1',
        rateParam: '',
        topRefundRateParam: '',
        selectOptions: []
      }
    },
    addBusiness () {
      this.formItem = {
        businessType: '',
        businessNameList: [],
        parentCustomer: '',
        rateMode: '1',
        rateParam: '',
        topProducureFee: '',
        refundProducureFee: '0',
        refundRateMode: '1',
        refundRateParam: '',
        topRefundRateParam: '',
        businessName: '',
        businessParamInst: []
      }
      this.currModelIndex = 0
      this.editModal = true
      this.ruleValidate.businessName[0].required = true
      this.ruleValidate.businessType[0].required = true
      if (this.businessTypeList.length <= 0) {
        this.getBusinessTypeList()
      }
    },
    goBack () {
      this.$emit('on-listen-child', 'tab02')
    },
    onNextStep () {
      if (this.dataList.length <= 0) {
        this.$Message.error('请至少添加一条业务')
        return false
      }
      if (this.tabPaneDisable === true) {
        this.$emit('on-change-tab', 'tabPaneDisable4')
      }
      setTimeout(() => {
        this.$emit('on-listen-child', 'tab04')
      }, 800)
    },
    getBusinessTypeList () {
      this.$api.merchantDetail.getBusinessCategories().then((res) => {
        if (res && res.length > 0) {
          this.businessTypeList = res
        }
      })
    }
  },
  mounted () {
    if (this.curOperateType === 'view') {
      this.columnsName[7].render = (h, params) => { return '-' }
    }
    this.getList()
  },
  watch: {
    '$route' (to, from) {
      let toParams = to.params
      let fromParams = from.params
      if (fromParams.cid !== '' && toParams.cid === undefined) {
        this.curInfoId = '-1'
        this.curOperateType = this.$route.params.opt || 'add'
        this.auditId = ''
        this.auditModule = ''
        this.dataObj = {}
        this.auditObj = {}
        if (this.curOperateType === 'add') {
          this.$emit('on-listen-child', 0)
          this.getList()
        }
      }
    }
  }
}
</script>

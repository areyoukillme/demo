<template>
  <div class="merchant-detail">
     <Row class="merchant-detail-inner">
      <!-- 条件选择 -->
      <Col span="24">
        <div class="pay-hd-inner">
          <Form :label-width="120" ref="formValidate" :model="dataObj" :rules="ruleValidate" >
            <Input placeholder="" v-if="isShow" v-model="dataObj.settleId" />
             <Row>
              <Col span="20">
                <FormItem label="结算账户类型" class="pay-line-input" prop="bankAccountType">
                  <RadioGroup v-model="dataObj.bankAccountType" :disabled="inputDisabled" :value="dataObj.bankAccountType" @on-change="onChangeAccount" id="backAccountType">
                    <Radio label="1" :disabled="inputDisabled">对公</Radio>
                    <Radio label="2" :disabled="inputDisabled">对私</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="'1' === dataObj.bankAccountType">
              <Col span="20">
                <FormItem label="银行开户名" class="pay-line-input" prop="customerNameInBank_public">
                  <Input placeholder="请输入银行开户名" v-model="dataObj.customerNameInBank_public" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
            </Row>
            <!-- tab2 -->
             <Row v-if="'2' === dataObj.bankAccountType">
              <Col span="10">
                <FormItem label="持卡人姓名" class="pay-line-input" prop="customerNameInBank_private">
                  <Input placeholder="请输入持卡人姓名" v-model="dataObj.customerNameInBank_private" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="银行预留手机号" class="pay-line-input" prop="bankReservedMobile">
                  <Input placeholder="请输入银行预留手机号" v-model="dataObj.bankReservedMobile" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="'2' === dataObj.bankAccountType">
              <Col span="10">
                <FormItem label="开户身份证" class="pay-line-input" prop="bankReservedLpidNo">
                  <Input placeholder="请输入开户身份证" v-model="dataObj.bankReservedLpidNo" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
            </Row>
            <!-- 公共 -->
            <Row>
              <Col span="10">
                <FormItem label="银行账号" class="pay-line-input" prop="bankAccountNo">
                  <Input placeholder="请输入银行账号" v-model="dataObj.bankAccountNo" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
               <Col span="10">
                <FormItem label="商户结算类型" class="pay-line-input" prop="target">
                   <Select v-model="dataObj.target" :disabled="inputDisabled">
                    <Option v-for="s in settleTypeList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
             <Row>
              <Col span="10">
                <FormItem label="结算银行名称" class="pay-line-input" prop="subBankBranchName">
                  <!-- <Select @on-change="setLinkNum($event)" :label-in-value="true"
                v-model="dataObj.subBankBranchName"
                filterable
                remote
                :remote-method="getBankBranch"
                :loading="loading">
                <Option v-for="(option) in mydata" :bankLnkNo="option.lbnkNo" :value="option.lbnkNo +'_' + option.lbnkNm" :key="option.lbnkNo">
                  {{option.lbnkNo +'_' + option.lbnkNm}}
                </Option>
            </Select> -->
            <!-- @on-change="setLinkNum($event)" -->
                  <Input placeholder="请输入，比如中国工商银行广州支行"  @on-blur="getBankBranch()"  v-model="dataObj.subBankBranchName" :disabled="inputDisabled"/>
                </FormItem>
                <!-- <li v-for="(value,index) in merchantmydata" :class="{gray:index==now}"> -->
                 <!-- <div class="search-result clearfix" v-show="headerStatus">
                    <li v-for="item in results">
                        <div>
                            <span class="item-name" @click="searchClick($event)">{{item.name}}</span>
                            <span class="item-num">约有{{item.number}}件</span>
                        </div>
                    </li>
                </div> -->
              </Col>
               <Col span="10">
                <FormItem label="联行行号" class="pay-line-input">
                   <Input placeholder="根据结算银行名称自动读取"   v-model="dataObj.bankLineNumber" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
            </Row>
             <Row>
              <Col span="10">
                <FormItem label="结算周期" class="pay-line-input" prop="circle">
                   <Select v-model="dataObj.circle" :disabled="inputDisabled" placeholder="请选择">
                    <Option v-for="s in circleList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
               <Col span="10">
                <FormItem label="起始金额（元）" class="pay-line-input">
                    <!-- <Input placeholder="请输入起始金额" v-model="dataObj.startAmount" :disabled="inputDisabled"/> -->
                  <InputNumber placeholder="请输入起始金额" v-model="dataObj.startAmount" :disabled="inputDisabled" class="long"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <Row class="merchant-common-footer" v-if="this.curOperateType != 'view'">
              <Col span="22">
                <Button @click="goBack" type="success">上一步</Button>
              </Col>
              <Col span="2">
                <Button type="primary"  size="large" class="pay-check-button" :loading="modalLoading" @click="onSave('formValidate')" :disabled="inputDisabled">下一步</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
  </div>
</template>

<script>
import '@/assets/styles/merchant.less'
export default {
  name: 'merchantDetail-settleInfo',
  data () {
    let bankAccountType = '1'
    return {
      banklbnkNo: '',
      model6: '',
      isShow: false,
      loading: false,
      modalLoading: false,
      inputDisabled: false,
      bankAccountTypeTest: '1',
      mydata: [],
      // settleTypeList: settleTypeList,
      // circleList: circleList,
      // 商户结算类型
      settleTypeList: [
        {code: '', name: '请选择'},
        {code: 1, name: '结算到银行账户'},
        {code: 2, name: '结算到账户余额'}
      ],
      // 结算周期
      circleList: [
        {code: '', name: '请选择'},
        {code: 0, name: 'D0-代付'},
        {code: 1, name: 'T+1'},
        {code: 2, name: 'T+2'},
        {code: 3, name: 'T+3'},
        {code: 5, name: 'T+5'}
      ],
      dataObj: {
        bankAccountType: bankAccountType
      },
      middObj: {
        bankAccountType: bankAccountType,
        openAccountBankName: '',
        customerNameInBank: '',
        bankReservedMobile: '',
        bankReservedLpidNo: ''
      },
      formValidate: {
        bankAccountType: '1',
        customerNameInBank_public: '',
        customerNameInBank_private: '',
        bankReservedMobile: '',
        target: '',
        subBankBranchName: ''
      },
      ruleValidate: {
        bankAccountType: [
          { required: true, message: '请选择结算类型', trigger: 'change' }
        ],
        customerNameInBank_public: [
          { required: true, message: '请输入银行开户名', trigger: 'blur' }
        ],
        customerNameInBank_private: [
          { required: true, message: '请输入持卡人姓名', trigger: 'blur' }
        ],
        bankAccountNo: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          { type: 'string', pattern: /^\d{6,50}$/, message: '银行账号至少6位，不超50位', trigger: 'blur' }
        ],
        bankReservedLpidNo: [
          { required: true, message: '请输入开户身份证', trigger: 'blur' }
        ],
        bankReservedMobile: [
          { required: true, message: '请输入银行预留手机号', trigger: 'blur' }
        ],
        circle: [
          { required: true, type: 'number', message: '请选择结算周期', trigger: 'change' }
        ],
        target: [
          { required: true, type: 'number', message: '请选择商户结算类型', trigger: 'change' }
        ],
        subBankBranchName: [
          { required: true, message: '请输入结算银行名称', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['curInfoId', 'curOperateType', 'tabPaneDisable'],
  methods: {
    changeCount (value) {
    },
    /**
     * 初始化
     */
    init () {
      let options = {customerInfoId: this.curInfoId}
      this.$api.merchantDetail.initMerchantSettleInfo(options).then(resJson => {
        this.dataObj = resJson
        this.middObj = resJson
        this.formValidate = resJson
        this.dataObj.circle = this.dataObj.circle === -1 ? '' : this.dataObj.circle
        this.dataObj.target = this.dataObj.target === 0 ? '' : this.dataObj.target
        this.dataObj.bankAccountType = this.middObj.bankAccountType = resJson.bankAccountType.toString()
        this.dataObj.subBankBranchName = resJson.openAccountBankName
        if (this.dataObj.bankAccountType === '1') {
          this.dataObj.customerNameInBank_public = this.middObj.customerNameInBank
          // this.dataObj.subBankBranchName = this.middObj.openAccountBankName
          this.dataObj.bankReservedMobile = ''
          this.dataObj.bankReservedLpidNo = ''
        } else if (this.dataObj.bankAccountType === '2') { // 对私属性置空
          this.dataObj.customerNameInBank_private = this.middObj.customerNameInBank
          // this.dataObj.subBankBranchName = this.middObj.openAccountBankName
          this.dataObj.bankReservedMobile = this.middObj.bankReservedMobile
          this.dataObj.bankReservedLpidNo = this.middObj.bankReservedLpidNo
        }
        // TODO 1.双向绑定或设置值
        if (this.curOperateType === 'view') {
          // TODO 2.表单元素disabled
          this.inputDisabled = true
        }
      })
    },
    getBankBranch () { // query
      // if (query !== '') {
      this.loading = true
      let options = {lbnkNm: this.dataObj.subBankBranchName}
      this.$api.merchantDetail.getBankBranch(options).then(resJson => {
        this.mydata = resJson.rows
        this.loading = false
        if (resJson.rows.length > 0) {
          this.dataObj.bankLineNumber = resJson.rows[0].lbnkNo
        }
      })
      // }
    },
    setLinkNum (v) {
      this.dataObj.bankLineNumber = v
    },
    // 保存
    onSave (name) {
      if (this.dataObj.bankAccountType === '1') {
        this.ruleValidate.customerNameInBank_private[0].required = false
        this.ruleValidate.bankReservedLpidNo[0].required = false
        this.ruleValidate.bankReservedMobile[0].required = false
        // add-new
        this.ruleValidate.customerNameInBank_public[0].required = true
      } else {
        this.ruleValidate.customerNameInBank_public[0].required = false
        // add-new
        this.ruleValidate.customerNameInBank_private[0].required = true
        this.ruleValidate.bankReservedLpidNo[0].required = true
        this.ruleValidate.bankReservedMobile[0].required = true
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 校验“不常规的表单元素”，特殊处理
          if (this.dataObj.bankAccountType === '1') {
            this.middObj.customerNameInBank = this.dataObj.customerNameInBank_public
            this.middObj.openAccountBankName = this.dataObj.subBankBranchName
            this.middObj.bankReservedMobile = ''
            this.middObj.bankReservedLpidNo = ''
          } else if (this.dataObj.bankAccountType === '2') { // 对私属性置空
            this.middObj.customerNameInBank = this.dataObj.customerNameInBank_private
            this.middObj.openAccountBankName = this.dataObj.subBankBranchName
            this.middObj.bankReservedMobile = this.dataObj.bankReservedMobile
            this.middObj.bankReservedLpidNo = this.dataObj.bankReservedLpidNo
          }
          this.$api.merchantDetail.saveSettleDetail(this.middObj).then((res) => {
            if (this.tabPaneDisable === true) {
              this.$emit('on-change-tab', 'tabPaneDisable3')
            }
            // 更新父组件的curTabIndex
            setTimeout(() => {
              this.$emit('on-listen-child', 'tab03')
            }, 800)
          })
        }
      })
    },
    goBack () {
      this.$emit('on-listen-child', 'tab01')
    },
    onChangeAccount (value) {
      this.dataObj.bankAccountType = value
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route' (to, from) {
      let toParams = to.params
      let fromParams = from.params
      if (fromParams.cid !== '' && toParams.cid === undefined) {
        this.curInfoId = ''
        this.curOperateType = this.$route.params.opt || 'add'
        this.auditId = ''
        this.auditModule = ''
        this.dataObj = {}
        this.auditObj = {}
        if (this.curOperateType === 'add') {
          this.$emit('on-listen-child', 0)
          this.init()
        }
      }
    }
  }
}
</script>

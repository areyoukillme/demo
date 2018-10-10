<template>
  <div class="merchant-basic-detail merchant-detail-inner">
    <Form :model="dataObj" ref="dataObj" :rules="ruleValidate" :label-width="140">
      <Collapse v-model="defaultShowPanel">
        <Panel name="1">
          <span class="merchant-basic-title">基本信息</span>
          <div slot="content">
            <Row>
              <Col span="10">
                <FormItem label="商户名称" prop="name">
                  <Input v-model="dataObj.name" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户性质" prop="customerType">
                  <Select v-model="dataObj.customerType" :disabled="inputDisabled" @on-change="customerTypeChange">
                    <Option v-for="c in this.customerTypeList" :key="c.code" :value='c.code' :label="c.name"></Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="商户简称" prop="shortName">
                  <Input v-model="dataObj.shortName" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户手机" prop="mobile">
                  <Input v-model="dataObj.mobile" :disabled="inputDisabled" :maxlength="maxLength"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="电话号码" prop="telephone">
                  <Input v-model="dataObj.telephone" :disabled="inputDisabled" :maxlength="telphoneLength"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="所属省市区" prop="areaCode">
                  <Row>
                    <Col span="8">
                      <Select v-model="dataObj.province" @on-change="getProvinceByParent(dataObj.province)" :disabled="inputDisabled">
                        <Option v-for="s in areaCodeList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                    <Col span="8" class="merchant-basic-eara">
                      <Select v-model="formItem.city"
                            @on-change="getDistrictByProvinceAndCity(dataObj.province, formItem.city)" :disabled="inputDisabled">
                        <Option v-for="s in cityList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Select v-model="dataObj.areaCode" :disabled="inputDisabled">
                        <Option v-for="s in districtList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="营业地址" prop="businessAddress">
                  <Input v-model="dataObj.businessAddress" type="textarea" :autosize="{minRows: 2, maxRows: 5}" :disabled="inputDisabled" />
                </FormItem>
              </Col>
            </Row>
          </div>
        </Panel>
        <div class="add">
          <span @click="changeBizLicenseType1" :class="{active:activenum==0}">普通营业执照</span>

          <span @click="changeBizLicenseType2" :class="{active:activenum==1}">三证合一</span>
        </div>
        <Panel name="2" class="two">
          <span class="merchant-basic-title">营业执照信息</span>
          <div slot="content">
          
            <div v-show="dataObj.useUscc === '0'" :label-width="140">
              <Row>
                <Col span="10">
                  <FormItem label="营业执照号" prop="businessLicenseNo0">
                    <Input v-model="dataObj.businessLicenseNo0" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="商户名称">
                    <Input v-model="dataObj.name" :disabled="true"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="注册资本（万元)" prop="registeredCapital0">
                    <InputNumber :min="0" v-model="dataObj.registeredCapital0" :disabled="inputDisabled" class="long"></InputNumber>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="营业执照期限" prop="businessLicenseExpDate0">
                    <DatePicker type="date" v-model="dataObj.businessLicenseExpDate0" :disabled="inputDisabled"></DatePicker>
                    <Checkbox @on-change="set4everOfBusinessLicenseExpDate" :disabled="inputDisabled">长期</Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="注册地址" prop="registeredAddress0">
                    <Input v-model="dataObj.registeredAddress0" type="textarea" :autosize="{minRows: 2, maxRows: 5}" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="组织机构代码" prop="orgStructureCode0">
                    <Input v-model="dataObj.orgStructureCode0" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="国税登记证号">
                    <Input v-model="dataObj.natTaxRegCerNo0" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="国税登记证过期日期">
                    <DatePicker type="date" v-model="dataObj.natTaxRegExpDate0" :disabled="inputDisabled"></DatePicker>
                    <Checkbox @on-change="set4everOfNatTaxRegExpDate" :disabled="inputDisabled">长期</Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="地税登记证号">
                    <Input v-model="dataObj.locTaxRegCerNo0" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="地税登记证过期日期">
                    <DatePicker type="date" v-model="dataObj.locTaxRegCerExpDate0" :disabled="inputDisabled"></DatePicker>
                    <Checkbox @on-change="set4everOfLocTaxRegCerExpDate" :disabled="inputDisabled">长期</Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="法人证件类型" prop="leaPersoniDentificationType0">
                    <Select v-model="dataObj.leaPersoniDentificationType0" :disabled="inputDisabled">
                      <Option v-for="l in this.leaPersoniDentificationTypeList" :key="l.code" :value="l.code">{{ l.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="法人证件号" prop="leaPersoniDentificationNo0">
                    <Input v-model="dataObj.leaPersoniDentificationNo0" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="法人姓名" prop="leaPersonName0">
                    <Input v-model="dataObj.leaPersonName0" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="法人证件过期日期" prop="leaPerDenExpDate0">
                    <DatePicker type="date" v-model="dataObj.leaPerDenExpDate0" :disabled="inputDisabled"></DatePicker>
                    <Checkbox @on-change="set4everOfLeaPerDenExpDate" :disabled="inputDisabled">长期</Checkbox>
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div v-show="dataObj.useUscc === '1'" :label-width="140">
              <Row>
                <Col span="10">
                  <FormItem label="商户名称">
                    <Input v-model="dataObj.name" :disabled="true"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="统一社会信用代码" prop="businessLicenseNo1">
                    <Input v-model="dataObj.businessLicenseNo1" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="营业执照期限" prop="businessLicenseExpDate1">
                    <DatePicker type="date" v-model="dataObj.businessLicenseExpDate1" :disabled="inputDisabled"></DatePicker>
                    <Checkbox @on-change="set4everOfBusinessLicenseExpDate" :disabled="inputDisabled">长期</Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="注册资本（万元)" prop="registeredCapital1">
                    <InputNumber :min="0" v-model="dataObj.registeredCapital1" :disabled="inputDisabled" class="long"></InputNumber>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="注册地址" prop="registeredAddress1">
                    <Input v-model="dataObj.registeredAddress1" type="textarea" :autosize="{minRows: 2, maxRows: 5}" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="法人证件类型" prop="leaPersoniDentificationType1">
                    <Select v-model="dataObj.leaPersoniDentificationType1" :disabled="inputDisabled">
                      <Option v-for="l in this.leaPersoniDentificationTypeList" :key="l.code" :value="l.code">{{ l.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="法人证件号" prop="leaPersoniDentificationNo1">
                    <Input v-model="dataObj.leaPersoniDentificationNo1" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="法人姓名" prop="leaPersonName1">
                    <Input v-model="dataObj.leaPersonName1" :disabled="inputDisabled"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="法人证件过期日期" prop="leaPerDenExpDate1">
                    <DatePicker type="date" v-model="dataObj.leaPerDenExpDate1" :disabled="inputDisabled"></DatePicker>
                    <Checkbox @on-change="set4everOfLeaPerDenExpDate" :disabled="inputDisabled">长期</Checkbox>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
        </Panel>
        <Panel name="3">
          <span class="merchant-basic-title">其它基本信息</span>
          <div slot="content">
            <Row>
              <Col span="10">
                <FormItem label="连锁关系">
                  <Select v-if="chainSelectList.length > 0" v-model="formItem.chainSelect" :disabled="inputDisabled">
                    <Option v-for="p in chainSelectList" :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="网站地址" prop="webAddress">
                  <Input type="email" v-model="dataObj.webAddress" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="formItem.chainSelect === '2'">
              <Col span="10">
                <FormItem label="上级商户编号">
                  <Input v-model="dataObj.parentCustomerCode" @on-blur="initParentCustomerName" :disabled="inputDisabled" />
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="上级商户名称">
                  <Input v-model="formItem.parentCustomerName" :disabled="true"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="行业类目" prop="tradeCategory">
                  <Row>
                    <Col span="8">
                      <Select v-model="formItem.category1" @on-change="refreshCategory2ByCategory1" :disabled="inputDisabled">
                        <Option v-for="s in category1List" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                    <Col span="8" class="merchant-basic-eara">
                      <Select v-model="formItem.category2" @on-change="refreshCategory3ByCategory1And2" :disabled="inputDisabled">
                        <Option v-for="s in category2List" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Select v-model="formItem.category3" @on-change="selectCategory3" :disabled="inputDisabled">
                        <Option v-for="s in category3List" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="经营范围（主业）" prop="businessScope">
                  <Input v-model="dataObj.businessScope" type="textarea" :autosize="{minRows: 2, maxRows: 5}" :disabled="inputDisabled" :maxlength="textareaMax"/>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Panel>
      </Collapse>
    </Form>
    <Row class="merchant-common-footer" v-if="this.curOperateType === 'add' || this.curOperateType === 'edit'">
      <div>
        <Col span="22">&nbsp;</Col>
        <Col>
          <Button type="primary" size="large" :disabled="inputDisabled" @click="save()">下一步</Button>
        </Col>
      </div>
    </Row>
  </div>
</template>
<script>
import '@/assets/styles/merchant.less'
import AreaCodes from '@/common/data/areaCode'
import CommonData from '@/common/data/index'
import CategoryUtil from '@/common/utils/CategoryUtil'
import Cookies from 'js-cookie'
export default {
  name: 'merchantDetail-basicInfo',
  props: ['curInfoId', 'curOperateType', 'auditId', 'auditModule', 'tabPaneDisable'],
  data () {
    return {
      activenum:0,

      // 显示第几个折叠面板
      defaultShowPanel: ['1', '2', '3'],
      inputDisabled: false,
      maxLength: 11,
      telphoneLength: 20,
      textareaMax: 200,
      // 来自数据库的原始数据
      originData: {},
      // 与视图绑定的数据(ViewBindingModel)
      dataObj: {
        name: '',
        customerType: '',
        shortName: '',
        mobile: '',
        telephone: '',
        businessAddress: '',
        // areaCode: '',
        province: '',
        useUscc: '',
        businessLicenseNo0: '',
        registeredCapital0: 0,
        businessLicenseExpDate0: '',
        registeredAddress0: '',
        orgStructureCode0: '',
        natTaxRegCerNo0: '',
        natTaxRegExpDate0: '',
        locTaxRegCerNo0: '',
        locTaxRegCerExpDate0: '',
        leaPersoniDentificationType0: '',
        leaPersoniDentificationNo0: '',
        leaPersonName0: '',
        leaPerDenExpDate0: '',
        businessLicenseNo1: '',
        registeredCapital1: 0,
        businessLicenseExpDate1: '',
        registeredAddress1: '',
        leaPersoniDentificationType1: '',
        leaPersoniDentificationNo1: '',
        leaPersonName1: '',
        leaPerDenExpDate1: '',
        webAddress: '',
        parentCustomerCode: '',
        businessScope: ''
      },
      // 审核信息
      auditObj: {},
      leaPersoniDentificationTypeList: CommonData.leaPersoniDentificationTypeList,
      customerTypeList: CommonData.customerTypeList,
      // 表单的辅助变量
      formItem: {
        province: '',
        city: '',
        district: '',
        category1: '',
        category2: '',
        category3: '',
        chainSelect: '',
        parentCustomerName: ''
      },
      // 省列表/市列表/区列表
      areaCodeList: AreaCodes.areaList,
      cityList: [],
      districtList: [],
      // 第一级栏目列表/第二级栏目列表/第三级栏目列表
      category1List: CategoryUtil.getFirstCategoryList(),
      category2List: [],
      category3List: [],
      chainSelectList: CommonData.chainSelectList,
      firstAuditComment: '',
      ruleValidate: {
        name: [
          {required: true, message: '请输入商户名称,字数不超50', trigger: 'blur', max: 50}
        ],
        customerType: [
          {required: true, type: 'number', message: '请选择商户性质', trigger: 'change'}
        ],
        shortName: [
          {required: true, message: '请输入商户简称,字数不超50', trigger: 'blur', max: 50}
        ],
        mobile: [
          // ^(0|86|17951)?(13[0-9]|16[0-9]|19[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$
          {required: true, message: '请输入商户手机', trigger: 'blur', pattern: /^1[3-9][0-9]{9}$/}
        ],
        telephone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'}
        ],
        businessAddress: [
          {required: true, message: '请输入营业地址,字数不超100', trigger: 'blur', max: 100}
        ],
        areaCode: [
          {required: true, message: '请选择所属省市区', trigger: 'change'}
        ],
        businessLicenseNo0: [
          {required: true, message: '请输入营业执照号,字数不超30', trigger: 'blur', max: 30}
        ],
        registeredCapital0: [
          {required: true, type: 'number', message: '请输入注册资本', trigger: 'blur'}
        ],
        businessLicenseExpDate0: [
          {required: true, type: 'date', message: '请选择营业执照期限', trigger: 'change'}
        ],
        registeredAddress0: [
          {required: true, message: '请输入注册地址,字数不超50', trigger: 'blur', max: 50}
        ],
        orgStructureCode0: [
          {required: true, message: '请输入组织机构代码,字数不超30', trigger: 'blur', max: 30}
        ],
        leaPersoniDentificationType0: [
          {required: true, type: 'number', message: '请输入法人证件类型', trigger: 'change'}
        ],
        leaPersoniDentificationNo0: [
          {required: true, message: '请输入法人证件号,字数不超20', trigger: 'blur', max: 20}
        ],
        leaPersonName0: [
          {required: true, message: '请输入法人姓名,字数不超10', trigger: 'blur', max: 10}
        ],
        leaPerDenExpDate0: [
          {required: true, type: 'date', message: '请选择法人证件过期日期', trigger: 'change'}
        ],
        businessLicenseNo1: [
          {required: true, message: '请输入营业执照号,字数不超30', trigger: 'blur', max: 30}
        ],
        registeredCapital1: [
          {required: true, type: 'number', message: '请输入注册资本', trigger: 'blur'}
        ],
        businessLicenseExpDate1: [
          {required: true, type: 'date', message: '请选择营业执照期限', trigger: 'change'}
        ],
        registeredAddress1: [
          {required: true, message: '请输入注册地址,字数不超50', trigger: 'blur', max: 50}
        ],
        leaPersoniDentificationType1: [
          {required: true, type: 'number', message: '请输入法人证件类型', trigger: 'change'}
        ],
        leaPersoniDentificationNo1: [
          {required: true, message: '请输入法人证件号,字数不超20', trigger: 'blur', max: 20}
        ],
        leaPersonName1: [
          {required: true, message: '请输入法人姓名,字数不超10', trigger: 'blur', max: 10}
        ],
        leaPerDenExpDate1: [
          {required: true, type: 'date', message: '请选择法人证件过期日期', trigger: 'change'}
        ],
        webAddress: [
          {required: true, message: '请输入网站地址,字数不超100', trigger: 'blur', max: 100}
        ],
        tradeCategory: [
          {required: true, message: '请选择完整行业类目', trigger: 'change'}
        ],
        businessScope: [
          {required: true, message: '请输入经营范围,字数不超500', trigger: 'blur', max: 500}
        ]
      },
      longTime: new Date('2099-12-31')
    }
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      this.inputDisabled = false
      if (this.curOperateType === 'view') {
        this.initDeatil4View()
      } else if (this.curOperateType === 'edit') {
        this.initDeatil4Edit()
      } else if (this.curOperateType === 'add') {
        this.initDeatil4Add()
      }
      // 如果来自审核或拒绝审核的操作，则显示审核相关信息
      if (this.auditId) {
        this.defaultShowPanel = ['1', '2', '3', '4']
      }
    },
    initDeatil4View () {
      let options = {customerInfoId: this.curInfoId}
      this.$api.merchantDetail.initMerchantBasicInfo4View(options).then(res => {
        // this.originData = res
        this.dataObj = res
        this.initDeatil()
        // 表单元素置灰
        this.inputDisabled = true
      })
    },
    initDeatil4Add () {
      this.$api.merchantDetail.initMerchantBasicInfo4Edit(null).then(res => {
        // this.originData = res
        this.dataObj = res
        this.initDeatil()
      })
    },
    initDeatil4Edit () {
      let options = {customerInfoId: this.curInfoId}
      this.$api.merchantDetail.initMerchantBasicInfo4Edit(options).then(res => {
        // this.originData = res
        this.dataObj = res
        this.initDeatil()
      })
    },
    initDeatil () {
      // 通知父组件detail.vue更新curInfoId
      // this.$emit('on-listen-child', null, this.originData.infoId) dataObj
      this.$emit('on-listen-child', null, this.dataObj.infoId)
      // 构造“与视图双向绑定的数据模型”（即初始化表单）
      this.createDataForViewBindingModel()
    },
    /**
     * 保存
     */
    save () {
      // 重写iView >> iForm >> validate方法
      this.$refs['dataObj'].validate = function (callback) {
        // 筛选出需校验的字段
        var needValidateFields = []
        for (var filedName in this.rules) {
          var rule = this.rules[filedName]
          if (rule[0].required) {
            needValidateFields.push(filedName)
          }
        }
        var valid = true
        var count = 0
        this.fields.forEach(function (field) {
          if (needValidateFields.includes(field.prop)) { // 仅校验required:true的字段
            field.validate('', function (errors) {
              if (errors) {
                valid = false
              }
              if (++count === needValidateFields.length) {
                if (typeof callback === 'function') {
                  callback(valid)
                }
              }
            })
          }
        })
      }
      // 保存（先校验表单）
      this.$refs['dataObj'].validate((valid) => {
        if (valid) {
          // 校验“不常规的表单元素”，特殊处理
          if (!this.validateOthers()) {
            return false
          }
          // 组装保存时的请求参数
          let params = this.formatRequestParams()
          this.$api.merchantDetail.saveMerchantBasicInfo(params).then(res => {
            if (res.returnCode !== '0000') {
              this.$Message.error(res.returnMsg)
              return
            }
            Cookies.set('customerType', this.dataObj.customerType)
            if (this.tabPaneDisable === true) {
              this.$emit('on-change-tab', 'tabPaneDisable2')
            }
            // 更新父组件的curTabIndex
            setTimeout(() => {
              this.$emit('on-listen-child', 'tab02')
            }, 800)
          })
        } else {
          document.getElementById('container').scrollTop = 140
        }
      })
    },
    /**
     * 组装保存时的请求参数
     */
    formatRequestParams () {
      let params = {}
      Object.assign(params, this.dataObj)
      // 构造“Panel 2 ：营业执照信息”的参数
      if (params.useUscc === '0') {
        params['businessLicenseNo'] = params['businessLicenseNo0']
        params['registeredCapital'] = params['registeredCapital0']
        params['businessLicenseExpDate'] = params['businessLicenseExpDate0']
        params['registeredAddress'] = params['registeredAddress0']
        params['orgStructureCode'] = params['orgStructureCode0']
        params['natTaxRegCerNo'] = params['natTaxRegCerNo0']
        params['natTaxRegExpDate'] = params['natTaxRegExpDate0']
        params['locTaxRegCerNo'] = params['locTaxRegCerNo0']
        params['locTaxRegCerExpDate'] = params['locTaxRegCerExpDate0']
        params['leaPersoniDentificationType'] = params['leaPersoniDentificationType0']
        params['leaPersoniDentificationNo'] = params['leaPersoniDentificationNo0']
        params['leaPersonName'] = params['leaPersonName0']
        params['leaPerDenExpDate'] = params['leaPerDenExpDate0']
      } else if (params.useUscc === '1') {
        params['businessLicenseNo'] = params['businessLicenseNo1']
        params['registeredCapital'] = params['registeredCapital1']
        params['businessLicenseExpDate'] = params['businessLicenseExpDate1']
        params['registeredAddress'] = params['registeredAddress1']
        params['orgStructureCode'] = params['orgStructureCode1']
        params['leaPersoniDentificationType'] = params['leaPersoniDentificationType1']
        params['leaPersoniDentificationNo'] = params['leaPersoniDentificationNo1']
        params['leaPersonName'] = params['leaPersonName1']
        params['leaPerDenExpDate'] = params['leaPerDenExpDate1']
      }
      // 移除提交参数中多余的数据
      delete params['businessLicenseNo0']
      delete params['registeredCapital0']
      delete params['businessLicenseExpDate0']
      delete params['registeredAddress0']
      delete params['orgStructureCode0']
      delete params['natTaxRegCerNo0']
      delete params['natTaxRegExpDate0']
      delete params['locTaxRegCerNo0']
      delete params['locTaxRegCerExpDate0']
      delete params['leaPersoniDentificationType0']
      delete params['leaPersoniDentificationNo0']
      delete params['leaPersonName0']
      delete params['leaPerDenExpDate0']
      delete params['businessLicenseNo1']
      delete params['registeredCapital1']
      delete params['businessLicenseExpDate1']
      delete params['registeredAddress1']
      delete params['leaPersoniDentificationType1']
      delete params['leaPersoniDentificationNo1']
      delete params['leaPersonName1']
      delete params['leaPerDenExpDate1']
      return params
    },
    // 三级栏目
    refreshCategory2ByCategory1 () {
      this.category2List = CategoryUtil.getSecondByFirstCategory(this.formItem.category1)
    },
    refreshCategory3ByCategory1And2 () {
      this.category3List = CategoryUtil.getThirdByFirstAndSecondCategory(this.formItem.category1, this.formItem.category2)
    },
    selectCategory3 () {
      if (this.formItem.category1 && this.formItem.category2 && this.formItem.category3) {
        this.dataObj.tradeCategory = this.combineTradeCategory()
      } else {
        this.dataObj.tradeCategory = ''
      }
    },
    combineTradeCategory () {
      return '5651' + this.formItem.category1 + this.formItem.category2 + this.formItem.category3
    },
    // 日期设置
    set4everOfBusinessLicenseExpDate (isChecked) {
      this.setExpDate(isChecked, 'businessLicenseExpDate')
    },
    set4everOfLeaPerDenExpDate (isChecked) {
      if (isChecked) {
        this.dataObj.leaPerDenExpDate0 = this.longTime
        this.dataObj.leaPerDenExpDate1 = this.longTime
      } else {
        this.dataObj.leaPerDenExpDate0 = ''
        this.dataObj.leaPerDenExpDate1 = ''
      }
    },
    set4everOfNatTaxRegExpDate (isChecked) {
      this.setExpDate(isChecked, 'natTaxRegExpDate')
    },
    set4everOfLocTaxRegCerExpDate (isChecked) {
      this.setExpDate(isChecked, 'locTaxRegCerExpDate')
    },
    setExpDate (isChecked, expDateName) {
      let name = expDateName + this.dataObj.useUscc
      if (isChecked) {
        this.dataObj[name] = this.longTime
      } else {
        this.dataObj[name] = ''
      }
    },
    // 所属省市区
    getProvinceByParent (province) {
      var city = []
      var area = AreaCodes.areaList
      for (var i = 0; i < area.length; i++) {
        if (area[i].code === province) {
          var children = area[i].children
          if (children != null) {
            for (var j = 0; j < children.length; j++) {
              var a = { code: children[j].code, name: children[j].name }
              city.push(a)
            }
          }
        }
      }
      this.cityList = city
    },
    getDistrictByProvinceAndCity (province, city) {
      var district = []
      var area = AreaCodes.areaList
      for (var i = 0; i < area.length; i++) {
        if (area[i].code === province) {
          // 找到对应的省
          var cityArr = area[i].children
          if (cityArr != null) {
            for (var j = 0; j < cityArr.length; j++) {
              if (cityArr[j].code === city) {
                // 找到对应的城市
                var districtArr = cityArr[j].children
                // 获取对应的区
                if (districtArr != null) {
                  for (var k = 0; k < districtArr.length; k++) {
                    var a = {
                      code: districtArr[k].code,
                      name: districtArr[k].name
                    }
                    district.push(a)
                  }
                }
              }
            }
          }
        }
      }
      this.districtList = district
    },
    // 获取父级商户名
    initParentCustomerName () {
      if (this.dataObj.parentCustomerCode) {
        this.formItem.chainSelect = '2'
        this.$api.merchantDetail.getParentCustomerName({customerCode: this.dataObj.parentCustomerCode}).then((res) => {
          if (res && res.name) {
            this.formItem.parentCustomerName = res.name
          }
        })
      } else {
        this.formItem.chainSelect = '1'
      }
    },
    // 时间戳转化
    tampsToDate (str) {
      var newDate = new Date()
      newDate.setTime(str)
      let y = newDate.getFullYear()
      let m = newDate.getMonth() + 1
      let d = newDate.getDate()
      return new Date(y + '-' + m + '-' + d)
    },
    /**
     * 校验“不常规的表单元素”，特殊处理
     * 注：包括联动下拉框、营业执照信息两个tab中同名的属性
     */
    validateOthers () {
      // 校验连锁关系
      if (this.formItem.chainSelect === '2') {
        if (!this.dataObj.parentCustomerCode) {
          this.$Message.error('选择分店时，上级商户编号必填')
          return false
        }
      }
      return true
    },
    customerTypeChange (type) {
      this.dataObj.customerType = parseInt(type)
    },
    /**
     * “与视图双向绑定的数据”的构造
     * 注：包括数据深拷贝、特殊数据的数据转换
     */
    createDataForViewBindingModel () {
      /**
       * 第一步：数据深拷贝
       */
      // Object.assign(this.dataObj, this.originData)
      /**
       * 第二步：特殊数据的数据转换
       */
      // 初始化营业执照类型
      this.dataObj.useUscc = this.dataObj.useUscc.toString()
      // 初始商户类型
      if (this.dataObj.customerType !== 0) {
        this.dataObj.customerType = parseInt(this.dataObj.customerType)
      } else {
        this.dataObj.customerType = ''
      }
      Cookies.set('customerType', this.dataObj.customerType)
      // 初始化行政区域
      if (this.dataObj.areaCode === '000000') {
        this.dataObj.province = ''
        this.formItem.city = ''
        this.dataObj.areaCode = ''
      } else {
        if (this.dataObj.areaCode && this.dataObj.areaCode.length === 6) {
          this.dataObj.province = this.dataObj.areaCode.substring(0, 2) + '0000'
          this.formItem.city = this.dataObj.areaCode.substring(0, 4) + '00'
        }
      }
      // 初始化连锁关系
      this.initParentCustomerName()
      // 初始化行业栏目
      if (this.dataObj.tradeCategory === '0000000000000000') {
        this.formItem.category1 = ''
        this.formItem.category2 = ''
        this.formItem.category3 = ''
        this.dataObj.tradeCategory = ''
      } else {
        if (this.dataObj.tradeCategory.length === 16) {
          this.formItem.category1 = this.dataObj.tradeCategory.substring(4, 8)
          this.refreshCategory2ByCategory1()
          this.formItem.category2 = this.dataObj.tradeCategory.substring(8, 12)
          this.refreshCategory3ByCategory1And2()
          this.formItem.category3 = this.dataObj.tradeCategory.substring(12, 16)
        }
      }
      // 初始化营业证件版块
      this.initBizLicense()
    },
    /**
     * 初始化营业证件版块（表单赋值+表单校验规则修改）
     */
    initBizLicense () {
      let type = this.dataObj.useUscc
      this.fillDataOfBizLicense(type)
      this.setValidateRuleOfBizLicense(type)
    },
    /**
     * 营业证件版块的表单赋值（用于页面初始化）
     * @param type 营业执照类型 0:普通营业执照，1:三证合一
     */
    fillDataOfBizLicense (type) {
      if (type === '0') {
        // 填充普通营业执照数据
        this.dataObj['businessLicenseNo0'] = this.dataObj['businessLicenseNo']
        this.dataObj['registeredCapital0'] = this.dataObj['registeredCapital']
        this.dataObj['businessLicenseExpDate0'] = this.tampsToDate(this.dataObj.businessLicenseExpDate)
        this.dataObj['registeredAddress0'] = this.dataObj['registeredAddress']
        this.dataObj['orgStructureCode0'] = this.dataObj['orgStructureCode']
        this.dataObj['natTaxRegCerNo0'] = this.dataObj['natTaxRegCerNo']
        this.dataObj['natTaxRegExpDate0'] = this.tampsToDate(this.dataObj['natTaxRegExpDate'])
        this.dataObj['locTaxRegCerNo0'] = this.dataObj['locTaxRegCerNo']
        this.dataObj['locTaxRegCerExpDate0'] = this.tampsToDate(this.dataObj['locTaxRegCerExpDate'])
        this.dataObj['leaPersoniDentificationType0'] = this.dataObj['leaPersoniDentificationType']
        this.dataObj['leaPersoniDentificationNo0'] = this.dataObj['leaPersoniDentificationNo']
        this.dataObj['leaPersonName0'] = this.dataObj['leaPersonName']
        this.dataObj['leaPerDenExpDate0'] = this.tampsToDate(this.dataObj.leaPerDenExpDate)
        // // 清空三证合一数据
        this.dataObj['businessLicenseNo1'] = ''
        this.dataObj['registeredCapital1'] = 0
        this.dataObj['businessLicenseExpDate1'] = ''
        this.dataObj['registeredAddress1'] = ''
        this.dataObj['leaPersoniDentificationType1'] = ''
        this.dataObj['leaPersoniDentificationNo1'] = ''
        this.dataObj['leaPersonName1'] = ''
        this.dataObj['leaPerDenExpDate1'] = ''
      } else if (type === '1') {
        // 清空普通营业执照数据
        this.dataObj['businessLicenseNo0'] = ''
        this.dataObj['registeredCapital0'] = 0
        this.dataObj['businessLicenseExpDate0'] = ''
        this.dataObj['registeredAddress0'] = ''
        this.dataObj['orgStructureCode0'] = ''
        this.dataObj['natTaxRegCerNo0'] = ''
        this.dataObj['natTaxRegExpDate0'] = ''
        this.dataObj['locTaxRegCerNo0'] = ''
        this.dataObj['locTaxRegCerExpDate0'] = ''
        this.dataObj['leaPersoniDentificationType0'] = ''
        this.dataObj['leaPersoniDentificationNo0'] = ''
        this.dataObj['leaPersonName0'] = ''
        this.dataObj['leaPerDenExpDate0'] = ''
        // 填充三证合一数据
        this.dataObj['businessLicenseNo1'] = this.dataObj['businessLicenseNo']
        this.dataObj['registeredCapital1'] = this.dataObj['registeredCapital']
        this.dataObj['businessLicenseExpDate1'] = this.tampsToDate(this.dataObj.businessLicenseExpDate)
        this.dataObj['registeredAddress1'] = this.dataObj['registeredAddress']
        this.dataObj['leaPersoniDentificationType1'] = this.dataObj['leaPersoniDentificationType']
        this.dataObj['leaPersoniDentificationNo1'] = this.dataObj['leaPersoniDentificationNo']
        this.dataObj['leaPersonName1'] = this.dataObj['leaPersonName']
        this.dataObj['leaPerDenExpDate1'] = this.tampsToDate(this.dataObj.leaPerDenExpDate)
      }
    },
    /**
     * 营业证件版块的表单清空（用于版块切换）
     */
    clearDataOfBizLicense () {
      this.dataObj['businessLicenseNo0'] = ''
      this.dataObj['registeredCapital0'] = 0
      this.dataObj['businessLicenseExpDate0'] = ''
      this.dataObj['registeredAddress0'] = ''
      this.dataObj['orgStructureCode0'] = ''
      this.dataObj['natTaxRegCerNo0'] = ''
      this.dataObj['natTaxRegExpDate0'] = ''
      this.dataObj['locTaxRegCerNo0'] = ''
      this.dataObj['locTaxRegCerExpDate0'] = ''
      this.dataObj['leaPersoniDentificationType0'] = ''
      this.dataObj['leaPersoniDentificationNo0'] = ''
      this.dataObj['leaPersonName0'] = ''
      this.dataObj['leaPerDenExpDate0'] = ''
      this.dataObj['businessLicenseNo1'] = ''
      this.dataObj['registeredCapital1'] = 0
      this.dataObj['businessLicenseExpDate1'] = ''
      this.dataObj['registeredAddress1'] = ''
      this.dataObj['leaPersoniDentificationType1'] = ''
      this.dataObj['leaPersoniDentificationNo1'] = ''
      this.dataObj['leaPersonName1'] = ''
      this.dataObj['leaPerDenExpDate1'] = ''
    },
    /**
     * 营业证件版块的表单校验规则修改
     * @param type 营业执照类型 0:普通营业执照，1:三证合一
     */
    setValidateRuleOfBizLicense (type) {
      if (type === '0') {
        // 添加普通营业执照数据的校验
        this.ruleValidate.businessLicenseNo0[0].required = true
        this.ruleValidate.registeredCapital0[0].required = true
        this.ruleValidate.businessLicenseExpDate0[0].required = true
        this.ruleValidate.registeredAddress0[0].required = true
        this.ruleValidate.orgStructureCode0[0].required = true
        this.ruleValidate.leaPersoniDentificationType0[0].required = true
        this.ruleValidate.leaPersoniDentificationNo0[0].required = true
        this.ruleValidate.leaPersonName0[0].required = true
        this.ruleValidate.leaPerDenExpDate0[0].required = true
        // // 移除三证合一数据的校验
        this.ruleValidate.businessLicenseNo1[0].required = false
        this.ruleValidate.registeredCapital1[0].required = false
        this.ruleValidate.businessLicenseExpDate1[0].required = false
        this.ruleValidate.registeredAddress1[0].required = false
        this.ruleValidate.leaPersoniDentificationType1[0].required = false
        this.ruleValidate.leaPersoniDentificationNo1[0].required = false
        this.ruleValidate.leaPersonName1[0].required = false
        this.ruleValidate.leaPerDenExpDate1[0].required = false
      } else if (type === '1') {
        // 移除普通营业执照数据的校验
        this.ruleValidate.businessLicenseNo0[0].required = false
        this.ruleValidate.registeredCapital0[0].required = false
        this.ruleValidate.businessLicenseExpDate0[0].required = false
        this.ruleValidate.registeredAddress0[0].required = false
        this.ruleValidate.orgStructureCode0[0].required = false
        this.ruleValidate.leaPersoniDentificationType0[0].required = false
        this.ruleValidate.leaPersoniDentificationNo0[0].required = false
        this.ruleValidate.leaPersonName0[0].required = false
        this.ruleValidate.leaPerDenExpDate0[0].required = false
        // // 添加三证合一数据的校验
        this.ruleValidate.businessLicenseNo1[0].required = true
        this.ruleValidate.registeredCapital1[0].required = true
        this.ruleValidate.businessLicenseExpDate1[0].required = true
        this.ruleValidate.registeredAddress1[0].required = true
        this.ruleValidate.leaPersoniDentificationType1[0].required = true
        this.ruleValidate.leaPersoniDentificationNo1[0].required = true
        this.ruleValidate.leaPersonName1[0].required = true
        this.ruleValidate.leaPerDenExpDate1[0].required = true
      }
      // 刷新表单校验器
      // if (this.curOperateType === 'edit') {
      //   this.$refs['dataObj'].validate()
      // }
    },
    /**
     * 营业证件版块Radio切换事件（表单赋值+表单校验规则修改）
     */
    changeBizLicenseType () {
      let type = this.dataObj.useUscc

      this.clearDataOfBizLicense()
      this.setValidateRuleOfBizLicense(type)
    },
    changeBizLicenseType1() {
      this.dataObj.useUscc="0";
      this.activenum=0;
      this.clearDataOfBizLicense()
      this.setValidateRuleOfBizLicense("0")

    },
    changeBizLicenseType2 () {
      this.dataObj.useUscc="1";
      this.activenum=1;
      this.clearDataOfBizLicense()
      this.setValidateRuleOfBizLicense("1")
    }
  },
  mounted () {
    this.init()
  },
  updated () {
    // 刷新表单校验器
    if (this.curOperateType === 'edit') {
      this.$refs['dataObj'].validate()
    }
  },
  watch: {
    '$route' (to, from) {
      let toParams = to.params
      let fromParams = from.params
      if (fromParams.cid !== '' && toParams.cid === undefined) {
        if (this.curOperateType === 'add') {
          this.dataObj = {
            registeredCapital1: 0,
            registeredCapital0: 0
          }
          this.init()
        }
      }
    }
  },
  beforeDestroy () {
  },
  destroyed () {}
}
</script>

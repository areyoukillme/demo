<template>
  <div class="trading-order-pay common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="formItem" :label-width="100">
            <Row >
              <c-date-picker ref="cdatepicker" @on-change="changeDate" :label="titmeTitle" @searchdata="getCheckList"></c-date-picker>
            </Row>
            <Row :gutter="30">
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入商户名称"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户编号" class="pay-line-input">
                  <Input v-model="formItem.customerCode" placeholder="请输入商户编号"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="30">
              <Col span="10">
                <FormItem label="商户状态" class="pay-line-input">
                  <Select v-model="customerState">
                    <Option v-for="s in customerStateList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户结算状态" class="pay-line-input">
                  <Select v-model="settleState">
                    <Option v-for="s in settleList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span="10">
              <Input v-if="isShow" v-model="formItem.areaCodeId" hidden placeholder=""></Input>
                <FormItem label="所属省市" class="pay-line-input">
                  <Row :gutter="10" class="city">
                    <Col span="7">
                      <Select v-model="formItem.province" @on-change="getProvinceByParent(formItem.province)">
                        <Option v-for="s in areaCodeList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                    <Col span="7" class="merchant-basic-eara">
                      <Select v-model="formItem.city"
                          @on-change="getDistrictByProvinceAndCity(formItem.province,formItem.city)">
                        <Option v-for="s in cityList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                    <Col span="7">
                      <Select v-model="formItem.district" @on-change="setDistrictByistrict(formItem.district)">
                        <Option v-for="s in districtList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                      </Select>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <Row class="common-check-button">
              <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getCheckList">查询</Button>
              <Button size="large" type="success" icon="refresh" @click="getReset" >清空</Button>
              <!-- <Button size="large" icon="ionic" @click="getAll">全部</Button> -->
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row>
      <!-- 列表 -->
      <Col span="24" class="merchant-list-tab">
        <Table border :columns="columnsName" :data="dataList"  ref="selection" @on-selection-change="selectMerchantSelection" class="order-tab"></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row>
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal / formItem.pageSize > 1" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getDataList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
    <!-- 编辑 -->
    <Modal v-model="errorTip" width="260" class="pas-delete-box">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>信息提示</span>
      </p>
      <div style="text-align:center">
        <p>{{errorMsg}}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="onClose">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="editModal">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span v-if="currModelIndex === 1">冻结</span>
         <span v-if="currModelIndex === 2">解冻</span>
      </p>
      <div class="system-user-modal">
        <Form :model="merchantFormItem" :label-width="80" ref="merchantFormItem" :rules="ruleValidate">
          <Input v-model="merchantFormItem.customerId" v-if="isShow" :disabled="inputDisabled" />
          <Form-item label="商户编号">
            <Input v-model="merchantFormItem.customerCode" placeholder="请输入商户编号" type="text" :disabled="inputDisabled" />
          </Form-item>
           <Form-item label="商户名称">
            <Input v-model="merchantFormItem.customerName" placeholder="请输入商户名称" type="text" :disabled="inputDisabled" />
          </Form-item>
            <Form-item label="商户状态">
            <Input v-model="merchantFormItem.customerState"  v-if="isShow" :disabled="inputDisabled" />
            <Input v-model="merchantFormItem.customerStateDesc" placeholder="请输入商户状态" type="text" :disabled="inputDisabled" />
          </Form-item>
             <Form-item label="状态说明" prop="updateComment">
            <Input v-model="merchantFormItem.updateComment" placeholder="请输入状态说明" type="text" />
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
     
        <Button type="primary" size="large"  @click="onSave('merchantFormItem')" :loading="add_loading" :disabled="saveDisabled" v-if="currModelIndex === 1 || currModelIndex === 2">
          保存
        </Button>
      </div>
    </Modal>
    <!-- 编辑 /-->
  </div>
</template>

<script>
import '@/assets/styles/tranding.less'
import Common from '@/assets/js/common'
import areaCode from '@/common/data/areaCode'
import CDatePicker from '@/components/layout/common/CDatePicker'
import moment from 'moment'
export default {
  name: 'merchant',
  components: {
    CDatePicker
  },
  data () {
    let areaList = areaCode.areaList
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      titmeTitle: '建立时间',
      selection: [],
      isShow: false,
      loading: false,
      editModal: false,
      modal_loading: false,
      add_loading: false,
      inputDisabled: false,
      currModelIndex: -1,
      errorTip: false,
      saveDisabled: false,
      settleState: '',
      customerState: '',
      errorMsg: '',
      optionsAuth: this.$store.state.app.menuOptions,
      merchantFormItem: {
        customerCode: '',
        customerName: '',
        customerState: '',
        customerStateDesc: '',
        customerId: '',
        updateComment: '',
        newState: ''
      },
      beginCreateTime: '',
      endCreateTime: '',
      ruleValidate: {
        updateComment: [
          {required: true, message: '请输入状态说明', trigger: 'blur'}
        ]
      },
      customerStateList: [
        { code: '-1', name: '全部' },
        { code: '1', name: '正常' },
        { code: '2', name: '冻结' }
      ],
      settleList: [
        { code: '-1', name: '全部' },
        { code: '0', name: '正常结算' },
        { code: '1', name: '暂停结算' }
      ],
      columnsName: [
        {
          key: 'index',
          width: 40,
          title: '序号',
          align: 'center'
        },
        {
          key: 'customerCode',
          title: '商户编码'
        },
        {
          key: 'customerName',
          title: '商户名称'
        },
        {
          key: 'areaCode',
          title: '商户归属地区'
        },
       
        {
          key: 'createTime',
          title: '商户建立日期'
        },
        {
          key: 'lastUpdator',
          title: '操作员'
        },
         {
          key: 'settleState',
          title: '商户结算状态',
          className:"docolor"
        },
        {
          key: 'customerStateDesc',
          title: '商户状态',
          className:"docolor2"
        },
        {
          key: 'stateComment',
          title: '状态说明'
        }
      ],
      dataList: [],
      cityList: [],
      districtList: [],
      areaCodeList: areaList,
      listTotal: 0,
      endStartTime: new Date(),
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      formItem: {
        pageSize: 10,
        pageNum: 1,
        beginCreateTime: '',
        endCreateTime: '',
        customerName: '',
        customerState: '',
        customerCode: '',
        settleState: ''
      },
      ownOptions: this.$store.state.app.menuOptions
    }
  },
  methods: {
    initTable () {
      if (Common.getOperationNumber(this.optionsAuth) > 0) {
        this.columnsName.push(
          {
            title: '操作',
            align:'center',
            key: 'action',
            // fixed: 'right',
            width: 240,
            render: (h, params) => {
              let optArray = this.getButtoms(h, params)
              return h('div', optArray)
            }
          }
        )
      }
      this.getDataList()
    },
    getButtoms (h, params) {
      let optionsAuth = this.optionsAuth
      let optArray = []
      if (Common.getOperationAuth('view', optionsAuth)) {
        optArray.push(h('Button', {
          props: {
   
            type:'success',
          },
          on: {
            click: () => {
              this.$router.push({name: 'merchantDetail', params: {cid: params.row.customerInfoId, opt: 'view'}})
            }
          }
        }, '查看'))
      }
      if (Common.getOperationAuth('modify', optionsAuth)) {
        optArray.push(h('Button', {
          props: {
         
            type: 'primary'
          },
          on: {
            click: () => {
              this.$router.push({name: 'merchantDetail', params: {cid: params.row.customerInfoId, opt: 'edit'}})
            }
          }
        }, '修改'))
      }
      
      if (Common.getOperationAuth('unFrozen', optionsAuth) || Common.getOperationAuth('frozen', optionsAuth)) {
        optArray.push(
          h('Button', {
            props: {
           
              type:'warning'
            },
            on: {
              click: () => {
                let obj = params.row
                obj.customerState === '1' ? this.freezingMerchant(obj) : this.unFreezingMerchant(obj)
              }
            }
          }, params.row.customerState === '1' ? '冻结' : '解冻')
        )
      }
      return optArray
    },
    getDataList (currentPage) {
      this.loading = true
      let options = this.formItem
      this.pageCurrent = options.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.beginCreateTime = Common.getTimeFormat(this.beginCreateTime, 'YYYYMMDD', 0, true)
      options.endCreateTime = Common.getTimeFormat(this.endCreateTime, 'YYYYMMDD', 1, true)
      this.formItem.settleState = this.settleState === '-1' ? '' : this.settleState
      this.formItem.customerState = this.customerState === '-1' ? '' : this.customerState
      this.$api.merchant.getQueryDataList(options).then(resJson => {
        let list = []
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = this.formItem.pageSize * (this.formItem.pageNum - 1) + 1 + r
            json['customerCode'] = resArray[r].customerCode
            json['customerName'] = resArray[r].customerName
            json['areaCode'] = this.getAreaByCode(resArray[r].areaCode)
            json['settleState'] = this.getTypeName(resArray[r].settleState, 1)
            json['createTime'] = this.getDateFormat(resArray[r].createTime, 'YYYY-MM-DD HH:mm:ss')
            json['lastUpdator'] = resArray[r].lastUpdator || '-'
            json['customerState'] = resArray[r].customerState
            json['customerStateDesc'] = this.getTypeName(resArray[r].customerState, 0)
            json['stateComment'] = resArray[r].stateComment
            json['customerId'] = resArray[r].customerId
            json['customerInfoId'] = resArray[r].customerInfoId
            list.push(json)
          }
        }
        this.dataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
        // 查询成功置空时间
        // this.formItem.beginCreateTime = ''
        // this.formItem.endCreateTime = ''
        // this.beginCreateTime = ''
        // this.endCreateTime = ''
        // this.$refs.cdatepicker.clear()
      })
    },
    // 获取方式或者状态名 index 0: 支付方式 1： 支付状态
    getTypeName (typeCode, index) {
      let typeArray = index === 0 ? this.customerStateList : this.settleList
      for (var i = 0; i < typeArray.length; i++) {
        if (parseInt(typeArray[i].code) === parseInt(typeCode)) {
          return typeArray[i].name
        }
      }
      return ''
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
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.formItem.pageSize = pageSize
      this.getDataList()
    },
    // 查询列表
    getCheckList () {
      this.modal_loading = true
      this.getDataList(1)
    },
    // 根据地区编码来查找对应的地区名称
    // @param pAreaCode
    getAreaByCode (pAreaCode) {
      var areaStr = ''
      if (!pAreaCode) {
        return areaStr
      }
      var provinceCode = pAreaCode.substring(0, 2) + '0000'
      var cityCode = pAreaCode.substring(0, 4) + '00'
      var districtCode = pAreaCode
      var area = areaCode.areaList
      for (var i = 0; i < area.length; i++) {
        if (area[i].code === provinceCode) {
          // 找到对应的省
          areaStr = areaStr + area[i].name
          var cityArr = area[i].children
          if (cityArr != null) {
            for (var j = 0; j < cityArr.length; j++) {
              if (cityArr[j].code === cityCode) {
                // 找到对应的城市
                areaStr = areaStr + '-' + cityArr[j].name
                var districtArr = cityArr[j].children
                // 获取对应的区
                if (districtArr != null) {
                  for (var k = 0; k < districtArr.length; k++) {
                    if (districtArr[k].code === districtCode) {
                      areaStr = areaStr + '-' + districtArr[k].name
                    }
                  }
                }
              }
            }
          }
        }
      }
      return areaStr
    },
    getProvinceByParent (province) {
      var city = []
      var area = areaCode.areaList
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
      this.formItem.areaCodeId = province
    },
    setDistrictByistrict (district) {
      this.formItem.areaCodeId = district
    },
    getDistrictByProvinceAndCity (province, city) {
      var district = []
      var area = areaCode.areaList
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
      this.formItem.areaCodeId = city
      this.districtList = district
    },
    // “全部”按钮
    getAll () {
      this.formItem.pageSize = 10
      this.formItem.pageNum = 1
      this.formItem.beginCreateTime = ''
      this.formItem.endCreateTime = ''
      this.beginCreateTime = ''
      this.endCreateTime = ''
      this.$refs.cdatepicker.clear()
      this.getDataList(1)
    },
    // 选择开始时间
    chooseStartTime (date) {
      this.endStartTime = new Date(date)
    },
    // 选择
    selectMerchantSelection (selection) {
      this.selection = selection
    },
    // 取消
    onCancel () {
      this.editModal = false
    },
    onClose () {
      this.errorTip = false
    },
    // 冻结操作
    freezingMerchant (obj) {
      if (obj.customerState === '2') {
        this.errorMsg = '该商户当前状态不能进行冻结操作。'
        this.errorTip = true
      } else {
        this.editModal = true
        this.currModelIndex = 1
        this.merchantFormItem.customerCode = obj.customerCode
        this.merchantFormItem.customerName = obj.customerName
        this.merchantFormItem.customerState = obj.customerState
        this.merchantFormItem.customerStateDesc = obj.customerStateDesc
        this.merchantFormItem.customerId = obj.customerId
        this.inputDisabled = true
      }
    },
    // 解冻
    unFreezingMerchant (obj) {
      if (obj.customerState === '1') {
        this.errorMsg = '该商户当前状态不能进行解冻操作。'
        this.errorTip = true
      } else {
        this.editModal = true
        this.currModelIndex = 2
        this.merchantFormItem.customerCode = obj.customerCode
        this.merchantFormItem.customerName = obj.customerName
        this.merchantFormItem.customerState = obj.customerState
        this.merchantFormItem.customerStateDesc = obj.customerStateDesc
        this.merchantFormItem.customerId = obj.customerId
        this.inputDisabled = true
      }
    },
    // 查看用户
    checkMerchant () {
      this.editModal = true
      this.currModelIndex = 2
      // this.getMerchantInfoById()
    },
    // 保存
    onSave (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let successTxt = '操作成功'
          if (this.merchantFormItem.customerState === '1') {
            this.merchantFormItem.newState = '2'
          } else if (this.merchantFormItem.customerState === '2') {
            this.merchantFormItem.newState = '1'
          }
          /**
           * 限定按钮在loading的时候继续提交数据
           */
          if (this.add_loading) {
            return false
          }
          this.add_loading = true
          this.$api.merchantDetail.freezingMerchant(this.merchantFormItem).then((res) => {
            this.$Message.info(successTxt)
            this.onCancel()
            this.getDataList()
            this.add_loading = false
          })
        }
      })
    },
    changeDate (type, time) {
      if (type === '1') {
        this.beginCreateTime = time
      } else {
        this.endCreateTime = time
      }
    },
    sendInletEmail (params) {
      this.$api.merchantDetail.sendInletEmail(params).then((res) => {
        if (res.returnCode === '0000') {
          this.$Message.info('发送成功')
        } else {
          this.$Message.error(res.errorMsg)
        }
      })
    },
    // 清空条件
    getReset () {
      this.formItem = {
        pageSize: 10,
        pageNum: 1,
        beginCreateTime: '',
        endCreateTime: '',
        customerName: '',
        customerState: '',
        customerCode: '',
        settleState: ''
      }
      this.beginCreateTime = ''
      this.endCreateTime = ''
      this.customerState = ''
      this.settleState = ''
      this.$refs.cdatepicker.clear()
      this.getDataList(1)
    }
  },
  mounted () {
    this.initTable()
  }
}
</script>

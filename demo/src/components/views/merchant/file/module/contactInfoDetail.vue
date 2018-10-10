<template>
  <div class="merchant-detail">
    <Row class="merchant-detail-inner">
      <!-- 条件选择 -->
      <Col span="24">
        <div>
          <Form :label-width="120" :model="dataObj" ref="formValidate" :rules="ruleValidate">
             <Input placeholder="" v-if="isShow" v-model="dataObj.contactId" :disabled="inputDisabled"/>
            <Row>
              <Col span="10">
                <FormItem label="商户管理员姓名" class="pay-line-input" prop="name">
                  <Input placeholder="请输入商户管理员姓名" v-model="dataObj.name" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
               <Col span="10">
                <FormItem label="管理员手机号" class="pay-line-input" prop="mobile">
                    <Input placeholder="请输入管理员手机号" v-model="dataObj.mobile" :disabled="mobileInputDisabled" :maxlength="maxlength"/>
                </FormItem>
              </Col>
            </Row>
             <Row>
              <Col span="10">
                <FormItem label="管理员Email" class="pay-line-input" prop="email">
                  <Input placeholder="请输入管理员Email"  v-model="dataObj.email" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
               <Col span="10">
                <FormItem label="管理员QQ" class="pay-line-input">
                   <Input placeholder="请输入管理员QQ"  v-model="dataObj.qq" :disabled="inputDisabled"/>
                </FormItem>
              </Col>
            </Row>
            <Row class="merchant-common-footer" v-if="this.curOperateType != 'view'">
              <Col span="22">
                <Button @click="goBack" type='success'>上一步</Button>
              </Col>
              <Col span="2">
                <Button type="primary" size="large" class="pay-check-button" :loading="modalLoading" @click="onSave('formValidate')" >下一步</Button>
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
  name: 'merchantDetail-contactInfo',
  data () {
    return {
      // dataObj: {},
      maxlength: 11,
      contactId: '',
      modalLoading: false,
      isShow: false,
      inputDisabled: false,
      mobileInputDisabled: false,
      middObj: {
      },
      dataObj: {
        name: '',
        mobile: '',
        email: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入商户管理员姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, pattern: /^1[3-9][0-9]{9}$/, message: '请输入正确格式的管理员手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确格式的管理员Email', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['curInfoId', 'curOperateType', 'tabPaneDisable'],
  methods: {
    /**
     * 初始化
     */
    init () {
      let options = {customerInfoId: this.curInfoId}
      this.$api.merchantDetail.initMerchantContactInfo(options).then(resJson => {
        this.dataObj = resJson
        // TODO 1.双向绑定或设置值
        this.middObj = this.dataObj
        if (this.curOperateType === 'view') {
          // TODO 2.表单元素disabled
          this.inputDisabled = true
        }
        if (this.curOperateType === 'edit' || this.curOperateType === 'view') {
          this.mobileInputDisabled = true
        }
      })
    },
    // 保存
    onSave (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$api.merchantDetail.saveContactInfo(this.middObj).then((res) => {
            if (res.returnCode !== '0000') {
              this.$Message.error({content: res.message, duration: 2})
              return false
            }
            if (this.tabPaneDisable === true) {
              this.$emit('on-change-tab', 'tabPaneDisable5')
            }
            // 更新父组件的curTabIndex
            setTimeout(() => {
              this.$emit('on-listen-child', 'tab05')
            }, 800)
          })
        }
      })
    },
    goBack () {
      this.$emit('on-listen-child', 'tab03')
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

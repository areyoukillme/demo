<template>
 <div class="merchant-detail-attach merchant-detail-inner">
    <div :model="attachFormItem">
      <Row>
        <Col span="12" class="merchant-attach-tip">
          <Icon type="information-circled"></Icon> 温馨提示：上传的文件支持jpg，jpeg，png，bmp格式文件，单个文件不超过 5 MB。
        </Col>
      </Row>
      <Row class="merchant-attach-row" :gutter="30">
        <Col span="3" class="merchant-attach-label">
          <em>*</em>上传法人身份证：
        </Col>
        <Col span="5">
          <file-upload typeTitle="身份证正面面照" bussinessType="idCardFront" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
        <Col span="5">
          <file-upload typeTitle="身份证反面面照" bussinessType="idCardBack" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          <em v-if="this.customerType != 50">*</em>营业执照：
        </Col>
        <Col span="5">
          <file-upload bussinessType="businessLicense" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          组织机构代码：
        </Col>
        <Col span="3">
          <file-upload bussinessType="organStructCode" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row>
    
        <Col span="8" class="merchant-attach-tip">
          <Icon type="information-circled"></Icon> 上传1张店铺招牌照片，需清晰展示完整的招牌
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          店铺招牌：
        </Col>
        <Col span="3">
          <file-upload bussinessType="sign" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row>

        <Col span="8" class="merchant-attach-tip">
          <Icon type="information-circled"></Icon> 上传3张店铺内景照片，需体现真实的经营内容
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          店铺内景：
        </Col>
        <Col span="5">
         <file-upload bussinessType="interiorOne" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
        <Col span="5">
          <file-upload bussinessType="interiorTwo" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
        <Col span="5">
          <file-upload bussinessType="interiorThree" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          合作协议：
        </Col>
        <Col span="5">
         <file-upload bussinessType="cooperationAgreement" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
        <Col span="5">
          <file-upload bussinessType="cooperationAgreementTwo" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          授权委托书：
        </Col>
        <Col span="3">
         <file-upload bussinessType="attorney" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          签约银行卡图片：
        </Col>
        <Col span="3">
         <file-upload bussinessType="signedBankCard" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          手持证件照：
        </Col>
        <Col span="3">
         <file-upload bussinessType="idPhoto" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          入境证明:
        </Col>
        <Col span="3">
         <file-upload bussinessType="entryCertificate" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          银行账户信息:
        </Col>
        <Col span="3">
         <file-upload bussinessType="bankAccount" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row">
        <Col span="3" class="merchant-attach-label">
          其他证件/文件:
        </Col>
        <Col span="3">
         <file-upload bussinessType="otherDocuments" :propCurInfoId="propCurInfoId" :sonCurOperateType="sonCurOperateType"></file-upload>
        </Col>
      </Row>
      <Row class="merchant-attach-row merchant-common-footer" v-if="this.curOperateType !== 'view'">
        <Col span="22">
          <Button @click="goBack" type="success">上一步</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="merchantFileSubmit">审核提交</Button>
        </Col>
      </Row>
    </div>
</div>
</template>
<script>
import FileUpload from './fileUpload'
import CommonData from '@/common/data/index'
import Cookies from 'js-cookie'
export default {
  components: {
    FileUpload
  },
  props: ['curInfoId', 'curOperateType', 'auditModule', 'auditId', 'tabPaneDisable'],
  data () {
    return {
      attachFormItem: {},
      dataObj: [],
      propCurInfoId: this.curInfoId,
      getPathParams: {
        expiredTime: 30,
        type: 'show',
        uniqueId: ''
      },
      attachmentUrlJson: [],
      merchantFileBox: 'merchangefilebox',
      merchantFileUploadBox: 'merchantfileupload',
      sonCurOperateType: this.curOperateType,
      customerType: Cookies.get('customerType') || ''
    }
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      let options = {customerInfoId: this.curInfoId}
      this.$api.merchantDetail.initMerchantAttachmentInfo(options).then(resJson => {
        this.dataObj = resJson
        for (var i = 0; i < resJson.length; i++) {
          let code = resJson[i].attachmentCode
          // let attachmentId = resJson[i].attachmentId
          if (code && code !== '') {
            let key = CommonData.ATTACHMENTCODE_CODE_MAP[code]
            this.getPathParams.uniqueId = resJson[i].attachmentUrl
            this.getFilePath({data: this.getPathParams, key: key, attachmentId: resJson[i].attachmentId})
          }
        }
      })
    },
    // 获取图片路径
    getFilePath (params) {
      this.$api.merchantDetail.fileAttach.getFilePath(params.data).then((res) => {
        
        if (!res.resultCode) {
          console.log(res)
          this.fillFilePath(params.key, res, params.attachmentId)
        }
      })
    },
    fillFilePath (key, imagePath, attachmentId) {
      let imgId = this.merchantFileBox + key
      let inputId = this.merchantFileUploadBox + key
      let imgBox = document.getElementById(imgId)
      if (imgBox.getElementsByTagName('i')) {
        imgBox.getElementsByTagName('i')[1].setAttribute('data-key', key)
      }
      if (imgBox.getElementsByTagName('img')) {
        imgBox.getElementsByTagName('img')[0].setAttribute('src', imagePath)
        imgBox.getElementsByTagName('img')[0].setAttribute('id', attachmentId)
      }
      imgBox.style.display = 'block'
      document.getElementById(inputId).style.display = 'none'
    },
    merchantFileSubmit () {
      if (!this.validateData()) {
        document.getElementById('container').scrollTop = 120
        this.$Message.error({
          content: '请上传必填图片!',
          duration: 5,
          closable: true
        })
        return false
      }
      let param = {customerInfoId: this.curInfoId}
      this.$api.merchantDetail.fileAttach.getCustomerBusinessInfo(param).then((res) => {
        if (this.auditId && this.auditId !== '') {
          param.auditId = this.auditId
        }
        if (res !== '0') {
          this.$api.merchantDetail.fileAttach.submitAudit(param).then((res) => {
            this.$Message.info('提交审核成功！')
            setTimeout(() => {
              if (this.curOperateType === 'edit') {
                this.$router.push('/merchant/file/list')
              } else {
                setTimeout(() => {
                  this.$emit('on-listen-child', 'tab01')
                }, 800)
              }
            }, 800)
          })
        } else {
          this.$Message.error('请至少添加一条业务信息！')
        }
      })
    },
    validateData () {
      let getImageFun = (id) => {
        return document.getElementById(id).getElementsByTagName('img')[0].getAttribute('src')
      }
      let fronImage = getImageFun('merchangefileboxidCardFront')
      let backImage = getImageFun('merchangefileboxidCardBack')
      let businessImage = getImageFun('merchangefileboxbusinessLicense')
      if (fronImage === '' || backImage === '' || (parseInt(this.customerType) !== 50 && businessImage === '')) {
        return false
      }
      return true
    },
    goBack () {
      this.$emit('on-listen-child', 'tab04')
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
          this.$emit('on-listen-child', 'tab01')
          this.init()
        }
      }
    }
  }
}
</script>

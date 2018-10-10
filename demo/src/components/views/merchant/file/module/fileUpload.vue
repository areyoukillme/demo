<template>
  <div :class="merchantStatus">
      <div class="merchant-upload-list" v-show="imagePath !== ''" :id="merchantFileBox">
        <template>
            <img :src="imagePath" :id="attachmentId">
            <div v-show="this.ableEdit">
              <div class="merchant-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="onHandleView($event)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="onHandleRemove($event)"></Icon>
              </div>
            </div>
        </template>
      </div>
      <div class="merchant-upload-box ivu-upload" @click="onFileClick" v-show="imagePath === ''" :data-code="businessCode" :id="merchantFileUploadBox">
        <div class="ivu-upload ivu-upload-drag">
          <div class="merchant-upload-inner" >
            <div v-show="fileUploadProgress" v-if="this.typeTitle" style="line-height: 20px; padding-top: 40px;">
              <i class="ivu-icon ivu-icon-camera" style="font-size: 20px;"></i>
              <p>({{ this.typeTitle }})</p>
            </div>
            <div v-else>
              <i class="ivu-icon ivu-icon-camera" style="font-size: 20px;" v-show="fileUploadProgress"></i>
              <Spin class="merchant-load" v-show="!fileUploadProgress">
                  <Icon type="load-c" size=18 class="merchant-spin-icon-load"></Icon>
                  <div>上传中</div>
              </Spin>
            </div>
            <Spin class="merchant-load" v-show="!fileUploadProgress">
                <Icon type="load-c" size=18 class="merchant-spin-icon-load"></Icon>
                <div>上传中</div>
            </Spin>
          </div>
        </div>
      </div>
      <div style="display: none;" v-if="this.ableEdit">
        <input name="file" type="file" multiple="multiple" class="ivu-upload-input" :id="uploadInputFileId" @change="onFileChange($event)" v-show="clearShow" accept="image/jpeg,image/png,image/gif"/>
    </div>
    <Modal v-model="visibleImage" :closable='closableImage' width="600px">
        <img :src="imageViewPath" style="width: 100%">
        <div slot="footer">
            <Button type="default" @click="closeImage">关闭</Button>
        </div>
    </Modal>
    <!--删除提示  -->
    <Modal v-model="deleteImage" width="250">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续该图片？</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="onDeleteImageContinue">删除</Button>
      </div>
    </Modal>
    <!--删除提示 / -->
  </div>
</template>

<script>
import '@/assets/styles/merchant.less'
import axios from 'axios'
import CommonData from '@/common/data/index'
import {GetEvn, GetServerBase} from '@/common/utils/index'
import Url from '@/assets/js/url'
export default {
  props: {
    typeTitle: String,
    bussinessType: String,
    propCurInfoId: Number,
    curInfoId: String,
    curOperateType: String,
    attachmentUrlJson: JSON,
    sonCurOperateType: String
  },
  data () {
    let SERVER_BASE_URL = GetEvn() ? (location.origin) : (GetServerBase().baseServerUrl)
    return {
      clearShow: true,
      deleteImage: false,
      closableImage: false,
      visibleImage: false,
      imageViewPath: '',
      defaultList: [],
      baseUrl: SERVER_BASE_URL,
      imgName: '',
      visible: false,
      uploadShow: true,
      fromSystemId: 'yymh',
      imgTitle: this.typeTitle,
      fileUploadData: {},
      fileUploadAction: '',
      token: '',
      imageLimit: 5120000,
      customerAttachmentData: {},
      uploadList: [],
      getFilePathParams: {
        expiredTime: 30,
        type: 'show',
        uniqueId: ''
      },
      uploadInputFileId: this.bussinessType,
      imagePath: '',
      attachmentId: '',
      merchantFileBox: 'merchangefilebox' + this.bussinessType,
      merchantFileUploadBox: 'merchantfileupload' + this.bussinessType,
      businessCode: this.bussinessType,
      fileUploadProgress: true,
      ableEdit: this.sonCurOperateType !== 'view',
      merchantStatus: this.sonCurOperateType === 'view' ? 'merchant-unedit' : '',
      attachmentEvent: ''
    }
  },
  methods: {
    getToken (type) {
      this.$api.merchantDetail.getUploadToken({businessType: type, fromSystemId: 'yymh'}).then((res) => {
        if (res) {
          this.token = res
          this.fileUploadAction = this.baseUrl + Url.merchant.attachmentUpload + '?uploadToken=' + res
        } else {
          this.fileUploadProgress = true
        }
      })
    },
    getCustomerAttachment () {
      this.$api.merchantDetail.fileAttach.getCustomerAttachment(this.customerAttachmentData).then((res) => {
        if (res !== '') {

          this.attachmentId = res
          this.onGetFilePath(this.getFilePathParams)
        }
      })
    },
    // 点击上传图片事件
    onFileClick () {
      if (this.sonCurOperateType === 'view') {
        return false
      }
      let type = this.bussinessType
      let attachType = CommonData.ATTACHMENTCODE_DOMID_MAP[type]
      document.getElementById(this.uploadInputFileId).click()
      this.customerAttachmentData['attachmentCode'] = attachType
      this.customerAttachmentData['customerInfoId'] = this.propCurInfoId
      if (attachType) {
        this.getToken(attachType)
      }
    },
    // input file change 事件
    onFileChange (e) {
      let uploadFile = e.target.files
      if (uploadFile.length <= 0) {
        this.fileUploadProgress = true
        return false
      }
      let formData = new FormData()
      this.clearShow = false
      for (let i = 0; i < uploadFile.length; i++) {
        formData.append('file', uploadFile[i])
      }
      let config = {
        'Content-Type': 'multipart/form-data'
      }
      this.customerAttachmentData['attachmenSize'] = uploadFile[0].size
      this.customerAttachmentData['attachmentName'] = uploadFile[0].name
      if (uploadFile[0].size > this.imageLimit) {
        this.$Message.error('文件不超过 5 MB')
        return false
      }
      if (this.token !== '') {
        this.token = ''
        this.fileUploadProgress = false
        this.postData(formData, {headers: config}, e)
      }
    },
    // post 图片
    postData (formData, config, e) {
      axios.post(this.fileUploadAction, formData, config).then((res) => {
        e.target.value = null
        if (!res.data.returnCode) {
          this.getFilePathParams['uniqueId'] = this.customerAttachmentData['attachmentUrl'] = res.data
          console.log(this.getFilePathParams)
          this.getCustomerAttachment()
        } else {
          this.fileUploadProgress = true
        }
      })
    },
    // 获取图片路径
    onGetFilePath (params) {
      this.$api.merchantDetail.fileAttach.getFilePath(params).then((res) => {
        if (!res.returnCode) {
          this.uploadList[0] = {status: 'finished', url: res.filePath}
          this.imagePath = res
          this.fileUploadProgress = true
        }
      })
    },
    onHandleRemove (event) {
      this.attachmentEvent = event
      this.deleteImage = true
    },
    // 删除图片
    onDeleteImageContinue () {
      this.deleteImage = false
      let event = this.attachmentEvent
      let attachId = event.target.parentNode.parentNode.previousElementSibling.id
      this.$api.merchantDetail.fileAttach.deleteFile({attachmentId: attachId}).then((res) => {
        if (res === '') {
          this.customerAttachmentData = {}
          if (this.attachmentId === '') {
            let key = event.target.getAttribute('data-key')
            let imgId = 'merchangefilebox' + key
            let inputId = 'merchantfileupload' + key
            this.clearShow = true
            document.getElementById(imgId).style.display = 'none'
            document.getElementById(inputId).style.display = 'block'
          } else {
            this.imagePath = this.attachmentId = this.attachmentEvent = ''
          }
          this.$Message.info('删除成功')
        } else {
          this.$Message.error(JSON.parse(res).message)
        }
      })
    },
    // 查看大图
    onHandleView (event) {
      this.imageViewPath = event.target.parentNode.parentNode.previousElementSibling.currentSrc
      this.visibleImage = true
    },
    closeImage () {
      this.visibleImage = false
      // this.imageViewPath = ''
    }
  }
}
</script>

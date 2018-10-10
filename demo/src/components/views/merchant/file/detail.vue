<template>
  <div class="merchant-detail-base">
    <Tabs type="card" :animated="animated" :closable="closable" :value="curTabIndex" @on-click="showTabPane">
      <TabPane label="基本资料" name="tab01">
        <basic-info-detail v-if="curTabIndex==='tab01'" :curInfoId="curInfoId" :curOperateType="curOperateType" :curTabIndex="curTabIndex" :auditId="auditId" :auditModule="auditModule" @on-listen-child="onListenChild" :tabPaneDisable="tabPaneDisable.tabPaneDisable2" @on-change-tab="onChangeTabStatus">
        </basic-info-detail>
      </TabPane>
      <TabPane label="结算信息" name="tab02" :disabled="tabPaneDisable.tabPaneDisable2">
        <settle-info-detail v-if="curTabIndex==='tab02'" :curInfoId="curInfoId" :curOperateType="curOperateType" :curTabIndex="curTabIndex" @on-listen-child="onListenChild" :tabPaneDisable="tabPaneDisable.tabPaneDisable3" @on-change-tab="onChangeTabStatus">
        </settle-info-detail>
      </TabPane>
      <TabPane label="业务信息" name="tab03" :disabled="tabPaneDisable.tabPaneDisable3">
        <business-info-detail v-if="curTabIndex==='tab03'" :curInfoId="curInfoId" :curOperateType="curOperateType" :curTabIndex="curTabIndex" @on-listen-child="onListenChild" :tabPaneDisable="tabPaneDisable.tabPaneDisable4" @on-change-tab="onChangeTabStatus">
        </business-info-detail>
      </TabPane>
      <TabPane label="管理员联系信息" name="tab04" :disabled="tabPaneDisable.tabPaneDisable4">
        <contact-info-detail v-if="curTabIndex==='tab04'" :curInfoId="curInfoId" :curOperateType="curOperateType" :curTabIndex="curTabIndex" @on-listen-child="onListenChild" :tabPaneDisable="tabPaneDisable.tabPaneDisable5" @on-change-tab="onChangeTabStatus">
        </contact-info-detail>
      </TabPane>
      <TabPane label="附件" name="tab05" :disabled="tabPaneDisable.tabPaneDisable5">
        <attachment-info-detail v-if="curTabIndex==='tab05'" :curInfoId="curInfoId" :curOperateType="curOperateType" :curTabIndex="curTabIndex" :auditId="auditId" :auditModule="auditModule" @on-listen-child="onListenChild">
        </attachment-info-detail>
      </TabPane> 
    </Tabs>
    <div v-if="this.auditId !== ''" class="merchant-audit-box merchant-common-footer">
        <p class="merchant-audit-header">
          <span class="merchant-basic-title">审核信息</span>
        </p>
        <Form :model="auditObj" ref="formData" :label-width="140">
          <Row>
            <Col span="10">
                <FormItem label="初审备注" class="ivu-form-item-required">
                  <Input v-model="auditObj.firstAuditComment" type="textarea" :autosize="{minRows: 2, maxRows: 5}" :disabled="auditModule === 'rejectAudit' || auditObj.auditStatus !== '00'"/>
                </FormItem>
            </Col>
          </Row>
          <Row v-if='this.auditObj.auditStatus === "02"'>
            <Col span="10">
                <FormItem label="复审备注" class="ivu-form-item-required">
                  <Input v-model="auditObj.secondAuditComment" type="textarea" :autosize="{minRows: 2, maxRows: 5}" :disabled="auditModule === 'rejectAudit'"/>
                </FormItem>
            </Col>
          </Row>
        </Form>
        <Row v-if="this.auditModule === 'waitAudit'">
          <Col span="20">&nbsp;</Col>
          <Col span="2">
            <Button type="primary" size="large" @click="saveAudit(true)">通过</Button>
          </Col>
          <Col span="2">
            <Button type="primary" size="large" @click="saveAudit(false)">不通过</Button>
          </Col>
        </Row>
      </div>
  </div>
</template>
<script>
import '@/assets/styles/merchant.less'
import BasicInfoDetail from '@/components/views/merchant/file/module/basicInfoDetail'
import SettleInfoDetail from '@/components/views/merchant/file/module/settleInfoDetail'
import BusinessInfoDetail from '@/components/views/merchant/file/module/businessInfoDetail'
import ContactInfoDetail from '@/components/views/merchant/file/module/contactInfoDetail'
import AttachmentInfoDetail from '@/components/views/merchant/file/module/attachmentInfoDetail'
export default {
  name: 'merchantDetail',
  components: {
    BasicInfoDetail,
    SettleInfoDetail,
    BusinessInfoDetail,
    ContactInfoDetail,
    AttachmentInfoDetail
  },
  data () {
    return {
      closable: false,
      animated: false,
      loading: true,
      modal_loading: false,
      curInfoId: this.$route.params.cid || '',
      curOperateType: this.$route.params.opt || 'add', // 当前对商户资料的操作类型，取值范围：view | edit | add
      auditId: this.$route.params.auditId || '',
      auditModule: this.$route.params.auditModule || '',
      curTabIndex: 'tab01', // 当前操作Tab序号，取值范围：0,1,2,3,4
      auditObj: {},
      tabPaneDisable: {
        tabPaneDisable2: true,
        tabPaneDisable3: true,
        tabPaneDisable4: true,
        tabPaneDisable5: true
      }
    }
  },
  methods: {
    
    init () {
      if (this.curOperateType === 'edit' || this.curOperateType === 'view' || this.auditId !== '') {
        this.tabPaneDisable.tabPaneDisable2 = false
        this.tabPaneDisable.tabPaneDisable3 = false
        this.tabPaneDisable.tabPaneDisable4 = false
        this.tabPaneDisable.tabPaneDisable5 = false
      }
      if (this.auditId !== '') {
        this.getAuditDetail()
      }
    },
    showTabPane (index) {
      this.curTabIndex = index
    },
    onListenChild (index, infoId) {
      if (index) {
        this.curTabIndex = index
      }
      if (infoId) {
        this.curInfoId = infoId
      }
    },
    /**
     * 审核
     * @augments isAgree true:通过，false:不允许通过
     */
    saveAudit (isAgree) {
      let auditInfoId = this.auditId
      let auditOption = isAgree ? '00' : '01'
      let comment = this.auditObj.auditStatus === '00' ? this.auditObj.firstAuditComment : this.auditObj.secondAuditComment
      // 表单校验
      if (!this.validateAuditInfoForm()) {
        return
      }
      this.$api.merchantDetail.merchantAudit.saveAudit({auditInfoId: auditInfoId, auditOption: auditOption, comment: comment}).then((res) => {
        if (res && res.code) {
          this.$Message.error('系统错误，错误码：' + res.code)
          return
        }
        this.$Message.info('审核成功')
        this.$router.push('/merchant/file/audit')
      })
    },
    // 校验审核信息表单
    validateAuditInfoForm () {
      var isFirstAudit = this.auditObj.auditStatus === '00'
      if (isFirstAudit) {
        var firstAuditComment = this.auditObj.firstAuditComment
        if (!firstAuditComment) {
          this.$Message.error('初审备注必填')
          return false
        }
        if (firstAuditComment.length > 150) {
          this.$Message.error('初审备注超最大限制，150字')
          return false
        }
      } else {
        var secondAuditComment = this.auditObj.secondAuditComment
        if (!secondAuditComment) {
          this.$Message.error('复审备注必填')
          return false
        }
        if (secondAuditComment.length > 150) {
          this.$Message.error('复审备注超最大限制，150字')
          return false
        }
      }
      return true
    },
    // 获取复审信息
    getAuditDetail () {
      this.$api.merchantDetail.merchantAudit.getAudit({auditInfoId: this.auditId}).then((res) => {
        this.auditObj = res
        document.getElementById('container').scrollTop = 1250
      })
    },
    // 修改tab的状态
    onChangeTabStatus (name) {
      this.tabPaneDisable[name] = false
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
        this.curOperateType = 'add'
        this.auditId = ''
        this.auditModule = ''
        this.curInfoId = ''
        this.curTabIndex = 'tab01'
        this.tabPaneDisable = {
          tabPaneDisable2: true,
          tabPaneDisable3: true,
          tabPaneDisable4: true,
          tabPaneDisable5: true
        }
      }
    }
  }
}
</script>

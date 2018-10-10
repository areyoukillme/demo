<template>
  <div class="common-inner">
    <!-- 条件选择 -->
    <Row>
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="searchFormItem" :label-width="100">
            <Row>
              <Col span="10">
                <FormItem label="商户名称">
                  <Input v-model="searchFormItem.customerName" placeholder="请输入商户名称"/>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户编号">
                  <Input v-model="searchFormItem.customerCode" placeholder="请输入商户编号"/>
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getList()" class="common-check-button">查询</Button>
          </Form>
        </div>
      </Col>
    </Row>
    <!-- 条件选择 /-->
    <!-- 按钮组 -->
    <Row>
      <Col span="24" class="merchant-list-group-btn">
        <ButtonGroup>
          <Button type="ghost" icon="plus-round" @click="addCert">新增</Button>
          <!-- <Button type="ghost" icon="ios-eye-outline" @click="viewCert" :disabled="selection.length !== 1">查看</Button> -->
          <!-- <Button type="ghost" icon="edit" @click="deleteCert" :disabled="selection.length !== 1">删除</Button> -->
        </ButtonGroup>
      </Col>
    </Row>
    <!-- 按钮组 /-->
    <!-- 列表 -->
    <Row>
      <Col span="24" class="merchant-list-tab">
        <Table border :columns="columnsName" :data="dataList" :loading="loading" ref="selection" @on-selection-change="selectTableRow"></Table>
      </Col>
    </Row>
    <!-- 列表 /-->
    <!-- 分页-->
    <Row>
      <Col span="24">
        <Page v-if="listTotal > 0" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
    </Row>
    <!-- 分页 /-->
    <!-- 新增模态框 -->
    <Modal v-model="isShowDetailModal">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span v-if="curOperateType === 'ADD'">新增</span>
        <span v-if="curOperateType === 'VIEW'">查看</span>
      </p>
      <div>
        <Form :model="detailFormItem" :label-width="120">
          <Form-item label="商户编号" prop="customerCode">
            <Input v-model="detailFormItem.customerCode" @on-blur="getCustDetailByCustomerCode" placeholder="请输入商户编号" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="商户名称" prop="customerName">
            <Input v-model="detailFormItem.customerName" placeholder="根据商户号识别" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="证书编号" prop="certificateNo">
            <Input v-model="detailFormItem.certificateNo" placeholder="来自证书导入" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="证书类型" prop="type">
            <Select v-model="detailFormItem.type" :disabled="inputDisabled">
              <Option v-for="c in this.certificateTypeList" :key="c.code" :value='c.code' :label="c.name"></Option>
            </Select>
          </Form-item>
          <Form-item label="证书状态" prop="status">
            <Select v-model="detailFormItem.status" :disabled="inputDisabled">
              <Option v-for="c in this.certificateStatusList" :key="c.code" :value='c.code' :label="c.name"></Option>
            </Select>
          </Form-item>
          <Form-item label="商户证书使用状态" prop="useStatus">
            <Select v-model="detailFormItem.useStatus" :disabled="inputDisabled">
              <Option v-for="c in this.certificateUseStatusList" :key="c.code" :value='c.code' :label="c.name"></Option>
            </Select>
          </Form-item>
          <Form-item label="有效时间" prop="notBefore">
            <Row>
              <Col span="11">
                <DatePicker type="date" placeholder="生效时间，来自证书导入" v-model="detailFormItem.notBefore"></DatePicker>
              </Col>
              <Col span="2" class="text-center">-</Col>
              <Col span="11">
                <DatePicker type="date" placeholder="失效时间，来自证书导入" v-model="detailFormItem.notAfter"></DatePicker>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="证书序列号" prop="signSN">
            <Input v-model="detailFormItem.signSN" placeholder="来自证书导入" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="颁发者" prop="issuerDn">
            <Input v-model="detailFormItem.issuerDn" placeholder="来自证书导入" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="证书主题" prop="subjectDn">
            <Input v-model="detailFormItem.subjectDn" placeholder="来自证书导入" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item>
            <Upload
              ref="uploaded"
              name="uploadFile"
              action="/pas/Certificate/import"
              :on-success="uploadCertSuccessCallBack">
              <Button type="ghost" icon="ios-cloud-upload-outline">导入证书</Button>
            </Upload>
          </Form-item>
          <Form-item label="证书公钥" prop="base64X509">
            <Input v-model="detailFormItem.base64X509" placeholder="来自证书导入" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input v-model="detailFormItem.remark" placeholder="备注" type="text" :disabled="inputDisabled" />
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="saveCert" :loading="loading">
          保存
        </Button>
        <Button size="large" @click="closeModal">
          关闭
        </Button>
      </div>
    </Modal>
    <!-- 新增模态框 /-->
  </div>
</template>

<script>
import moment from 'moment'
import '@/assets/styles/merchant.less'
// import {GetServerBase} from '@/common/utils/index'
export default {
  name: 'certList',
  // let SERVER_BASE_URL = GetEvn() ? (location.origin) : (GetServerBase().baseServerUrl)
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      loading: false,
      modal_loading: false,
      selection: [],
      columnsName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key: 'creatTime',
          title: '创建日期'
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
          key: 'certificateNo',
          title: '证书编号'
        },
        {
          key: 'type',
          title: '证书类型'
        },
        {
          key: 'useStatus',
          title: '商户证书使用状态'
        },
        {
          key: 'status',
          title: '证书状态'
        },
        {
          title: '操作',
          key: 'action',
          // fixed: 'right',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.viewCert(params.row.certificateNo)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteCert()
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      dataList: [],
      listTotal: 0,
      /**
       * 分页
       */
      pageNum: 1,
      pageSize: 10,
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      /**
       * 搜索框
       */
      searchFormItem: {
        customerCode: '',
        customerName: ''
      },
      /**
       * 模态框（新增/查看）
       */
      isShowDetailModal: false,
      curOperateType: '', // 取值范围： ADD | VIEW
      inputDisabled: false,
      detailFormItem: {
        customerCode: '',
        customerName: '',
        certificateNo: '',
        type: '',
        status: '',
        useStatus: '',
        beginTime: '',
        endTime: '',
        signSN: '',
        issuerDn: '',
        subjectDn: '',
        base64X509: '',
        remark: ''
      },
      /**
       * 类型枚举
       */
      certificateTypeList: [
        { code: '0', name: '公钥' },
        { code: '1', name: '私钥' }
      ],
      certificateStatusList: [
        { code: '0', name: '正常' },
        { code: '1', name: '冻结' },
        { code: '2', name: '无效' }
      ],
      certificateUseStatusList: [
        { code: '0', name: '停用' },
        { code: '1', name: '正常使用' }
      ]
    }
  },
  methods: {
    getList (currentPage) {
      this.loading = true
      let params = {
        customerCode: this.searchFormItem.customerCode,
        customerName: this.searchFormItem.customerName,
        pageSize: this.pageSize,
        pageNum: currentPage !== undefined ? parseInt(currentPage) : 1
      }
      this.$api.merchant.certificate.queryList(params).then((resJson) => {
        let list = []
        let resArray = resJson.rows
        for (let r = 0; r < resArray.length; r++) {
          let json = {}
          json['creatTime'] = this.getDateFormat(resArray[r].createDateTime, 'YYYY-MM-DD HH:mm:ss')
          json['customerCode'] = resArray[r].customerCode
          json['customerName'] = resArray[r].customerName
          json['certificateNo'] = resArray[r].signSN
          json['type'] = this.getTypeName(resArray[r].type, 0)
          json['useStatus'] = this.getTypeName(resArray[r].useStatus, 1)
          json['status'] = this.getTypeName(resArray[r].status, 1)
          list.push(json)
        }
        this.dataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
      })
    },
    getCustDetailByCustomerCode () {
      var customerCode = this.detailFormItem.customerCode
      if (customerCode !== '') {
        this.loading = true
        let params = {
          customerCode: customerCode
        }
        this.$api.merchant.certificate.getCustDetailByCustomerCode(params).then((resJson) => {
          this.detailFormItem.customerName = resJson.name
          this.loading = false
          this.modal_loading = false
        })
      }
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.searchFormItem.pageSize = pageSize
      this.getList()
    },
    // 查询列表
    search () {
      this.modal_loading = true
      this.getList()
    },
    // 表格选中行
    selectTableRow (selection) {
      this.selection = selection
    },
    // 获取枚举值 index 0: 操作类型 1： 审核状态
    getTypeName (typeCode, index) {
      let typeArray = (index === 0) ? this.certificateTypeList : this.certificateStatusList
      for (let i = 0; i < typeArray.length; i++) {
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
    /**
     * 关闭模态框
     */
    closeModal () {
      this.isShowDetailModal = false
      this.curOperateType = ''
    },
    /**
     * 新增证书
     */
    addCert () {
      this.curOperateType = 'ADD'
      this.isShowDetailModal = true
    },
    /**
     * 保存证书
     */
    saveCert () {
      let params = {
        customerCode: this.detailFormItem.customerCode,
        customerName: this.detailFormItem.customerName,
        certificateNo: this.detailFormItem.certificateNo,
        type: this.detailFormItem.type,
        status: this.detailFormItem.status,
        useStatus: this.detailFormItem.useStatus,
        notBefore: this.detailFormItem.notBefore,
        notAfter: this.detailFormItem.notAfter,
        signSN: this.detailFormItem.signSN,
        issuerDn: this.detailFormItem.issuerDn,
        subjectDn: this.detailFormItem.subjectDn,
        base64X509: this.detailFormItem.base64X509,
        mem: this.detailFormItem.remark
      }
      this.$api.merchant.certificate.save(params).then((res) => {
        this.$Message.info('证书新增成功/失败：' + res)
      })
    },
    /**
     * 查看证书
     */
    viewCert (certificateNo) {
      this.curOperateType = 'VIEW'
      this.isShowDetailModal = true
      // var signNo = this.selection[0].certificateNo
      var signNo = certificateNo
      let params = {
        signSN: signNo // TODO 20180926A 20180209test01
      }
      this.$api.merchant.certificate.view(params).then((res) => {
        this.detailFormItem.customerCode = res.customerCode
        this.detailFormItem.customerName = res.customerName
        this.detailFormItem.signSN = res.signSN
        this.detailFormItem.notBefore = this.getDateFormat(res.notBefore, 'YYYY-MM-DD HH:mm:ss')
        this.detailFormItem.notAfter = this.getDateFormat(res.notAfter, 'YYYY-MM-DD HH:mm:ss')
        this.detailFormItem.issuerDn = res.issuerDn
        this.detailFormItem.type = res.type
        this.detailFormItem.status = res.status
        this.detailFormItem.useStatus = res.useStatus
        this.detailFormItem.base64X509 = res.base64X509
        this.detailFormItem.subjectDn = res.subjectDn
        // 显示商户名称
        this.getCustDetailByCustomerCode()
        // 查看时置灰
        this.inputDisabled = true
      })
    },
    /**
     * 删除证书
     */
    deleteCert () {
    },
    uploadCertSuccessCallBack (res, file) {
      // {"signSN":"227638140029254235532834521166754032749723932893","customerCode":null,
      // "notBefore":1473151445000,"notAfter":1504687445000,
      // "issuerDn":"CN=天威诚信数字认证中心企业证书CA, OU=企业证书, O=北京天威诚信电子商务服务有限公司, C=CN",
      // "subjectDn":"CN=易票联支付有限公司, OU=系统运维部, O=北京天威诚信电子商务服务有限公司",
      // "base64X509":"-----BEGIN CERTIFICATE-----\r\nMIIEJDCCAwygAwIBAgIUJ9+lsRcXirBqSNIt54c+eHTGWN0wDQYJKoZIhvcNAQEL\r\nBQAwgZYxCzAJBgNVBAYTAkNOMTkwNwYDVQQKDDDljJfkuqzlpKnlqIHor5rkv6Hn\r\nlLXlrZDllYbliqHmnI3liqHmnInpmZDlhazlj7gxFTATBgNVBAsMDOS8geS4muiv\r\ngeS5pjE1MDMGA1UEAwws5aSp5aiB6K+a5L+h5pWw5a2X6K6k6K+B5Lit5b+D5LyB\r\n5Lia6K+B5LmmQ0EwHhcNMTYwOTA2MDg0NDA1WhcNMTcwOTA2MDg0NDA1WjB7MTkw\r\nNwYDVQQKDDDljJfkuqzlpKnlqIHor5rkv6HnlLXlrZDllYbliqHmnI3liqHmnInp\r\nmZDlhazlj7gxGDAWBgNVBAsMD+ezu+e7n+i/kOe7tOmDqDEkMCIGA1UEAwwb5piT\r\n56Wo6IGU5pSv5LuY5pyJ6ZmQ5YWs5Y+4MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A\r\nMIIBCgKCAQEAuHINgPcadhD30AjoumQFckZWme3AbPNgiVlFqfSHj7yd8bSbHrfL\r\n4QDaQd7cJvxSFmcg1PLV6uvxJ4rAUSNQRcZF3n+ItYPEhaaHMUoa1HJlNiBQKpK3\r\npZW87O80TVj4Ber3TKpQ0n7UwtRN6rqzXYauewessQT6NNhLevlb4w6rqxsFIFsX\r\nkpI1jtBNi0EIG+a5txYGutTXH3rc9OkArAtGExHjgttA5Df+AD95sESPYaS008Nb\r\nL6ApbEWpkLU5XIGdFNJXSXlBfvnNSWkWZqyVD/XgTybxqmuU3peiGxvZA7/5CVRT\r\n4UXQL+4p6ajmn9wM1Jip8d0/J3Z4ev2L4QIDAQABo4GDMIGAMAkGA1UdEwQCMAAw\r\nCwYDVR0PBAQDAgWgMGYGA1UdHwRfMF0wW6BZoFeGVWh0dHA6Ly90b3BjYS5pdHJ1\r\ncy5jb20uY24vcHVibGljL2l0cnVzY3JsP0NBPTdFMURDOEQ0QjA5OEQ2RTNBRkMz\r\nMUFBQjA0MjY3REExNUFBRTdCNUUwDQYJKoZIhvcNAQELBQADggEBAAKzTrVNQD7u\r\n8MZNSX5dVF6L3uI+ovf+ADM3HODM4Lla90c1JC5qpMq5uoQwem9DvETMhFgveJHu\r\ngRR8d8i4yRDoqDMJoczZJLwap/HMHrMC/GiUv+Z2uuxAVbnnN25CQbNQh8kxEOa0\r\n57A/nB4b1pl4tkqVH0GmShrtd7YaFRv8j2LSGo7eBqTwnKDqEqaZkk9GG7S+RFIT\r\nuwdi/IFeP1nDjLBjpAZ+bBum61QhVIyJQPTX1QunqWTw3gPmI9EMLplRLihfxmGO\r\nPSCIAG369THtIGLVoGfsL7kcXjVzplZsAA9CVBKOAikDB0s+0DFI8hec3A+dIHTE\r\nbrec+RqOmBM=\r\n-----END CERTIFICATE-----",
      // "keyStorePath":null,"keystoreType":null,"privateKeyPwd":null,
      // "type":0,"status":null,"useStatus":null,"createDateTime":null,
      // "updateDateTime":null,"mem":null}
      this.detailFormItem.signSN = res.signSN
      this.detailFormItem.notBefore = this.getDateFormat(res.notBefore, 'YYYY-MM-DD HH:mm:ss')
      this.detailFormItem.notAfter = this.getDateFormat(res.notAfter, 'YYYY-MM-DD HH:mm:ss')
      this.detailFormItem.issuerDn = res.issuerDn
      this.detailFormItem.type = res.type
      this.detailFormItem.status = res.status
      this.detailFormItem.useStatus = res.useStatus
      this.detailFormItem.base64X509 = res.base64X509
      this.detailFormItem.subjectDn = res.subjectDn
    }
  },
  mounted () {
    // this.$refs['uploaded'].action = (GetServerBase().baseServerUrl) + 'pas/Certificate/import'
    // this.$refs['uploaded'].action="/sssss.do"
    this.getList()
  }
}
</script>

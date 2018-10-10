<template>
  <div class="merchant-audit-reject common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form ref="order" :model="formItem" :label-width="100">
            <Row>
              <Col span="10">
                <FormItem label="提交日期">
                  <Row :gutter="30">
                    <Col span="11">
                      <DatePicker type="date" placeholder="开始时间" v-model="formItem.submitTimeBegin" style="width: 100%" :options="startTimeOptions" @on-change="chooseStartEndTime"></DatePicker>
                    </Col>
                    <Col span="11">
                      <DatePicker type="date" placeholder="结束时间" v-model="formItem.submitTimeEnd" style="width: 100%" :options="endTimeOptions" @on-change="chooseStartTime"></DatePicker>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入商户名称"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="行为类型" class="pay-line-input">
                  <Select v-model="formItem.operationType">
                    <Option v-for="p in operationTypeList" :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="审核状态" class="pay-line-input">
                  <Select v-model="formItem.auditStatus">
                    <Option v-for="s in auditStatusList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row class="common-check-button">
              <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="search" class="pay-check-button">查询</Button>
              <Button size="large" type="success" icon="refresh" @click="getReset" >清空</Button>

            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row>
      <!-- 列表 -->
      <Col span="24" class="merchant-list-tab">
        <Table border :columns="columnsName" :data="dataList"  class="merchant-reject-tab"></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row>
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal / formItem.pageSize > 1" :total="listTotal" :current="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
  </div>
</template>

<script>
import '@/assets/styles/merchant.less'
import moment from 'moment'
import CommonData from '@/common/data/index'
import Common from '@/assets/js/common'
export default {
  name: 'merchantRejectAudit',
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      loading: false,
      modal_loading: false,
      operationTypeList: CommonData.operationTypeList,
      auditStatusList: CommonData.auditStatusList,
      menuOptions: this.$store.state.app.menuOptions,
      columnsName: [
        {
          key: 'index',
          width: 40,
          title: '序号',
          align: 'center'
        },
        {
          key: 'updateTime',
          title: '提交日期',
          align: 'center'
        },
        {
          key: 'customerName',
          title: '商户名称',
          align: 'center'
        },
        {
          key: 'operationType',
          title: '行为类型',
          align: 'center'
        },
        {
          key: 'creatorUserName',
          title: '录入员',
          width:150
        },
        {
          key: 'auditStatus',
          title: '审核状态',
          width:150
        }
      ],
      dataList: [],
      listTotal: 0,
      // endStartTime: new Date(),
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      formItem: {
        pageSize: pageShowSizer,
        pageNum: pageCurrent,
        submitTimeBegin: '',
        submitTimeEnd: '',
        customerName: '',
        operationType: '',
        auditStatus: ''
      },
      startTimeOptions: {
        disabledDate: (time) => {
          return time && time.valueOf() > Date.now()
        }
      },
      endTimeOptions: {
        disabledDate: (time) => {
          return time && time.valueOf() > Date.now()
        }
      }
    }
  },
  methods: {
    getList (currentPage) {
      this.loading = true
      let options = this.formItem
      this.pageCurrent = this.formItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.submitTimeBegin = this.getDateFormat(options.submitTimeBegin, 'YYYYMMDD')
      options.submitTimeEnd = this.getDateFormat(options.submitTimeEnd, 'YYYYMMDD')
      this.$api.merchant.getRejectAuditList(options).then((resJson) => {
        let list = []
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = this.formItem.pageSize * (this.formItem.pageNum - 1) + 1 + r
            json['updateTime'] = this.getDateFormat(resArray[r].updateTime, 'YYYY-MM-DD HH:mm:ss')
            json['customerName'] = resArray[r].customerName
            json['operationType'] = this.getTypeName(resArray[r].operationType, 0)
            json['creatorUserName'] = resArray[r].creatorUserName
            json['auditStatus'] = this.getTypeName(resArray[r].auditStatus, 1)
            json['customerInfoId'] = resArray[r].customerInfoId
            json['customerAuditInfoId'] = resArray[r].customerAuditInfoId
            list.push(json)
          }
        }
        this.dataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modal_loading = false
      })
    },
    // 获取枚举值 index 0: 操作类型 1： 审核状态
    getTypeName (typeCode, index) {
      let typeArray = (index === 0) ? this.operationTypeList : this.auditStatusList
      for (var i = 0; i < typeArray.length; i++) {
        if (parseInt(typeArray[i].code) === parseInt(typeCode)) {
          return typeArray[i].name
        }
      }
      return ''
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.formItem.pageSize = pageSize
      this.getList()
    },
    // 查询列表
    search () {
      this.modal_loading = true
      this.getList(1)
    },
    // 查看审核
    checkAudit (params) {
      this.$router.push({name: 'merchantDetailAudit', params: {opt: 'view', cid: params.row.customerInfoId, auditId: params.row.customerAuditInfoId, auditModule: 'rejectAudit'}})
    },
    // 修改
    editAudit (params) {
      this.$router.push({name: 'merchantDetailAudit', params: {opt: 'edit', cid: params.row.customerInfoId, auditId: params.row.customerAuditInfoId, auditModule: 'rejectAudit'}})
    },
    getDateFormat (time, format) {
      if (!time) return ''
      format = format !== null ? format : 'YYYY-MM-DD'
      return moment(time).format(format)
    },
    // 选择结束的开始时间
    chooseStartTime (date) {
      this.startTimeOptions = Common.chooseStartTime(date)
    },
    // 选择开始的结束时间
    chooseStartEndTime (date) {
      this.endTimeOptions = Common.chooseStartEndTime(date)
    },
    // 清空条件
    getReset () {
      this.formItem = {
        pageSize: 10,
        pageNum: 1,
        submitTimeBegin: '',
        submitTimeEnd: '',
        customerName: '',
        operationType: '',
        auditStatus: ''
      }
      this.getList(1)
    },
    initTable () {
      if (Common.getOperationNumber(this.menuOptions) > 0) {
        this.columnsName.push(
          {
            key: 'operation',
            title: '操作',
            align:'center',
            width: 200,
            render: (h, params) => {
              return h('div', this.getTabOpt(h, params))
            }
          }
        )
      }
      this.getList()
    },
    getTabOpt (h, params) {
      var paramsArray = []
      if (Common.getOperationAuth('view', this.menuOptions)) {
        paramsArray.push(
          h('Button', {
            props: {
              type: 'success',
            
            },
            on: {
              click: () => {
                this.checkAudit(params)
              }
            }
          }, '查看')
        )
      }
      if (Common.getOperationAuth('modify', this.menuOptions)) {
        paramsArray.push(
          h('Button', {
            props: {
              type: 'primary',
      
            },
            on: {
              click: () => {
                this.editAudit(params)
              }
            }
          }, '修改')
        )
      }
      return paramsArray
    }
  },
  mounted () {
    this.initTable()
  }
}
</script>

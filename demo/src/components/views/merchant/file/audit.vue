<template>
  <div class="merchant-audit-reject common-inner">
    <Row>
      <!-- 条件选择(后台接口暂缺条件查询) -->
      <Col span="24">
        <div class="common-inner-div">
          <Form ref="order" :model="formItem" :label-width="100">
            <c-date-picker ref="cdatepicker" @on-change="changeDate" :label="titmeTitle" @searchdata="search" ></c-date-picker>
            <Row>
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入商户名称"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="行为类型" class="pay-line-input" >
                  <Select v-model="formItem.operationType">
                    <Option v-for="p in operationTypeList" :value="p.code" :key="p.code">{{ p.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <!--
              <Col span="10">
                <FormItem label="审核状态" class="pay-line-input">
                  <Select v-model="formItem.auditStatus">
                    <Option v-for="s in auditStatusList" :value="s.code" :key="s.code">{{ s.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              -->
            </Row>
            
            <Row class="common-check-button">
              <Button class="merchant-submit" type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="search">查询</Button>
              <Button type="success" size="large" icon="refresh" @click="getReset" >清空</Button>
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row>
      <!-- 列表 -->
      <Col span="24" class="merchant-list-tab">
        <Table   :columns="columnsName" :data="dataList" ></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row>
      <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal / formItem.pageSize > 1" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
  </div>
</template>

<script>
import '@/assets/styles/merchant.less'
import CDatePicker from '@/components/layout/common/CDatePicker'
import moment from 'moment'
import CommonData from '@/common/data/index'
import Common from '@/assets/js/common'

export default {
  name: 'merchantWaitAudit',
  components: {
    CDatePicker
  },
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      loading: false,
      modal_loading: false,
      operationTypeList: CommonData.auditOperationTypeList,
      auditStatusList: CommonData.auditStatus,
      titmeTitle: '提交时间',
      columnsName: [
        {
          key: 'index',
          width:150,
          title: '序号',
          align: 'center'
        },
        {
          key: 'updateTime',
          title: '提交日期',
          width:200,
        },
        {
          key: 'customerName',
          title: '商户名称',
          width:200,
        },
        {
          key: 'operationType',
          title: '行为类型',
      
        },
        {
          key: 'creatorUserName',
          title: '录入员',
         
        },
        {
          key: 'auditStatus',
          title: '审核状态',
          className:'audit'

        }
      ],
      dataList: [],
      listTotal: 0,
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      formItem: {
        pageSize: 10,
        pageNum: 1,
        submitTimeBegin: '',
        submitTimeEnd: '',
        customerName: '',
        operationType: '',
        auditStatus: ''
      },
      submitTimeBegin: '',
      submitTimeEnd: ''
    }
  },
  methods: {
    getList (currentPage) {
      this.pageCurrent = currentPage
      this.loading = true
      let options = this.formItem
 
      options.submitTimeBegin = Common.getTimeFormat(this.submitTimeBegin, 'YYYYMMDD', 0, true)
      options.submitTimeEnd = Common.getTimeFormat(this.submitTimeEnd, 'YYYYMMDD', 1, true)
      options.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      this.$api.merchant.getWaitAuditList(options).then((resJson) => {
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
            json['operation'] = resArray[r].auditStatus === '02' ? '复审' : '初审'
            json['customerInfoId'] = resArray[r].customerInfoId
            json['customerAuditInfoId'] = resArray[r].customerAuditInfoId
            json['auditStatusCode'] = resArray[r].auditStatus
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
    // 审核/复审 操作
    doAudit (params) {
      this.$router.push({name: 'merchantDetailAudit', params: {opt: 'view', cid: params.row.customerInfoId, auditId: params.row.customerAuditInfoId, auditModule: 'waitAudit'}})
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
    changeDate (type, time) {
      if (type === '1') {
        this.submitTimeBegin = time
      } else {
        this.submitTimeEnd = time
      }
      console.log(this.submitTimeBegin,this.submitTimeEnd)
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
      this.submitTimeBegin = ''
      this.submitTimeEnd = ''
      this.$refs.cdatepicker.clear()
      this.getList(1)
    },
    initTable () {
      if (Common.getOperationAuth('firstAudit', this.$store.state.app.menuOptions)) {
        this.columnsName.push(
          {
            key: 'operation',
            title: '操作',
            align:'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                  type: 'primary',
                  },
                  on: {
                    click: () => {
                      this.doAudit(params)
                    }
                  }
                }, params.row.operation)
              ])
            }
          }
        )
      }
      this.getList()
    }
  },
  mounted () {
    this.initTable()
  }
}
</script>
<style lang="less" scoped>

</style>


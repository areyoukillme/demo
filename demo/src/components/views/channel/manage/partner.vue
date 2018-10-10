<template>
  <div class="common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form ref="order" :model="formItem" :label-width="100">
            <Row>
              <Col span="10">
                <FormItem label="合作机构编号" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入合作机构编号"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="合作机构名称" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入合作机构名称"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col class="merchant-submit"><Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="search" class="common-check-button">查询</Button></Col>
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row>
      <!-- 按钮组 -->
      <Col span="24" class="merchant-list-group-btn">
        <ButtonGroup>
          <!-- <Button type="ghost" icon="edit" @click="viewItem" :disabled="selection.length != 1">查看</Button> -->
          <Button type="ghost" icon="ios-eye-outline" @click="addItem">新增</Button>
          <!-- <Button type="ghost" icon="locked" @click="editItem" :disabled="selection.length != 1">编辑</Button> -->
          <!-- <Button type="ghost" icon="unlocked" @click="deleteItem" :disabled="selection.length != 1">删除</Button> -->
        </ButtonGroup>
      </Col>
      <!-- 按钮组 /-->
    </Row>
    <Row>
      <!-- 列表 -->
      <Col span="24" class="merchant-list-tab">
        <Table border :columns="columnsName" :data="dataList" :loading="loading"></Table>
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
import moment from 'moment'
import CommonData from '@/common/data/index'
import Common from '@/assets/js/common'
export default {
  name: 'PartnerManage',
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      selection: [],
      loading: false,
      modal_loading: false,
      operationTypeList: CommonData.operationTypeList,
      auditStatusList: CommonData.auditStatusList,
      columnsName: [
        {
          key: 'index',
          width: 40,
          title: '序号',
          align: 'center'
        },
        {
          key: 'updateTime',
          title: '合作机构编号',
          width: 100
        },
        {
          key: 'customerName',
          title: '合作机构名称',
          width: 150
        },
        {
          key: 'operationType',
          title: '对账方式'
        },
        {
          key: 'creatorUserName',
          title: '对账周期'
        },
        {
          key: 'auditStatus',
          title: '易票联对接人'
        },
        {
          key: 'operation',
          title: '操作时间'
        },
        {
          key: 'operation',
          title: '操作人'
        },
        {
          key: 'operation',
          title: '所属支付渠道'
        },
        {
          title: '操作',
          key: 'action',
          // fixed: 'right',
          width: 165,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.viewItem()
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editItem()
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteItem()
                  }
                }
              }, '删除')
            ])
          }
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
      this.formItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.submitTimeBegin = this.getDateFormat(options.submitTimeBegin, 'YYYYMMDD', 0)
      options.submitTimeEnd = this.getDateFormat(options.submitTimeEnd, 'YYYYMMDD', 0)
      this.$api.merchant.getRejectAuditList(options).then((res) => {
        let list = []
        let resArray = res.rows
        if (resArray && resArray.length > 0) {
          for (let r = 0; r < resArray.length; r++) {
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
        this.listTotal = res.total
        this.loading = false
        this.modal_loading = false
      })
    },
    // 获取枚举值 index 0: 操作类型 1： 审核状态
    getTypeName (typeCode, index) {
      let typeArray = (index === 0) ? this.operationTypeList : this.auditStatusList
      for (let i = 0; i < typeArray.length; i++) {
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
      this.getList()
    },
    // 查看
    viewItem () {
    },
    // 新增
    addItem () {
    },
    // 修改
    editItem () {
    },
    // 删除
    deleteItem () {
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
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

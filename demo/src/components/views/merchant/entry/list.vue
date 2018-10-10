<template>
  <div class="common-inner">
    <!-- 条件选择 -->
    <Row>
      <Col span="24">
        <div class="merchant-form-inner">
          <Form ref="order" :model="formItem" :label-width="100">
            <Row>
              <Col span="8">
                <FormItem label="创建时间">
                  <Row>
                    <Col span="12">
                      <DatePicker type="date" placeholder="开始时间" v-model="formItem.createTimeBegin" style="width: 100%" :options="BeginTimeOptions" @on-change="chooseBeginEndTime"></DatePicker>
                    </Col>
                    <Col span="12">
                      <DatePicker type="date" placeholder="结束时间" v-model="formItem.createTimeEnd" style="width: 100%" :options="endTimeOptions" @on-change="chooseBeginTime"></DatePicker>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="合作机构名称" class="pay-line-input">
                  <Input v-model="formItem.partner" placeholder="请选择"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="进件状态" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入商户名称"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="商户编号" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入商户编号"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="商户名称" class="pay-line-input">
                  <Input v-model="formItem.customerName" placeholder="请输入商户名称"></Input>
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getList()">查询</Button>
          </Form>
        </div>
      </Col>
    </Row>
    <!-- 条件选择 /-->
    <!-- 按钮组 -->
    <Row>
      <Col span="24" class="merchant-list-group-btn">
        <ButtonGroup>
          <Button type="ghost" icon="ios-eye-outline" @click="viewEntry" :disabled="selection.length !== 1">查看进件</Button>
          <Button type="ghost" icon="edit" @click="reEntry" :disabled="selection.length !== 1">重新进件</Button>
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
        <Page v-if="listTotal > 0" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="pay-page" @on-change="getList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
    </Row>
    <!-- 分页 /-->
  </div>
</template>

<script>
import '@/assets/styles/merchant.less'
import moment from 'moment'
import CommonData from '@/common/data/index'
import Common from '@/assets/js/common'
export default {
  name: 'MerchantEntryQuery',
  data () {
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      loading: false,
      modal_loading: false,
      selection: [],
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
          key: 'createTime',
          title: '创建时间',
          width: 120
        },
        {
          key: 'partnerName',
          title: '合作机构名称',
          width: 150
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
          key: 'bankCustomerCode',
          title: '银行商户编号'
        },
        {
          key: 'entryStatus',
          title: '进件状态'
        }
      ],
      dataList: [],
      listTotal: 0,
      // endBeginTime: new Date(),
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: pageCurrent,
      formItem: {
        pageSize: pageShowSizer,
        pageNum: pageCurrent,
        createTimeBegin: '',
        createTimeEnd: '',
        customerName: '',
        operationType: '',
        auditStatus: ''
      },
      BeginTimeOptions: {
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
      options.createTimeBegin = this.getDateFormat(options.createTimeBegin, 'YYYYMMDD', 0)
      options.createTimeEnd = this.getDateFormat(options.createTimeEnd, 'YYYYMMDD', 0)
      // this.$api.merchant.getRejectAuditList(options).then((resJson) => {
      // TODO 假数据
      let res = {
        result: '0000',
        rows: [{
          createTime: '2018-05-23 15:43:52',
          partnerName: '天翼电子商务有限公司广东分公司',
          customerCode: '5651300000000151',
          customerName: '易票联',
          bankCustomerCode: '100052958913',
          entryStatus: '进件失败'
        }, {
          createTime: '2017-05-23 09:43:52',
          partnerName: '易海云商有限公司',
          customerCode: '5651300000000453',
          customerName: '易票联',
          bankCustomerCode: '100052958914',
          entryStatus: '进件成功'
        }, {
          createTime: '2017-05-23 09:43:52',
          partnerName: '诚川贸易有限公司',
          customerCode: '5651300000000451',
          customerName: '易票联',
          bankCustomerCode: '200052958915',
          entryStatus: '审核中'
        }],
        total: 3
      }
      this.dataList = res.rows
      this.listTotal = res.total
      this.loading = false
      this.modal_loading = false
      // })
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
      this.getList()
    },
    // 表格选中行
    selectTableRow (selection) {
      this.selection = selection
    },
    // 查看进件
    viewEntry (params) {
    },
    // 重新进件
    reEntry (params) {
    },
    getDateFormat (time, format) {
      if (!time) return ''
      format = format !== null ? format : 'YYYY-MM-DD'
      return moment(time).format(format)
    },
    // 选择结束的开始时间
    chooseBeginTime (date) {
      this.BeginTimeOptions = Common.chooseBeginTime(date)
    },
    // 选择开始的结束时间
    chooseBeginEndTime (date) {
      this.endTimeOptions = Common.chooseBeginEndTime(date)
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

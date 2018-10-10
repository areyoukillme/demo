<template>
  <div class="common-inner business-information-info">
    <div v-show="showList">
      <Row>
        <!-- 条件选择 -->
        <Col span="24">
          <div class="common-inner-div">
            <Form :label-width="100" :model="infoParam">
              <Row>
                <Col span="10">
                  <FormItem label="业务名称" class="pay-line-input" >
                    <Input placeholder="请输入业务名称" v-model="infoParam.name"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="业务类型" class="pay-line-input">
                    <Select v-model="infoParam.type">
                      <Option v-for="p in businessTypes" :value="p.code" :key="p.code">{{ p.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <div class="common-check-button">
                <Button type="primary" size="large"  icon="ios-search" :loading="modal_loading" @click="getCheckList">查询</Button>
                <Button v-if="this.hasAdd" icon="plus-round" size="large" type="success" @click="addInfo">新增</Button>
              </div>
            </Form>
          </div>
        </Col>
        <!-- 条件选择 /-->
        <!-- 按钮组 -->
      </Row>
      <Row>
        <!-- 按钮组 /-->
        <!-- 列表 -->
        <Col span="24" class="merchant-list-tab">
          <Table border :columns="columnsName" :data="infoDataList" :loading="loading"></Table>
        </Col>
        <!-- 列表 /-->
      </Row>
      <Row class="pay-inner">
        <!-- 分页-->
        <Col span="24" align="right">
          <Page v-if="totalPage / infoParam.pageSize > 1" :current.sync="currentPage" :total="totalPage" :page-size-opts="pageSizeOpts" :page-size="infoParam.pageSize" show-total show-sizer class="common-page-box" @on-change="getDataList" @on-page-size-change="getPageSizeChange"></Page>
        </Col>
        <!-- 分页 /-->
      </Row>
    </div>
    <info-add v-show="!showList"  @on-back="goBack"></info-add>
  </div>
</template>

<script>
import CommonData from '@/common/data/index'
import Common from '@/assets/js/common'
import '@/assets/styles/tranding.less'
import '@/assets/styles/business.less'
import InfoAdd from './module/infoAdd'
export default {
  components: {
    InfoAdd
  },
  data () {
    return {
      loading: false,
      modal_loading: false,
      isInfoAdd: false,
      showList: true,
      // 下拉框
      businessTypes: CommonData.businessInforTypes,
      currentPage: 1,
      hasAdd: Common.getOperationNumber(this.$store.state.app.menuOptions) > 0,
      // 列表
      columnsName: [
        {
          title: '业务编码',
          key: 'code',
          width: 80
        },
        {
          title: '业务名称',
          key: 'name'
        },
        {
          title: '业务类型',
          key: 'type',
          render: (h, params) => {
            let typeName = ''
            if (params.row.type === '1') {
              typeName = '互联网支付'
            } else if (params.row.type === '2') {
              typeName = 'DSP账户服务'
            }
            return h('span', typeName)
          }
        },
        {
          title: '支付方式',
          key: 'payMethodList',
          render: (h, params) => {
            var payMethodName = ''
            for (var i in params.row.payMethodList) {
              if (i > 0) {
                payMethodName += ','
              }
              payMethodName += params.row.payMethodList[i].payMethodName
            }
            return h('span', payMethodName)
          }
        },
        {
          title: '收单计费方式',
          key: 'ratioMode',
          render: (h, params) => {
            let ratioMode = ''
            if (params.row.type === '1') {
              ratioMode = '按单笔收费'
            } else if (params.row.type === '2') {
              ratioMode = '按比例收费'
            }
            return h('span', ratioMode)
          }
        },
        {
          title: '标准费率',
          key: 'ratio',
          render: (h, params) => {
            let unit = ''
            let value = ''
            if (params.row.ratioMode === '1') {
              unit = '元'
            } else if (params.row.ratioMode === '2') {
              unit = '%'
            }
            value = params.row.ratio.split('_')[0] / 100 + unit
            return h('span', value)
          }
        },
        {
          title: '收单封顶手续费（元）',
          key: 'ratio',
          width: 150,
          render: (h, params) => {
            let v = params.row.ratio.split('_')
            let ratio = ''
            if (v !== undefined && v.length > 1) {
              ratio = v[1] / 100
            } else {
              ratio = '-'
            }
            return h('span', ratio)
          }
        },
        {
          title: '备注',
          key: 'remark',
          render: (h, params) => {
            let remark = params.row.remark
            if (remark === null || remark === '') {
              remark = '-'
            }
            return h('span', remark)
          }
        },
        {
          title: '操作人',
          key: 'updator',
          render: (h, params) => {
            let updator = params.row.updator
            if (updator === null || updator === '') {
              updator = '-'
            }
            return h('span', updator)
          }
        },
        {
          title: '操作时间',
          key: 'createTime',
          render: (h, params) => {
            let createTime = params.row.createTime
            let newTime = ''
            if (createTime === '') {
              newTime = '-'
            } else {
              let date = new Date(createTime)
              let Y = date.getFullYear() + '-'
              let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
              let D = date.getDate() + ' '
              let h = date.getHours() + ':'
              let m = date.getMinutes() + ':'
              let s = date.getSeconds()
              newTime = Y + M + D + h + m + s
            }
            return h('span', newTime)
          }
        }
      ],
      infoParam: {
        name: '',
        type: '',
        pageSize: 10,
        pageNum: 1
      },
      infoDataList: [],
      totalPage: 0,
      pageSizeOpts: [10, 50, 100]
    }
  },
  methods: {
    // 获取列表
    getDataList (currentPage) {
      this.loading = false
      let params = this.infoParam
      this.currentPage = params.pageNum = currentPage !== undefined ? currentPage : 1
      // if (currentPage) {
      //   params.pageNum = currentPage
      // }
      this.$api.business.information.getBusinessList(params).then((res) => {
        console.log(res)
        if (res && res.rows) {
          this.infoDataList = res.rows
          this.totalPage = res.total
        }
        this.loading = this.modal_loading = false
      })
    },
    // 每页条数修改
    getPageSizeChange (pageSize) {
      this.infoParam.pageSize = pageSize
      this.getDataList()
    },
    // 条件查询
    getCheckList () {
      this.modal_loading = true
      this.getDataList()
    },
    // 新增
    addInfo () {
      this.showList = false
    },
    goBack () {
      this.showList = true
      this.getDataList()
      this.currentPage = 1
    }
  },
  mounted () {
    this.getDataList()
  },
  computed: {}
}
</script>

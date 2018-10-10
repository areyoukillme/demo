<template>
  <div class="trading-order-pay common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :model="payFormItem" :label-width="100">
            <Row>
              <Col span="10">
                <FormItem label="通知类型" class="pay-line-input">
                  <RadioGroup v-model="noticeState" @on-change="changeState">
                    <Radio  v-for="s in statusList" :label="s.code" :key="s.code">
                      <span>{{ s.name }}</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <c-date-picker ref="cdatepicker" @on-change="changeDate" :label="noticeTime"></c-date-picker>
            <Row>
              <div class="common-check-button">
                <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="getCheckList">查询</Button>
                <!-- <Button type="ghost" size="large" :loading="download_loading" icon="arrow-right-a" @click="getDownload">导出</Button> -->
                <Button size="large" icon="refresh" @click="getReset">清空</Button>
              </div>
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
    <Row class="pay-inner">
      <!-- 列表 -->
      <Col span="24">
        <Table border :columns="columnsName" :data="dataList" :loading="loading"></Table>
      </Col>
      <!-- 列表 /-->
    </Row>
    <Row class="pay-inner">
       <!-- 分页-->
      <Col span="24">
        <Page v-if="listTotal / payFormItem.pageSize > 1" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getPayList" @on-page-size-change="getPageSizeChange"></Page>
      </Col>
      <!-- 分页 /-->
    </Row>
  </div>
</template>

<script>
import '@/assets/styles/tranding.less'
import CDatePicker from '@/components/layout/common/CDatePicker'
import CommonData from '@/common/data/index'
import Common from '@/assets/js/common'

export default {
  name: 'FundsNotice',
  components: {
    CDatePicker
  },
  data () {
    return {
      noticeTime: '通知时间',
      loading: false,
      modal_loading: false,
      statusList: CommonData.noticeList,
      columnsName: [
        {
          key: 'index',
          title: '序号',
          width: 40,
          render: (h, params) => {
            return h('span', (this.payFormItem.pageNum - 1) * this.payFormItem.pageSize + params.index + 1)
          }
        },
        {
          key: 'notifyTime',
          title: '交易时间',
          width: 130
        },
        {
          key: 'noticeState',
          title: '通知类型',
          width: 130,
          render: (h, params) => {
            return h('span', (this.noticeState === '0' ? '来账' : '退汇'))
          }
        },
        {
          key: 'content',
          title: '通知内容'
        }
      ],
      dataList: [],
      listTotal: 0,
      pageShowSizer: 10,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: 1,
      payFormItem: {
        pageSize: 10,
        pageNum: 1,
        timeEnd: '',
        timeBegin: ''
      },
      noticeState: '0',
      beginTime: '',
      endTime: ''
    }
  },
  methods: {
    getPayList (currentPage) {
      this.loading = true
      let options = this.payFormItem
      this.pageCurrent = this.payFormItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      options.timeBegin = this.beginTime !== '' ? Common.getTimeFormat(this.beginTime, 'YYYYMMDD', 0, false) : ''
      options.timeEnd = this.endTime !== '' ? Common.getTimeFormat(this.endTime, 'YYYYMMDD', 1, false) : ''
      this.$api.funds[(this.noticeState === '0' ? 'getBackNotice' : 'getreturnNotice')](options).then((res) => {
        if (res.code === '0000') {
          this.dataList = res.data.rows
          this.listTotal = res.data.total
        }
        this.loading = false
        this.modal_loading = false
      })
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.payFormItem.pageSize = pageSize
      this.getPayList()
    },
    // 查询列表
    getCheckList () {
      if (!(this.beginTime || this.endTime || this.noticeState)) {
        this.$Message.error('请至少输入一条查询条件！')
        return
      }
      this.modal_loading = true
      this.pageCurrent = 1
      this.getPayList()
    },
    // 清空条件
    getReset () {
      this.payFormItem = {
        pageSize: 10,
        pageNum: 1,
        timeEnd: '',
        timeBegin: ''
      }
      this.noticeState = '0'
      this.pageCurrent = 1
      this.beginTime = ''
      this.endTime = ''
      this.getPayList()
    },
    changeState: function (val) {
      this.noticeState = val
      this.getPayList()
    },
    changeDate (type, time) {
      if (type === '1') {
        this.beginTime = time
      } else {
        this.endTime = time
      }
    }
  },
  mounted () {
    this.getPayList()
  }
}
</script>

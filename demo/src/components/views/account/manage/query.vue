<template>
  <div class="trading-order common-inner">

        <div class="common-inner-div">
          <Form :model="formItem" :label-width="100">
            <Row>
              <Col span="10">
                <FormItem label="商户编号" class="pay-line-input">
                  <Input v-model="formItem.customerCode" placeholder="请输入商户编号"/>
                </FormItem>
              </Col>
              <Button type="primary" size="default" :loading="modal_loading" icon="ios-search" @click="search" class="common-check-button">查询</Button>
            </Row>
            <!-- <Button type="primary" size="large" :loading="modal_loading" icon="ios-search" @click="exportData" class="pay-check-button">导出</Button> -->
          </Form>  
        </div>
        <Row :gutter=20 class="card" v-for="(item,idx1) in imglist" :key="idx1" >
              <Col span="8" v-for="(item2,idx2) in item" :key="idx2">
                <router-link :to='{path:"/account/manage/detail",query:{name:item2.name}}'>
                  <Row>
                    <Col span="10"> <Card><img :src="item2.imgurl" alt=""></Card></Col>

                    <Col span="14">
                      <h4>{{item2.name}} 
                          <Icon type="ios-checkmark" />
                         
                      </h4>
                      <p>{{item2.num}}</p>
                    </Col>
                  </Row>
                </router-link>
              </Col>
          </Row>
  </div>
</template>

<script>
import '@/assets/styles/tranding.less'
export default {
  name: 'accountList',
  data () {
    
    let pageShowSizer = 10
    let pageCurrent = 1
    return {
      imglist:[[{name:"沃尔玛",imgurl:"/static/images/logo1.jpg",num:"41242535253554"},
            {name:"古井集团",imgurl:"/static/images/logo2.jpg",num:"25425454254254"},
            {name:"翔泰",imgurl:"/static/images/logo3.jpg",num:"24242542544554"}],
            [{name:"鑫玉龙",imgurl:"/static/images/logo4.jpg",num:"2544254254254254"},
            {name:"西域良品",imgurl:"/static/images/logo5.jpg",num:"54254324546743545"},
            {name:"科尔沁",imgurl:"/static/images/logo6.jpg",num:"54254455454545432"}],
   ],
      loading: false,
      modal_loading: false,
      accountTypeList: [
        { code: 'YE-A', name: '余额账户' },
        { code: 'JY-A', name: '交易账户' },
        { code: 'BJ-B', name: '簿记账户' },
        { code: 'FZ-B', name: '被分账账户' }
      ],
 
    
      dataList: [],
      listTotal: 0,
      pageShowSizer: 6,
      pageSizeOpts: [6, 18, 100],
      pageCurrent: pageCurrent,
      formItem: {
        pageSize: pageShowSizer,
        pageNum: pageCurrent,
        // submitTimeBegin: '',
        // submitTimeEnd: '',
        customerName: '',
        customerCode: ''
        // operationType: '',
        // auditStatus: ''
      },
      // 弹出模态框
      modal: {
        isOpen: false,
        accountFormItem: [{}, {}]
      }
    }
  },
  methods: {
    getList (currentPage) {
      this.loading = true
      // let options = this.formItem
      let options = this.formItem
      this.pageCurrent = options.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      // this.formItem.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      // TODO 此接口用假数据模拟
      // let params = {
      //   customerCode: this.formItem.customerCode,
      //   customerName: this.formItem.customerName,
      //   pageSize: this.pageSize,
      //   pageNum: currentPage !== undefined ? parseInt(currentPage) : 1
      // }
      // alert(JSON.stringify(options))
      this.$api.accountManage.getAccountList(options).then(resJson => {
        // let list = []
        // // let resArray = resJson.rows
        // for (var r = 0; r < 10; r++) {
        //   let json = {}
        //   json['customerCode'] = '561520036587100' + r
        //   json['customerName'] = '商户名称' + r
        //   json['xxx'] = '66.66'
        //   list.push(json)
        // }
        if (resJson.returnCode === '0000') {
          let list = []
          let resArray = resJson.accountList.rows
          if (resArray && resArray.length > 0) {
            for (var r = 0; r < resArray.length; r++) {
              let json = {}
              json['index'] = this.formItem.pageSize * (this.formItem.pageNum - 1) + 1 + r
              json['customerCode'] = resArray[r].customerCode
              json['customerName'] = resArray[r].customerName
              json['balance'] = (resArray[r].balance / 100).toFixed(2)
              json['availableBalance'] = (resArray[r].availableBalance / 100).toFixed(2)
              json['frozenBalance'] = (resArray[r].frozenBalance / 100).toFixed(2)
              json['floatBalance'] = (resArray[r].floatBalance / 100).toFixed(2)
              json['accountTypeName'] = this.getAccountTypeName(resArray[r].code)
              json['currency'] = resArray[r].currency
              list.push(json)
            }
          }
          this.dataList = list
          console.log(this.dataList)
          this.listTotal = resJson.accountList.total
         
          this.loading = false
          this.modal_loading = false
        }
      })
    },
    getAccountTypeName (typeCode) {
      let tCode = typeCode.substring(0, 4)
      for (var i = 0; i < this.accountTypeList.length; i++) {
        if (this.accountTypeList[i].code === tCode) {
          return this.accountTypeList[i].name
        }
      }
      return '主账户'
    },
    // 表格选中行
    selectTableRow (selection) {
      this.selection = selection
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.formItem.pageSize = pageSize
      this.getList()
    },
    // 查询列表
    search () {
      this.modal_loading = true
      this.$api.accountManage.getAccountList(this.formItem).then(resJson => {
        if (resJson.returnCode === '0000') {
          let list = []
          let resArray = resJson.accountList.rows
          if (resArray && resArray.length > 0) {
            for (var r = 0; r < resArray.length; r++) {
              let json = {}
              json['index'] = this.formItem.pageSize * (this.formItem.pageNum - 1) + 1 + r
              json['customerCode'] = resArray[r].customerCode
              json['customerName'] = resArray[r].customerName
              json['balance'] = (resArray[r].balance / 100).toFixed(2)
              json['availableBalance'] = (resArray[r].availableBalance / 100).toFixed(2)
              json['frozenBalance'] = (resArray[r].frozenBalance / 100).toFixed(2)
              json['floatBalance'] = (resArray[r].floatBalance / 100).toFixed(2)
              json['accountTypeName'] = this.getAccountTypeName(resArray[r].code)
              json['currency'] = resArray[r].currency
              list.push(json)
            }
          }
          this.dataList = list
          this.$router.push({
            path:"/account/manage/detail",
            query:{money:list,name:"测试账户"}
          })
        }
      })
    },
    // 导出
    exportData () {
      alert('TODO 导出未实现')
    },
    // 查看账户详情
    viewDetail (params) {
      // let customerCode = params.row.customerCode
      this.modal.isOpen = true
    },
    // 提现
    withDraw (params) {
      let json = {}
      json['outTradeNo'] = (new Date()).valueOf()
      json['customerCode'] = this.selection[0].customerCode
      json['fromSystemId'] = 'YYMH'
      json['tradePass'] = '' // need modify
      json['payAmount'] = Math.round(parseFloat(this.selection[0].availableBalance).toFixed(2) * 100)
      json['payCurrency'] = this.selection[0].currency // CNY'
      json['channelType'] = '01'
      json['notifyUrl'] = ''
      json['remark'] = ''
      json['arrivalType'] = '0'
      json['bankCardId'] = '' // need modify
      this.$api.accountManage.accountWithDraw(json).then(resJson => {
        alert(resJson)
      })
    }
  },
  mounted () {
    this.getList()

  }
}
</script>
<style lang="less" scoped>
  .card{margin-top: 30px;
  a{color:#8080b8}
  .ivu-row{height:150px;}
  .ivu-col{.ivu-row{background: #2a2a45}}
  .ivu-card-body{height:30px;}
    img{width:100%;}
    h4{padding-left:20px;margin-top:40px;font-size:16px;
      i{float:right;padding-right:20px;color:#4ff9cc;}
    }
    p{padding-left:20px;margin-top:10px;font-size:14px;}
  }
</style>



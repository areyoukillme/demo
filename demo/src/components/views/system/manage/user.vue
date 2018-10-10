<template>
  <div class="trading-order-pay common-inner">
    <div class="system-manage-user" v-show="!showPop">
      <Row>
        <!-- 条件选择 -->
        <Col span="24">
          <div class="common-inner-div">
            <Form :model="systemManageUser" :label-width="100">
              <Row>
                <Col span="10">
                  <FormItem label="用户名" class="pay-line-input">
                    <Input placeholder="请输入用户名" v-model="systemManageUser.name"></Input>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="真实姓名" class="pay-line-input">
                    <Input placeholder="请输入真实姓名" v-model="systemManageUser.realName"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="状态" class="pay-line-input">
                    <Select v-model="systemManageUser.status">
                      <Option v-for="p in state" :value="p.code" :key="p.code">{{ p.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="角色" class="pay-line-input">
                    <Input placeholder="请输入角色名称" v-model="systemManageUser.roleName"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="10">
                  <FormItem label="部门" class="pay-line-input">
                    <Input placeholder="请输入部门名称" v-model="systemManageUser.deptName"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row class="common-check-button">
                <Button type="primary" size="large"  icon="ios-search" :loading="modalLoading" @click="getCheckList" >查询</Button>
                <Button v-if="this.hasAdd" size="large" type="success"" icon="plus-round" @click="addUser">新增</Button>
              </Row>
            </Form>
          </div>
        </Col>
        <!-- 条件选择 /-->
      </Row>
      <Row class="pay-inner">
        <!-- 列表 -->
        <Col span="24">
          <Table border ref="selection" :columns="columnsName" :data="systemDataList" :loading="loading" @on-selection-change="selectUserSelection" class="system-table"></Table>
        </Col>
        <!-- 列表 /-->
      </Row>
      <Row class="pay-inner">
        <!-- 分页-->
        <Col span="24" align="right">
          <Page v-if="listTotal / systemManageUser.pageSize > 0" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getUserList" @on-page-size-change="getPageSizeChange"></Page>
        </Col>
        <!-- 分页 /-->
      </Row>
    </div>
    <!-- Modal 新增 -->
    <!--提示  -->
    <Modal v-model="deleteUserTip" width="250" class="pas-delete-box">
      <p slot="header">
        <Icon v-show="popType === 1" type="information-circled"></Icon>
        <Icon v-show="popType === 2" type="help-circled"></Icon>
        <span>{{ popTitle }}</span>
      </p>
      <div style="text-align:center">
        <p>{{ popContent }}</p>
      </div>
      <div slot="footer">
        <Button v-show="popType === 1" type="primary" size="large" long @click="deleteUserBatch">删 除</Button>
        <Button v-show="popType === 2" type="primary" size="large" long @click="setUseableUser">确 定</Button>
      </div>
    </Modal>
    <!--提示 / -->
    <Modal class="system-reset-modal" title="重置密码" v-model="resetPsdModal" ok-text="确定" cancel-text="取消" width="300" @on-ok="resetPsdPhone" @on-cancel="closeModal">
        <span class="content">密码重置后，将发送至{{ phoneNumber }}手机号，继续重置请确定！</span>
    </Modal>
    <!-- Modal 新增 /-->
    <pop-user ref="popUser" v-if="this.hasAdd || this.hasModify || this.hasView" v-show="showPop" :inputDisabled="this.inputDisabled" :currModelIndex="this.currModelIndex" @on-listen-refresh="refresh"></pop-user>
  </div>
</template>

<script>
import '@/assets/styles/system.less'
import Common from '@/assets/js/common'
import CommonData from '@/common/data/index'
import popUser from './module/pop-user'
export default {
  name: 'tradingOrderPay',
  components: {
    popUser
  },
  data () {
    let auth = this.$store.state.app.menuOptions
    return {
      inputDisabled: false,
      phoneNumber: '',
      showPop: false,
      resetPsdModal: false,
      deleteUserTip: false,
      loading: false,
      modalLoading: false,
      showUserModal: false,
      currModelIndex: -1,
      saveDisabled: true,
      deleteUid: '',
      reqireClassName: '',
      state: CommonData.systemUserState,
      optionsAuth: auth,
      hasAdd: Common.getOperationAuth('add', auth),
      hasModify: Common.getOperationAuth('modify', auth),
      hasView: Common.getOperationAuth('view', auth),
      userState: [],
      userRole: [],
      allDepts: [],
      popTitle: '',
      popContent: '',
      popType: 0,
      userableId: '',
      userableStatus: '',
      roleIdList: [],
      roleNameList: [],
      selection: [],
      // 列表
      columnsName: [
        {
          // type: 'selection',
          width: 40,
          key: 'index',
          title: '序号',
          align: 'center'
        },
        {
          title: '用户名',
          key: 'name',
          width: 80
        },
        {
          title: '真实名称',
          key: 'realName',
          width: 80
        },
        {
          title: '部门',
          key: 'deptName',
          width:100,
          align:'center'
        },
        {
          title: '手机',
          key: 'mobile',
          width:100
        },
        {
          title: '角色',
          key: 'roleName',
         
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 80
        },
        {
          title: '创建人',
          key: 'creator',
          width: 80
        },
        {
          title: '状态',
          key: 'status',
          width: 60
        }
      ],
      systemDataList: [],
      listTotal: 0,
      pageShowSizer: 10,
      pageSizeOpts: [10, 50, 100],
      pageCurrent: 1,
      reAllDarpt: [],
      systemManageUser: {
        pageSize: 10,
        pageNum: 1,
        status: '',
        name: '',
        realName: '',
        deptName: '',
        roleName: ''
        // roleNameList: []
      }
      // userAllRoles: []
    }
  },
  methods: {
    initTab () {
      if (Common.getOperationNumber(this.optionsAuth, 'add') > 0) {
        this.columnsName.push(
          {
            title: '操作',
            key: 'action',
            width: 400,
            align:'center',
            render: (h, params) => {
              let buttonsArray = []
              if (Common.getOperationAuth('modify', this.optionsAuth)) {
                buttonsArray.push(
                  h('Button', {
                    props: {
                
                      type:'info'
                    },
                    on: {
                      click: () => {
                        this.editorUser(params.row.uid, params.row.deptId)
                      }
                    }
                  }, '编辑')
                )
              }
              if (Common.getOperationAuth('view', this.optionsAuth)) {
                buttonsArray.push(
                  h('Button', {
                    props: {
           
                      type:'success'
                    },
                    on: {
                      click: () => {
                        this.checkUser(params.row.uid)
                      }
                    }
                  }, '查看')
                )
              }
              if (Common.getOperationAuth('delete', this.optionsAuth)) {
                buttonsArray.push(
                  h('Button', {
                    props: {
               
                      type:'warning'
                    },
                    on: {
                      click: () => {
                        this.deleteUserTip = true
                        this.popTitle = '删除确认'
                        this.popContent = '是否继续删除？'
                        this.popType = 1
                        this.deleteUid = params.row.uid
                      }
                    }
                  }, '删除')
                )
              }
              if (Common.getOperationAuth('enable', this.optionsAuth) && params.row.status === '禁用') {
                buttonsArray.push(
                  h('Button', {
                    props: {
                
                      type:'dashed'

                    },
                    on: {
                      click: () => {
                        this.deleteUserTip = true
                        this.popTitle = '启用确认'
                        this.popContent = '是否继续启用该用户？'
                        this.userableId = params.row.uid
                        this.userableStatus = 'Y'
                        this.popType = 2
                        // this.setUseableUser(params.row.uid, 'Y')
                      }
                    }
                  }, '启用')
                )
              }
              if (Common.getOperationAuth('disable', this.optionsAuth) && params.row.status === '启用') {
                buttonsArray.push(
                  h('Button', {
                    props: {
   
                      type:'error'
                    },
                    on: {
                      click: () => {
                        this.deleteUserTip = true
                        this.popTitle = '禁用确认'
                        this.popContent = '是否继续禁用该用户？'
                        this.userableId = params.row.uid
                        this.userableStatus = 'N'
                        this.popType = 2
                        // this.setUseableUser(params.row.uid, 'N')
                      }
                    }
                  }, '禁用')
                )
              }
              if (Common.getOperationAuth('resetPsw', this.optionsAuth)) {
                buttonsArray.push(
                  h('Button', {
                    props: {
                  
                      type:'primary'
                    },
                    on: {
                      click: () => {
                        this.resetPsdModal = true
                        this.phoneNumber = params.row.mobile
                        this.userableId = params.row.uid
                      }
                    }
                  }, '重置密码')
                )
              }
              return h('div', buttonsArray)
            }
          }
        )
      }
      this.getUserList()
    },
    // 重置密码
    resetPsdPhone () {
      this.$api.system.userManage.restUserPwd({uid: this.userableId}).then((res) => {
        if (res.returnCode === '0000') {
          this.$Message.info('操作成功')
        } else {
          this.$Message.error(res.returnMsg)
        }
        this.closeModal()
      })
    },
    // 关闭重置密码
    closeModal () {
      this.userableId = ''
      this.phoneNumber = ''
      this.resetPsdModal = false
    },
    getUserList (currentPage) {
      this.loading = true
      this.selection = []
      let options = this.systemManageUser
      this.systemManageUser.pageNum = currentPage ? parseInt(currentPage) : 1
      this.$api.system.getManageUserList(options).then((resJson) => {
        let list = []
        let resArray = resJson.rows
        if (resArray && resArray.length > 0) {
          for (var r = 0; r < resArray.length; r++) {
            let json = {}
            json['index'] = this.systemManageUser.pageSize * (this.systemManageUser.pageNum - 1) + r + 1
            json['name'] = resArray[r].name || '-'
            json['realName'] = resArray[r].realName || '-'
            json['deptName'] = resArray[r].deptName || '-'
            json['mobile'] = resArray[r].mobile || '-'
            json['roleName'] = resArray[r].roleName || '-'
            json['createTime'] = resArray[r].createTime || '-'
            json['creator'] = resArray[r].creator || '-'
            json['status'] = ((resArray[r].status === 'Y') ? '启用' : '禁用') || '-'
            json['uid'] = resArray[r].uid
            json['deptId'] = resArray[r].deptId
            json['email'] = resArray[r].email || '-'
            json['remark'] = resArray[r].remark || '-'
            list.push(json)
          }
        }
        this.systemDataList = list
        this.listTotal = resJson.total
        this.loading = false
        this.modalLoading = false
      })
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.systemManageUser.pageSize = pageSize
      this.systemManageUser.pageNum = this.pageCurrent = 1
      this.getUserList()
    },
    // 查询列表
    getCheckList () {
      this.modalLoading = true
      this.systemManageUser.pageNum = this.pageCurrent = 1
      this.getUserList()
    },
    // 删除
    deleteUserBatch () {
      // let uId = this.selection[0].uid
      let uId = this.deleteUid
      this.$api.system.deleteManageUserById({uid: uId}).then((res) => {
        // 接口待修改 to-do
        this.deleteUserTip = false
        if (res.returnCode === '0000') {
          this.$Message.info('删除成功')
          this.refresh()
        } else {
          this.$Message.error(res.returnMsg)
        }
      })
    },
    // 选择
    selectUserSelection (selection) {
      this.selection = selection
    },
    popCommonOpen (index, inputStatus) {
      Common.windowToTop()
      this.inputDisabled = inputStatus
      this.showPop = true
      this.currModelIndex = index
    },
    // 新增
    addUser () {
      this.popCommonOpen(0, false)
      this.$refs.popUser.getRoleList()
      this.$refs.popUser.getDeptsList()
    },
    // 查看用户
    checkUser (uid) {
      this.popCommonOpen(2, true)
      this.$refs.popUser.getUserInfoById(uid)
    },
    // 编辑
    editorUser (uid, dId) {
      this.popCommonOpen(1, false)
      this.$refs.popUser.getUserInfoById(uid)
      this.$refs.popUser.getDeptsList(dId)
    },
    // 刷新页面请求
    refresh () {
      this.selection = []
      this.showPop = false
      this.systemManageUser = {
        pageSize: 10,
        pageNum: 1,
        status: 'Y',
        name: '',
        realName: ''
      }
      this.roleIdList = []
      this.pageCurrent = 1
      this.getUserList()
    },
    // 设置禁用启用
    setUseableUser () {
      let params = {
        uid: this.userableId,
        status: this.userableStatus
      }
      this.$api.system.useableUser(params).then((res) => {
        if (res.returnCode === '0000') {
          this.userableId = this.userableStatus = ''
          this.deleteUserTip = false
          this.$Message.info('操作成功')
          this.refresh()
        } else {
          this.$Message.error(res.returnMsg)
        }
      })
    }
  },
  mounted () {
    if (this.$route.query) {
      if (this.$route.query.role) {
        this.systemManageUser.roleName = this.$route.query.role
      }
      if (this.$route.query.depart) {
        this.systemManageUser.deptName = this.$route.query.depart
      }
    }
    this.initTab()
  }
}
</script>

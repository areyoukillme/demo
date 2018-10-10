<template>
  <div class="trading-order-pay common-inner">
    <div v-show="!showPop">
      <Row>
        <!-- 条件选择 -->
        <Col span="24">
          <div class="common-inner-div">
            <Form :model="systemManageRole" :label-width="100">
              <Row>
                <Col span="10">
                  <FormItem label="角色名" class="pay-line-input">
                    <Input placeholder="请输入角色名" v-model="systemManageRole.name" />
                  </FormItem>
                </Col>
              </Row>
              <Row class="common-check-button">
                <Button type="primary" size="large"  icon="ios-search" :loading="modalLoading" @click="getCheckList" >查询</Button>
                <Button type="ghost" icon="plus-round" @click="addRole" size="large" v-if="this.hasAdd">新增</Button>
              </Row>
            </Form>
          </div>
        </Col>
        <!-- 条件选择 /-->
      </Row>
      <!-- 按钮组 /-->
      <Row class="pay-inner">
        <!-- 列表 -->
        <Col span="24">
          <Table border ref="selection" :columns="columnsName" :data="systemDataList" :loading="loading" @on-selection-change="selectRoleSelection" class="system-table"></Table>
        </Col>
        <!-- 列表 /-->
      </Row>
      <Row class="pay-inner">
        <!-- 分页-->
        <Col span="24" align="right">
          <Page v-if="listTotal / systemManageRole.pageSize > 0" :total="listTotal" :current.sync="pageCurrent" show-sizer :page-size="pageShowSizer" :page-size-opts="pageSizeOpts" show-total class="common-page-box" @on-change="getRoleList" @on-page-size-change="getPageSizeChange"></Page>
        </Col>
        <!-- 分页 /-->
      </Row>
    </div>
    <!--删除提示  -->
    <Modal v-model="deleteUserTip" width="250" class="pas-delete-box">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="deleteRole">删除</Button>
      </div>
    </Modal>
    <!--删除提示 / -->
    <!-- Modal 新增 -->
    <pop-role ref="popRole" v-if="this.hasAdd || this.hasModify" v-show="showPop" :currModelIndex="this.currModelIndex" @on-listen-cancel="onCancel"></pop-role>
  </div>
</template>

<script>
import '@/assets/styles/system.less'
import Common from '@/assets/js/common'
import popRole from './module/pop-role'
export default {
  name: 'tradingOrderPay',
  components: {
    popRole
  },
  data () {
    let pageShowSizer = 10
    let current = 1
    let auth = this.$store.state.app.menuOptions
    return {
      showPop: false,
      editRoleModal: false,
      deleteUserTip: false,
      loading: false,
      modalLoading: false,
      showUserModal: false,
      currModelIndex: -1,
      saveDisabled: true,
      delUid: '',
      reqireClassName: '',
      userRole: [],
      allRoleTreeData: [],
      allTreeData: [],
      optionsAuth: auth,
      hasAdd: Common.getOperationAuth('add', auth),
      hasModify: Common.getOperationAuth('modify', auth),
      roleFormValidate: {
        name: [
          {required: true, message: '角色名称', trigger: 'blur'}
        ]
      },
      selection: [],
      // 列表
      columnsName: [
        {
          width: 60,
          align: 'center',
          title: '序号',
          key: 'uid',
          render: (h, params) => {
            return h('span', {}, (this.pageCurrent - 1) * this.pageShowSizer + params.row._index + 1)
          }
        },
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '关联用户数',
          key: 'userCount',
          className: 'system-role-link',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.$router.push('/system/manage/user?role=' + params.row.name)
                }
              }
            }, params.row.userCount)
          }
        },
        {
          title: '备注',
          key: 'remark'
        }
      ],
      systemDataList: [],
      listTotal: 0,
      pageShowSizer: pageShowSizer,
      pageSizeOpts: [50, 100],
      pageCurrent: current,
      systemManageRole: {
        pageSize: pageShowSizer,
        pageNum: current,
        name: ''
      }
    }
  },
  methods: {
    initTab () {
      if (Common.getOperationNumber(this.optionsAuth, 'add') > 1) {
        this.columnsName.push(
          {
            title: '操作',
            key: 'action',
            width: 120,
            render: (h, params) => {
              let arrays = []
              if (Common.getOperationAuth('modify', this.optionsAuth)) {
                arrays.push(
                  h('Button', {
                    props: {
                      size: 'small',
                      type:'success'
                    },
                    on: {
                      click: () => {
                        this.editorRole(params.row.uid)
                      }
                    }
                  }, '编辑')
                )
              }
              if (Common.getOperationAuth('delete', this.optionsAuth)) {
                arrays.push(
                  h('Button', {
                    props: {
                      size: 'small',
                      type:'error'
                    },
                    on: {
                      click: () => {
                        this.deleteUserTip = true
                        this.deleteUid = params.row.uid
                      }
                    }
                  }, '删除')
                )
              }
              return h('div', arrays)
            }
          }
        )
      }
      this.getRoleList(1)
    },
    getRoleList (currentPage) {
      this.loading = true
      let options = this.systemManageRole
      this.pageCurrent = this.systemManageRole.pageNum = currentPage !== undefined ? parseInt(currentPage) : 1
      this.$api.system.roleManage.getRoleList(options).then((res) => {
        if (res.returnCode === '0000') {
          this.systemDataList = res.rows
          this.listTotal = res.total
        } else {
          this.$Message.error(res.message)
        }
        this.loading = false
        this.modalLoading = false
      })
    },
    // 切换每页条数
    getPageSizeChange (pageSize) {
      this.systemManageRole.pageSize = pageSize
      this.systemManageRole.pageNum = this.pageCurrent = 1
      this.refresh()
    },
    // 查询列表
    getCheckList () {
      this.modalLoading = true
      this.systemManageRole.pageNum = this.pageCurrent = 1
      this.refresh()
    },
    // 删除
    deleteRole () {
      let uId = this.deleteUid
      this.$api.system.roleManage.deleteRoleById({uid: uId}).then((res) => {
        this.deleteUserTip = false
        if (res.returnCode === '0000') {
          this.$Message.info('删除成功')
          this.selection = []
          this.refresh()
        } else {
          this.$Message.error(res)
        }
      })
    },
    // 选择
    selectRoleSelection (selection) {
      this.selection = selection
    },
    // 取消
    onCancel () {
      this.showPop = false
    },
    // 新增角色
    addRole () {
      this.showPop = true
      this.currModelIndex = 0
      this.$refs.popRole.getAllRoleTree()
    },
    // 编辑
    editorRole (uid) {
      this.showPop = true
      this.currModelIndex = 1
      this.$refs.popRole.reAllRoleTreeData = []
      this.$refs.popRole.getRoleInfoById(uid)
    },
    // 刷新页面请求
    refresh () {
      setTimeout(() => {
        this.getRoleList(1)
      }, 800)
    }
  },
  mounted () {
    this.initTab()
  },
  destroyed () {
    this.allRoleTreeData = []
  }
}
</script>

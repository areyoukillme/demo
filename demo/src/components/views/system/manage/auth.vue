<template>
  <div class="trading-order-pay common-inner">
    <!-- 按钮组 -->
    <div class="pay-inner pay-group-hd trading-auth-buttonGroup">
      <ButtonGroup>
        <Button type="ghost" icon="plus-round" @click="addAuth">新增</Button>
      </ButtonGroup>
    </div>
    <!-- 按钮组 /-->
    <Row class="pay-inner">
      <!-- 列表 -->
      <Col span="24">
        <table-tree :items='allAuthTreeData' :columns='columnsName' @on-row-click='onRowClick'></table-tree>
      </Col>
      <!-- 列表 /-->
    </Row>
    <!-- Modal 新增 -->
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
        <Button type="error" size="large" long @click="deleteAuth">删除</Button>
      </div>
    </Modal>
    <!--删除提示 / -->
    <!-- 编辑 -->
    <Modal v-model="editAuthModal">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span v-if="currAuthIndex === 0">新增权限</span>
        <span v-if="currAuthIndex === 1">编辑权限</span>
      </p>
      <div class="system-user-modal">
        <Form :model="authFormItem" :label-width="80" ref="authFormItem" :rules="authFormValidate">
          <Form-item label="权限名称" prop="name">
            <Input v-model="authFormItem.name" placeholder="请输入权限名称" type="text" />
          </Form-item>
          <Form-item label="code" prop="code">
            <Input v-model="authFormItem.code" placeholder="请输入code" type="text"  />
          </Form-item>
          <Form-item label="URL">
            <Input v-model="authFormItem.url" placeholder="请输入URL" type="text"  />
          </Form-item>
          <Form-item label="上级权限">
            <Tree v-if="currAuthIndex === 0" :data="allAuthTreeData"  @on-select-change="authCheckChange"></Tree>
            <Tree v-if="currAuthIndex === 1" :data="reAllAuthTreeData" @on-check-change="handleSelect"  @on-select-change="authCheckChange"></Tree>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="onCancel">
          关闭
        </Button>
        <Button type="primary" size="large"  @click="onSaveAuth" :loading="loading" :disabled="saveDisabled">
          保存
        </Button>
      </div>
    </Modal>
    <!-- 编辑 /-->
    <!-- Modal 新增 /-->
  </div>
</template>

<script>
import '@/assets/styles/tranding.less'
import TableTree from './treeTable'
export default {
  components: {
    TableTree
  },
  data () {
    return {
      editAuthModal: false,
      deleteUserTip: false,
      loading: false,
      modalLoading: false,
      showUserModal: false,
      currAuthIndex: -1,
      saveDisabled: true,
      reqireClassName: '',
      userAuth: [],
      authFormItem: {
        name: '',
        code: '',
        url: '',
        parentId: ''
      },
      authFormValidate: {
        name: [
          {required: true, message: '请输入权限名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入code', trigger: 'blur'}
        ]
      },
      // 列表
      columnsName: [
        {
          title: '权限名称',
          key: 'title'
        },
        {
          title: 'CODE',
          key: 'code'
        },
        {
          title: 'URL',
          key: 'url'
        },
        {
          title: '操作',
          type: 'action',
          actions: [
            {
              type: 'ghost',
              text: '编辑',
              icon: 'edit'
            },
            {
              type: 'ghost',
              text: '删除',
              icon: 'edit'
            }
          ]
        }
      ],
      allAuthTreeData: [],
      reAllAuthTreeData: [],
      authTreeData: []
    }
  },
  watch: {
    authFormItem: {
      handler (val) {
        let name = this.authFormItem.name.trim()
        let code = this.authFormItem.code.trim()
        this.saveDisabled = (name === '' || code === '')
      },
      deep: true
    }
  },
  methods: {
    // 获取全部角色
    getAllAuthTree () {
      this.$api.system.authManage.getAllAuthTree().then((res) => {
        if (res && res.length > 0) {
          this.authTreeData = this.allAuthTreeData = res
        }
      })
    },
    getAuthList () {
      this.loading = true
      if (this.allAuthTreeData.length <= 0) {
        this.$api.system.authManage.getAllAuthTree().then((res) => {
          if (res && res.length > 0) {
            this.allAuthTreeData = res
          } else {
            this.$Message.info(res.message)
          }
        })
      }
      this.loading = false
      this.modalLoading = false
    },
    // 查询列表
    getCheckList () {
      this.modalLoading = true
      this.refresh()
    },
    // 取消
    onCancel () {
      this.editAuthModal = false
      this.authFormItem = {
        name: '',
        code: '',
        url: '',
        parentId: ''
      }
    },
    // 新增角色
    addAuth () {
      this.allAuthTreeData = this.getAllAuthTree()
      this.authFormItem = {
        name: '',
        code: '',
        url: '',
        parentId: ''
      }
      this.editAuthModal = true
      this.currAuthIndex = 0
    },
    // 保存
    onSaveAuth () {
      let saveName = 'createAuth'
      let successTxt = '新增成功'
      if (this.currAuthIndex === 1) {
        saveName = 'updateAuth'
        successTxt = '编辑成功'
      }
      if (this.authFormItem.parentId === '') {
        this.authFormItem.parentId = 0
      }
      this.$api.system.authManage[saveName](this.authFormItem).then((res) => {
        if (JSON.stringify(res) === '0') {
          this.editAuthModal = false
          this.$Message.info(successTxt)
          this.refresh()
        } else {
          this.$Message.info(res.message)
        }
      })
    },
    // 编辑的角色树选中
    authTreeSelected (uid) {
      let authTree = this.authTreeData
      let ele = ''
      let selectFun = (id, rt) => {
        for (var i = 0; i < rt.length; i++) {
          if (parseInt(id) === parseInt(rt[i].id)) {
            // rt[i]['checked'] = true
            ele = rt[i]
          } else {
            if (rt[i].children && rt[i].children.length > 0) {
              selectFun(id, rt[i].children)
            }
          }
        }
        authTree = rt
      }
      selectFun(uid, authTree)
      this.reAllAuthTreeData = authTree
      this.handleSelect(ele)
    },
    handleSelect (ele) {
      ele.expand = true // 设置为展开
      ele.checked = true
    },
    // 刷新页面请求
    refresh () {
      this.getAuthList()
    },
    // 处理树数据
    handleTree (treeData) {
      for (var i = 0; i < treeData.length; i++) {
      }
    },
    // 选中树的值
    authCheckChange (data) {
      this.authFormItem.parentId = data[0].id
    },
    // 点击按钮操作时间
    onRowClick (data, event, index, text) {
      this.selection = {}
      this.selection = data
      if (text === '编辑') {
        this.editorAuth()
      } else if (text === '删除') {
        this.deleteUserTip = true
      }
    },
    // 编辑
    editorAuth () {
      // if (this.allAuthTreeData.length <= 0) {
      //   this.getAllAuthTree()
      // }
      this.$api.system.authManage.getAuthById({uid: this.selection.id}).then((res) => {
        if (res && !res.message) {
          this.authFormItem = res
          this.authFormItem.parentId = res.uid
          this.authTreeSelected(res.uid)
        }
        this.editAuthModal = true
        this.currAuthIndex = 1
      })
    },
    // 删除
    deleteAuth () {
      this.$api.system.authManage.deleteAuth({uid: this.selection.id}).then((res) => {
        this.deleteUserTip = false
        this.selection = {}
        if (res !== null && res === '0') {
          this.$Message.info('删除成功')
          this.refresh()
        } else {
          this.$Message.error(res)
        }
      })
    }
  },
  mounted () {
    this.getAllAuthTree()
  }
}
</script>

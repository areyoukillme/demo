<template>
  <!-- 编辑 -->
  <div class="new-box system-common-box">
    <p slot="header" style="display: none;">
      <Icon type="information-circled"></Icon>
      <span v-if="currModelIndex === 0">新增角色</span>
      <span v-if="currModelIndex === 1">编辑角色</span>
    </p>
    <div>
      <Form :model="roleFormItem" :label-width="100" ref="roleFormItem" :rules="roleFormValidate">
        <Form-item label="角色名" prop="name">
          <Input v-model="roleFormItem.name" placeholder="请输入角色名" type="text" />
        </Form-item>
        <Form-item label="备注">
          <Input v-model="roleFormItem.remark" placeholder="请输入备注" type="text"  />
        </Form-item>
        <Form-item label="权限设定">
          <Tree v-if="currModelIndex === 0" :data="allRoleTreeData" show-checkbox v-model="roleFormItem.remark" multiple  @on-check-change="roleCheckChange"></Tree>
          <Tree v-else :data="reAllRoleTreeData" show-checkbox v-model="roleFormItem.remark" multiple  @on-check-change="roleCheckChange"></Tree>
        </Form-item>
      </Form>
    </div>
    <div class="footer">
      <Button size="large" @click="onCancel">
        返回
      </Button>
      <Button type="primary" size="large"  @click="onSaveRole" :loading="loading" :disabled="saveDisabled" v-if="currModelIndex === 0 || currModelIndex === 1">
        保存
      </Button>
    </div>
  </div>
  <!-- 编辑 /-->
</template>
<script>
export default {
  name: 'systemPopRole',
  props: ['currModelIndex'],
  data () {
    return {
      editRoleModal: false,
      deleteUserTip: false,
      loading: false,
      modalLoading: false,
      showUserModal: false,
      saveDisabled: true,
      delUid: '',
      reqireClassName: '',
      userRole: [],
      allRoleTreeData: [],
      allTreeData: [],
      reAllRoleTreeData: [],
      roleFormItem: {
        name: '',
        remark: '',
        ids: ''
      },
      roleFormValidate: {
        name: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
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
      systemDataList: []
    }
  },
  watch: {
    roleFormItem: {
      handler (val) {
        let name = this.roleFormItem.name ? this.roleFormItem.name.trim() : ''
        this.saveDisabled = name === ''
      },
      deep: true
    }
  },
  methods: {
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
    // 选择
    selectRoleSelection (selection) {
      this.selection = selection
    },
    // 取消
    onCancel () {
      this.allRoleTreeData = []
      this.reAllRoleTreeData = []
      this.roleFormItem = {
        name: '',
        remark: '',
        ids: ''
      }
      this.$emit('on-listen-cancel')
    },
    // 保存
    onSaveRole () {
      let saveName = 'createRole'
      let successTxt = '新增成功'
      if (this.currModelIndex === 1) {
        saveName = 'updateRole'
        successTxt = '编辑成功'
      }
      this.$api.system.roleManage[saveName](this.roleFormItem).then((res) => {
        if (res.returnCode === '0000') {
          this.editRoleModal = false
          this.$Message.info(successTxt)
          this.onCancel()
        } else {
          this.$Message.error(res.returnMsg)
        }
      })
    },
    // 编辑
    editorRole (uid) {
      // this.getAllRoleTree()
      this.reAllRoleTreeData = []
      this.getRoleInfoById(uid)
      this.editRoleModal = true
      this.currModelIndex = 1
    },
    // 获取全部角色
    getAllRoleTree (selectedTag) {
      this.$api.system.roleManage.getAllRoleTree().then((res) => {
        if (res.returnCode === '0000') {
          let allTree = JSON.stringify(res.root.children).replace(/alias/gim, 'title')
          this.allRoleTreeData = JSON.parse(allTree)
        }
      }).then((resp) => {
        if (selectedTag) {
          this.roleTreeSelected()
        }
      })
    },
    // 编辑的角色树选中
    roleTreeSelected () {
      let rolesTree = this.allRoleTreeData
      if (this.roleFormItem.ids === '' || this.roleFormItem.ids === null) {
        return false
      }
      let ids = this.roleFormItem.ids.split(',')
      let selectFun = (id, rt) => {
        for (var i = 0; i < rt.length; i++) {
          if (rt[i].children && rt[i].children.length > 0) {
            selectFun(id, rt[i].children)
          } else {
            if (parseInt(id) === parseInt(rt[i].permId)) {
              rt[i]['checked'] = true
            }
          }
        }
        rolesTree = rt
      }
      for (var k = 0; k < ids.length; k++) {
        selectFun(ids[k], rolesTree)
      }
      this.reAllRoleTreeData = rolesTree
    },

    // 获取用户信息
    getRoleInfoById (uid) {
      this.$api.system.roleManage.getRoleById({uid: uid}).then((res) => {
        if (res) {
          this.roleFormItem = res
          this.roleFormItem.ids = res.permIds
          return true
        }
        return false
      }).then((resp) => {
        if (resp) {
          this.getAllRoleTree(true)
        }
      })
    },
    // 选中树的值
    roleCheckChange (data) {
      var idsArray = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].children === null && data[i].permId !== null) {
          idsArray.push(data[i].permId)
        }
      }
      this.roleFormItem.ids = idsArray.join(',')
    }
  }
}
</script>

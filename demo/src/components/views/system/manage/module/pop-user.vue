<template>
  <div class="trading-order-pay common-inner">
    <!-- 编辑 -->
    <div class="new-box system-common-box">
      <p style="display: none;">
        <span v-if="currModelIndex === 0">新增用户</span>
        <span v-if="currModelIndex === 1">编辑用户</span>
        <span v-if="currModelIndex === 2">查看用户</span>
      </p>
      <div>
        <Form :model="userFormItem" :label-width="100" ref="userFormItem" :rules="userRuleValidate">
          <Form-item label="用户名" v-if="currModelIndex === 0" prop="name">
            <Input v-model="userFormItem.name" placeholder="请输入用户名" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="密码" v-if="currModelIndex === 0" prop="password">
            <Input v-model="userFormItem.password" placeholder="请输入密码" type="password" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="真实名称" required>
            <Input v-model="userFormItem.realName" placeholder="请输入真实名称" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="部门" required>
            <Tree v-if="currModelIndex === 0" class="system-depart-tree" :data="allDepts" @on-select-change="authCheckChange"></Tree>
            <Tree v-if="currModelIndex === 1" class="system-depart-tree" :data="reAllDarpt" @on-select-change="authCheckChange"></Tree>
            <Input v-if="currModelIndex === 2"  placeholder="请输入部门" v-model="userFormItem.deptName" type="text" :disabled="inputDisabled"/>
          </Form-item>
          <Form-item label="备注">
            <Input v-model="userFormItem.remark" placeholder="请输入备注" type="text" :disabled="inputDisabled" />
          </Form-item>
          <Form-item label="邮箱">
            <Input v-model="userFormItem.email" placeholder="请输入邮箱" type="text" :disabled="inputDisabled"/>
          </Form-item>
          <Form-item label="手机" required>
            <Input v-model="userFormItem.mobile" :maxlength="phoneLength" placeholder="请输入手机" type="text" :disabled="inputDisabled"/>
          </Form-item>
          <Form-item label="角色" required>
            <Input v-if="currModelIndex === 2" v-model="userFormItem.roleName" placeholder="-" type="text" :disabled="inputDisabled"/>
            <CheckboxGroup v-model="roleIdList" v-else @on-change="checkRoleIds">
              <Checkbox :label="item.uid" v-for=" (item, index) in userRole" :key="index">
                <span>{{item.name}}</span>
              </Checkbox>
            </CheckboxGroup>
          </Form-item>
        </Form>
      </div>
      <div class="footer">
        <Button size="large" @click="onCancel">
          返回
        </Button>
        <Button type="primary" size="large"  @click="onSaveUser" :loading="loading" :disabled="saveDisabled" v-if="currModelIndex === 0 || currModelIndex === 1">
          保存
        </Button>
      </div>
    </div>
    <!-- 编辑 /-->
    <!-- Modal 新增 /-->
  </div>
</template>

<script>
import '@/assets/styles/tranding.less'
export default {
  name: 'systemPopUser',
  props: ['currModelIndex', 'inputDisabled'],
  data () {
    let auth = this.$store.state.app.menuOptions
    return {
      phoneLength: 11,
      deleteUserTip: false,
      loading: false,
      modalLoading: false,
      showUserModal: false,
      saveDisabled: true,
      deleteUid: '',
      reqireClassName: '',
      optionsAuth: auth,
      userState: [],
      userRole: [],
      allDepts: [],
      popType: 0,
      userableId: '',
      userableStatus: '',
      userFormItem: {
        name: '',
        password: '',
        realName: '',
        deptId: '',
        dept: '',
        remark: '',
        email: '',
        mobile: '',
        status: 'Y',
        roleIdList: '',
        uid: '',
        roleName: ''
      },
      roleIdList: [],
      roleNameList: [],
      userRuleValidate: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
      selection: [],
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
      }
    }
  },
  watch: {
    userFormItem: {
      handler (val) {
        this.checkRequired()
      },
      deep: true
    }
  },
  methods: {
    checkRoleIds (val) {
      this.checkRequired()
    },
    // 取消
    onCancel () {
      this.roleIdList = []
      this.userFormItem = {
        name: '',
        password: '',
        realName: '',
        deptId: '',
        dept: '',
        remark: '',
        email: '',
        mobile: '',
        status: '',
        roleIdList: '',
        uid: '',
        roleNameList: [],
        roleName: ''
      }
      this.$emit('on-listen-refresh')
    },
    // 保存
    onSaveUser () {
      let saveName = 'saveManageUse'
      let successTxt = '新增成功'
      if (this.currModelIndex === 1) {
        saveName = 'editUser'
        successTxt = '编辑成功'
        delete this.userFormItem.name
        delete this.userFormItem.password
      } else if (this.currModelIndex === 0) {
        this.userFormItem.status = 'Y'
      }
      this.userFormItem.roleIdList = this.roleIdList.toString()
      this.$api.system[saveName](this.userFormItem).then((res) => {
        if (res.returnCode === '0000') {
          this.$Message.info(successTxt)
          setTimeout(() => {
            this.$emit('on-listen-refresh')
          }, 800)
        } else {
          this.$Message.error(res.returnMsg)
        }
      })
    },
    // 获取部门
    getDeptsList (dId) {
      this.$api.system.departManage.getDepartList().then((res) => {
        if (res.returnCode === '0000') {
          let allDepts = JSON.stringify(res.list).replace(/name/gim, 'title')
          this.allDepts = JSON.parse(allDepts)
          return dId
        } else {
          this.$Message.error(res.returnMsg)
        }
        return null
      }, (error) => {
        this.$Message.error(error)
      }).then((res2) => {
        if (res2) {
          this.departTreeSelected(res2)
        }
      })
    },
    departTreeSelected (uid) {
      let departTree = this.allDepts
      let selectFun = (id, rt) => {
        for (var i = 0; i < rt.length; i++) {
          if (parseInt(id) === parseInt(rt[i].id)) {
            rt[i]['checked'] = true
            rt[i]['expand'] = true
            rt[i]['selected'] = true
          } else {
            if (rt[i].children && rt[i].children.length > 0) {
              rt[i]['expand'] = true
              rt[i]['checked'] = false
              selectFun(id, rt[i].children)
            }
          }
        }
        departTree = rt
      }
      selectFun(uid, departTree)
      let reAllDarpt = JSON.stringify(departTree).replace(/name/gim, 'title')
      this.reAllDarpt = JSON.parse(reAllDarpt)
    },
    // 获取用户信息
    getUserInfoById (uid) {
      this.$api.system.getUserById({uid: uid}).then((res) => {
        if (res.returnCode === '0000') {
          let json = res
          this.userFormItem = json
          this.userFormItem.roleNameList = []
          let roleIds = res.roleIdList.split(',')
          roleIds.forEach((v, i, o) => {
            this.roleIdList.push(parseInt(v))
          })
          return {roleIds: roleIds, roleNams: json.roleName.split(',')}
        }
        return null
      }).then((res2) => {
        if (res2 && this.userRole.length <= 0) {
          this.getRoleList()
          this.userFormItem.roleNameList = res2.roleNams
        }
      })
    },
    // 获取角色
    getRoleList () {
      this.$api.system.roleManage.selectAllRoles().then((res) => {
        if (res.returnCode === '0000') {
          this.userRole = res.roleList
        } else {
          this.$Message.error(res.returnMsg)
        }
      })
    },
    // 选中树的值
    authCheckChange (data) {
      this.userFormItem.deptId = data[0].id
    },
    checkRequired () {
      let realName = this.userFormItem.realName ? this.userFormItem.realName.trim() : ''
      let deptId = this.userFormItem.deptId
      let phone = this.userFormItem.mobile ? this.userFormItem.mobile : ''
      let roleId = this.roleIdList.toString()
      let cIndex = this.currModelIndex
      this.saveDisabled = true
      if (realName !== '' && deptId !== '' && /^1[3,8]\d{9}$/.test(phone) && roleId !== '') {
        if (cIndex === 0) {
          let name = this.userFormItem.name.trim()
          let psd = this.userFormItem.password.trim()
          if (psd !== '' && name !== '') {
            this.saveDisabled = false
          }
        } else if (cIndex === 1) {
          this.saveDisabled = false
        }
      } else {
        this.saveDisabled = true
      }
    },
    onCancelModel () {
      this.roleIdList = []
    }
  }
}
</script>

<template>
  <div class="new-box system-common-box">
    <p slot="header" style="display: none;">
      <Icon type="information-circled"></Icon>
      <span v-if="currDepartIndex === 0">新增部门</span>
      <span v-if="currDepartIndex === 1">编辑部门</span>
    </p>
    <Form :model="authFormItem" :label-width="100" ref="authFormItem" :rules="authFormValidate">
      <Form-item label="部门名称" prop="name" required>
        <Input v-model="authFormItem.name" placeholder="请输入部门名称" type="text" />
      </Form-item>
      <Form-item label="有无上级部门" prop="hasParent" required>
        <RadioGroup v-model="authFormItem.hasParent">
            <Radio label="有"></Radio>
            <Radio label="无"></Radio>
        </RadioGroup>
      </Form-item>
      <Form-item label="上级部门" prop="parentId" v-show="authFormItem.hasParent === '有'" required>
        <Tree class="system-depart-tree" v-if="currDepartIndex === 0" :data="departDataListTree"  @on-select-change="authCheckChange"></Tree>
        <Tree class="system-depart-tree" v-if="currDepartIndex === 1" :data="reAllAuthTreeData" @on-select-change="authCheckChange"></Tree>
      </Form-item>
    </Form>
    <div class="footer">
      <Button size="large" @click="onCancel">
        返回
      </Button>
      <Button type="primary" size="large"  @click="onSaveDepart" :loading="loading" :disabled="saveDisabled">
        保存
      </Button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['currDepartIndex', 'departDataListTree'],
  data () {
    return {
      loading: false,
      saveDisabled: true,
      authFormItem: {
        name: '',
        parentId: '',
        hasParent: '有'
      },
      authFormValidate: {
        name: [
          {required: true, message: '请输入部门名称', trigger: 'blur'}
        ]
      },
      // 列表
      columnsName: [
        {
          title: '部门名称',
          key: 'name'
        },
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '人数',
          key: 'num',
          type: 'link'
        }
      ],
      reAllAuthTreeData: [],
      authTreeData: []
      // departDataListTree: []
    }
  },
  watch: {
    authFormItem: {
      handler (val) {
        let name = this.authFormItem.name.trim()
        let hasParent = this.authFormItem.hasParent === '有'
        let parentId = hasParent ? this.authFormItem.parentId : ''
        this.saveDisabled = !(((!hasParent) || (hasParent && parentId !== '')) && (name !== ''))
      },
      deep: true
    }
  },
  methods: {
    // 取消
    onCancel () {
      this.authFormItem = {
        name: '',
        parentId: '',
        hasParent: '有'
      }
      this.$emit('on-listen-cancel')
    },
    // 保存
    onSaveDepart () {
      let saveName = 'addDepart'
      let successTxt = '新增成功'
      if (this.currModelIndex === 1) {
        saveName = 'modifyDepart'
        successTxt = '编辑成功'
      }
      if (this.authFormItem.parentId === '' || this.authFormItem.hasParent === '无') {
        this.authFormItem.parentId = 0
      }
      this.$api.system.departManage[saveName](this.authFormItem).then((res) => {
        if (res.returnCode === '0000') {
          this.$Message.info(successTxt)
          setTimeout(() => {
            this.onCancel()
          }, 600)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    // 编辑的角色树选中
    departTreeSelected (id) {
      let departTree = this.departDataListTree
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
      selectFun(id, departTree)
      let departDataListTree = JSON.stringify(departTree).replace(/name/gim, 'title')
      this.reAllAuthTreeData = JSON.parse(departDataListTree)
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
    // 编辑
    editDepart (id) {
      this.$api.system.departManage.getDepartDetail(id).then((res) => {
        if (res.returnCode === '0000') {
          this.authFormItem.name = res.name
          this.authFormItem.id = res.id
          if (res.parentId) {
            this.authFormItem.hasParent = '有'
            this.authFormItem.parentId = res.parentId
          } else {
            this.authFormItem.hasParent = '无'
          }
          return id
        }
        return null
      }).then((res2) => {
        if (res2) {
          this.departTreeSelected(res2)
        }
      })
    }
  }
}
</script>

<template>
  <div class="trading-order-pay common-inner">
    <div v-show="!showPop">
      <!-- 按钮组 -->
      <div class="pay-inner system-depart-button" v-if="this.hasAdd">
        <ButtonGroup v-if="hasAdd">
          <Button type="ghost" size="large" icon="plus-round" @click="addDepart" class="">新增</Button>
        </ButtonGroup>
      </div>
      <!-- 按钮组 /-->
      <Row class="pay-inner">
        <!-- 列表 -->
        <Col span="24">
          <table-tree class="system-table" :items='departDataList' :columns='columnsName' @on-row-click='onRowClick'></table-tree>
        </Col>
        <!-- 列表 /-->
      </Row>
    </div>
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
        <Button type="primary" size="large" long @click="deleteAuth">删除</Button>
      </div>
    </Modal>
    <!-- Modal 新增 /-->
    <pop-depart
        v-if="hasModify || hasAdd" v-show="showPop"
        ref="popDepart"
        :currDepartIndex="this.currDepartIndex"
        :departDataListTree="this.departDataListTree"
        @on-listen-cancel="onCancel">
    </pop-depart>
  </div>
</template>
<script>
import '@/assets/styles/system.less'
import Common from '@/assets/js/common'
import TableTree from './treeTable'
import popDepart from './module/pop-depart'
export default {
  components: {
    TableTree,
    popDepart
  },
  data () {
    let auth = this.$store.state.app.menuOptions
    return {
      showPop: false,
      editAuthModal: false,
      deleteUserTip: false,
      currDepartIndex: -1,
      userAuth: [],
      optionsAuth: auth,
      hasAdd: Common.getOperationAuth('add', auth),
      hasModify: Common.getOperationAuth('modify', auth),
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
      departDataList: [],
      reAllAuthTreeData: [],
      authTreeData: [],
      departDataListTree: []
    }
  },
  methods: {
    initTable () {
      if (Common.getOperationNumber(this.optionsAuth, 'add') > 0) {
        let actionsArray = []
        if (Common.getOperationAuth('modify', this.optionsAuth)) {
          actionsArray.push(
            {
              type: 'ghost',
              text: '编辑',
              code: 'modify',
              icon: 'edit'
            }
          )
        }
        if (Common.getOperationAuth('delete', this.optionsAuth)) {
          actionsArray.push(
            {
              type: 'ghost',
              text: '删除',
              code: 'delete',
              icon: 'edit'
            }
          )
        }
        this.columnsName.push(
          {
            title: '操作',
            type: 'action',
            actions: actionsArray
          }
        )
      }
      this.getDepartList()
    },
    // 查询列表
    getCheckList () {
      this.refresh()
    },
    // 取消
    onCancel () {
      this.showPop = false
      this.getDepartList()
    },
    // 新增部门
    addDepart () {
      this.showPop = true
      this.currDepartIndex = 0
    },
    // 刷新页面请求
    refresh () {
      setTimeout(() => {
        this.getDepartList()
      }, 800)
    },
    // 点击按钮操作时间
    onRowClick (data, event, index, text) {
      this.selection = {}
      this.selection = data
      if (text === '编辑') {
        this.editDepart()
      } else if (text === '删除') {
        this.deleteUserTip = true
      } else if (text === 'link') {
        this.$router.push('/system/manage/user?depart=' + data.name)
      }
    },
    // 编辑
    editDepart () {
      this.showPop = true
      this.currDepartIndex = 1
      this.$refs.popDepart.editDepart(this.selection.id)
    },
    // 删除
    deleteAuth () {
      this.$api.system.departManage.deleteDepart(this.selection.id).then((res) => {
        this.deleteUserTip = false
        this.selection = {}
        if (res.returnCode === '0000') {
          this.$Message.info('删除成功')
          this.refresh()
        } else {
          this.$Message.error(res)
        }
      })
    },
    getDepartList () {
      this.$api.system.departManage.getDepartList().then((res) => {
        if (res.returnCode === '0000') {
          this.departDataList = res.list
          let departDataListTree = JSON.stringify(res.list).replace(/name/gim, 'title')
          this.departDataListTree = JSON.parse(departDataListTree)
        } else {
          this.$Message.error(res.returnMsg)
        }
      })
    }
  },
  mounted () {
    this.initTable()
  }
}
</script>

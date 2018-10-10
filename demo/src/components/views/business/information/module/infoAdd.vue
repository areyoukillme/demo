<template>
   <!-- 新增 -->
    <Row class="new-box">
      <Col span="18">
        <Form :label-width="100" ref="infoFormItem" :model="infoFormItem" :rules="infoFormValidate">
          <FormItem label="业务名称" prop="name">
            <Input v-model="infoFormItem.name" placeholder="请输入业务名称"/>
          </FormItem>
          <FormItem label="业务类型" prop="type">
            <Select v-model="infoFormItem.type">
              <Option v-for="p in businessTypes" :value="p.code" :key="p.code">{{ p.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="支付方式" prop="payMethod">
            <CheckboxGroup v-model="infoFormItem.payMethod">
                <Checkbox class="info-checkbox" v-for="b in payList" :label="b.id" :key="b.id">{{ b.payMethodName }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="标准费率" prop="ratioMode">
                <Select v-model="infoFormItem.ratioMode" @on-change="onChangeUnit">
                  <Option v-for="p in businessRatioMode" :value="p.code" :key="p.code">{{ p.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem :label-width="20" prop="ratio">
                <Input v-model="infoFormItem.ratio" placeholder="请输入标准费率"/>
              </FormItem>
            </Col>
            <Col span="1" class="info-unit">
              <span v-show="this.rateUnit === '1'">元</span>
              <span v-show="this.rateUnit==='2'">%</span>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="收单封顶手续费">
                <Input placeholder="请输入收单封顶手续费" text="text" v-model="infoFormItem.fare"/>
              </FormItem>
            </Col>
            <Col span="1" class="info-unit">元
            </Col>
          </Row>
          <FormItem label="备注">
            <Input type="textarea" :rows="4" placeholder="请输入1-100个字符" v-model="infoFormItem.remark" />
          </FormItem>
          <FormItem>
            <Button size="large" @click="goBack" class="info-back">返回</Button>
            <Button type="primary" size="large" :loading="modal_loading" @click="saveInfo('infoFormItem')">新增</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <!-- 新增 /-->
</template>
<script>
import CommonData from '@/common/data/index'
export default {
  data () {
    return {
      modal_loading: false,
      rateUnit: '1',
      infoFormItem: {
        state: 1,
        ratioMode: '1'
      },
      infoValidate: {},
      payList: [],
      businessTypes: CommonData.businessInforTypes,
      businessRatioMode: CommonData.businessRatioMode,
      infoFormValidate: {
        name: [
          { required: true, message: '业务名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择业务类型', pattern: /^\d+(\.\d{1,2})?$/, trigger: 'change' }
        ],
        payMethod: [
          { required: true, message: '请选择支付方式', type: 'array', min: 1, trigger: 'change' }
        ],
        ratioMode: [
          { required: true, message: '请选择标准费率', trigger: 'change' }
        ],
        ratio: [
          { required: true, message: '请输入标准费率', trigger: 'blur' }
        ],
        remark: [
          { type: 'string', min: 100, message: '备注不超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onChangeUnit (value) {
      this.rateUnit = value.toString()
    },
    // 获取支付类型
    getPaySelectList () {
      this.$api.business.information.getPaySelectList().then((res) => {
        if (res && res.length > 0) {
          this.payList = res
        }
      })
    },
    // 保存新增
    saveInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var params = JSON.parse(JSON.stringify(this.infoFormItem))
          params.payMethod = this.infoFormItem.payMethod.join(',')
          let ratio = this.infoFormItem.ratio
          let ratioMode = this.infoFormItem.ratioMode
          if (ratioMode === '1') {
            ratio = parseFloat(ratio * 100) // 1-单笔固定费率
          } else {
            ratio = parseFloat(ratio / 100) // 2-按交易金额比例
          }
          let fare = this.infoFormItem.fare
          params.ratio = ratio
          if (fare !== '') {
            fare = parseFloat(fare * 100)
            params.ratio = ratio + '_' + fare
          }
          params.state = 1
          setTimeout(() => {
            this.goBack()
          }, 800)
          this.$api.business.information.saveInfo(params).then((res) => {
            if (res === '0') {
              this.$Message.info('新增成功！')
              setTimeout(() => {
                this.goBack()
              }, 800)
            } else {
              this.$Message.error('新增失败')
            }
          })
        }
      })
    },
    goBack () {
      this.infoFormItem = {
        state: 1,
        ratioMode: '1'
      }
      this.$emit('on-back')
    }
  },
  mounted () {
    this.getPaySelectList()
  },
  computed: {
    // saveInfo: (name) => {
    //   this.$refs[name].validate((valid) => {
    //     debugger
    //     if (valid) {
    //       var params = this.infoFormItem
    //       params.payMethod = this.infoFormItem.payMethod.join(',')
    //       let ratio = this.infoFormItem.ratio
    //       let ratioMode = this.infoFormItem.ratioMode
    //       if (ratioMode === '1') {
    //         ratio = parseFloat(ratio * 100) // 1-单笔固定费率
    //       } else {
    //         ratio = parseFloat(ratio / 100) // 2-按交易金额比例
    //       }
    //       let fare = this.infoFormItem.fare
    //       params.ratio = ratio
    //       if (fare !== '') {
    //         fare = parseFloat(fare * 100)
    //         params.ratio = ratio + '_' + fare
    //       }
    //       params.state = 1
    //       console.log(params)
    //       setTimeout(() => {
    //         this.goBack()
    //       }, 800)
    //       this.$api.business.information.saveInfo(params).then((res) => {
    //         if (res === '0') {
    //           this.$Message.info('新增成功！')
    //           setTimeout(() => {
    //             this.goBack()
    //           }, 800)
    //         } else {
    //           this.$Message.error('新增失败')
    //         }
    //       })
    //     }
    //   })
    // }
  }
}
</script>

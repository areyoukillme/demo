<template>
  <div class="funds-manage-provisions common-inner">
    <Row>
      <!-- 条件选择 -->
      <Col span="24">
        <div class="common-inner-div">
          <Form :label-width="150">
            <Row>
              <Col span="8">
                <FormItem label="银联虚拟余额 (元)">
                  <Input v-model="currentMoney" :disabled="true"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                  <FormItem label="DSP需备款总额 (元)">
                    <Input v-model="totalMoney" :disabled="true"/>
                  </FormItem>
              </Col>
              <Col span="3">
                <DatePicker type="date" placeholder="查询时间"  class="date" v-model="currentTime" @on-change="getWithDrawAmount"></DatePicker>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="请输入备款金额 (元)">
                  <InputNumber :min="0" v-model="setMoney" style="width:100%;"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                  <Button type="primary" size="large" :loading="loading" icon="android-upload"  @click="saveMoney">备款</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Col>
      <!-- 条件选择 /-->
    </Row>
  </div>
</template>

<script>
import '@/assets/styles/funds.less'
import Common from '@/assets/js/common'
export default {
  name: 'provision',
  data () {
    return {
      loading: false,
      currentMoney: 0,
      totalMoney: 0,
      currentTime: new Date(),
      setMoney: 0
    }
  },
  methods: {
    getWithDrawAmount: function (date) {
      if (!date) {
        date = new Date()
      }
      this.currentTime = date
      let newDate = Common.getTimeFormat(date, 'YYYYMMDD', 0, false)
      this.$api.funds.getWithDrawAmount({date: newDate}).then((res) => {
        // if (res.code === '0000') {
        //   this.totalMoney = res.amount / 100
        // } else {
        //   this.$Message.error(res.message)
        // }
        this.totalMoney = res.amount / 100
        this.totalMoney = isNaN(this.totalMoney) ? 0 : this.totalMoney
      })
    },
    getTimeBalance: function () {
      this.$api.funds.getRealTimeBalanceQuery().then((res) => {
        if (res.code === '0000') {
          this.currentMoney = res.data.acctBal / 100
        } else {
          this.$Message.error(res.errorMsg)
        }
        this.currentMoney = (isNaN(this.currentMoney) || this.currentMoney == null) ? 0 : this.currentMoney
      })
    },
    saveMoney: function () {
      if (this.setMoney > 0) {
        this.loading = true
        let money = this.setMoney * 100
        this.$api.funds.saveMoney({txnAmt: money}).then((res) => {
          if (res.code === '0000') {
            this.getTimeBalance()
            this.$Message.info('备款已提交，请勿重复操作！')
          } else {
            this.$Message.error('备款提交失败！')
          }
          this.loading = false
        })
      } else {
        this.$Message.error('请输入大于0的备款金额')
      }
    }
  },
  mounted () {
    this.getWithDrawAmount()
    this.getTimeBalance()
  }
}
</script>

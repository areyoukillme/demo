<template>
  <div class=cddata>
    <Row :gutter="20" >
      <Col span="10">
        <FormItem :label="timeLabel">
          <Row class="time"  >
            <Col span="12" style="margin-right:20px">
              <DatePicker type="date" placeholder="建立时间" v-model="bTime" :options="startTimeOptions" @on-change="chooseStartEndTime" style="width:100%"></DatePicker>
            </Col>
            <Col span="12" style="margin-left:20px">
              <DatePicker type="date" placeholder="结束时间" v-model="eTime" :options="endTimeOptions"
               @on-change="chooseStartTime"></DatePicker>
            </Col>
          </Row>
        </FormItem>
      </Col>
      <Col span="13" class="date-time">
        <span @click="getDateChange(0)" v-bind:class="{current: currentIndex === 0}">今天</span>
        <em>|</em>
        <span @click="getDateChange(1)" v-bind:class="{current: currentIndex === 1}">昨天</span>
        <em>|</em>
        <span @click="getDateChange(6)" v-bind:class="{current: currentIndex === 6}">最近7天</span>
        <em>|</em>
        <span @click="getDateChange(29)" v-bind:class="{current: currentIndex === 29}">最近30天</span>
        <!-- <div style="display:inline-block" v-if="timeIsNine == 'true'">
          <em>|</em>
          <span @click="getDateChange(89)" v-bind:class="{current: currentIndex === 89}">最近90天</span>
        </div> -->
        <div style="display:inline-block" v-if="timeIsLast == 'true'">
          <em>|</em>
          <span @click="getDateChange(1, true)" v-bind:class="{current: currentLast === 'last1'}">上个月</span>
          <em>|</em>
          <span @click="getDateChange(2, true)" v-bind:class="{current: currentLast === 'last2'}">上上个月</span>
        </div>
      </Col>
    </Row>
   
   </div> 
</template>
<script>
import Common from '@/assets/js/common'
export default {
  name: 'cDatePicker',
  props: ['label', 'isNine', 'isLast'],
  data () {
    return {
      bTime: '',
      eTime: '',
      timeIsNine: this.isNine || 'true',
      timeIsLast: this.isLast || 'false',
      timeLabel: this.label || '交易时间',
      startTimeOptions: {
        disabledDate: (time) => {
          return time && time.valueOf() > Date.now()
        }
      },
      endTimeOptions: {
        disabledDate: (time) => {
          return time && time.valueOf() > Date.now()
        }
      },
      currentIndex: '',
      currentLast: ''
    }
  },
  methods: {
    chooseStartTime (date) {
      this.startTimeOptions = Common.chooseStartTime(date)
      this.currentIndex = ''
      this.currentLast = ''
      this.$emit('on-change', '0', date)
    },
    // 选择开始的结束时间
    chooseStartEndTime (date) {
      this.endTimeOptions = Common.chooseStartEndTime(date)
      this.currentIndex = ''
      this.currentLast = ''
      this.$emit('on-change', '1', date)
    },
    /*
    * 时间切换
    * @LastMonth: 当给参数表示true时，
    *   num表示的不是天数，而是月数,
    *   当没有给LastMonth值或者false时候，num表示天数
    */
    getDateChange (num, LastMonth) {
      
      let $this = this
      let date = new Date()
      let edate = new Date()
      let now = date.getTime()
      let tempnow = num
      let endNum = 0
      /* 获取当前日期 */
      let nowDay = date.getDate()
      /* 获取当前月份 */
      let nowMonth = date.getMonth() + 1
      if (LastMonth) {
        num = nowDay
        for (let i = 1; i <= tempnow; i++) {
          num += $this.getCountDay(nowMonth - i)
          $this.currentLast = 'last' + i
        }
        num -= 1
        // 结束时间的运算
        endNum = now - (num - $this.getCountDay(nowMonth - tempnow) + 1) * 24 * 60 * 60 * 1000
      }
      // 开始时间的运算
      let beginTime = now - num * 24 * 60 * 60 * 1000
      this.eTime = num === 1 ? new Date(beginTime) : (LastMonth === true ? new Date(endNum) : edate)
      this.$emit('on-change', '0', this.eTime)
      this.bTime = new Date(beginTime)
      this.currentIndex = num
      this.$emit('on-change', '1', this.bTime)
      this.currentLast = LastMonth === true ? this.currentLast : ''
      this.$emit('searchdata')
    },
    clear () {
      this.bTime = ''
      this.eTime = ''
      this.currentIndex = ''
      this.currentLast = ''
    },
    // 判断传入月份有几天
    getCountDay (month) {
      var curDate = new Date()
      var curMonth = month
      curDate.setMonth(curMonth)
      curDate.setDate(0)
      return curDate.getDate()
    }
  }
}
</script>

<template>
  <div>
    <navbar>{{$route.meta.title}}</navbar>
    <div class="div_box" v-if="JSON.stringify(logisticsDeta)!='{}'">
      <div class="box_top">
        <div class="top_left">
          <div class="top_left_img f_pr">
            <img class="fitimg" :src="logisticsDeta.goodsImage">
          </div>
          <span>共{{logisticsDeta.goodsNum}}件</span>
          <span>{{logisticsDeta.expName}} {{logisticsDeta.number}}</span>
        </div>
        <div class="top_rigth">
          <span v-if="logisticsDeta.deliverystatus==0">待收货</span>
          <span v-if="logisticsDeta.deliverystatus==1">运输中</span>
          <span v-if="logisticsDeta.deliverystatus==2">正在派件</span>
          <span v-if="logisticsDeta.deliverystatus==3">已签收</span>
          <span v-if="logisticsDeta.deliverystatus==4">派件失败</span>
        </div>
      </div>
      <!-- 内容 -->
      <div class="content_box">
        <div class="ul">
          <div class="li liwei">
            <div class="time"></div>
            <div class="shou">
              <img class="fitimg img" src="../../assets/shouhuo.png">
            </div>
            <span class="t2">[收货地址]{{logisticsDeta.fullAddr}}</span>
          </div>
          <div class="li" v-for="(x,index) in logisticsDeta.list" :key="index">
            <div class="time">
              <span class="n f_db" :class="index==0?'checked':''">{{x.day}}</span>
              <span class="s f_db">{{x.hour}}</span>
            </div>
            <div class="shou">
              <img
                v-if="index==logisticsDeta.list.length-1"
                class="fitimg img"
                src="../../assets/fahuo.png"
              >
              <img
                v-if="index==0&&logisticsDeta.deliverystatus==3"
                class="fitimg img"
                src="../../assets/shou.png"
              >
            </div>
            <div class="t2">
              <span
                :class="logisticsDeta.deliverystatus==3?'checked':''"
                v-if="logisticsDeta.deliverystatus==3&&index==0"
              >已签收<br/></span>
              <span :class="index==0?'checked':''">{{x.status}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 空 -->
      <div class="null_box"></div>
    </div>
  </div>
</template>

<script>
import navbar from "../../components/common/navbar";
import { getLogisticsDetail } from "../../service/getData";

export default {
  data() {
    return {
      logisticsDeta: {}, //物流详情
      orderId:this.$route.query.orderId, //订单Id
      tokenId:this.$route.query.tokenId,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //获取数据
    async getData() {
      let res = await getLogisticsDetail(this.orderId, this.tokenId);
      if (res.code == 0) {
        this.logisticsDeta = res.result;
        this.logisticsDeta.list.forEach(data => {
          let timearr = data.time
            .replace(" ", ":")
            .replace(/\:/g, "-")
            .split("-");
          data.day = String(timearr[1] + "-" + timearr[2]);
          data.hour = String(timearr[3] + ":" + timearr[4]);
        });
      } else {
        this.$toast(res.msg, 1500);
      }
    }
  },
  components: {
    navbar
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";

.div_box {
  width: 100%;
  /* height: 100%; */
  padding: 0.266666rem 0.4rem 0 0.4rem;
}

.box_top {
  width: 9.2rem;
  height: 1.6rem;
  border-radius: 0.266666rem;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.top_rigth {
  width: 1.573333rem;
  height: 100%;
  background: #2acc85;
  text-align: center;
}

.top_rigth span {
  font-size: 0.32rem;
  color: #fff;
  line-height: 1.6rem;
}

.top_left {
  width: 7.626666rem;
  height: 100%;
  background: #fff;
  padding: 0.306666rem 0 0.4rem 0.306666rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.top_lef span {
  display: inline-block;
  color: #666;
  font-size: 0.32rem;
}

.top_left span:nth-of-type(1) {
  padding-right: 0.826666rem;
  position: relative;
}

.top_left span:nth-of-type(1)::after {
  width: 0.026666rem;
  height: 100%;
  background: #d8d8d8;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: 0.413333rem;
}

.top_left_img {
  width: 0.986666rem;
  height: 0.986666rem;
  margin-right: 0.4rem;
  border-radius: 0.133333rem;
  overflow: hidden;
}

/* 内容 */

.content_box {
  width: 9.2rem;
  /* height: 740; */
  margin-top: 0.266666rem;
  background: #fff;
  border-radius: 0.266666rem;
  padding: 0.533333rem 0.266666rem;
}

.content_box .ul {
  width: 100%;

  /* height: 400; */
  /* background: red; */
}

.content_box .ul .li {
  width: 100%;
  /* height: 66; */ /* background: yellowgreen; */
  font-size: 0.32rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /*align-items: center;*/
  padding-bottom: 0.533333rem;
  position: relative;
  color: #999999;
}

.li .shou {
  width: 0.64rem;
  height: 0.64rem;
  position: relative;
  margin-right: 0.32rem;
  margin-left: 0.17rem;
  z-index: 1;
}
.li span {
  color: #999999;
}
.shou image {
  z-index: 1;
}
.shou::after {
  width: 0.16rem;
  height: 0.16rem;
  background: #d8d8d8;
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  border-radius: 50%;
  /* border-right: 2 dashed #d8d8d8; */
}

.li .time {
  width: 1.066666rem;
  height: 0.853333rem;
  /* background: yellow; */
  display: flex;
  /*justify-content: flex-end;*/
  flex-direction: column;
}

.li .time .n {
  text-align: right;
  font-size: 0.32rem;
  line-height: 0.453333rem;
  margin-bottom: 0.053333rem;
}

.li .time .s {
  text-align: right;
  font-size: 0.266666rem;
  line-height: 0.266666rem;
}

.li .t2 {
  display: block;
  width: 6.72rem;
}

.li::after {
  width: 0.026666rem;
  height: 100%;
  background: #d8d8d8;
  content: "";
  display: block;
  position: absolute;
  top: 0.4rem;
  left: 1.506666rem;
  z-index: 0;
  /* border-right: 2 dashed #d8d8d8; */
}

.liwei::after {
  width: 0.026666rem;
  height: 80%;
  background: none;
  content: "";
  display: block;
  position: absolute;
  top: 0.666666rem;
  left: 1.48rem;
  border-right: 0.026666rem dashed #d8d8d8;
}
.li:last-of-type::after {
  width: 0;
  height: 0;
}

.checked {
  color: #333 !important;
}

.img{
    z-index: 1;
}

.null_box {
  width: 100%;
  height: 1.333333rem;
}
</style>
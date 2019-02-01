<template>
  <div>
    <navbar>{{$route.meta.title}}</navbar>
    <div class="timeHorizon_content">
      <div class="box border_top border_bottom">
        <div class="item border_bottoms f_pr" @click.stop="choose(1)">最近三天
          <div class="choose_box f_pa">
            <img class="f_pa" src="../../assets/limit_choose.png" v-if="limitType==1">
          </div>
        </div>
        <div class="item border_bottoms f_pr" @click.stop="choose(2)">最近半年
          <div class="choose_box f_pa">
            <img class="f_pa" src="../../assets/limit_choose.png" v-if="limitType==2">
          </div>
        </div>
        <div class="item f_pr" @click.stop="choose(3)">全部
          <div class="choose_box f_pa">
            <img class="f_pa" src="../../assets/limit_choose.png" v-if="limitType==3">
          </div>
        </div>
      </div>
      <span class="f_db txt">在选择的时间范围之前发布的农友圈，将对农友不可见</span>
    </div>
  </div>
</template>
<script>
import navbar from "../../components/common/navbar";
import { chooseScopeData } from "../../service/getData.js";

export default {
  data() {
    return {
      limitType: 0, //1为三天,2为半年,3为全部
      tokenId: this.$route.query.tokenId,
    };
  },
  created() {
    this.limitType = this.$route.query.type;
  },
  methods: {
    //选择范围
    async choose(limitType) {
      if (limitType == this.limitType) {
        //防重复点击
        this.$router.go(-1);
        return;
      }
      this.limitType = limitType;
      let frdShowDays = limitType == 3 ? "0" : limitType == 2 ? "180" : "3";
      let res = await chooseScopeData(frdShowDays, "3", this.tokenId);
      if (res.code == 0) {
        this.$router.go(-1);
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

.timeHorizon_content {
  padding-top: 0.4rem;
}

.box {
  padding-left: 0.4rem;
  background: #fff;
  overflow: hidden;
}

.box > div {
  height: 1.2rem;
  font-size: 0.426666rem;
  line-height: 1.173333rem;
  cursor: pointer;
}

.box > div:last-of-type {
  height: 1.173333rem;
}

.txt {
  font-size: 0.373333rem;
  color: #888;
  text-align: center;
  line-height: 0.8rem;
}

.choose_box {
  right: 0;
  top: 0;
  height: 1.173333rem;
  width: 0.853333rem;
}

.choose_box > img {
  width: 0.506666rem;
  height: 0.506666rem;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.border_bottoms {
  border-bottom: 0.08rem solid #f1f1f1;
}
</style>

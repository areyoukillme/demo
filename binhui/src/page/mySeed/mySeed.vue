<template>
  <div>
    <navbar>{{$route.meta.title}}</navbar>
    <div class="mySeed_content" >
      <loadmore :infinite="infinite" :disabled="touchend">
        <div slot="content" class="slot_content">
          <div class="list f_pr" v-for="(item,index) in seedList" :key="index">
            <div class="img">
              <img :src="item.imageUrl">
            </div>
            <div class="name ellipsis">{{item.seedName}}</div>
            <div class="size">
              <span class="icon">X</span>{{item.amount}}
            </div>
          </div>
          <div class="list f_pr" @click.stop="toBuy">
              <div class="img buy f_pr">
              </div>
              <div class="buyBtn">购买种子</div>
          </div>
        </div>
      </loadmore>
    </div>
    <div class="mySeed_bottom">
      <div class="mhb_content" :class="leaseId&&seedList.length>0?'':'disable'">
        <div class="msg" @click.stop="toSow">
          <img src="../../assets/mySeed.png" class="img f_db">
          <span>去播种</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import loadmore from "../../components/common/loadmore";
import navbar from "../../components/common/navbar";
import defaultpage from "../../components/common/defaultpage";
import { getMySeedData } from "../../service/getData";

export default {
  data() {
    return {
      seedList: [], //种子列表数据
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      touchend: false, //没有更多数据
      banRun: true, //禁止初始上啦加载
      page: 1, //当前页数
      limit: 20, //每页大小
      tokenId: this.$route.query.tokenId,
      leaseId:this.$route.query.leaseId,//土地Id
    };
  },
  created() {
    this.getMyseed();
  },
  methods: {
    //获取种子数据
    async getMyseed() {
      let res = await getMySeedData(this.page, this.limit, this.tokenId);
      if (res.code == 0) {
        // console.log(res)
        this.seedList = res.page.list;
        this.banRun = this.seedList.length==0?ture:false;
      } else {
        this.$toast(res.msg, 1500);
      }
    },
    //去播种
    toSow() {
      let self = this;
      if(this.leaseId&&this.seedList.length>0){
          this.$bridge.callhandler('toSow',{leaseId:self.leaseId});
      }
      
    },
    //到达底部加载更多数据
    infinite() {
      this.loaderMore();
    },
    async loaderMore() {
      if (this.banRun) {
        return;
      }
      if (this.touchend) {
        return;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return;
      }
      this.preventRepeatReuqest = true;
      //数据的定位加10位
      this.page++;
      let res = await getMySeedData(this.page, this.limit, this.tokenId);
      this.seedList = [...this.seedList, ...res.page.list];
      //当获取数据小于10，说明没有更多数据，不需要再次请求数据
      if (res.page.list.length < this.limit) {
        this.touchend = true;
        return;
      }
      this.preventRepeatReuqest = false;
    },
    //购买种子
    toBuy(){
      this.$router.push({
        path:'seeds'
      })
    },
  },
  components: {
    loadmore,
    navbar,
    defaultpage
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";

.mySeed_content{
  width: 100%;
  padding: 0 0.266666rem 2.666666rem;
  overflow: hidden;
}
.slot_content {
  overflow: hidden;
  // overflow-x: hidden;
  // overflow-y: scroll;
}
.list {
  margin: 0.266666rem 0 0 2.8%;
  background: #fff;
  width: 31.45%;
  height: 4.266666rem;
  float: left;
  padding: 0.133333rem;
  border-radius: 0.133333rem;
  cursor: pointer;
}
.choose {
  top: -0.053333rem;
  right: 0;
  width: 0.8rem;
  height: 0.8rem;
}
.choose img {
  width: 0.453333rem;
  height: 0.453333rem;
  display: block;
  margin: 0.213333rem 0 0 0.213333rem;
}

.list:nth-of-type(3n-2) {
  margin-left: 0;
}

.list > .img {
  margin: 0 auto 0.133333rem;
  width: 2.693333rem;
  height: 2.666666rem;
  overflow: hidden;
}

.list > .img > img {
  width: auto;
  height: 100%;
  display: block;
}

.name {
  height: 0.64rem;
  line-height: 0.64rem;
  font-size: 0.4rem;
  font-weight: 600;
  word-break: break-all;
  /* display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden; */
}

.size {
  height: 0.533333rem;
  line-height: 0.533333rem;
  font-size: 0.32rem;
  color: #999;
}

.size > .icon {
  color: #999;
  padding: 0 0.026666rem 0 0.026666rem;
  font-size: 18;
}

.mySeed_bottom {
  position: fixed;
  bottom: 0.906666rem;
  left: 50%;
  width: 8.906666rem;
  height: 1.253333rem;
  transform: translateX(-50%);
  background: #2ACC85;
	border-radius: 0.133333rem;
	overflow: hidden;
}

.mhb_content {
  width: 100%;
  height: 100%;
  background: #2acc85;
  display: flex;
  align-items: center;
  justify-content: center;
}


.msg {
  display: inline-block;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.img {
  width: 0.48rem;
  height: 0.48rem;
  margin-right: 0.266666rem;
}

.msg > span {
  font-size: 0.4rem;
  color: #fff;
}

.active > span {
  color: #ffed8b;
}

.buy{
  border: 1px dashed #cacaca;
}

.buy::after{
  width: 1.6rem;
  height: 0.106666rem;
  content: '';
  position: absolute;
  margin: auto;
  left: 0;
  right:0;
  top: 0;
  bottom:0;
  background: #d8d8d8;
}

.buy::before{
  width: 0.106666rem;
  height: 1.6rem;
  content: '';
  position: absolute;
  margin: auto;
  left: 0;
  right:0;
  top: 0;
  bottom:0;
  background: #d8d8d8;
}

.buyBtn{
  border-radius: 1.333333rem;
  margin: 0.373333rem auto 0;
  font-size: 0.37333rem;
  text-align: center;
  line-height: 0.8rem;
  height: 0.8rem;
  width: 2.4rem;
  border: 1px solid #2acc85;
  color: #2acc85;
}

.disable{
  background:#999;
}
</style>

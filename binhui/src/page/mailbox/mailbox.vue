<template>
  <div>
    <navbar>{{$route.meta.title}}</navbar>
    <defaultpage defaultType="mail" v-if="mailList.length==0"></defaultpage>
    <loadmore :infinite="infinite" :disabled="touchend">
      <div slot="content" class="mailBox_content" v-for="(item,index) in mailList" :key="index">
        <div class="item f_pr">
          <span class="title f_db">{{item.title}}</span>
          <span class="detail f_db">{{item.content}}</span>
          <div class="date">{{item.addTime}}</div>
          <!-- <div class="f_tar btn" v-if="item.module==3" bind:tap="tomyFarmLand">去农庄收获</div> -->
          <!-- <div class="f_tar btn" v-if="item.module==4">查看详情</div> -->
        </div>
      </div>
    </loadmore>
  </div>
</template>

<script>
import loadmore from "../../components/common/loadmore";
import navbar from "../../components/common/navbar";
import defaultpage from "../../components/common/defaultpage";
import { getMailListData,havenotice } from "../../service/getData";

export default {
  data() {
    return {
      mailList: [], //信箱列表数据
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      touchend: false, //没有更多数据
      banRun: true, //禁止初始上啦加载
      page: 1, //分页页数
      limit: 20, //每页大小
      tokenId: this.$route.query.tokenId,
    };
  },
  created() {
    //加载数据
    this.getMailList();
  },
	mounted(){
		
	},
  methods: {
    //获取信箱列表数据
    async getMailList() {
      let res = await getMailListData(this.page, this.limit, this.tokenId);
      if (res.code == 0) {
        this.mailList = res.page.list;
        this.banRun = res.page.list.length==0?true:false;
        this.read(res.page.list[0].msgId);
				let id=res.page.list[0].msgId;
				this.$bridge.callhandler('msgId',{"msgId":id})
      } else {
        this.$toast(res.msg, 1500);
      }
    },
    //信箱已读
    async read(msgId){
      let res = await havenotice(msgId, this.tokenId);
        if (res.code == 0) {
        } else {
          this.$toast(res.msg, 1500);
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

      let res = await getMailListData(this.page, this.limit, this.tokenId);
      this.mailList = [...this.mailList, ...res.page.list];
      if (res.page.list.length < this.limit) {
        this.touchend = true;
        return;
      }

      this.preventRepeatReuqest = false;
    }
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
.mailBox_content{
    padding: 0 0.133333rem;
}

.item{
    background: #fff;
    border-radius: 0.133333rem;
    overflow: hidden;
    margin-top: 0.266666rem;
    padding:0 0.266666rem 0.08rem 0.293333rem;
}

.item .title{
    font-size: 0.426666rem;
    font-weight: bold;
    line-height: 0.586666rem;
    height: 0.586666rem;
    margin-top: 0.213333rem;
}

.item .detail{
    font-size: 0.373333rem;
    color: #666;
    line-height: 0.533333rem;
    margin: 0.186666rem 0;
}

.item .detail .userName{
     font-size: 0.373333rem;
    line-height: 0.533333rem;
    color: #2acc85;
}

.item .date{
    font-size: 0.32rem;
    color: #ababab;
    height: 0.426666rem;
    line-height: 0.426666rem;
    margin-bottom: 0.16rem;
}

.item .btn{
    font-size: 0.32rem;
    line-height: 0.453333rem;
    color: #2acc85;
    height: 0.453333rem;
    margin-bottom: 0.213333rem;
}
</style>
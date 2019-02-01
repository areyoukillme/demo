<template>
  <div class="box bgc">
    <navbar>{{$route.meta.title}}</navbar>
    <defaultpage defaultType="suggest" v-if=" historyList.length==0"></defaultpage>
    <loadmore :infinite="infinite" :disabled="touchend">
      <div slot="content" class="friendCollect_content">
        <div class="item" v-for="(item,index) in historyList" :key="index">
          <div class="detail">
            <span class="f_db date">{{item.addTime}}</span>
            <span class="f_db content">{{item.content}}</span>
            <div class="pic_box" v-if="item.items.length>0">
              <img
                class="f_pr pic_item left"  v-for="(y,index) in item.items" :key="index" :src="y.imgUrl" preview
              >
          
            </div>
          </div>
          <span
            class="reply f_db"
            space="nbsp"
            v-if="item.replay!=null && item.replay"
          >回复： {{item.replay}}</span>
        </div>
      </div>
    </loadmore>
  </div>
</template>

<script>
import loadmore from "../../components/common/loadmore";
import navbar from "../../components/common/navbar";
import defaultpage from "../../components/common/defaultpage";
import {
  getSuggestHistoryData
} from "../../service/getData";

export default {
  data() {
    return {
      historyList: [], //反馈记录数据
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      touchend: false, //没有更多数据
      banRun: true, //禁止初始上啦加载
      page: 1, //分页页数
      limit: 20, //每页大小
      tokenId: this.$route.query.tokenId,
    };
  },
  mounted() {
    //加载数据
    this.getSuggestHistoryList().then(function(){
			setTimeout(()=>{
			window.scrollTo(0,1);
			},5)
		});
  },
  methods: {
    //获取反馈记录列表数据
    async getSuggestHistoryList() {
      let res = await getSuggestHistoryData(this.page, this.limit, this.tokenId);
      if (res.code == 0) {
        this.historyList = res.page.list;
        // console.log(this. historyList);
        this.banRun = res.page.list.length==0?true:false;
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

      let res = await getSuggestHistoryData(
        this.page,
        this.limit,
        this.tokenId
      );
      
      this.historyList = [...this.historyList, ...res.page.list];

      //当获取数据小于20，说明没有更多数据，不需要再次请求数据
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

.box{
  min-height: inherit;
}

.item{
    /* margin-top: 20; */
    overflow: hidden;
    background: #fff;
    width: 9.733333rem;
    margin: 0.266666rem auto 0;
    border-radius: 0.133333rem;
    padding: 0 0.266666rem;
}

.item .detail{
    overflow: hidden;
    // padding: 0 0.266666rem;
}

.item .date{
    font-size: 0.373333rem;
    color: #999;
    line-height: 0.533333rem;
    height:0.533333rem;
    margin: 0.186666rem auto 0.213333rem;
}

.item .content{
    font-size: 0.426666rem;
    line-height: 0.533333rem;
    word-wrap: break-word;
    word-break: normal;
    color: #999;
    margin-bottom:0.293333rem; 
}

.item .pic_box{
    overflow: hidden;
    margin-bottom: 0.373333rem;
		z-index: 100;
}

.item .pic_item{
    width: 2.133333rem;
    height: 2.133333rem;
    margin-right: 0.133333rem;
    overflow: hidden;
    background-size: cover !important;
}

.item .reply{
    overflow: hidden;
    padding: 0.266666rem 0;
    /* min-height: 146; */
    font-size: 0.426666rem;
    line-height: 0.533333rem;
    word-wrap: break-word;
    word-break: normal;
    color: #999;
    border-top:solid 0.026666rem #d8d8d8;
}
</style>
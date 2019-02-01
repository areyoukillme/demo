<template>
  <div>
    <navbar type="iosback">{{$route.meta.title}}</navbar>
    <div class="setting_content">
      <div class="box f_pr">
        <div class="f_pr" @click.stop="toSet(1)">
          不让他(她)看我的农友圈
          <img class="arrows f_pa" src="../../assets/mine_arrows.png">
        </div>
        <div class="f_pr" @click.stop="toSet(2)">
          不看他(她)的农友圈
          <img class="arrows f_pa" src="../../assets/mine_arrows.png">
        </div>
        <div class="f_pr" @click.stop="toSet(3)">允许朋友查看农友圈范围
          <span class="right status">{{scope}}</span>
          <img class="arrows f_pa" src="../../assets/mine_arrows.png">
        </div>
        <div class="f_pr" @click.stop="toSet(4)">
          屏蔽的人
          <img class="arrows f_pa" src="../../assets/mine_arrows.png">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navbar from "../../components/common/navbar";
import {getScopeData} from '../../service/getData.js';

export default {
  data() {
    return {
      scope:'',//查看范围文字
      limitType:'',//查看范围类型数字,3全部,2最近半年,1最近三天
      tokenId:this.$route.query.tokenId,
    };
  },
  created() {
    this.getScope();
  },
  methods: {
       //获取查看范围数据
    async getScope(){
        let res = await getScopeData('3',this.tokenId); 
          if(res.code==0){
              this.scope = res.frdShowDays == 0 ? '全部' : (res.frdShowDays == 3 ? '最近三天' : '最近半年');
              this.limitType = res.frdShowDays == 0 ? '3' : (res.frdShowDays == 3 ? '1' : '2');
          }else{
            this.$toast(res.msg,1500)
          }
    },
    //去到设置界面
    toSet(type) {
        switch (type) {
            case 1:
                this.$router.push({path:'setPerson',query:{type:1,tokenId:this.tokenId}});
                break;
            case 2:
                this.$router.push({path:'setPerson',query:{type:2,tokenId:this.tokenId}});
                break;
            case 3:
                this.$router.push({path:'timeHorizon',query:{type:this.limitType}});
                break;
            case 4:
                this.$router.push({path:'hidePerson',query:{tokenId:this.tokenId}});
                break;
            default:
                break;
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

.setting_content{
    padding: 0.266666rem;
}


.box{
    width: 100%;
    overflow: hidden;
    background: #fff;
    border-radius: 0.133333rem;
    padding-left: 0.266666rem;
}

.box>div{
    height: 1.253333rem;
    line-height: 1.173333rem;
    font-size: 0.453333rem;
    color: #333;
    padding-left: 0.133333rem;
    border-bottom: 0.08rem solid #f1f1f1;
    cursor: pointer;
    /* font-weight: 600; */
}

.box>div:last-of-type{
    height: 1.173333rem;
    border-bottom: none;
}

.arrows {
    width: 0.573333rem;
    height: 0.573333rem;
    right: 0.266666rem;
    top: 50%;
    transform: translateY(-50%);
}
.status{
    font-size: 0.373333rem;
    line-height: 1.173333rem;
    color: #999;
    padding-right: 0.853333rem;
}
</style>

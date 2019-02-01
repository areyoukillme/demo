<template>
    <div class="Bbeans_container">
        <!-- 导航栏部分 -->
        <navbar>{{message}}</navbar>
        <div class="list_content">
          <loadmore :infinite="infinite" :disabled="touchend">
            <div slot="content">
              <ul>
                <li v-for="(item) in list">
                   <div class="icon f_pr">
                       <img :src="item.imgRui" alt="" class="fitimg" />
                   </div>
                   <div class="content_r">
                        <div class="txt">{{item.name}}</div>
                        <div class="price">
                            <div class="beans_img"><img :src="imgBaseUrl+'beans.png'" alt="" /></div>
                           <p>{{item.redeemMoney | keepTwoNum}}</p>
                        </div>
                        <div class="b">
                            <div class="progress">
                                <p class="outer"></p>
                                <p class="inner" :style="{width:item.innerW +'%'}"></p>
                            </div>
                            <p v-if="item.diffMoney != 0">差{{item.diffMoney}}</p>
                            <div class="btn" @click="goExchange(item.bgdId)">马上兑换</div>
                            
                        </div>
                   </div>
                </li>
              </ul>
          </div>
        </loadmore>
        </div>
        <div class="footer">
            <div class="head"><img :src="headUrl" alt=""  /></div>
            <div class="txt">已拥有 <span>{{beansNum}}</span><img :src="imgBaseUrl+'beans.png'" alt="" /></div>
            <div class="btn" @click="dChange">兑换记录</div>
        </div>
    </div>
</template>
<script>
    import navbar from '../../components/common/navbar.vue'
    import loadmore from '@/components/common/loadmore';
    import { Toast,MessageBox } from 'mint-ui';
    import {loadMore} from '../../config/mUtils.js';
    import {imgBaseUrl} from '../../config/env.js';
    import {exChangeList,gochange,beansMoney} from '../../service/getData.js';
    export default{
        components:{
          navbar,
          loadmore
        },
        data(){
            return {
                message:'摘豆游戏',
                imgBaseUrl: imgBaseUrl, //图片地址前缀
                beansNum:'',//接收传过来总豆豆
                headUrl:'',//接收头像
                list:[],//兑换列表数据

                page:'1',//页码
                limit:'10',//每页多少条
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                touchend: false, //没有更多数据
                banRun:true,//阻止初始加载
            }
        },
        created(){
          this.beansMoney();
          this.getData();
        },
        methods:{
          //到达底部加载更多数据
          infinite () {
              this.loaderMore();              
          },
          async loaderMore() {
              if(this.banRun){
                  return false;
              }
              if(this.touchend) {
                  return false;
              } 
              //防止重复请求
              if(this.preventRepeatReuqest) {
                  return false;
              }
              this.preventRepeatReuqest = true;
              
              //页码加1
              this.page++;
              let response = await exChangeList(this.page,this.limit);
              this.list = [...this.list,...response.page.list];
              //当获取数据小于10，说明没有更多数据，不需要再次请求数据
              if(response.page.list.length < 10) {
                  this.touchend = true;
                  return false;
              }
              this.preventRepeatReuqest = false;
          },
          //跳转到兑换记录
          async dChange(){
            this.$router.push({
              path:'./conversion'
            })
          },
          //获取列表数据
          async getData(){
            let res = await exChangeList("1",this.limit);
            console.log(res)
            if(res.code == 0) {
                this.list = res.page.list;
                this.banRun = false;
                this.list.forEach((item)=>{
                  if((this.beansNum/item.redeemMoney) > 1 ){
                    this.$set(item,'innerW',100)
                  }else{
                    this.$set(item,'innerW',(this.beansNum/item.redeemMoney)*100)
                  }
                })
            }
          },
          //点击马上兑换触发
          async goExchange(bgdId){
            let res = await gochange(String(bgdId));
            if(res.code == 0){
                Toast('兑换成功');
                this.beansMoney();
                this.getData();
            }else if(res.code == 403){
                Toast('滨惠豆金额不足');
                return false;
            }
          },
          //总金额
          async beansMoney(){
              let res = await beansMoney();
              this.headUrl = res.handerImage;
              this.beansNum = res.beanMoney
          },
        }
    }
</script>
<style scoped>
    @import "beansList.css";
</style>
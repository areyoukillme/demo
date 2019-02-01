<template>
    <div class="conversion_container">
        <!-- 导航栏部分 -->
        <navbar>{{message}}</navbar>
        <div class="conversion_content">
            <loadmore :infinite="infinite" :disabled="touchend">
                <div slot="content">
                    <ul>
                        <li v-for="(item) in list">
                            <div class="li_t">
                                <div class="icon">
                                   <img :src="item.imgRui" alt="" />
                               </div>
                               <div class="content_r">
                                    <div class="txt">{{item.name}}</div>
                                    <div class="b">
                                        <div class="price">
                                            <div class="beans_img"><img :src="imgBaseUrl+'beans.png'" alt="" /></div>
                                           <p>{{item.money | keepTwoNum}}</p>
                                        </div>
                                        <div class="btn" v-if="item.button == 0" @click="mail(item.brdmId)">寄回家</div>
                                        <div class="btn" v-else @click="goDetail(item.orderId)">查看详情</div>
                                    </div>
                               </div>
                            </div>
                           <div class="date">
                               兑换时间：{{item.addTime}}
                           </div>
                        </li>
                   </ul>
                </div>
            </loadmore>
        </div>
    </div>
</template>
<script>
    import navbar from '../../components/common/navbar.vue'
    import loadmore from '@/components/common/loadmore';
    import {imgBaseUrl} from '../../config/env.js';
    import {ChangeList,} from '../../service/getData.js';
    export default {
        components:{
            navbar,
            loadmore
        },
        data(){
            return {
                message:'摘豆游戏',
                imgBaseUrl: imgBaseUrl, //图片地址前缀
                list:[],//兑换记录数据
                
                page:'1',//页码
                limit:'10',//每页条数
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                touchend: false, //没有更多数据
                banRun:true,//阻止初始加载
            }
        },
        created(){
          this.getData();
        },
        methods:{
            //获取列表数据
            async getData(){
                let res = await ChangeList("1",this.limit);
                if(res.code == 0) {
                    this.list = res.page.list; 
                    this.banRun = false;
                }
            },
            //寄回家
            mail(id){
                this.$router.push({
                    path: './addressList',
                    query:{
                        brdmId:id,
                        type:1
                    }
                }) 
            },
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
                let response = await ChangeList(this.page,this.limit);
                this.list = [...this.list,...response.page.list];
                //当获取数据小于10，说明没有更多数据，不需要再次请求数据
                if(response.page.list.length < 10) {
                    this.touchend = true;
                    return false;
                }
                this.preventRepeatReuqest = false;
            },
            //去详情页
            goDetail(orderid){
                this.$router.push({
                    path: './orderDetail',
                    query: {orderId: orderid}
                })
            },
        }
    }
</script>
<style scoped>
    @import "./conversion.css";
</style>
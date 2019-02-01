<template>
    <div class="receive_container">
        <!-- 导航栏部分 v-if="typeHide"-->
        <navbar type="createOrederBack" v-if="typeHide">{{message}}</navbar>
        <navbar v-if="!typeHide">{{message}}</navbar>
        <div class="receive_content">
            <loadmore :infinite="infinite" :disabled="touchend">
                <div slot="content">
                    <ul>
                        <li @click="goDetail(item.orderId)" v-for="(item) in list"  :key="">
                            <div class="img">
                                <img :src="item.orderUri" alt="" />
                            </div>
                            <div class="content">
                                <h1>{{item.orderNum}}</h1>
                                <div class="date">领取时间：{{item.addTimeStr}}</div>
                                <div class="detail">查看详情</div>
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
    import {imgBaseUrl} from '../../config/env.js';
    import loadmore from '@/components/common/loadmore';
    import {receiveList} from '../../service/getData.js';
    export default {
        components: {
            navbar,
            loadmore
        },
        data() {
            return {
                message:'领取记录',
                imgBaseUrl: imgBaseUrl, //图片地址前缀
                list:[],//列表
                typeHide:false,

                page:'1',//页码
                limit:'10',//每页条数
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                touchend: false, //没有更多数据
                banRun:true,//阻止初始加载
            }
        },
        created(){
            this.getData();
            if(this.$route.query.createOrder == 1) {
                this.typeHide = true
            }
        },
        methods:{
            //获取数据
            async getData() {
                let res = await receiveList("1",this.limit);
                if(res.code == 0){
                    this.list = res.page.list;
                    this.banRun = false;
                }
            },
            //去详情页
            goDetail(orderid){
                this.$router.push({
                    path: './orderDetail',
                    query: {orderId: orderid}
                })
            },
            //到达底部加载更多数据
            infinite () {
                this.loaderMore();              
            },
            //滚动加载更多数据
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
                let response = await receiveList(this.page,this.limit);
                this.list = [...this.list,...response.page.list];
                //当获取数据小于10，说明没有更多数据，不需要再次请求数据
                if(response.page.list.length < 10) {
                    this.touchend = true;
                    return false;
                }
                this.preventRepeatReuqest = false;
            },
        },
        mounted(){
            
        }
    }
</script>
<style scoped>
    @import "receive.css";
</style>
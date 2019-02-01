<template>
    <div class="logistics_container">
        <!-- 导航栏部分 -->
        <navbar>{{message}}</navbar>
        <div class='view_box'>
            <div class='box_top'>
                <div class='top_left'>
                    <div class='top_left_img f_pr'>
                        <img class='fitimg' :src="logisticsDeta.goodsImage" alt="" />
                    </div>

                    <span>共{{logisticsDeta.goodsNum}}件</span>
                    <span>{{logisticsDeta.expName}} {{logisticsDeta.number}}</span>
                </div>
                <div class='top_rigth'>
                    <span v-if='logisticsDeta.deliverystatus==0'>待收货</span>
                    <span v-if='logisticsDeta.deliverystatus==1'>运输中</span>
                    <span v-if='logisticsDeta.deliverystatus==2'>正在派件</span>
                    <span v-if='logisticsDeta.deliverystatus==3'>已签收</span>
                    <span v-if="logisticsDeta.deliverystatus==4">派件失败</span>
                </div>
            </div>
            <!-- 内容 -->
            <div class='content_box'>
                <div class='ul'>
                    <div class='li liwei'>
                        <div class='time'></div>
                        <div class='shou'>
                            <img class='fitimg' src="../../assets/gameImg/shouhuo.png" alt="" />
                        </div>
                        <span class='t2'>【收货地址】{{logisticsDeta.fullAddr}}</span>
                    </div>
                    <div class='li' v-for="(item,index) in logisticsDeta.list" :key="">
                        <div class='time'>
                            <span class='n f_db' :class='index == 0 ?"checked":""'>{{item.day}}</span>
                            <span class='s f_db'>{{item.hour}}</span>
                        </div>
                        <div class='shou'>
                            <img class='fitimg' v-if="index == logisticsDeta.list.length-1" src="../../assets/gameImg/fahuo.png" alt="" />
                            <img class='fitimg' v-if="index == 0&&logisticsDeta.deliverystatus==3" src="../../assets/gameImg/shou.png" alt="" />
                        </div>
                        <div class='t2'>
                            <span :class='logisticsDeta.deliverystatus==3?"checked":""' v-if='logisticsDeta.deliverystatus==3&&index==0'>  已签收</span>
                            <span :class='index==0?"checked":""'>{{item.status}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 空 -->
            <div class='null_box'></div>
        </div>
    </div>
</template>
<script>
    import navbar from '../../components/common/navbar.vue'
    import {imgBaseUrl} from '../../config/env.js';
    import {logisticsDetail} from '../../service/getData.js';
    export default {
        components:{
            navbar
        },
        data(){
            return {
                message:'物流信息',
                imgBaseUrl: imgBaseUrl, //图片地址前缀
                logisticsDeta: {}, //物流详情
                orderId:'',//订单Id
            }
        },
        created(){
            this.getPageList();
        },
        methods:{
            async getPageList(){
                let res = await logisticsDetail(this.$route.query.orderId);
                console.log(res)
                if(res.code == 0){
                    res.result.list.forEach((data)=>{
                        let timearr = data.time.replace(" ", ":").replace(/\:/g, "-").split("-");
                        data.day = String(timearr[1] + "-" + timearr[2])
                        data.hour = String(timearr[3] + ":" + timearr[4]) 
                    })
                    this.logisticsDeta = res.result;
                }
            },
            //返回
            back(){
                if (this.$route.query.goindex === 'true') {
                  this.$router.push('/')
                } else {
                  this.$router.back(-1)
                }
            },    
        },
        mounted(){

        }
    }
</script>
<style scoped>
    @import "logistics.css";
</style>
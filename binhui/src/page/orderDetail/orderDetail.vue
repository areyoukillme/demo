<template>
    <div class="order_container">
        <!-- 导航栏部分 -->
        <navbar>{{message}}</navbar>
        <div class='seedsorder_box'>
            <div class='seed_title'>
                <span>{{orderInfo.statusName}}</span>
                <div class='time f_pa' v-if="orderInfo.status == 1">
                    <img class='f_pa' src='../../assets/gameImg/countDown.png' />
                    倒计时：{{countDown}}
                </div>
            </div>
            <div class='address_box' v-if="orderInfo.orderType!=2">
                <div class='site_box orderType' v-if='orderInfo.status!=1&&orderInfo.status==3' @click="gologisticsDetails">
                    <div class='tu_icon'>
                        <img class='s_left fitimg' :src="imgBaseUrl+'/cart_l.png'" />
                    </div>
                    <div class='site_content site_content_m'>
                        <div class='admin'>
                            <span class='stext'>{{orderInfo.logistics.lastExpStatus}}</span>
                        </div>
                        <span class='stime'>{{orderInfo.logistics.time}}</span>
                    </div>
                    <div class='tu_icon f_pr'>
                        <img class='s_rigth fitimg' src='../../assets/gameImg/right@2x.png' />
                    </div>
                </div>
                <div class='site_box' v-if="orderInfo.orderType==1||orderInfo.orderType==5">
                    <div class='tu_icon f_pr'>
                        <img class='s_left fitimg' :src="imgBaseUrl+'/site_icon.png'" />
                    </div>
                    <div class='site_content'>
                        <div class='admin'>
                            <span>收货人：{{orderInfo.orderAddress.userName}}</span>
                            <span>{{orderInfo.orderAddress.mobile}}</span>
                        </div>
                        <span class='address'>收货地址：{{orderInfo.orderAddress.fullAddr}}</span>
                    </div>
                    <div class='tu_icon f_pr'>
                        <!-- <image class='s_rigth fitimg' src='{{imgBaseUrl}}site_left.png'></image> -->
                    </div>
                </div>
            </div>
            <div class='seed_content'>
                <div class='seed_box'>
                    <div class='seed_item' v-for="(pro) in orderInfo.orderSkuList" :key="pro.goodsId">
                        <div class='seed_img f_pr' >
                            <img class='fitimg' :src='pro.goodsImage' />
                        </div>
                        <div class='parameter'>
                            <div class='parameter_top'>
                                <div class='title'>
                                    <span>{{pro.goodsName}}</span>
                                </div>
                                <span class='m'>¥ {{pro.sellPrice}}</span>
                            </div>
                            <div class='parameter_center'>
                                <span>x{{pro.spec}}</span>
                            </div>
                        </div>
                    </div>
                    <div class='shop_m'>
                        <div class='shop_j'>
                            <span>商品总价</span>
                            <span>¥ {{orderInfo.totalPrice}}</span>
                        </div>
                        <div class='shop_j' v-if="orderInfo.orderType==1||orderInfo.orderType==5">
                            <span>运费</span>
                            <span>¥ {{orderInfo.deliveryPrice}}</span>
                        </div>
                    </div>
                </div>
                <div class='shishu'>
                    <span>实付款: </span>
                    <span>¥ {{orderInfo.payPrice}}</span>
                </div>
            </div>
            <div class='tiem_box'>
                <div class='t'>
                    <span>订单编号：{{orderInfo.orderNum}}</span>
                    <span>下单时间：{{orderInfo.addTime}}</span>
                </div>
                <div class='fangshi' v-if="orderInfo.payType!=0">
                    <span class='f_db'>支付方式：{{orderInfo.payType}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import navbar from '../../components/common/navbar.vue';
    import {imgBaseUrl} from '../../config/env.js';
    import {orderDetail} from '../../service/getData.js';
    export default {
        components:{
            navbar
        },
        data(){
            return {
                message:'订单详情',
                imgBaseUrl: imgBaseUrl, //图片地址前缀
                orderInfo: {
                    orderSkuList: [],
                    orderAddress: {},
                    logistics:{}
                },
                countDown: "00:00:00", //倒计时
                time:'',
            }
        },
        created(){
            this.loadOrderDetail();
        },
        methods:{
            //获取数据
            async loadOrderDetail() {
                let res = await orderDetail(this.$route.query.orderId);
                if(res.code == 0){
                    this.orderInfo = res.result,
                    this.time = res.result.countDown;
                    this.formatSecondsTime();
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
            //去物流信息
            gologisticsDetails(){
                this.$router.push({
                    path: '../logistics',
                    query: {orderId: this.$route.query.orderId}
                })
            },
            //将毫秒秒转化为时分秒
            formatSecondsTime() {
                let seconds = 0;
                let minutes = 0;
                let _this = this;
                let second = Math.floor(this.time / 1000) //转换总秒数
                minutes = Math.floor(second / 60) //转换成分钟
                if (minutes < 10) {
                    minutes = '0' + minutes
                }
                seconds = Math.floor(second % 60) //转换成秒
                if (seconds < 10) {
                    seconds = '0' + seconds
                }
                let date = "00:" + minutes + ':' + seconds;
                this.countDown = date;

                let timer = setInterval(() => {
                    second--
                    if (second > 0) {
                        minutes = Math.floor(second / 60) //转换成分钟
                        if (minutes < 10) {
                            minutes = '0' + minutes
                        }
                        seconds = Math.floor(second % 60) //转换成秒
                        if (seconds < 10) {
                            seconds = '0' + seconds
                        }
                        let date = "00:" + minutes + ':' + seconds
                        this.countDown = date
                    }

                }, 1000)
            }
        },
        mounted(){
            
        }
    }
</script>
<style scoped>
    @import "orderDetail.css";
</style>
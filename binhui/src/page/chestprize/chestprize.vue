<template>
    <div class="chestprize_container">
        <!-- 导航栏部分 -->
        <navbar>{{message}}</navbar>
        <div class="chestprize_content">
            <ul>
                <li v-for="(item,index) in list" :key="index">
                    <div class="bgimg">
                        <div class="img_box">
                            <img :src='item.uri'  alt="" />
                        </div>
                        <div class="prize_list">
                            <div class="prize_li">{{item.temp}}</div>
                        </div>
                    </div>
                    <div class="success"><img :src="imgBaseUrl+'/success@2x.png'" alt="" /></div>
                </li>
            </ul>
            <div class="golist">
                <router-link :to='{path:"./receive?createOrder=0"}'>领取记录</router-link>
            </div>
        </div>
        <div class="go_home">
            <div class="btn" @click="mail">寄回家</div>
        </div>
    </div>
</template>
<script>
    import navbar from '../../components/common/navbar.vue'
    import gotop from '../../components/common/gotop.vue';
    import {imgBaseUrl} from '../../config/env.js';
    import {chestList} from '../../service/getData.js';
    import { Toast , MessageBox } from 'mint-ui';
    export default {
        components: {
            gotop,
            navbar
        },
        data() {
            return {
                message:'宝箱奖品',
                imgBaseUrl: imgBaseUrl, //图片地址前缀
                listStr :[],
                list:[],//列表数据
                page: 1, //当前页
                limit: 20, //每页数量
            }
        },
        created(){
            this.chestList();
        },
        methods:{
            //获取宝箱列表
            async chestList() {
                let _this = this;
                let res = await chestList("1",this.limit);
                console.log(res)
                if(res.code == 0){
                    if(res.page.list.length > 0){
                        res.page.list.forEach((item)=>{
                            item.Time = _this.timeFormat(item.addTime);
                            _this.listStr.push(item.Time)
                        })
                    }
                    _this.list = res.page.list
                }     
            },
            //寄回家
            mail(){
                let _this = this;
                let Today = _this.timeFormat(new Date());
                if(_this.list.length == 0){
                    Toast('还没有宝箱奖品哦~');
                    return false;
                }
                if(_this.listStr.indexOf(Today) != -1) {
                    MessageBox.confirm('', { 
                         message: '寄回家后当天就不能再体验答题了哦~', 
                         title: '提示', 
                         confirmButtonText: '【立即前往】', 
                         cancelButtonText: '【放弃答题】' 
                    }).then(action => {
                         if (action == 'confirm') {     //确认的回调
                            this.$router.push({
                                path: './game'
                            }) 
                         }
                     }).catch(err => { 
                         if (err == 'cancel') {     //取消的回调
                            this.$router.push({
                                path: './addressList',
                                query:{
                                    brdmId:'',
                                    type:0
                                }
                            })
                         } 
                    });
                }else{
                    MessageBox.confirm('', { 
                         message: '今日还有未挑战宝箱，请继续答题赢大奖~', 
                         title: '提示', 
                         confirmButtonText: '【立即前往】', 
                         cancelButtonText: '【放弃答题】' 
                    }).then(action => {
                         if (action == 'confirm') {     //确认的回调
                            this.$router.push({
                                path: './game'
                            }) 
                         }
                     }).catch(err => { 
                         if (err == 'cancel') {     //取消的回调
                            this.$router.push({
                                path: './addressList',
                                query:{
                                    brdmId:'',
                                    type:0
                                }
                            })
                         } 
                    });
                }
            },
            // 监听滚动位置
            handleScroll() {
                var scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (scroll > 1000) {
                    this.showTop = true;
                } else {
                    this.showTop = false;
                }
            },
            add0(m){return m<10?'0'+m:m },
            //时间戳转化成时间格式
            timeFormat(timestamp){
              //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
                var time = new Date(timestamp);
                var year = time.getFullYear();
                var month = time.getMonth()+1;
                var date = time.getDate();
                var hours = time.getHours();
                var minutes = time.getMinutes();
                var seconds = time.getSeconds();
                return year+'-'+this.add0(month)+'-'+this.add0(date);
            }
        },
        mounted(){
            window.addEventListener('scroll', this.handleScroll)
        }
    }
</script>
<style scoped>
    @import "chestprize.css";
</style>
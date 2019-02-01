<template>
    <div class="boot_container">
        <div class="bg_img">
            <img src="https://bhmall.zhiyesoft.cn/mp_images/farm/load_bg@2x.png" alt="" />
            <div class="load_btn" @click="goApp">立即下载体验</div>
        </div>
    </div>
</template>
<script>
    import { Toast} from 'mint-ui';
    import {imgBaseUrl} from '../../config/env.js';
    export default {
        data (){
            return {
                imgBaseUrl: imgBaseUrl, //图片地址前缀
            }
        },
        methods:{
            goApp (){
                Toast('跳转到app');
                //window.location.href="https://itunes.apple.com/cn/app/id1221155886?mt=8"  
                var _iframe = document.createElement('iframe');
                _iframe.src = 'https://itunes.apple.com/cn/app/id1447360762?mt=8';
                _iframe.style.display = 'none';
                document.body.appendChild(_iframe);
                setTimeout(function(){
                    document.body.removeChild(_iframe);
                }, 2000);
            }
        }
    }
</script>
<style scoped>
    .boot_container{
        width:100%;
        height:100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .bg_img{
        width:100%;
        height:100%;
    }
    .bg_img img{
        display:block;
        width:100%;
        height:100%;
    }
    .load{
        width:100%;
        height:1.333333rem;
        background-color: #fff;
    }
    .load_btn{
        width:6.666667rem;
        height:1.066667rem;
        line-height:1.066667rem;
        background:#2ACC85;
        color:#fff;
        text-align: center;
        -webkit-border-radius: 0.666667rem;
        border-radius: 0.666667rem;
        position: absolute;
        left:50%;
        bottom:0.266667rem;
        -webkit-transform: translateX(-50%);
           -moz-transform: translateX(-50%);
            -ms-transform: translateX(-50%);
             -o-transform: translateX(-50%);
                transform: translateX(-50%);
    }
</style>
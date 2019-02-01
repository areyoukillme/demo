<template>
    <div class="navbar_content" :class="isIphoneX?'iphoneX':''">
        <div class='navbar_box  ellipsis' :class='isSE?"se":""'>{{message}}
            <span>
                <slot></slot>
            </span>
            <div class='icon' @click.stop='_back'>
                <img src='https://bhmall.zhiyesoft.cn/mp_images/farm/navbar_icon.png' />
            </div>
        </div>
      
    </div>
</template>

<script>
    export default {
        props: {
            type: '',
            message: '',
        },
        created() {

        },
        data() {
            return {
                isIphoneX: '',
                isSE: '',
                content: ''
            }
        },
        methods: {          
            _back(){
                if(this.type=="iosback"){
                    this.$bridge.callhandler('iosback')
                }else if(this.type=="gopay"){
                    this.$bridge.callhandler('gopay')
                }else{
                    this.$router.go(-1)
                }
            }
        },
    
    }
</script>

<style scoped>
    .navbar_content {
        height: 1.706666rem;
        width: 100%;
        background: #fff;
        display: block;
        position:relative;
    }
       
    .navbar_box {
        width: 100%;
        padding: 0 2.933333rem;
        height: 1.706666rem;
        padding-top: 0.533333rem;
        line-height: 1.173333rem;
        font-size: 0.453333rem;
        color: #030303;
        text-align: center;
        font-family: PingFangSC-Regular;
        z-index: 999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .navbar_box>.icon {
        width: 1.333333rem;
        height: 1.173333rem;
        bottom: 0;
        left: 0;
        position: absolute;
    }

    .navbar_box>.icon>img {
        width: 0.48rem;
        height: 0.48rem;
        position: absolute;
        left: 0.266666rem;
        top: 50%;
        transform: translateY(-50%);
    }
    .list_content{
        width:100%;
        height:auto;
        background: #f8f8f8;
        margin-top: 0.133333rem;
        padding:0 0.2rem;
        padding-bottom: 1.333333rem;
    }
    .list_content li{
        display:flex;
        position:relative;
        margin-bottom:0.266667rem;
        background:#fff;
        padding:0.266667rem;
        border-radius: 0.133333rem;
    }
    .icon{
        width:2.666667rem;
        height:2.666667rem;;
        flex:0 0 2.666667rem;
        border-radius: 0.133333rem;
    }
    .icon img{
        display:block;
        width:100%;
        height:100%;
        border-radius: 0.133333rem;
    }
    .se {
        font-size: 0.533333rem;
    }

    .shade {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 2.666666rem;
        z-index: 999;
    }
</style>

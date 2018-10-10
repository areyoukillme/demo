<template>
    <footer>
        <div class="footer-main">
            <div class="main-message">
                <div><img :src="imgsrc" alt=""></div>
                <div v-for="item in list" :key="item.id">
                    <p>{{item.title}}</p>
                    <ul>
                        <li v-for="index in item.ullist"><a href="">{{index}}</a></li>
                    </ul>
                </div>
            </div>
            <div class="main-records">©2018 作者创作作品协议  京ICP证030173号-1 京网文【2013】0934-983号</div>
        </div>
    </footer>
</template>
<script>
    export default{
        data(){
            return{
                imgsrc:'/static/images/wechat.jpg',
                list:[
                    {id:1,title:"客户服务",ullist:["联系我们","法律服务","商务合作"]},
                    {id:2,title:"关于我们",ullist:["公司简介","团队成员","联系方式"]},
                    {id:3,title:"加入我们",ullist:["你是设计师吗","福利待遇","你的能力"]},
                ]

            }
        }
    }

</script>
<style scoped lang="scss">
    footer{
        background:#1c1e20;
        width:100%;
        overflow:hidden;
        .footer-main{
            width:1200px;
            height:240px;
            margin:0 auto;
            .main-message{
                display:flex;
                justify-content:space-around;
                padding-top:20px;
                div{
                    img{
                        width:175px;
                        height:175px;
                    }
                    p{
                        font-size:22px;
                        color:#fff;

                    }
                    li{
                        text-align:center;
                        line-height:30px;
                        a{
                            color:#fff
                        }
                    }
                }
            }
            .main-records{
                color:#fff;
                text-align:center;
            }
        }
    }
</style>
<template>
    <div class="collect_container">
        
		<navbar>答题偷菜</navbar>
        <div class="collect_content">
            <div class="load">
                <div class="logo"><img :src="imgBaseUrl+'/logo@2x.png'" alt="" /></div>
                <div class="txt">
                    <h1>下载APP体验在线耕种乐趣</h1>
                    <div>滨惠智慧农场</div>
                </div>
                <div class="btn">立即打开</div>
            </div>
            <div class="friends">
                <div class="opacity">
                    <div class="friend_content">
                        <h3>已有<span>2位</span>好友助力</h3>
                        <ul>
                            <li>
                                <div class="head_img">
                                    <img src="https://bhmall.zhiyesoft.cn/mp_images/farm/yecaihua.png" alt="" />
                                </div>
                            </li>
                            <li>
                                <div class="head_img">
                                    <img src="https://bhmall.zhiyesoft.cn/mp_images/farm/yecaihua.png" alt="" />
                                </div>
                            </li>
                            <li>
                                <div class="head_img">
                                    <img src="../../assets/gameImg/add.png" alt="" />
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="collect_state" v-if="false">
                        <div class="collect_btn">转发给好友</div>
                        <p>还没有集齐哦！快转给好友吧！</p>
                    </div>
                    <div class="collect_state">
                        <div class="collect_btn">继续答题</div>
                        <p>已经集齐啦！快去APP里继续答题吧！</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {imgBaseUrl} from '../../config/env.js';
	import navbar from '../../components/common/navbar.vue'
    export default {
		components:{navbar},
        data() {
            return {
                imgBaseUrl: imgBaseUrl, //图片地址前缀
            }
        }
    }
</script>
<style scoped>
    @import "collect.css";
</style>
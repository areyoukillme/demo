<template>
	<div class="bg">
		<navbar>我的二维码</navbar>
		<div class="myCode_content">
			<div class='myCode_info f_pr'>
				<div class='userInfo f_pr'>
					<div class='img f_pa'>
						<img mode='aspectFill' class='fitimg tx' :src='userInfo.avatar'></img>
					</div>
					<span class='userName ellipsis f_db'>{{userInfo.userName}}</span>
				</div>
				<div class='code_icon f_pr'>
					<img class='fitimg' :src='userInfo.qrcode'></img>
				</div>
				<span class='txt f_db'>扫一扫上面的二维码图案，加我好友</span>
			</div>
		</div>
	</div>
</template>

<script>
	import {mycode} from '../../service/getData.js'
	import navbar from '../../components/common/navbar.vue'
	export default {
		components:{navbar},
		data() {
			return {
				userInfo: {}, //用户账号信息
			};
		},
		created(){this.getmycode()},
		methods:{
			async getmycode(){
				let res=await mycode();
				if(res.code==0){
					this.userInfo=res.data
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.bg{background: #2E3132;min-height: inherit;}
	.myCode_content{
    width: 100%;
    min-height: 100%;
    background: #2E3132;
    overflow: hidden;
}
.myCode_info{
    width: 8.8rem;
    height: 11.733333rem;
    margin:  2.133333rem  auto auto;
    background: #fff;
    border: 1px solid #979797;
    padding: 0.533333rem;
}

.userInfo{
    height: 1.706666rem;
    padding-left: 1.973333rem;
    overflow: hidden;
    margin-bottom: 0.933333rem;
}

.userName{
    width: 100%;
    font-size: 0.48rem;
    height: 0.666666rem;
    margin-top: 0.16rem;
    line-height: 0.666666rem;
     word-break: break-all;
    /* overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; */
}

.img{
    left: 0;
    width: 1.706666rem;
    height: 1.706666rem;
    border-radius: 0.133333rem;
    overflow: hidden;
	border-radius: 50%;
	overflow: hidden;
}

.code_icon{
    width: 6.8rem;
    height: 6.8rem;
    margin: 0 auto;
}
.tx{width: 100%;height: 100%;object-fit: cover;}
.txt{
    height: 0.373333rem;
    line-height: 0.373333rem;
    font-size: 0.266666rem;
    color: #666;
    margin-top: 0.826666rem;
    text-align: center;
}
</style>

<template>
	<div class="main">
		<!-- 导航栏部分 -->
	    <navbar type="chestPrizeList">{{message}}</navbar>
		<div class="addr_content">
			<div class="address box" v-if="addrList.length == 0">
				<img :src='imgBaseUrl+"/default_address.png"' alt=""  class="address_img img" />
				<span class="tip">还没地址信息，快添加</span>
			</div>
			<div class="addr_item" v:else  v-for='(item,index) in addrList'>
				<div class="select_icon" v-on:click="selectAddr(index)">
					<img :src='imgBaseUrl+"/select_green_icon.png"' v-if='item.isSelect'/>
					<img :src='imgBaseUrl+"/select_white_icon.png"' v-if='!item.isSelect'/>
				</div>
				<div class="addr_info">
					<div class="addr_name">{{item.provName+item.cityName+item.distName}}</div>
					<div class="addr_detail">{{item.address}}</div>
					<div class="user_info">
						<div>{{item.userName}}</div>
						<div>{{item.mobile}}</div>
					</div>
				</div>
				<div class="edit_icon" v-on:click="goAddAddress(index)">
					<img :src="imgBaseUrl+'/edit.png'"/>
				</div>
			</div>
			<button class="sure_btn" v-on:click="confirm()">确定</button>
			<button class="add_btn" v-on:click="goAddAddress()">新增地址</button>
		</div>
	</div>
</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import {imgBaseUrl} from '../../config/env.js';
	import {getAddrList,creatOrder,goHome} from '../../service/getData.js';
	import { Toast } from 'mint-ui';
	export default {
		components:{
            navbar
        },
		data(){
			return {
				message:'选择地址',
				imgBaseUrl:imgBaseUrl,
				addrList:[],//地址列表
				addrId:'',//地址id
				type:'',//用于判断是从哪里进来的 0是偷菜 1是滨惠豆
				brdmId:'',//兑换Id
				count:0
			}
		},
		created(){
			this.getAddrList();
			this.brdmId = this.$route.query.brdmId;
			this.type = this.$route.query.type;
		},
		methods:{
			//获取地址列表
			async getAddrList(){
				let _this=this;
				let res = await getAddrList();
				console.log(res);
				if(res.code==0){
					res.page.forEach(item=>{
						item.isSelect=false;
					})
					this.addrList=res.page;
				}else{
					Toast("获取地址失败，请稍后再试！");
					return false;
				}
			},
			//选择地址
			selectAddr(index){
				this.addrList.forEach(item=>{
					item.isSelect=false;
				})
				this.addrList[index].isSelect = true;
				this.count ++;
				this.addrId = this.addrList[index].addrId;
			},
			//跳转到编辑地址页面
			goAddAddress(index){
				let _this=this;
				if(index!=undefined){//编辑
					this.$router.push({
						path:'/addAdd',
						query:{
							addrId:this.addrList[index].addrId,
							types:'game',
							brdmId:_this.brdmId,
							type:_this.type
						}
					})
				}else{//新增
					this.$router.push({
						path:'/addAdd',
						query:{
							addrId:'',
							types:'game',
							brdmId:_this.brdmId,
							type:_this.type
						}
					})
				}
			},
			//点击确定
			async confirm(){
				if(this.count != 0){
					if(this.type == 0){//0是偷菜 1是滨惠豆
						let res = await goHome(this.addrId);
						if(res.code == 0){
							this.$router.push({
								path:'./receive',
								query:{
									createOrder:1
								}
							})
						}else if(res.code == 400){
							Toast('暂无宝箱奖品~');
							return false;
						}
					}else {
						let res = await creatOrder(String(this.brdmId),this.addrId);
						console.log(res)
						if(res.code == 0) {
							this.$router.push({
								path:'./conversion'
							})
						}else if(res.code == 403){
							Toast('暂无兑换奖品~');
							return false;
						}
					}
				}else{
					Toast('请先选择收货地址~');
					return false;
				}
			}
		}
	}
</script>

<style scoped>
	.main{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #F2F4F8;
	}

	/*主体内容*/
	.box{
		overflow: hidden;
	}
	.address_img {
		margin:1.2rem auto 0.64rem;
	}
	.box>.img{
		display:block;
		width:3.6rem;
        height:2.666667rem;
	}
	.box>.tip{
		font-size:0.426667rem;
		line-height:0.453333rem;
		color:#666;
		font-weight:600;
		text-align:center;
		display:block;
	}
	.addr_content{
		width: 100%;
		padding: 0 0.133333rem 0.4rem;
		background: #F2F4F8;
	}
	
	.addr_item{
		margin-top: 0.133333rem;
		background: #fff;
		border-radius: 0.133333rem;
		display: flex;
		align-items:center;
	}
	
	.select_icon img{
		width: 0.613333rem;
		height: 0.613333rem;
	}
	
	.select_icon{
		margin: 1.066666rem 0.4rem;
	}
	
	.addr_info{
		flex: 1;
	}
	
	.addr_name{
		font-family:  PingFangSC-Medium;
		font-size: 0.426666rem;
		color: #333;
	}
	
	.addr_detail{
		margin-top: 0.066666rem;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #333;
	}
	
	.user_info{
		margin-top: 0.346666rem;
		display: flex;
	}
	
	.user_info div{
		margin-right: 0.306666rem;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color: #C0C0C0;
	}
	
	.edit_icon{
		
	}
	
	.edit_icon img{
		width: 0.48rem;
		height: 0.453333rem;
		margin: 0.44rem;
	}
	
	.sure_btn{
		width: 6.933333rem;
		height: 1.173333rem;
		background: #2ACC85;
		border-radius: 0.693333rem;
		font-family: PingFangSC-Medium;
		font-size: 0.426666rem;
		color: #fff;
		display: block;
		margin: 1.333333rem auto 0;
	}
	.add_btn{
		width: 6.933333rem;
		height: 1.173333rem;
		background: #fff;
		border:0.026666rem solid #2ACC85;
		border-radius: 0.693333rem;
		font-family: PingFangSC-Regular;
		font-size: 0.373333rem;
		color:  #4A4A4A;
		display: block;
		margin: 0.4rem auto 0 auto;
	}
</style>
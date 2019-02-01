<template>
	<div>
		<navbar>赞</navbar>
		<div class="msg_content">
			<div slot='content'>
				<div class='list f_pr' @click.stop='toArticleDetail(item,index)' v-for="(item,index) in msgList" :key="index">
					<!-- 用户头像 -->
					<div class='img f_pa'>
						<img class='fitimg' :src='item.avatar'></img>
					</div>
					<!-- 用户名 -->
					<div class='userName'>
						{{item.userName}}
					</div>
					<!-- 点赞 -->
					<img class='icon f_db' src='../../assets/zanIcon.png'></img>
					<!-- 时间 -->
					<span class='time'>{{item.addTime}}</span>
					<div class='detail f_pa' style='word-break: break-all' v-if="item.pic==null||item.pic == ''">
						{{item.content}}
					</div>
					<div class='detail f_pa' v-else>
						<img class='fitimg' :src='item.pic[0]'></img>
					</div>
				</div>
			</div>
			<defaultpage defaultType='praise'></defaultpage>
			

		</div>
	</div>
</template>

<script>
	import {
		gethonor
	} from '../../service/getData.js'
	import navbar from '../../components/common/navbar.vue'
	import defaultpage from '../../components/common/defaultpage.vue'
	export default {
		components:{navbar,defaultpage},
		data() {
			return {
				msgList: {}, //消息列表数据
				page: "1", //当前页数
				limit: "20", //每页大小
				isLoad: false, //防止重复加载
				total: 0, //总数据
				userId: '', //本地存储用户id
				tip: false, //缺省页
				isShow: false,
				count: 200, //分页组件每页大小
				isLoad: false, //防止重复加载
				tokenId:this.$route.query.tokenId
			};
		},
		created(){this.getMsgList()},
		methods: {
			async getMsgList() {
				let res = await gethonor(this.page,this.limit,this.tokenId)
				if (res.code == 0) {
					this.list = res.pageUtils.list;
					if(this.list){
						this.tip=true;
					}
				}
			}
		}
	}	
</script>

<style scoped>
	

.msg_content {
  /* padding: 0 20px; */
  overflow: hidden;
}

.list {
  width: 100%;
  height: 2.133333rem;
  padding: 0 2.08rem 0 1.733333rem;
  overflow: hidden;
  /* border-radius: 10px; */
  background: #fff;
  margin: 0.133333rem  auto 0;
}

.list:last-of-type {
  border-bottom: none;
}

.img {
  width: 1.253333rem;
  height: 1.253333rem;
  left: 0.133333rem;
  top: 0.24rem;
  background: #eee;
  overflow: hidden;
  border-radius: 100%;
}

.userName {
  font-size: 0.373333rem;
  color: #325489;
  height: 0.533333rem;
  line-height: 0.533333rem;
  margin: 0.266666rem 0 0.053333rem;
  font-weight: bolde;
}

.detail {
  width: 1.6rem;
  height: 1.6rem;
  top: 0.24rem;
  right: 0.133333rem;
  font-size: 0.346666rem;
  line-height: 0.533333rem;
  color: #666;
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.txt {
  font-size: 0.373333rem;
  color: #333;
  line-height: 0.533333rem;
  word-break: break-all;
  /* overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; */
  margin-bottom: 0.053333rem;
}

.time {
  font-size: 0.346666rem;
  color: #666;
  line-height: 0.48rem;
}

.icon{
  width: 0.453333rem;
  height: 0.453333rem;
  margin: 0.106666rem 0 0.08rem;
}

.delcom{
    color: #999;
    background: #f8f8f8;
    font-size: 0.32rem;
}

.tip{
    font-size: 28px;
    color: #999;
    padding-top: 40px;
    text-align: center;
}


</style>

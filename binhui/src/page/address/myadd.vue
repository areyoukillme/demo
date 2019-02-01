<template>
	<div>
		<navbar type="addressback">地址管理</navbar>
		<div>
			<defaultpage :defaultType="addressList.length>0?'':'address'"></defaultpage>
			<div class='content'>
				<div class='list f_pr' v-for="(item,index) in addressList" :key="index" @click.stop='choose(item)'>
					<div class='edit f_pa' @click.stop='toEdit(item)'>
						<img src='../../assets/edit.png'></img>
					</div>
					<div class='home'>{{item.address}}<span class='default f_dib' v-if="item.isDefault==1">默认</span></div>
					<div class='address'>{{item.provName}}{{item.cityName}}{{item.distName}}</div>
					<div class='consignee'>
						<span class='nameadd'>{{item.userName}}</span>{{item.mobile}}</div>
				</div>
			</div>
			<div class='btn' @click='toAdd'>新增地址</div>
	</div>
	</div>
</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import defaultpage from '../../components/common/defaultpage.vue'
	import {
		myadd,
		addInfo
	} from '../../service/getData.js'
	export default {
		components: {
			navbar,
			defaultpage
		},
		data() {
			return {
				addressList: [], //地址列表
				options: {}, //存储url参数对象
				url: '', //跳转路径
				urlType: '', //跳转路径类型
				tokenId: '',
			};
		},
		created() {
			this.tokenId = this.$route.query.tokenId;
			this.myadd()
			
			
		},
		methods: {
			async myadd() {
				let res = await myadd(this.tokenId);
				if (res.code == 0) {
					this.addressList = res.page;
				} else if (res.code != 401) {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					});

				}
			},
			toEdit(item) {
				this.$router.push({
					path: './addAdd',
					query: {
						addrId: item.addrId
					}
				})

			},
			toAdd() {
				this.$router.push({
					path: './addAdd',
					query: {
						addrId: "new"
					}
				})
			},
		
			async choose(item) {
				let res = await addInfo(item.addrId);
				let that=this
				if(res.code==0){
					let data = {
						"userName": res.data.userName,
						"addrId": res.data.addrId,
						"mobile": res.data.mobile,
						"fullAddr": res.data.fullAddr,
					}
					console.log(data)
					that.$bridge.callhandler("backpay",data,(response)=>{
			
					})
				}
				
			}


		}

	}
</script>

<style scoped lang="scss">
	page {
		padding-top: 0.133333rem;
	}

	.content {
		/* margin-top: 10px; */
		width: 9.733333rem;
		overflow: hidden;
		margin: 0 auto;
	}

	.btn {
		text-align: center;
		height: 0.933333rem;
		width: 5.333333rem;
		line-height: 0.933333rem;
		background-color: #2acc85;
		box-shadow: 0px 2px 0.266666rem 0px rgba(0, 183, 103, 0.35);
		border-radius: 0.466666rem;
		font-size: 0.4rem;
		color: #fff;
		margin: 0.986666rem auto 0.986666rem;
	}

	.list {
		width: 100%;
		/* height: 202px; */
		/* border-bottom: 2px solid #eee; */
		padding-left: 0.4rem;
		overflow: hidden;
		background: #fff;
		margin-top: 0.133333rem;
		padding-right: 0.266666rem;
		border-radius: 0.133333rem;
	}

	.list:last-of-type {
		border: none;
	}

	.edit {
		z-index:99;
		width: 2.533333rem;
		height: 2.533333rem;
		top: 50%;
		right: 0.266666rem;
		transform: translateY(-50%);
	}

	.edit img {
		display: block;
		width: 0.533333rem;
		height: 0.533333rem;
		margin: 1rem 0rem 1rem 1.8rem;
	}

	.home {
		width: 8rem;
		font-size: 0.426666rem;
		/* height: 40px; */
		line-height: 0.533333rem;
		font-weight: 600;
		color: #1e1e1e;
		margin-top: 0.32rem;
		word-break: break-all;
	}

	.address {
		font-size: 0.373333rem;
		color: #333;
		line-height: 0.48rem;
		width: 8rem;
		/* height: 36px; */
		margin-top: 0.16rem;
		/* font-weight: 600; */
		word-break: break-all;
	}

	.consignee {
		width: 8rem;
		font-size: 0.373333rem;
		height: 0.48rem;
		line-height: 0.48rem;
		color: #999;
		margin-top: 0.346666rem;
		margin-bottom: 0.346666rem;
	}

	.nameadd {
		padding-right: 0.266666rem;
		display: inline-block;
	}

	.default {
		width: 0.906666rem;
		height: 0.426666rem;
		background-color: #f4da4d;
		border-radius: 0.053333rem;
		font-size: 0.32rem;
		line-height: 0.426666rem;
		vertical-align: middle;
		color: #fff;
		text-align: center;
		margin-bottom: 0.08rem;
		margin-left: 0.266666rem;
	}
</style>

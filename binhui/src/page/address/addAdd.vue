<template>
	<div>
		<navbar>{{title}}</navbar>
		<div>
			<div class='content'>
				<div class='list f_pr '>
					<span class='f_dib txt'>联系人</span>
					<input class='f_dib' placeholder="姓名" required="true" placeholder-style='color:#c1c1c1' maxlength='10' v-model="addressInfo.userName"></input>
				</div>
				<div class='list f_pr '>
					<span class='f_dib txt'>电话</span>
					<input class='f_dib' ref="tel" placeholder="手机" required="true" placeholder-style='color:#c1c1c1'
					 type='tel' bindinput='getPhone' maxlength='11' v-model="addressInfo.mobile"></input>
				</div>
				<div class='list f_pr'>
					<span id="trigger" class="f_db f_pa trigger"></span>
					<span class='f_dib txt'>地址</span>
					<input type="text" required="true" v-model="region" placeholder="地址选择" placeholder-style='color:#c1c1c1'>
				</div>
				<div class='list f_pr'>
					<span class='f_dib txt'>详细地址</span>
					<input class='f_dib' placeholder="例：3号楼203室" placeholder-style='color:#c1c1c1' v-model='addressInfo.address'></input>
				</div>
			</div>
			<div class='default f_pr'>
				设置为默认地址
				<mt-switch v-model="isDefault" class='switch right'></mt-switch>
			</div>
			<div class='default del' v-if="isEdit" @click.stop='toDel' style="cursor: pointer">删除收货地址</div>
			<div class='btn' @click.stop='toSave' style="cursor: pointer">保存</div>
		</div>
	</div>
</template>

<script>
	import MobileSelect from 'mobile-select'
	import navbar from '../../components/common/navbar.vue'
	import {
		province,
		city,
		country,
		addInfo,
		deleteadd,
		saveadd
	} from '../../service/getData.js'

	export default {
		components: {
			navbar
		},
		data() {
			return {
				teldisabled: false,
				addressInfo: {}, //地址信息
				region: [], //默认显示地址
				isDefault: false, //是否设置为默认地址
				isEdit: false, //是否为编辑地址
				isDel: false, //是否删除地址
				options: '', //判断是否从订单界面过来
				title: '', //标题
				type: '',
				addressList: [], //地址数据列表
				selectaddress: false, //是否选择了地址
				province: {
					data: [{
						"id": 1,
						"level": 1,
						"parentId": 0,
						"name": "北京"
					}, {
						"id": 2,
						"level": 1,
						"parentId": 0,
						"name": "上海"
					}, {
						"id": 3,
						"level": 1,
						"parentId": 0,
						"name": "天津"
					}, {
						"id": 4,
						"level": 1,
						"parentId": 0,
						"name": "重庆"
					}, {
						"id": 5,
						"level": 1,
						"parentId": 0,
						"name": "河北"
					}, {
						"id": 6,
						"level": 1,
						"parentId": 0,
						"name": "山西"
					}, {
						"id": 7,
						"level": 1,
						"parentId": 0,
						"name": "河南"
					}, {
						"id": 8,
						"level": 1,
						"parentId": 0,
						"name": "辽宁"
					}, {
						"id": 9,
						"level": 1,
						"parentId": 0,
						"name": "吉林"
					}, {
						"id": 10,
						"level": 1,
						"parentId": 0,
						"name": "黑龙江"
					}, {
						"id": 11,
						"level": 1,
						"parentId": 0,
						"name": "内蒙古"
					}, {
						"id": 12,
						"level": 1,
						"parentId": 0,
						"name": "江苏"
					}, {
						"id": 13,
						"level": 1,
						"parentId": 0,
						"name": "山东"
					}, {
						"id": 14,
						"level": 1,
						"parentId": 0,
						"name": "安徽"
					}, {
						"id": 15,
						"level": 1,
						"parentId": 0,
						"name": "浙江"
					}, {
						"id": 16,
						"level": 1,
						"parentId": 0,
						"name": "福建"
					}, {
						"id": 17,
						"level": 1,
						"parentId": 0,
						"name": "湖北"
					}, {
						"id": 18,
						"level": 1,
						"parentId": 0,
						"name": "湖南"
					}, {
						"id": 19,
						"level": 1,
						"parentId": 0,
						"name": "广东"
					}, {
						"id": 20,
						"level": 1,
						"parentId": 0,
						"name": "广西"
					}, {
						"id": 21,
						"level": 1,
						"parentId": 0,
						"name": "江西"
					}, {
						"id": 22,
						"level": 1,
						"parentId": 0,
						"name": "四川"
					}, {
						"id": 23,
						"level": 1,
						"parentId": 0,
						"name": "海南"
					}, {
						"id": 24,
						"level": 1,
						"parentId": 0,
						"name": "贵州"
					}, {
						"id": 25,
						"level": 1,
						"parentId": 0,
						"name": "云南"
					}, {
						"id": 26,
						"level": 1,
						"parentId": 0,
						"name": "西藏"
					}, {
						"id": 27,
						"level": 1,
						"parentId": 0,
						"name": "陕西"
					}, {
						"id": 28,
						"level": 1,
						"parentId": 0,
						"name": "甘肃"
					}, {
						"id": 29,
						"level": 1,
						"parentId": 0,
						"name": "青海"
					}, {
						"id": 30,
						"level": 1,
						"parentId": 0,
						"name": "宁夏"
					}, {
						"id": 31,
						"level": 1,
						"parentId": 0,
						"name": "新疆"
					}, {
						"id": 32,
						"level": 1,
						"parentId": 0,
						"name": "台湾"
					}, {
						"id": 84,
						"level": 1,
						"parentId": 0,
						"name": "钓鱼岛"
					}, {
						"id": 52993,
						"level": 1,
						"parentId": 0,
						"name": "港澳"
					}]
				},
				city: {
					data: [{
						"id": 72,
						"level": 2,
						"parentId": 1,
						"name": "朝阳区"
					}, {
						"id": 2800,
						"level": 2,
						"parentId": 1,
						"name": "海淀区"
					}, {
						"id": 2801,
						"level": 2,
						"parentId": 1,
						"name": "西城区"
					}, {
						"id": 2802,
						"level": 2,
						"parentId": 1,
						"name": "东城区"
					}, {
						"id": 2803,
						"level": 2,
						"parentId": 1,
						"name": "崇文区"
					}, {
						"id": 2804,
						"level": 2,
						"parentId": 1,
						"name": "宣武区"
					}, {
						"id": 2805,
						"level": 2,
						"parentId": 1,
						"name": "丰台区"
					}, {
						"id": 2806,
						"level": 2,
						"parentId": 1,
						"name": "石景山区"
					}, {
						"id": 2807,
						"level": 2,
						"parentId": 1,
						"name": "门头沟"
					}, {
						"id": 2808,
						"level": 2,
						"parentId": 1,
						"name": "房山区"
					}, {
						"id": 2809,
						"level": 2,
						"parentId": 1,
						"name": "通州区"
					}, {
						"id": 2810,
						"level": 2,
						"parentId": 1,
						"name": "大兴区"
					}, {
						"id": 2812,
						"level": 2,
						"parentId": 1,
						"name": "顺义区"
					}, {
						"id": 2814,
						"level": 2,
						"parentId": 1,
						"name": "怀柔区"
					}, {
						"id": 2816,
						"level": 2,
						"parentId": 1,
						"name": "密云区"
					}, {
						"id": 2901,
						"level": 2,
						"parentId": 1,
						"name": "昌平区"
					}, {
						"id": 2953,
						"level": 2,
						"parentId": 1,
						"name": "平谷区"
					}, {
						"id": 3065,
						"level": 2,
						"parentId": 1,
						"name": "延庆县"
					}]
				},
				country: {
					data: [{
						"id": 2799,
						"level": 3,
						"parentId": 72,
						"name": "三环以内"
					}, {
						"id": 2819,
						"level": 3,
						"parentId": 72,
						"name": "三环到四环之间"
					}, {
						"id": 2839,
						"level": 3,
						"parentId": 72,
						"name": "四环到五环之间"
					}, {
						"id": 2840,
						"level": 3,
						"parentId": 72,
						"name": "五环到六环之间"
					}, {
						"id": 4137,
						"level": 3,
						"parentId": 72,
						"name": "管庄"
					}, {
						"id": 4139,
						"level": 3,
						"parentId": 72,
						"name": "北苑"
					}, {
						"id": 4211,
						"level": 3,
						"parentId": 72,
						"name": "定福庄"
					}]
				},
				provinceId: 1,
				provinceName: '',
				cityId: 72,
				cityName: '',
				countryId: 1,
				countryName: '',
				addrId: '',
				tokenId: '',
				types:'',//是游戏页面过来的

			};
		},
		created() {
			this.tokenId = this.$route.query.tokenId;
			let addrId = this.$route.query.addrId || '';
			this.addrId = addrId;
			this.types = this.$route.query.types; //游戏页面
			this.type = this.$route.query.type;//用于判断是从哪里进来的 0是偷菜 1是滨惠豆
			if (addrId == "new" || addrId == "") {
				this.title = "新增地址"
				this.isEdit = false
				this.addrId = ''
			} else if (addrId) {
				this.title = "编辑地址"
				this.addinfo(addrId)
				this.isEdit = true;
			}

		},
		methods: {
			judgetel() {
				if (!this.isMobile(this.addressInfo.mobile)) {
					this.teldisabled = true;
					this.$toast({
						message: "号码格式错误",
						position: 'center',
						duration: 1500
					})

				} else {
					this.teldisabled = false;
				}
			},
			saveAddressData(picker, values) {},
			//获取省数据
			async getprovince() {
				let res = await province(this.tokenId);
				if (res.code == 0) {
					this.province.data = res.provinceList
					
				}
			},
			//市数据
			async getcity() {
				let res = await city(this.provinceId, this.tokenId);
				if (res.code == 0) {
					this.city.data = res.cityList;
					this.city = Object.assign({}, this.city)

				}
			},
			//区数据
			async getcountry() {
				let res = await country(this.cityId, this.tokenId);
				if (res.code == 0) {
					this.country.data = res.countryList;
					this.country = Object.assign({}, this.country)

				}
			},
			async addinfo(data) {
				let res = await addInfo(data);
				if (res.code == 0) {
					let data = res.data
					this.addressInfo = data
					this.isDefault = data.isDefault == 1 ? true : false;
					this.region = [data.provName, data.cityName, data.distName] //地址
					this.provinceName=data.provName;
					this.provinceId=data.provId;
					this.cityName=data.cityName;
					this.cityId=data.cityId;
					this.countryName=data.distName;
					this.countryId=data.distId;
				} else if (res.code != 401) {
					this.$toast({
						message: res.msg,
						position: 'center',
						duration: 1500
					});
				}

			},
			//删除收货地址
			async deleteadd() {
				let _this = this;
				let res = await deleteadd(this.addrId);
				if (res.code == 0) {
					if(_this.types == 'game'){
						_this.$router.push({
							path: './addressList',
							query:{
								type:_this.type,
								brdmId:_this.$route.query.brdmId
							}
						})
					}else {
						this.$router.push({
							path: './myadd',
							query:{
								deviceType:'ios'
							}
						})
					}
				}
			},
			toDel() {
				this.$messagebox({
					message: '确定要删除该收货地址吗?',
					showCancelButton: true,
					confirmButtonText: '确定',
					canselButtonText: '取消'
				}).then(action => {
					if (action == 'confirm') {
						this.deleteadd()
					} else {
						return
					}
				})
			},
			isMobile(str) {
				if (str == null || str == "") return false;
				let result = str.match(
					"^(13[0-9]|14[1|4|5|6|7|8]|15[0|1|2|3|5|6|7|8|9]|166|17[0|1|3|5|6|7|8]|18[0-9]|19[8|9])\\d{8}$");
				if (result == null) {return };
				
			},
			async toSave() {
				let _this = this;
				if (!this.addressInfo.userName) {
					this.$toast({
						icon: "none",
						message: '请输入联系人！',
						duration: 1500,
						position: 'center'
					})
					return false
				}
				if (!this.addressInfo.mobile) {
					this.$toast({
						icon: "none",
						message: '请输入电话！',
						duration: 1500,
						position: 'center'
					})
					return false
				}
				if(!this.addressInfo.mobile.match("^(13[0-9]|14[1|4|5|6|7|8]|15[0|1|2|3|5|6|7|8|9]|166|17[0|1|3|5|6|7|8]|18[0-9]|19[8|9])\\d{8}$")){
					this.$toast({
						icon: "none",
						message: '电话格式不正确',
						duration: 1500,
						position: 'center'
					})
					return false
				}

				if (!(this.region.length > 0)) {
					this.$toast({
						icon: "none",
						message: '请输入地址！',
						duration: 1500,
						position: 'center'
					})
					return false
				}
				if (!this.addressInfo.address) {
					this.$toast({
						icon: "none",
						message: '请输入详细地址！',
						duration: 1500,
						position: 'center'
					})
					return false
				}


				let res = await saveadd(this.addrId, this.addressInfo.address, this.cityId, this.cityName, this.countryId, this.countryName,
					Number(this.isDefault),
					this.addressInfo.mobile, this.provinceId, this.provinceName, this.addressInfo.userName);
				if (res.code == 0) {
					if(_this.types == 'game'){
						_this.$router.push({
							path: './addressList',
							query:{
								type:_this.type,
								brdmId:_this.$route.query.brdmId,
							}
						})
					}else {
						this.$router.push({
							path: 'myadd',
							query:{
								deviceType:'ios'
							}
						})
					}
				}
			},
		},
		mounted() {
			let that = this;
			that.getprovince().then(that.getcity()).then(that.getcity()).then(function() {
				let mobileSelect = new MobileSelect({
					trigger: "#trigger",
					title: "选择收货地址",
					wheels: [
						that.province,
						that.city,
						that.country
					],
					keyMap: {
						id: 'id',
						value: 'name',
						fontSize: 80
					},
					callback: function(indexArr, data) {
						that.provinceId = data[0].id
						that.cityId = data[1].id
						that.countryId = data[2].id
						that.provinceName = data[0].name
						that.cityName = data[1].name
						that.countryName = data[2].name
						that.region = [data[0].name, data[1].name, data[2].name]
					},
					transitionEnd: function(index, data) {
						//滚蛋到其他位置才加载
						if (that.provinceId != data[0].id) {
							that.provinceId = data[0].id
							that.getcity().then(function() {
								mobileSelect.locatePosition(1, 0)
								mobileSelect.updateWheel(1, that.city.data)
								that.cityId = that.city.data[0].id
							}).then(function() {
								that.getcountry().then(function() {
									mobileSelect.locatePosition(2, 0)
									mobileSelect.updateWheel(2, that.country.data)
								})
							})
						} else if (that.cityId != data[1].id) {
							that.cityId = data[1].id
							that.getcountry().then(function() {
								mobileSelect.locatePosition(2, 0)
								mobileSelect.updateWheel(2, that.country.data)
							})
						} else {
							return
						}

					}
				});
			})
		}

	}
</script>

<style scoped lang="scss">
	.mypicker {
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.addadd {
		margin-top: 0.266666rem;
	}

	.content {
		width: 9.733333rem;
		overflow: hidden;
		padding: 0 0.266666rem;
		background: #fff;
		margin: 0 auto;
		border-radius: 0.133333rem;
	}

	.btn {
		text-align: center;
		height: 1.133333rem;
		width: 7.333333rem;
		line-height: 1.133333rem;
		background-color: #2acc85;
		box-shadow: 0px 2px 0.266666rem 0px rgba(0, 183, 103, 0.35);
		border-radius: 0.56rem;
		font-size: 0.4rem;
		color: #fff;
		margin: 0.986666rem auto 0.986666rem;
	}

	.list {
		width: 100%;
		height: 1.333333rem;
		line-height: 1.333333rem;
		border-bottom: 0.013333rem solid #f1f1f1;
		overflow: hidden;
		font-size: 0px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.list:last-of-type {
		border: none;
		height: 1.333333rem;
	}

	.txt {
		width: 1.92rem;
		font-size: 0.4rem;
		font-weight: 600;
		color: #333;
		line-height: 1.333333rem;
	}

	input {
		font-size: 0.4rem;
		color: #666;
		height: 1.333333rem;
		border: none;
		padding: 0;
		margin: 0;
		width: 7.2rem;
	}

	.default {
		width: 9.733333rem;
		height: 1.333333rem;
		line-height: 1.333333rem;
		font-size: 0.4rem;
		font-weight: 600;
		padding: 0 0.266666rem;
		margin: 0 auto;
		margin-top: 0.4rem;
		background: #fff;
		border-radius: 0.133333rem;

		.switch {
			position: absolute;
			right: 0.2rem;
			top: 50%;
			margin-top: -0.426666rem;
			.mint-switch-core {height: 0.666666rem !important;}
		}

	}

	.del {
		color: #ed0000;
	}
	.trigger{
		width:100%;
		height: 100%;
		left:0;
		top:0;
		z-index:500;
	}
</style>

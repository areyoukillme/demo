<template>
	<div class="main">
		<!-- 导航栏部分 -->
        <navbar>{{message}}</navbar>
		<div class="addr_content">
			<div class="addr_box">
				<div class="addr_li">
					<div>联系人</div>
					<input type="text" placeholder='请输入联系人' v-model="userName" value="userName">
				</div>
				<div class="addr_li">
					<div>电话</div>
					<input type="text" placeholder='请输入电话' v-model="mobile" value="mobile">
				</div>
				<div class="addr_li">
					<div>地址</div>
					<span @click="showPicker()" style="cursor: pointer" v-if="!showAddr">选择收货地址</span>
					<span @click="showPicker()" style="cursor: pointer" v-if="showAddr" class="address">{{address}}</span>
				</div>
				<div class="addr_li">
					<div>详细地址</div>
					<input type="text" placeholder='单元楼层门牌号码等' v-model="detailAddr" value='detailAddr'>
				</div>
			</div>
			<button class="save_btn" @click="saveAddr" style="cursor: pointer">保存</button>
		</div>
		<mt-popup v-model="isShow" position="bottom">
			<div class="picker_bar">
				<div @click="cancel" style="cursor: pointer">取消</div>
				<div @click="confirm" style="cursor: pointer">确定</div>
			</div>
			<mt-picker :slots="slots" @change='onValuesChange'></mt-picker>
		</mt-popup>
	</div>
</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import Vue from 'vue';
	import { Picker, Popup, Toast } from 'mint-ui';
	import Address from '../../assets/js/Address.js';
	import { getProvince, getCity, getCountry, getTown, getAddrInfo, saveAddr } from '../../service/getData.js'
	Vue.component('mt-popup', Popup);
	Vue.component('mt-picker', Picker);
	export default {
		components:{
            navbar
        },
		data() {
			return {
				message:'',//标题
				isShow: false,
				province: [], //省份
				city: [], //城市
				country: [], //区、县
				town: [], //镇
				slots: [], //地址选择器的插槽配置
				addressData: [[],[],[],[]], //地址总数据
				id: [],//选择省市三级的地址id
				address: '', //三级级地址
				showAddr: false,//是否显示地址
				userName:'',//联系人
				mobile:'',//手机号
				detailAddr:'',//详细地址
				addrId:'',//地址列表id
			}
		},
		created() {
			if(this.$route.query.addrId != undefined){
				this.message = '编辑地址';
				this.addrId=this.$route.query.addrId;
				this.getAddrInfo();
				this.setDefault();
			}else{
				this.message = '新增地址';
				this.id=[1, 72, 2799];
				this.setDefault();
			}
		},
		mounted() {
			
		},
		methods: {
			//获取一级地址
			async getProvince() {
				let _this = this;
				let res = await getProvince();
				if(res.code == 0) {
					_this.addressData[0] = res.provinceList;
					res.provinceList.forEach((item,index) => {
						_this.province.push(item.name);
					})
					_this.setSlots(0)
				}
			},
			//获取二级地址
			async getCity() {
				let _this = this;
				let res = await getCity(_this.id[0]);
				if(res.code == 0) {
					_this.addressData[1] = res.cityList;
					_this.city = [];
					res.cityList.forEach((item,index) => {
						_this.city.push(item.name);
					})
					_this.setSlots(1)
				}
			},
			//获取三级地址
			async getCountry() {
				let _this = this;
				let res = await getCountry(_this.id[1]);
				if(res.code == 0) {
					_this.addressData[2] = res.countryList;
					_this.country = [];
					res.countryList.forEach((item,index) => {
						_this.country.push(item.name);
					})
					_this.setSlots(2)
				}
			},
			//获取四级地址
			async getTown() {
				let _this = this;
				let res = await getTown(_this.id[2]);
				if(res.code == 0) {
					_this.addressData[3] = res.townList;
					_this.town = [];
					res.townList.forEach((item,index) => {
						_this.town.push(item.name);
					})
					_this.setSlots(3)
				}
			},
			//获取地址数据
			async getAddrInfo(){
				let _this = this;
				let res = await getAddrInfo(_this.addrId);
				console.log(res)
				if(res.code==0){
					_this.userName=res.data.userName;
					_this.mobile=res.data.mobile;
					_this.address=res.data.provName+','+res.data.cityName+','+res.data.distName;
					_this.detailAddr=res.data.address;
					_this.showAddr=true;
					_this.id=[...res.data.provId,...res.data.cityId,...res.data.distId];
				}
			},
			//保存地址
			async saveAddr(){
				let _this=this;
				let addrName=_this.address.split(',');
				//前端校验
				if(_this.userName==''){
					Toast({
						message:'联系人不能为空！',
						position:'bottom',
						duration:1500
					});
				}else if(_this.mobile==''){
					Toast({
						message:'电话不能为空！',
						position:'bottom',
						duration:1500
					});
				}else if(_this.showAddr==false){
					Toast({
						message:'地址不能为空！',
						position:'bottom',
						duration:1500
					});
				}else if(_this.detailAddr==''){
					Toast({
						message:'详细地址不能为空！',
						position:'bottom',
						duration:1500
					});
				}
				//参数
				let data={
					addrId:_this.addrId,
					userName:_this.userName,
					provId:_this.id[0],
					provName:addrName[0],
					cityId:_this.id[1],
					cityName:addrName[1],
					distId:_this.id[2],
					distName:addrName[2],
					mobile:_this.mobile,
					address:_this.detailAddr,
					isDefault:0
				}
				let res=await saveAddr(data);
				if(res.code==0){
					this.$router.push({
						path:'/addressList'
					})
				}
			},
			//弹出选择器
			showPicker() {
				this.isShow = !this.isShow;
			},
			//选择器值改变时触发
			onValuesChange(picker, val) {
				this.getAddrData(picker, val)
			},
			//获取地址id
			getAddrData(picker, val) {
				let _this = this;
				_this.addressData[0].forEach(item => {
					if(picker.getSlotValue(0) == item.name) {
						if(_this.id[0] != item.id){
							_this.id[0]=item.id;
							_this.city=[];
							_this.setSlots(1)
							_this.getCity();
							return;
						}
					}
				})
				_this.addressData[1].forEach(item => {
					if(picker.getSlotValue(1) == item.name) {
						if(_this.id[1] != item.id){
							_this.id[1]=item.id;
							_this.country=[];			//重设组件内容，以触发change事件
							_this.setSlots(2);
							_this.getCountry();			//获取到的country数组第一个值一样，组件不会触发第二次change事件
							return;
						}
					}
				})
				_this.addressData[2].forEach(item => {
					if(picker.getSlotValue(2) == item.name) {
						if(_this.id[2] != item.id){
							_this.id[2]=item.id;
							return;
						}
					}
				})
			},
			//设置地址的值
			setAddress(){
				let _this=this;
				let addr=[];
				this.addressData.forEach((pitem,pindex)=>{
					pitem.forEach(citem=>{
						if(citem.id==_this.id[pindex]){
							addr.push(citem.name);
						}
					})
				})
				this.address=addr.join(',');
			},
			//配置地址选择器插槽
			setSlots(i) {
				let _this = this;
				switch(i) {
					case 0:
						_this.slots[0].values= _this.province;
						break;
					case 1:
						_this.slots[1].values= _this.city;
						break;
					case 2:
						_this.slots[2].values= _this.country;
						break;
					default:
						break;
				}
			},
			//设置选择器默认数据
			setDefault(){
				this.slots=[{
					flex: 1,values: this.province,textAlign: 'center'
				},{
					flex: 1,values: this.city,textAlign: 'center'
				},{
					flex: 1,values: this.country,textAlign: 'center'
				}]
				this.getProvince()
				this.getCity()
				this.getCountry()
			},
			//取消
			cancel() {
				this.isShow = false;
			},
			//确定
			confirm() {
				this.setAddress();
				this.isShow = false;
				this.showAddr = true;
			},
		},
		
	}
</script>

<style scoped>
	.main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #F2F4F8;
	}
	/*主体内容*/
	
	.addr_content {
		padding: 0.133333rem;
		width: 100%;
		background: #F2F4F8;
	}
	
	.addr_box {
		padding: 0.066666rem;
		width: 100%;
		background: #fff;
		border-radius: 0.133333rem;
	}
	
	.addr_li {
		height: 1.333333rem;
		border-bottom: 0.013333rem solid #EEEEEE;
		display: flex;
		align-items: center;
	}
	
	.addr_li:last-child {
		border: none;
	}
	
	.addr_li div {
		font-family: PingFangSC-Semibold;
		font-size: 0.4rem;
		font-weight: 600;
		margin-left: 0.173333rem;
		color: #333333;
		letter-spacing: 0;
		text-align: justify;
		flex: 1;
	}
	
	.addr_li input {
		padding: 0.133333rem;
		font-family: PingFangSC-Regular;
		font-size: 0.4rem;
		color: #666666;
		letter-spacing: 0;
		text-align: justify;
		flex: 4;
	}
	
	.addr_li input::-webkit-input-placeholder {
		color: #C4C4C4;
	}
	
	.addr_li span {
		padding: 0.133333rem;
		font-family: PingFangSC-Regular;
		font-size: 0.4rem;
		color: #C4C4C4;
		letter-spacing: 0;
		text-align: justify;
		flex: 4;
	}
	
	.addr_li span.address {
		color: #666;
	}
	
	.save_btn {
		background: #2ACC85;
		width: 6.933333rem;
		height: 1.173333rem;
		border-radius: 0.693333rem;
		font-family: PingFangSC-Medium;
		font-size: 0.426666rem;
		color: #fff;
		display: block;
		margin: 1.466666rem auto 0 auto;
	}
	
	.picker_bar {
		height: 1.066666rem;
		padding: 0 0.666666rem;
		border-bottom: 0.013333rem solid #EEEEEE;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.picker_bar div {
		font-family: PingFangSC-Medium;
		font-size: 0.4rem;
	}
</style>
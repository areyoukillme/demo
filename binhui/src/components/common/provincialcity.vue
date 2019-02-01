<!--居住地址三级联动选项-->
<template>
	<section class="showChose" v-show="showChose">
		<div class="showChose_bg" @touchmove.prevent @click.self="closeAdd"></div>
		<transition name="slide-fade">
			<section class="address" v-show="showChose">
				<section class="title f_tac">
					<img class="f_pa" src="../../images/close_alert.png" @click="closeAdd">
					所在地区
				</section>
				<dl class="note_title clear">
					<dt class="left f_pr" @click="provinceSelected()">{{Province?Province:initProvinceName}}</dt>
					<dt class="left f_pr" @click="citySelected()" :class="City?'':'active'">{{City?City:'请选择'}}</dt>
					<dt class="left f_pr" @click="districtSelected()" :class="District?'':'active'" v-show="City">{{District?District:'请选择'}}</dt>
					<dt class="left f_pr" @click="townSelected()" :class="Townb?'':'active'" v-show="District&&showTown">{{Townb?Townb:'请选择'}}</dt>
				</dl>
				<ul class="addList">
					<li class="f_pr" v-for="(v,k) in info" @click="getProvinceId(v.id, v.name, k)" v-show="showProvince" :class="v.selected ? 'active' : ''">{{v.name}}</li>
					<li class="f_pr" v-for="(v,k) in showCityList" @click="getCityId(v.id, v.name, k)" v-show="showCity" :class="v.selected ? 'active' : ''">{{v.name}}</li>
					<li class="f_pr" v-for="(v,k) in showDistrictList" @click="getDistrictId(v.id, v.name, k)" v-show="showDistrict" :class="v.selected ? 'active' : ''">{{v.name}}</li>
					<li class="f_pr" v-for="(v,k) in showTownList" @click="getTownId(v.id, v.name, k)" v-show="showTown" :class="v.selected ? 'active' : ''">{{v.name}}</li>
				</ul>
			</section>
		</transition>
	</section>
</template>

<script>
	import { jingdongAddressOneData,jingdongAddressSecondData,jingdongAddressThirdData,jingdongAddressFourthData } from '../../service/getData'
	
	export default {
		name: 'myAddress',
		data() {
			return {
				//显示参数
				showProvince: true,
				showCity: false,
				showDistrict: false,
				showTown:false,
				//列表数据
				info:[],//省数据
				showCityList: [],//市数据
				showDistrictList: [],//区数据
				showTownList:[],//镇数据
				//初始化省市区编码
				provinceCode: null,
				cityCode: null,
				districtCode: null,
				townCode:null,
				//显示省市区tab
				District: false,
				Province: false,
				City: false,
				Townb:false,
				// v-for循环判断是否为当前
				selected: false,
				//初始省名
				initProvinceName:null,
				//传递至给父组件
				regionMsg:null,		
				townValue:''
			}
		},
		created(){
			this.userAddress();
		},
		methods: {
			//获取省市区
			async userAddress(){				
				let response=await jingdongAddressOneData();
				if(response.status===200){
					this.info=response.data;
					this.initProvinceName=this.info[0].name;
					this.provinceCode=this.info[0].id;
				}else{
					this.$toast(response.msg, 1500);
				}
			},
			//关闭省市区弹窗
			closeAdd() {
				this.$emit('closeAdd');
			},
			//数据筛选
			async _filter(api , code) {
				let result =[];
				let response=await api(code);
				if(response.status==200){
					result=response.data;					
				}
				return result;
			},
			//获取省ID加载对应的城市数据
			getProvinceId(code, input, index) {
				this.provinceCode = code;
				this.Province = input;
				this.showProvince = false;
				this.showCity = true;
				this.showDistrict = false;
				this.showTown=false;
				this._filter(jingdongAddressSecondData, this.provinceCode).then((r)=>{
					this.showCityList=r;
				});
//				console.log(this.showCityList);
				// 点击选择当前
				this.info.map(a => a.selected = false);
				this.info[index].selected = true;
			},
			//获取市ID加载对应的区数据
			getCityId(code, input, index) {
				this.cityCode = code;
				this.City = input;
				this.showProvince = false;
				this.showCity = false;
				this.showDistrict = true;
				this.showTown=false;
				this._filter(jingdongAddressThirdData, this.cityCode).then((r)=>{
					this.showDistrictList=r;
				});
				// 选择当前添加active
				this.showCityList.map(a => a.selected = false);
				this.showCityList[index].selected = true;
			},
			//获取区ID加载对应的镇数据
			getDistrictId(code, input, index) {
				this.districtCode = code;
				this.District = input;
				this.showProvince = false;
				this.showCity = false;
				this.showDistrict = true;
				this._filter(jingdongAddressFourthData, this.districtCode).then((r)=>{
					this.showTownList=r;
					if(this.showTownList.length>0){
						this.showDistrict = false;
						this.showTown=true;
					}else{
						this.townCode=0;
						this.townValue='';
						//传递编码给父组件
						this.setCodeToFather();
					}
				});
				// 选择当前添加active
				this.showDistrictList.map(a => a.selected = false);
				this.showDistrictList[index].selected = true;
			},
			//获取镇ID
			getTownId(code, input, index){
				this.townCode=code;
				this.Townb=input;
				this.townValue=this.Townb;
				// 选择当前添加active
				this.showTownList.map(a => a.selected = false);
				this.showTownList[index].selected = true;
				//传递编码给父组件
				this.setCodeToFather();
			},
			//传递编码给父组件
			setCodeToFather(){
				this.regionMsg={
					name:this.Province+''+this.City+''+this.District+''+this.townValue,
					proCode:this.provinceCode,
					cityCode:this.cityCode,
					distCode:this.districtCode,
					four:this.townCode
				},
				// console.log(this.regionMsg);
				//给父组件传值
				this.$emit('listenSelect',this.regionMsg);
				// 选取市区选项之后关闭弹层
				this.closeAdd();
			},
			//头部选择
			provinceSelected() {
				// 清除市级和区级列表
				this.showCityList = [];
				this.showDistrictList = [];
				this.showTownList=[];
				// 清除市级和区级选项
				this.City = false;
				this.District = false;
				this.Townb=false;
				// 选项页面的切换
				this.showProvince = true;
				this.showCity = false;
				this.showDistrict = false;
				this.showTown=false;
			},
			citySelected() {
				// 清除市级和区级选项
				this.District = false;
				this.Townb=false;
				// 选项页面的切换
				this.showProvince = false;
				this.showCity = true;
				this.showDistrict = false;
				this.showTown=false;
			},
			districtSelected() {
				// 清除市级和区级选项
				this.Townb=false;
				// 选项页面的切换
				this.showProvince = false;
				this.showCity = false;
				this.showDistrict = true;
				this.showTown=false;
			},
			townSelected(){
				this.showProvince = false;
				this.showCity = false;
				this.showDistrict = false;
				this.showTown=true;
			}
		},
		props: ['showChose']
	}
</script>

<style lang="scss" scoped>
	@import '../../style/mixin';
	.showChose {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 101;
	}
	
	.showChose_bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 102;
		background: rgba(0, 0, 0, 0.2);
	}
	
	.address {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 103;
		background: #fff;
		width: 100%;
		height: 9.333333rem;
		>.title{
			font-size: 0.426666rem;
			height: 1.173333rem;
			line-height: 1.173333rem;
			>img {
				width: 0.533333rem;
				height: 0.533333rem;
				top: 0.32rem;
				right: 0.4rem;
				z-index: 99;
			}
		}
	}
	/* 设置持续时间和动画函数 */
	
	.slide-fade-enter-active {
		transition: all .3s ease;
	}
	
	.slide-fade-leave-active {
		transition: all all .3s ease;
	}
	
	.slide-fade-enter {
		transform: translateY(10.666666rem);
		opacity: 0;
	}
	
	.note_title{
		width: 100%;
		height: 1.333333rem;
		padding-left:0.8rem;
		>dt{
			font-size: 0.373333rem;
			line-height: 1.333333rem;
			padding: 0 0.053333rem;
			margin-left: 0.266666rem;
		}
		>dt:nth-of-type(1){
			margin-left: 0;
		}
		>dt.active{
			color: #ed0000;
			font-size: 0.4rem;
		}
		>dt.active:after{
			content: "";
			position: absolute;
			width: 100%;
			height: 1px;
			background: #ed0000;
			left: 0;
			bottom:0.266666rem;
			
		}
	}
	
	.addList{
		width: 100%;
		height: 6.666666rem;
		padding: 0 0.533333rem;
		padding-left: 0.8rem;
		padding-bottom: 0.266666rem;
		overflow: hidden;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		>li{
			font-size: 0.346666rem;
			line-height: 0.8rem;
		}
		>li.active{
			color: #ed0000;
			font-size: 0.4rem;
		}
	}
	
	
	
	
	
</style>
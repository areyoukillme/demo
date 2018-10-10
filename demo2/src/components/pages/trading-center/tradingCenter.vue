<template>
	<div id="example">
		<el-select v-model="firstSelect" @change="selectClass"  placeholder="请选择">
    		<el-option v-for="item in first" :key="item.id" :value="item.id" :label="item.value"></el-option>
  		</el-select>
  		<el-select v-model="secondSelect" @change="selectStone" placeholder="请选择">
  			<el-option v-for="item in second" :key="item.id" :value="item.id" :label="item.value"></el-option>
  		</el-select>
  		<el-select v-model="threeSelect" placeholder="请选择" v-if="ceramShow">
  			<el-option v-for="item in three" :key="item.id" :value="item.id" :label="item.value"></el-option>
  		</el-select>
  		<div class="block">
	    	<el-slider @change="scope"  v-model="range" show-input :step="0.1" :min="0" :max="1"></el-slider>
	  	</div>
	</div>
</template>
<script>
import ceram from "../../../../static/json/ceram.json"
export default {
	data(){
		return{
			ceram:[], //汇总
			first:[], //一级分类
			second:[], //二级分类
			three:[], //三级分类
			firstSelect:"",
			secondSelect:"",
			threeSelect:"",
			ceramShow:false,
			range:0
		}
	},
	methods:{
		design(){
			for(let i in ceram){
				let ceramJson = {id:i,value:ceram[i]}
				this.ceram.push(ceramJson)
			}
			for(let i in this.ceram){
				if(this.ceram[i].id.match(/0000$/)){
					this.first.push({id:this.ceram[i].id,value:this.ceram[i].value,children:[]}) 
				}else if(this.ceram[i].id.match(/00$/)){
					this.second.push({id:this.ceram[i].id,value:this.ceram[i].value,children:[]})
				}
				else{
					this.three.push({id:this.ceram[i].id,value:this.ceram[i].value})
				}
			}
			for(let i in this.first){
				for(let j in this.second){
					if(this.first[i].id.slice(0,2) == this.second[j].id.slice(0,2)){
						this.first[i].children.push(this.second[j])
					}
				}
			}
			for(let i in this.second){
				for(let j in this.three){
					if(this.second[i].id.slice(0,4) == this.three[j].id.slice(0,4)){
						this.second[i].children.push(this.three[j])
					}
				}
			}
		},
		// 解析分类
		selectClass(e){
			for(let i in this.first){
				if(e == this.first[i].id){
					this.firstSelect = this.first[i].value;
					this.second = this.first[i].children;
					this.secondSelect = this.first[i].children[0].value;
					if(e == 130000){
						this.ceramShow = true
					}else{
						this.ceramShow = false;
					}
				}
			}
		},
		selectStone(e){
			for(let i in this.second){
				if(e == this.second[i].id){
					this.secondSelect = this.second[i].value;
					if(this.second[i].children != ""){
						this.ceramShow = true;
						this.three = this.second[i].children;
						this.threeSelect = this.three[0].value;
					}else{
						this.ceramShow = false;
					}
				}
			}
		},
		scope(e){
			console.log(e)
			this.value8 = e
		}

	},
	mounted(){
		this.design();

		// console.log(this.stone)

	}

}
</script>
<style lang="scss" scoped>
	.block{
		width:300px;
	}
</style>
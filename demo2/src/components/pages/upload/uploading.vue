<template>
	<div class="blockchain">
		<div class="block-upload">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{path:'/'}">上传</el-breadcrumb-item>
				<span class="el-item-color"></span>
			</el-breadcrumb>
			<div class="upload-explain">
				<h2>作品信息</h2>
				<div class="explain-name">
					<el-input placeholder="请输入作品名称"></el-input>	
				</div>
				<div class="explain-name">
					<el-select v-model="firstSelect" @change="selectClass"  placeholder="请选择作品类型">
						<el-option v-for="item in first" :key="item.id" :value="item.id" :label="item.value"></el-option>
					</el-select>
					<el-select v-model="secondSelect" @change="selectStone"  placeholder="请选择作品类型">
						<el-option v-for="item in second" :key="item.id" :value="item.id" :label="item.value"></el-option>
					</el-select>
					<el-select v-model="threeSelect" v-if="ceramShow"  placeholder="请选择作品类型">
						<el-option v-for="item in three" :key="item.id" :value="item.id" :label="item.value"></el-option>
					</el-select>
				</div>
				<div class="explain-name">
					<el-input type="textarea" placeholder="请输入作品介绍" :autosize="{ minRows: 2, maxRows: 3}"></el-input>
					<p>注：为了更好实现知识产权保护与交易，作品介绍请包括以下三个要素：创作目的、创作过程和独创性说明</p>
				</div>
				<div class="explain-name">
					<el-input class="el-label" placeholder="请输入作品标签"></el-input>
					<p>每个标签2-5个字,标签用空格隔开(最多5个)</p>
				</div>
			</div>
			<div class="upload-works">
				<h2>上传作品</h2>
				<el-upload action="22256464589" :limit=1 :auto-upload="false" list-type="picture-card"  class="works-box">
                  <i class="el-icon-plus"></i>      
              	</el-upload>
			</div>	
			<div class="upload-works">
				<h2>上传作品</h2>
				<el-upload action="22256464589" :limit=6 :auto-upload="false" list-type="picture-card"  class="works-box">
                  <i class="el-icon-plus"></i>      
              	</el-upload>
			</div>
			<div class="upload-true">
				<input type="checkbox" checked="true" >已阅读并同意<a href="">用户协议</a>
				<div><el-button type="primary" plain class="button0" >发布</el-button></div>
			</div>	
		</div>	
	</div>
</template>
<script>
import ceram from "../../../../static/json/ceram.json"
	export default {
		data(){
			return{
		        value: '',

		        ceram:[], //汇总
				first:[], //一级分类
				second:[], //二级分类
				three:[], //三级分类
				firstSelect:"",
				secondSelect:"",
				threeSelect:"",
				ceramShow:false,
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
		},
		mounted(){
			this.design()
		}
	}
</script>
<style scoped lang="scss">
	.blockchain{
		background:#eee;
	}
	.block-upload{
		width:1200px;
		overflow:hidden;
		margin:0 auto;
		.upload-explain{
			background:#fff;
			width:1200px;
			margin-top:46px;
			margin-bottom:24px;
			padding-bottom:40px;
			border-radius:4px;
			h2{
				padding-left:32px;
				border-bottom:1px solid #eee;
				line-height:64px;
				margin-bottom:24px;
			}
			.explain-name{
				padding:0 52px;
				margin-bottom:16px;
				color:#999;
				p{	
					margin-top:10px;
					font-size:14px;
				}
				.el-input{
					width:100%;
					height:40px;
					border-radius:4px;
					overflow:hidden;
					position:relative;
					.el-input__inner{
						height:45px;
					}
				}
				.el-select{
					width:200px;
					height:45px;
					color:#666;
					border-radius:4px;
				}
				.el-label{
					width:400px;
				}
			}	
		}
		.upload-works{
			background:#fff;
			width:1200px;
			border-radius:4px;
			padding-bottom:24px;
			margin-bottom:24px;
			h2{
				padding-left:32px;
				border-bottom:1px solid #eee;
				line-height:64px;
				margin-bottom:24px;
			}
			.works-box{
				overflow:hidden;
				padding-left:20px;
			}
		}
		.upload-true{
			padding-left:32px;
			padding-bottom:80px;
			a{
				color:#0078ff;
				margin-left:5px;
			}
			div{
				margin-top:30px;
			}
		}
	}
	.el-breadcrumb{
		height:50px;
		line-height:50px;
		width:160px;
		background:#1c1e20;
		padding-left:15px;
		position:relative;
		.el-item-color{
			width: 0;
    		height: 0;
		    border-bottom: 50px solid #eee;
		    border-left: 50px solid transparent;
		    position:absolute;
		    top:0;
		    right:0;
		}
	}
</style>
<style lang="scss">
	.block-upload{
		.el-breadcrumb__inner.is-link{
			color:#fff;
			font-weight:400;
		}
		.el-breadcrumb__separator{
			color:#fff;
		}
	}
	.works-box .el-upload--picture-card{
		width:266px;
		height:200px;
		position:relative;
	}
	.works-box .el-icon-plus{
		position:absolute;
		top:43%;
		left:45%;
	}
	.works-box{
		.el-upload-list--picture-card .el-upload-list__item{
			width:266px;
			height:200px;
		}
	}
	.explain-name{
		.el-input__inner,.el-textarea__inner{
			background:#f4f4f4;
			border:none;
		}
	}
	.upload-true{
		.el-button{
			padding:10px 44px;
		}
	}
</style>
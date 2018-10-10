<template>
	<div class="qkl-info">
	
		
		<el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm" v-if="!showimg">
			<el-form-item
				label=""
				prop="popNum"
				:rules="[
				{ required: true, message: '版权号不能为空'},
				
				]"
			>
				<span>版权号</span>
				<el-input type="string" v-model.number="numberValidateForm.popNum" auto-complete="off" class="inputtext"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary"  @click="submitForm">提交生成版权证书</el-button>
				<el-button @click="resetForm">重置</el-button>
			</el-form-item>
		</el-form>
		<div v-if="showload" class="showload">
			<i class="el-icon-loading"></i><span>生成中，请稍后</span>
		</div>
		<div class="rightbook" v-if="showimg"  id="pdfDom">
			<h2><img src="../../../assets/logo.png" alt=""></h2>
			<p>版权归属证书</p>
			<div class="right">
				<ul class="fl">
					<li><span>版权名称：</span>{{rightmessage.rightName}}</li>
					<li><span>版权号：</span>{{rightmessage.blockHash}}</li>
					<li><span>所有者姓名：</span>{{rightmessage.rightOwerName}}</li>
					<li><span>身份证号：</span>{{rightmessage.IDnum}}</li>
					<!-- <li><span>简介：</span>{{rightmessage.message}}</li> -->
				</ul>
				<div class="imgbox"><img :src="rightmessage.rightImgurl" alt=""></div>
			</div>
			<div class="qk">
				<ul>
					<li><span>区块高度：</span>{{rightmessage.qktext}}</li>
					<li><span>区块序号：</span>{{rightmessage.qknum}}</li>
					<li><span>上传凭证号：</span>{{rightmessage.uploadNum}}</li>							
				</ul>
			</div>

			<div class="org">
				<ul>
					<li><span>认证机构：</span>{{rightmessage.confirmOrganization}}</li>
					<li><span>认证时间：</span>{{rightmessage.confirmTime}}</li>
				</ul>
			</div>
		</div>
		<div v-if="showimg" class="download">
			<el-button type="primary" round @click="getPdf()">打印</el-button>
			<a href="#/rightsCenter">
				<el-button type="primary" round >取消</el-button>
			</a>
		</div>
	</div>
</template>

<script>
import CommonNav from '../../commons/CommonNav.vue'
export default {
	components:{CommonNav},
  data() {

    return {
	  showload:false,
	  showimg:false,
      numberValidateForm: {
    	popNum: ""
	  },
	  rightmessage:{
		  blockHash:'',
		  rightName:'',
		  rightOwerName:'',
		  IDnum:'',
		  message:'',
		  rightImgurl:'',
		  qknum:'',
		  qktext:'',
		  uploadNum:'',
		  confirmOrganization:'',
		  confirmTime:'',
		  confirmassign:'',
	  },
	  htmlTitle:'版权证书'

    };
  },
  methods: {
	resetForm(){this.numberValidateForm.popNum=''},  
    submitForm() {
		this.showload=true;
		var self=this;			
			var params=new URLSearchParams();
			params.append('hash',this.numberValidateForm.popNum);
			this.$.post('http://192.168.0.121:8686/getDCByHash', params).then(function (data) {
				self.showload=false;
				self.showimg=true;
                let newdata=data.data.data[0];
                self.rightmessage.rightImgurl=newdata.cover.substring(7);
                self.rightmessage.blockHash=newdata.blockHash;
				self.rightmessage.rightName=newdata.propertyName;
				self.rightmessage.qknum=newdata.propertyHash;
				self.rightmessage.qktext=newdata.height;
				self.rightmessage.confirmOrganization=newdata.ca;
				self.rightmessage.uploadNum=newdata.txId;
				self.rightmessage.rightOwerName=newdata.username;
				self.rightmessage.IDnum=newdata.userIDCardNumber;
				self.rightmessage.confirmTime=newdata.authenticationTime;
				console.log(data)
			}).catch(function (error) {
				alert("版本号输入错误")
	　　		self.showimg=false;
			});			
	},
	mounted(){	
	}
  }
};
</script>
<style scoped lang="scss">
	.imgbox{height:300px;text-align: center;
	img{height: 100%;}}
	.demo-ruleForm{text-align: center;margin-top:200px;height:1000px;
	.el-form-item__error{text-align: center;width:100%}
	}
	.inputtext{width:300px}
	.showload{text-align: center;font-size: 20px;color:red}
	.rightbook{
		border: 5px solid rgb(17, 17, 20);
		height: 1160px;
		margin: 0 auto;
		margin-top:50px;
		background-color:rgb(231, 226, 226) ;
		width: 800px;
		padding:30px;
		h2{text-align: center;
		img{margin:50px auto;height: 80px;}
		}
		p{text-align: center;width: 100%;font-size: 26px;color:black}
		.right{overflow: hidden;
			margin-top:30px;
			.fl{font-size:18px;
				li{margin-bottom: 15px}
			}
			.fr{width: 50%;height: 200px;}

		}
		.qk{
			ul{width: 100%;
				li{margin-bottom:20px;color:black}
			}
			margin-top:80px;
			font-size: 14px;
			span{color:black;font-size:18px;}
		}
		.org{
			margin-top:20px;
			font-size:24px;
			ul{
				width: 300px;margin-left:65%;
				color: black;
				li{margin-top:15px;}
			}
		}	
	}
	.download{
		margin-top:20px;
		text-align: center;
	}

	

</style>
<template>
	<div class="qkl-info">
		<div class="info-help">
			<div class="help-left">
				<div class="left-title">
					<p @click="tabContent(true)" :class="{active:tab == true}">注册与账户</p>
					<p @click="tabContent(false)" :class="{active:tab == false}">实名认证</p>
				</div>
			</div>
			<div class="help-right">
				<div class="right-content" v-if="tab == true">
					<h2>注册与账户</h2>
					<div class="content-complete">
						<h4>1.XX账号是什么?有什么用?</h4>
						<p>XX帐号是您使用XX旗下所有服务时所需要的用户系统，通过注册和登录XX帐号，您可以：<br>
						• 登录XX数字备案，为原创设计作品进行版权保护（数字备案登记，数字备案变更及法律维权咨询）。<br>
						• 登录XX网，进行版权交易，上传最新创作，购买原创版权，发现原创好物。
						如果您使用过上述任何一项服务，即表示您已经拥有XX帐号，您的帐号（手机号/电子邮箱）和密码可以用来登录其他任一XX服务。如果您的账号进行了第三方绑定，您也可以第三方登录的方式直接访问XX。<br>
						还没有XX帐号吗？赶快注册一个吧！</p>
					</div>
					<div class="content-complete">
						<h4>2.如何获得XX账号?</h4>
						<p>XX提供2种主要注册方式：手机号、电子邮箱：<br>
							1）注册表单都是必填项，请检查表单是否填写完整；<br>
							2）手机号、邮箱都是唯一的，如果已注册，请使用该帐号直接登录XX；<br>
							3）如果无法登录，请点击“忘记密码”，进行密码找回；<br>
							4）如果帐号遗失或无法验证可以邮箱联系我们：service@yuancangipr.com；<br>
							5）如果您使用IE系列浏览器或其他较低版本的浏览器，页面发生错位导致无法注册，请尝试更换新的浏览器重试。</p>
					</div>
					<div class="content-complete">
						<h4>3.使用哪些方式登陆?</h4>
						<p>1）通过注册或绑定的手机号<br>
						   2）通过注册或绑定的电子邮箱<br>
						   2）通过绑定XX帐号的社交帐号：微信、QQ
						</p>
					</div>
					<div class="content-complete">
						<h4>4.忘记密码怎么办?</h4>
						<p>在帐号登录页面，点击“忘记密码”，按照提示流程您可以通过绑定的手机号/电子邮箱获取验证码进行密码重置。</p>
					</div>
					<div class="content-complete">
						<h4>5.如果登录不了怎么办?</h4>
						<p>请根据登录失败提示检查原因，如不能解决，您可能是： 
							1）连续1年未登录的帐号，该帐号可能被系统收回，建议您定期保持XX帐号登录。 <br>
							2）多次输入错误密码，您在登录帐号时，多次输入错误密码，导致帐号被暂时冻结。您可以：等待1小时后重试。<br>
							3）如有其它紧急原因您可以发送邮件至：service@yuancangipr.com，我们会尽力协助您解决问题。 </p>
					</div>
				</div>
				<div class="right-content" v-if="tab == false">
					<h2>实名认证</h2>
					<div class="content-complete">
						<h4>1.实名认证是什么?</h4>
						<p>实名认证是XX对所有注册用户进行的身份认证，分为个人认证与企业认证，通过实名认证的帐号才可以享受XX提供的版权保护与版权交易等服务。</p>
					</div>
					<div class="content-complete">
						<h4>2.如何进行实名认证?</h4>
						<p>账号注册后，您可以通过相关提示进行实名认证。<br>
						如果您尚未进行实名认证，将无法使用XX的相关服务（如版权保护与版权交易），因此在使用相关服务前我们会提示您进行实名认证</p>
					</div>
					<div class="content-complete">
						<h4>3.实名认证需要填写什么信息以及提交哪些材料</h4>
						<p>1）个人实名认证：需要填写真实姓名、选择证件类型和填写证件号码，上传与证件号码对应的可证明您真实身份的有效证件（拍照或扫描）。<br>
						企业实名认证：需要填写企业名称、营业执照号，上传营业执照和组织机构代码证（可选）。</p>
					</div>
					<div class="content-complete">
						<h4>4.实名认证需要多久?</h4>
						<p>实名认证仅对用户做身份判定，不做实质性审核，您提交完成后，即实时通过，但发现资质造假等情况，XX有权利随时解除认证状态。</p>
					</div>
					<div class="content-complete">
						<h4>5.实名认证是否能够取消或修改?</h4>
						<p>1）XX保留判断认证资质是否符合标准的权利，如发现资质造假等情况，XX有权利随时解除认证状态；<br>
						2）我们暂不支持用户自主取消或修改认证，如有特殊疑问，请发送邮件至：service@yuancangipr.com。</p>
					</div>
					<div class="content-complete">
						<h4>6.上传不了证件怎么办?</h4>
						<p>如果您使用的IE系列浏览器或其他较版本过低，页面发生错误导致无法上传，请尝试更新您的浏览器，若仍未没解决问题，请邮件联系我们service@yuancangipr.com。</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				tab:true
			}
		},
		methods:{
			tabContent(value){
				this.tab = value;
			}
		}
	}
</script>

<style scoped lang="scss">
	.qkl-info{
		width:100%;
		overflow:hidden;
		background:#eee;
	}
	.info-help{
		width:1200px;
		margin:30px auto 0 auto;
		padding-bottom:60px;
		overflow:hidden;
	}
	.help-left{
		width:250px;
		height:200px;
		float:left;
		background:#fff;
		border-radius:8px;
		.left-title{
			padding-top:20px;
			p{
				padding-left:50px;
				margin-top:20px;
				cursor:pointer;
			}
			.active{
				border-left:2px solid #0078ff;
				color:#0078ff;
			}
		}
	}
	.help-right{
		width:860px;
		background:#fff;
		float:right;
		.right-content{
			width:100%;
			border-radius:8px;
			overflow:hidden;
			padding:0 5px;
			h2{
				height:80px;
				line-height:78px;
				border-bottom:1px solid #eee;
			}
		}
	}
	.content-complete{
		padding:20px 0 20px 30px;
		border-bottom:1px solid #ccc;
		h2{
			font-size:18px;
			font-weight:bold;
		}
		h4{
			font-weight:600;
			line-height:60px;
		}
		p{
			padding:0 50px;
			color:#999;
		}
	}
</style>
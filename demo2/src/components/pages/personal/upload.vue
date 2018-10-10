<template>
	<div>
        <div class="qkl-info">
			<h2>作品上传</h2>
			<div class="info-loading">
				<div class="loading-subhead">作品信息</div>
				<div class="loading-details">
					<ul>
						<li>
							<span class="details-category">作品名称：</span>
							<div class="details-name">
								<input type="text" class="name-input" maxlength="50">
								<span class="count">0/50</span>
							</div>
						</li>
						<li>
							<div class="details-category">作品介绍：</div>
							<div class="details-referral">
								<textarea name="" id="" cols="30" rows="10" maxlength="1000" class="referral-input"></textarea>
								<span class="count">0/1000</span>
							</div>
							<div class="details-tips">注：为了更好的实现知识产权保护与交易，作品介绍请包括以下三个要素：创作目的，创作过程与独创性说明。</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="info-loading">
				<div class="loading-subhead">上传作品</div>
				<div class="details-tips">注：不要在图片上放置设计师商业推广信息（除案例信息外），支持RGB模式下jpg/png/gif格式，10M以内，不超过24张，支持批量上传。</div>
				<div class="loading-details">
					<div class="details-cover"><input type="file" class="upFace" onchange="xmTanUploadImg(this)" multiple></div>
					<div class="details-info details"></div>
				</div>
			</div>
			<div class="info-loading">
				<div class="loading-subhead">上传封面</div>
				<div class="details-tips">注：只支持RGB模式下jpg/png/gif格式，5M以内，建议尺寸为400*300。</div>
				<div class="loading-details">
					<div class="details-cover cover-load"><input type="file" class="upFace" onchange="coverImg(this)"></div>
					<div class="details-info cover"></div>
				</div>
			</div>
			<div class="info-loading">
				<div class="loading-subhead">上传设计文档</div>
				<div class="loading-details">
					<div class="details-cover cover-load"><input type="file" class="upFace" onchange="wordImg(this)"></div>
					<div class="details-info word"></div>
				</div>
			</div>
			<div class="info-loading">
				<div class="loading-true">
					<input type="checkbox" checked="checked">已阅读并同意<a href="">《用户服务协议》</a>
					<button class="button">确认上传</button>
					<p>点击确认上传并通过审核后，其他用户可在版权交易中看到您的作品！</p>
				</div>
			</div>
		</div>
		<div class="popup">
			<h2>温馨提示</h2>
			<p></p>
			<button class="popup-true">确认</button>
		</div>
		<h4><a href="#/personal">返回个人中心</a></h4>
    </div>

</template>
<script>
	$(function(){
		setTimeout(function(){
			$(".name-input").keyup(function(){
	        	$(this).next().html($(this).val().length + "/50");
	        })
	        $(".referral-input").keyup(function(){
	        	$(this).next().html($(this).val().length + "/1000");
	        })

			var upload = function(json){
			var deferred = $.Deferred();
				$.ajax({
					url:"http://192.168.0.125:3000/uploadProperty",
					type:"post",
					data:json,
					contentType:false,
					processData:false,

					mimeType:"multipart/form-data",
					success:function(data){
						deferred.resolve(data)
					}
				})
				return deferred.promise()
			}


			var bold = "";
			var imgAttr = [];
	        var boldArr;
	        var word = "";
			xmTanUploadImg=function(obj) {
				var file = obj.files[0];
	            var reader = new FileReader();
	            reader.onload = function (e) {
	                var src = "<img src='"+e.target.result+"'/>";
					$(".details").append(src);
					boldArr = imgBase(this.result);			
	                var boldImg = new Blob([boldArr],{"type":"image/png"});
					imgAttr.push(boldImg)
					$(".details img").css({height:'200px',display:'inline-block',margin:'10px'});
	            }
	            reader.readAsDataURL(file)
	        }
	        coverImg=function(obj) {
				var file = obj.files[0];
				var reader = new FileReader();
	            reader.onload = function (e) {
	                var src = "<img src='"+e.target.result+"'/>"; 
					$(".cover").append(src)
					bold = imgBase(e.target.result);
					$(".cover img").css({height:'400px',display:'inline-block',margin:'10px'});
					console.log(bold)
	            }
				reader.readAsDataURL(file)
			
	        }
	        wordImg=function(obj) {
	            var file = obj.files[0];
				var reader = new FileReader();
	            reader.onload = function (e) {
	            	$(".word").html(file.name);
					word = imgBase(this.result);
					
	            }
				reader.readAsDataURL(file)
				
	        }
	        imgBase=function(base64Data) {
				var byteString;
				if(base64Data.split(',')[0].indexOf('base64') >= 0) {
					byteString = atob(base64Data.split(',')[1]);
				} else {
					byteString = unescape(base64Data.split(',')[1]);
				}
				var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
				var ia = new Uint8Array(byteString.length);
				for(var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ia], {
					type: mimeString
				});
			}
	        $(".name-input").keyup(function(){
	        	$(this).next().html($(this).val().length + "/50");
	        })
	        $(".referral-input").keyup(function(){
	        	$(this).next().html($(this).val().length + "/1000");
	        })
	        $(".popup-true").click(function(){
	        	$(".popup").hide()
	        })

	        $(".button").click(function(){
				$(".popup").show();
				var formData = new FormData();
				formData.append("name",$(".name-input").val());
				formData.append("description",$(".referral-input").val());
				formData.append("cover",bold,"image/png");
				formData.append("userId",window.localStorage.getItem("userId"))
				for(var i = 0 ;i<imgAttr.length;i++){
					formData.append("photos",imgAttr[i],"image/png")
				}	
				formData.append("file",word,"application/vnd.openxmlformats-officedocument.wordprocessingml.document")
				upload(formData).then(function(data){
					var ret = JSON.parse(data);			
					if(ret.status == 401){
						console.log(ret.status);
						$(".popup p").html("上传失败")
					}else if(ret.status == 403){
						$(".popup p").html("资产已经上链")
					}else if(ret.status == 402){	
						$(".popup p").html("网络连接错误,请稍后再试")
					}else if(ret.status == 200){
						console.log(ret.status);
						$(".popup p").html("资产上传成功,正在审核中")
						$(".name-input").val("");
						$(".referral-input").val("");
						$(".details").children().remove();
						$(".cover").children().remove();
						$(".word").html("")
					}
				})
			})
		},500)
	})	


// export default{
// 	data(){
// 		return {
// 			works:{
// 				name:"",
// 				presentation:"",
// 				cover:"",
// 				potops:[]
// 			}
// 		}
// 	},
// 	methods:{

// 	},
// 	mounted(){

// 	}
// }
</script>

<style scoped lang="scss">
	h4{
		width: 100%;
		font-size:16px;
		text-align:center;
		line-height:80px;
	}
    .qkl-info{
	width: 1200px;
	background: #f8f8f8;
}
.qkl-info > h2{
	font-size: 24px;
	padding-left:30px;
	line-height:50px;
	background:#fff;
}

.info-loading{
	width: 100%;
	min-height: 200px;
	background: #fff;
	margin:30px 0 ; 
	text-align: center;
}
.loading-subhead{
	min-height: 60px;
	line-height: 60px;
	color:#333;
	font-size: 16px;
	padding-left: 40px;
	border-bottom:1px solid #f8f8f8;
}
.loading-details{
	padding-left: 50px;
	padding-bottom: 10px;
}
.loading-details ul{
	width: 100%;
	height: 100%;
}
.loading-details ul li{
	width: 100%;
	min-height: 40px;
	margin:10px 0 ;
	font-size: 14px;
}

.details-category{
	display: inline-block;
	width: 120px;
	line-height: 40px;
	vertical-align: top;
	text-align: left;
}
.details-name{
	display: inline-block;
	width: 400px;
	height:38px;
	border:1px solid #ccc;
	position: relative;
}
.details-name input{
	width: 350px;
	padding-left: 20px;
	height: 38px;
	vertical-align: top;
}
.count{
	display: inline-block;
	width: 60px;
	height: 38px;
	line-height: 40px;
	text-align: center;
}
.details-name .count{
	position: absolute;
	top:0;
	right: 0;
	background-color: #fff;
}
.details-referral{
	display: inline-block;
	width: 380px;
	height: 200px;
	padding:10px;
	font-size: 14px;
	border: 1px solid #CCCCCC;
	background-color: #fbfbfb;
	position: relative;
}
.details-referral textarea{
	width: 100%;
	height: 100%;
	border:none;
	background-color: #fbfbfb;
}
.details-referral .count{
	position: absolute;
	bottom:0;
	right: 0;
}
.details-tips{
	height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #AAAAAA;
    padding-left: 120px;
}
.details-cover{
	width: 214px;
	height: 120px;
	background: url(../../../../static/images/bg.png) no-repeat;
	margin:10px auto;
}
.cover-load{
	width: 214px;
	height: 160px;
	background: url(../../../../static/images/yc_uploadimg_06.png) no-repeat;

}
.details-cover input{
	width: 100%;
	height: 100%;
	opacity: 0;
}
.details-info{
	min-height: 1px;
	width: 100%;
	margin-top: 30px;
}

.details-info >img{
	display: inline-block;
	width: 214px;
	height: 120px;
	margin:0 5px;
}
.loading-details .cover img{
	width: 300px;
	height: 400px;
	margin:0 5px;
}

.loading-true{
	height: 50px;
	line-height: 50px;
	padding-left: 30px;
	color:#AAAAAA;
}
.loading-true input{
	margin-right: 3px;
}
.loading-true button{
	background-color: #ff8a00;
    display: block;
    width: 180px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 14px;
    color: #FFFFFF;
    border-radius: 4px;
    margin:0 auto;
}
.popup{
	background-color:#fff;
	display: none;
	position:fixed;
	top:50%;
	left:45%;
	text-align:center;
	padding-bottom:20px;
	border-radius: 4px;
    overflow: hidden;
    width:200px;
	h2{
		width:100%;
		height: 40px;
		line-height: 40px;
		background: #f9f9f9;
	}
	p{
		padding:30px;
	}
	button{
		width: 80px;
		height: 30px;
		line-height: 30px;
		background: #e6a23c;
		color:#fff;
		border-radius: 4px;
	}
}



</style>
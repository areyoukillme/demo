
<template>
  <div class="box">
      <div class="qkl-info">
          <div class="zp-info">
              <h2>作品信息</h2>
              <div class="inputbox1">
                  <span></span>
                  <el-input placeholder="请输入作品名称" v-model="input1" clearable maxlength="50" class="input1" @input="changeinput"></el-input>
                  <span>{{inputnum}}/50</span>
              </div>
              <div class="classfy">
                  <el-select v-model="classfy" placeholder="请选择作品类型" class="select1" style="width:350px;">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </div>
              <div class="inputbox2">
                  <span></span>
                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="请输入作品简介" @input="changetext" v-model="textarea1" maxlength="1000" class="input2"></el-input>
                  <span>{{textareanum}}/1000</span>
              </div>
              <h4>注：为了更好实现知识产权保护与交易，作品介绍请包括以下三个要素：创作目的、创作过程和独创性说明</h4>
              <div class="tag">
                  <el-input placeholder="添加标签可以自动把作品推送给感兴趣的人" class="input3" v-model="tag"></el-input>
              </div>
              <h4>每个标签2-5字，标签用空格隔开（最多5个）</h4>
          </div>
          <div class="upload">
              <h2>上传封面 <span>(上传一张jpg/png/gif格式，小于10m图片)</span></h2> 
              <el-upload action="22256464589" :limit=1 :auto-upload="false" list-type="picture-card" :on-change="getbase"
               :on-remove="handleRemove" class="uploadbox" :on-exceed="exceed1">
                  <i class="el-icon-plus"></i>      
              </el-upload>
              </div>
          <div class="upload">
              <h2>上传作品 <span>(上传不超过6张jpg/png/gif格式，小于10m图片，可批量上传)</span></h2> 
              <el-upload action="22256464589" :limit=6 :auto-upload="false" list-type="picture-card" :on-change="getbasearr" :on-remove="arrremove" class="uploadbox"
               :multiple="true" :on-exceed="exceed">
                  <i class="el-icon-plus"></i>   
              </el-upload>
          </div>
          <div class="upload">
              <h2>上传设计文档<span>(上传word/pdf/psd等格式设计文件)</span></h2>  
              <div class="uploadbox">  <span class="filebox"><i class="el-icon-plus"></i><input type="file" class="uploadfile"
               @change="wordImg"> </span><span class="filename">{{filename}}</span></div>
          </div>
          <div class="uploading">
              <input type="checkbox" checked="true" @click="check">已阅读并同意<a href="">用户协议</a>
              <div><el-button type="primary" plain class="button0" @click="uploadfile" :disabled="disabled">发布</el-button><el-button type="primary" plain class="button0" :disabled="disabled">预览</el-button></div>
          </div>
      </div>
      <div class="cover" v-if="showcover">
          <div class="center">
              <i class="el-icon-loading"></i>
              <h2>上传中，请稍后</h2>
          </div>
         
      </div>
  
      <video autoplay v-if="showvideo" class="vedio">
        <source src="../../../../static/vedio.mp4" type="video/mp4">
        对不起；您的浏览器不支持HTML5视频在WebM和VP8 / VP9或MP4 
      </video>

  </div>     
</template>

<script>
import { getStorage, setStorage } from "../../../assets/cookie.js";
export default {
  data() {
    return {
      showvideo:false,
      showcover:false,
      input1: "",
      textarea1: "",
      inputnum: "0",
      textareanum: "0",
      bold: "",
      imgAttr: [],
      boldArr: "",
      word: "",
      filename: "",
      notice: "",
      disabled: false,
      classfy:'',
      tag:'',
      options: [{
          value: '选项1',
          label: '家装家具'
        }, {
          value: '选项2',
          label: '建筑设计'
        }, {
          value: '选项3',
          label: '室内设计'
        }, {
          value: '选项4',
          label: '工业设计'
        }, {
          value: '选项5',
          label: '服装设计'
        }],
    };
  },
  methods: {
    ended(){this.showvideo=false;},
    exceed1() {
      alert("只能上传1个");
    },
    exceed() {
      alert("最多只能上传6个");
    },
    changeinput() {
      this.inputnum = this.input1.length;
    },
    changetext() {
      this.textareanum = this.textarea1.length;
    },
    check() {
      this.disabled = !this.disabled;
    },
    open() {
      this.$alert(this.notice, "上传结果提示", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    handleRemove(file, fileList) {
      this.bold = "";
    },
    arrremove(file, fileList) {
      var that = this;
      var reader = new FileReader();
      reader.onload = function(e) {
        var remove = that.imgBase(e.target.result);
        that.imgAttr.map(function(item, index) {
          if (item.size == remove.size) {
            that.imgAttr.splice(index, 1);
          }
        });
      };
      reader.readAsDataURL(file.raw);
    },
    getbase(file) {
      var reader = new FileReader();
      var that = this;
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        that.bold = that.imgBase(e.target.result);
      };
    },
    getbasearr(file, fileList) {
      var reader = new FileReader();
      var that = this;
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        that.boldArr = that.imgBase(e.target.result);
        that.imgAttr.push(that.boldArr);
      };
    },
    wordImg(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      var that = this;
      reader.onload = function(e) {
        that.word = that.imgBase(this.result);
        that.filename = file.name;
      };
      reader.readAsDataURL(file);
    },
    uploadfile() {
      this.showcover=true;
      var formData = new FormData();
      formData.append("userId", getStorage("userId"));
      formData.append("name", this.input1);
      formData.append("description", this.textarea1);
      formData.append("cover", this.bold, "image/png");
      for (var i = 0; i < this.imgAttr.length; i++) {
        formData.append("photos", this.imgAttr[i], "image/png");
      }
      formData.append(
        "file",
        this.word,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      let that = this;
      this.upload(formData).then(function(data) {
        var ret = JSON.parse(data);
        if (ret.status == 401) {
          that.notice = "上传失败!";
          that.open();
          that.showcover=false;
        } else if (ret.status == 403) {
          that.notice = "资产已经上链!";
          that.open();
          that.showcover=false;
        } else if (ret.status == 402) {
          that.notice = "网络连接错误,请稍后再试!";
          that.open();
          that.showcover=false;
        } else if (ret.status == 200) {
          that.showcover=false;
          that.showvideo=true;
          setTimeout(function(){
            location.reload();
            },8500)
        }
      });
    },
    upload(json) {
      var deferred = $.Deferred();
      $.ajax({
        url: "http://192.168.0.125:3000/uploadProperty",
        type: "post",
        data: json,
        contentType: false,
        processData: false,

        mimeType: "multipart/form-data",
        success: function(data) {
          deferred.resolve(data);
        }
      });
      return deferred.promise();
    },
    imgBase(base64Data) {
      var byteString;
      if (base64Data.split(",")[0].indexOf("base64") >= 0) {
        byteString = atob(base64Data.split(",")[1]);
      } else {
        byteString = unescape(base64Data.split(",")[1]);
      }
      var mimeString = base64Data
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {
        type: mimeString
      });
    },
    openFullScreen() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
  }
};
</script>
<style scoped lang="scss">
body{height: 1586px;}
.el-upload {
  float: left;
}
.box {
  background: #eeeeee;
  .vedio{position:fixed;top:300px;left:50%;transform: translateX(-320px)};
  .cover{position:fixed;
    width: 100%;
    height: 1400px;
    background: #ccc;
    opacity: 0.6;
    font-size: 50px;
    z-index: 1000;
    top:0;
    .center{
        text-align: center;
        width:200px;
        margin:400px auto;
        color:blue;
        i{font-size:50px;}
        h2{font-size:16px;}
    }
   
  }
}
.qkl-info {
  background: #eee;
  padding: 20px;
  width:1200px;
  margin:0 auto;
  .zp-info {
    background: #fff;
    border-radius: 4px;
    margin-top: 160px;
    padding-bottom:20px;
    h2 {
      font-size: 16px;
      line-height: 65px;
      color: #232424;
      border-bottom: #eee solid 1px;
      padding-left: 20px;
    }
    h4 {
      font-size: 12px;
      color: #999;
      padding: 10px 0 10px 30px;
    }
  }
  .inputbox1 {
    margin-top: 27px;
    height: 42px;
    padding-left: 20px;
    .input1 {
      width: 90%;
      font-size: 14px;
      line-height: 42px;
    }
  }
  .classfy{margin-top:27px;
    height:42px;
    width:400px;
    padding-left:20px;
    .slect1{width:20%;}
    .el-input__inner{width:400px;}
  }

  .inputbox2 {
    margin-top: 27px;
   
    padding-left: 20px;
    .input2 {
      width: 90%;
      font-size: 14px;
      line-height: 42px;
    }
  }
  .tag{
    height: 42px;
    padding-left: 20px;
    .input3 {
      width: 30%;
      font-size: 14px;
      line-height: 42px;
    }
  }
  .upload {
    margin-top: 20px;
    background: #fff;
    border-radius: 4px;
    h2 {
      font-size: 16px;
      line-height: 65px;
      color: #232424;
      border-bottom: #eee solid 1px;
      padding-left: 20px;
      span {
        font-size: 12px;
        color: #666;
        padding-left:10px;
      }
    }
    .uploadbox {
      padding: 20px;
      overflow: hidden;
      div {
        float: left;
      }
      .el-upload {
        float: left;
      }
    }
    .filebox {
      display: inline-block;
      width: 146px;
      height: 146px;
      border: 1px solid #ccc;
      overflow: hidden;
      float: left;
      border: rgb(192, 204, 218) 1px dashed;
      border-radius: 4px;
      background: #fbfdff;
      position: relative;
      i {
        position: absolute;
        top: 50%-14;
        left: 50%-14;
        font-size: 28px;
        color: #8c939d;
      }
    }
    .filebox:hover {
      border-color: skyblue;
    }
    .filename {
      display: inline-block;
      width: 400px;
      height: 146px;
      font-size: 12px;
      line-height: 146px;
      float: left;
      margin-left: 20px;
    }
    .uploadfile {
      width: 146px;
      height: 146px;
      opacity: 0;
      z-index: 100;
    }
  }
  .uploading {
    a{color:#409eff;}
    padding: 30px 60px;
    div {
      padding: 20px 00px;
      .button0 {
        width: 118px;
        height: 36px;
        margin-right: 60px;
        span {
          font-size: 15px;
          line-height: 36px;
        }
      }
    }
  }
}
</style>
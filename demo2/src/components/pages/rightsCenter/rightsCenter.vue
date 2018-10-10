<template>
    <div class="rightcenter ">
        <div v-if="!showimg">
            <h2><img src="/static/images/wq01.png" alt=""></h2>
            <div class="weiquan">
            <div class="qkl-info">
                    <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm" >
                        <div>
                            <el-input placeholder="请输入版权号"  v-model="numberValidateForm.popNum" class="inputtext">
                                <template slot="prepend">版权号</template>
                            </el-input>
                        </div>
                        <div class="button1">
                            <el-button type="primary"  @click="submitForm">提交生成版权证书</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </div>
                    </el-form>
            </div>  
            </div>
        </div>
        <div class="rightbook"  id="pdfDom" v-if="showimg">
                
                <p>版权归属证书</p>
                <div class="right">
                    <ul class="positionfl">
                        <li><span>版权名称</span><i>:</i><span>{{rightmessage.rightName}}</span></li>
                        <li><span class="tebie">版权凭证</span><i>:</i><span class="tebie tebie2">{{rightmessage.qknum}}</span></li>
                        <li><span>所有者姓名</span><i>:</i><span>{{rightmessage.rightOwerName}}</span></li>
                        <li><span>身份证号</span><i>:</i><span class="tebie tebie2">{{rightmessage.IDnum}}</span></li>
                    </ul>
                </div>
                <div class="imgbox"><img :src="rightmessage.rightImgurl" alt=""></div>
                <div class="qk">
                    <ul>
                        <li><span>区块高度</span><i>:</i><span>{{rightmessage.qktext}}</span></li>
                        <li><span class="tebie">区块摘要</span><i>:</i><span class="tebie tebie2">{{rightmessage.blockHash}}</span></li>
                        <li><span class="tebie">上链标识</span><i>:</i><span class="tebie tebie2">{{rightmessage.uploadNum}}</span></li>							
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
                <el-button type="primary"  @click="getPdf()" class="button1">下载证书</el-button>
                <el-button type="info"  class="button1" @click="cancel">取消</el-button>
            </div>  
    </div> 
   
</template>

<script>
import CommonNav from "../../commons/CommonNav.vue";

export default {
  components: { CommonNav },
  data() {
    return {
      showimg: false,
      numberValidateForm: {
        popNum: ""
      },
      rightmessage: {
        blockHash:
          "b030625d10fe1381384d0f6ec3374c52948d1f0c1d79102b99d9575692f12c4c",
        rightName: "afejifejif",
        rightOwerName: "afefwsafafe",
        IDnum: "safaefasf15155",
        message: "afefaffe",
        rightImgurl: "afeafafefef",
        qknum:
          "fe5408654f01894897168540132131231313123123123123123131231231231313",
        qktext: "fef",
        uploadNum:
          "af1a14fe5f14e5fe513131231231313131313131313131231231231231231231",
        confirmOrganization: "认证平台",
        confirmTime: "2018-8-15",
        confirmassign: "ea1f5af14e1fesafe5fef1a5fe"
      },
      htmlTitle: "版权证书"
    };
  },
  computed: {},
  methods: {
    cancel() {
      window.location.reload();
    },
    resetForm() {
      this.numberValidateForm.popNum = "";
      $(".rightcenter").css(
        "background",
        "url('../../../../static/images/rightbg.png')"
      );
    },
    submitForm() {
      var self = this;
      console.log(this.numberValidateForm.popNum);
      var params = {};
      params.hash = self.numberValidateForm.popNum;
      self.$.post("http://192.168.0.125:3000/getDCByHash", params)
        .then(function(data) {
          if (data.data.data) {
            self.showimg = true;
            $(".rightcenter").css({ background: "#fff", height: "1400px" });
          }
          let newdata = data.data.data[0];
          self.rightmessage.rightImgurl = newdata.cover.substring(7);
          self.rightmessage.blockHash = newdata.blockHash;
          self.rightmessage.rightName = newdata.propertyName;
          self.rightmessage.qknum = newdata.propertyHash;
          self.rightmessage.qktext = newdata.height;
          self.rightmessage.confirmOrganization = newdata.ca;
          self.rightmessage.uploadNum = newdata.txId;
          self.rightmessage.rightOwerName = newdata.username;
          self.rightmessage.IDnum = newdata.userIDCardNumber;
          self.rightmessage.confirmTime = newdata.authenticationTime;
          console.log(data);
        })
        .catch(function(error) {
          alert("版本号输入错误");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.rightcenter {
  background: url("../../../../static/images/rightbg.png");
  height: 930px;
  padding-top: 140px;
  h2 {
    
    width: 100%;
    text-align: center;
    font-family: PingFang-SC-Bold;
    font-size: 72px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
    padding-top:90px;
    margin: 0 auto;
    line-height: 112px;
  }
}
.imgbox {
  height: 180px;
  text-align: center;
  img {
    height: 100%;
  }
}
.demo-ruleForm {
  text-align: center;
  margin-top: 100px;
  .version {
    display: inline-block;
    width: 80px;
    height: 44px;
    background-color: #f5f5f5;
    border-radius: 4px 0px 0px 4px;
    border: solid 1px #e5e5e5;
  }
}
.inputtext {
  width: 40%;
}
.rightbook {
  margin: 0 auto;
  background: url("../../../../static/images/downloadbg.png");
  background-size: 100%;
  width: 600px;
  height: 960px;
  padding: 180px 140px 100px 140px;
  p {
    text-align: center;
    width: 100%;
    font-family: SourceHanSansCN-Regular;
    font-size: 40px;
    letter-spacing: 24px;
    color: #040706;
    text-shadow: 4px 4px 2px rgba(4, 7, 6, 0.27);
  }
  .right {
    overflow: hidden;
    margin-top: 90px;
    .positionfl {
      font-size: 16px;
      li {
        span {
          width: 100px;
          text-align: justify;
          display: inline-block;
          height: 30px;
          vertical-align: top;
          letter-spacing: 1px;
          padding-left: 0.5em;
        }
        span:after {
          content: " ";
          display: inline-block;
          width: 100%;
        }
        .tebie {
          height: 60px;
          word-break: break-all;
          word-wrap: break-word;
        }
        .tebie2 {
          width: 450px;
        }
      }
    }
  }
  .qk {
    margin-top: 30px;
    font-size: 16px;
    ul {
      width: 100%;
      li {
        span {
          width: 100px;
          text-align: justify;
          display: inline-block;
          height: 30px;
          vertical-align: top;
          letter-spacing: 1px;
          font-size: 16px;
          padding-left: 0.5em;
        }
        span:after {
          content: "";
          display: inline-block;
          width: 100%;
        }
        .tebie {
          height: 60px;
          word-break: break-all;
          word-wrap: break-word;
        }
        .tebie2 {
          width: 450px;
        }
      }
    }
  }
  .org {
    margin-top: 120px;
    font-size: 20px;
    ul {
      width: 300px;
      margin-left: 60%;
      color: black;
      li {
        margin-top: 15px;
      }
    }
  }
}
.download {
  text-align: center;
  .button1 {
    width: 118px;
    height: 36px;
    margin-right: 60px;
    span {
      font-size: 15px;
      line-height: 36px;
    }
  }
}
.button1 {
  margin-top: 50px;
}
</style>
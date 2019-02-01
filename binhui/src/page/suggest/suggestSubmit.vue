<template>
  <div class="content_box">
    <navbar>{{$route.meta.title}}</navbar>
    <div class="suggest_content">
      <div class="title">问题和意见</div>
      <div class="textarea_box f_pr">
        <textarea
          placeholder="请填写10个字以上的问题描述以便于我们提供更好的帮助"
          class="textareaBox"
          maxlength="200"
          @input="changeTotal"
          v-model="content"
        ></textarea>
        <span class="f_pa total">{{total}}/200</span>
      </div>
      <div class="pictures f_pr">
        <span class="txt f_db">图片（选填，提供问题截图）</span>
        <div class="item f_pr left" v-for="(x,index) in imgList" :key="index">
          <div class="box f_pr">
            <img :src="x.src" @click="browse(x)" style="cursor: pointer">
            <div class="f_pa del" @click.stop="delImg(index)">
              <img src="../../assets/del.png">
            </div>
          </div>
        </div>
        <div class="item mr_null f_dib f_pr add" v-if="imgList.length<4">
          <choose-img :input-style="inputStyle" @getImg="getImg" :multiple="true" :source-img="imgList" :img-num-limit="limitNum" @getNum="getNum"></choose-img>
        </div>
      </div>
      <div class="title">联系电话</div>
      <div class="phone">
        <input
          placeholder="选填，便于我们与您联系"
          placeholder-class="placeholderC"
          v-model="tel"
          class="inputBox"
        >
      </div>
      <div class="btn" @click.stop="uploadPictures">提交</div>
      <div class="history">
        <span @click.stop="toHistory" style="cursor: pointer">反馈记录</span>
      </div>
    </div>
    <div class="shade" v-if="isSuccess">
      <div class="success">
        <img src="../../assets/success.png">
        <div class="tip">提交成功</div>
        <div class="title">感谢您的使用与认真反馈 我们将尽快处理</div>
        <button class="f_db" @click.stop="closeSuccess" style="cursor: pointer">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import loadmore from "../../components/common/loadmore";
import navbar from "../../components/common/navbar";
import { isMobile } from "../../config/formCheck";
import { submitSuggestData } from "../../service/getData";
import { serviceUrl } from "../../config/env";
import fetchImage from "../../config/uploadImg";
import chooseImg from "../../components/common/chooseImg";

export default {
  data() {
    return {
      total: 0, //字数
      content: "", //问题反馈的内容
      imgList: [], //图片
      webImgList: [], //存储上传云服务器后的图片路径和图片排序
      tel: "", //联系电话
      isSuccess: false, //提交成功弹框
      inputStyle: {
        width: "2.106666rem",
        height: "2.106666rem"
      },
      limitNum:4,
      tokenId: this.$route.query.tokenId,
    };
  },
  methods: {
    //改变剩余字数
    changeTotal() {
      //开头禁止输入空格
      if (this.content.trim() == "") {
        this.content = "";
      }
      this.total = this.content.length;
    },
    //预览图片
    borwse() {},
    //删除图片
    delImg(index) {
      // console.log(index)
      this.imgList.forEach((element, eq) => {
        if (index == eq) {
          this.imgList.splice(eq, 1);
        }
      });
      this.limitNum++;
    },
    //获取选中的图片
    getImg(val) {
      this.imgList = val;   
    },
    //获取选中图片的数量
    getNum(val){
      this.limitNum = this.limitNum-val;       
    },
    //提交反馈前上传图片
    async uploadPictures(){
      if (this.imgList.length>0) {
         this.webImgList = await fetchImage(this.imgList,this.tokenId,this);
         this.saveSuggest();
      }else{
        this.saveSuggest();
      }
    },
    //提交反馈
    async saveSuggest() {
      if (this.content.trim() == "") {
        this.$toast("请填写意见或反馈内容", 1500);
        return;
      } else if (this.content.trim().length < 10) {
        this.$toast("请填写10个字以上的问题描述", 1500);
        return;
      }
      if (this.tel != "" && !isMobile(this.tel)) {
        this.$toast("请填写正确的手机号码", 1500);
        return;
      }
      let webImg = this.webImgList.join(',');
      let res = await submitSuggestData(
        this.content,
        webImg,
        this.tel,
        this.tokenId
      );
      if (res.code == 0) {
        this.isSuccess = true;
        this.tel = "";
        this.imgList = [];
        this.content = "";
      } else {
        this.$toast(res.msg, 1500);
      }
    },
    //关闭弹框
    closeSuccess() {
      this.isSuccess = false;
    },
    //去到反馈记录界面
    toHistory() {
      this.$router.push({
        path: "suggestHistory",
        query: { tokenId: this.tokenId }
      });
    }
  },
  components: {
    loadmore,
    navbar,
    chooseImg,
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.content_box {
  min-height: inherit;
}
.title {
  line-height: 0.96rem;
  padding-left: 0.533333rem;
  font-size: 0.373333rem;
  color: #999;
}

.textarea_box {
  width: 100%;
  height: 3.066666rem;
  background: #fff;
  padding: 0.266666rem 0 0.746666rem 0.533333rem;
  margin-bottom: 0.533333rem;
}

.textarea_box > textarea {
  width: 100%;
  height: 100%;
  font-size: 0.426666rem;
  line-height: 0.48rem;
}

.textareaBox::input-placeholder {
  color: #999;
  font-size: 0.426666rem;
  line-height: 0.48rem;
}
.textareaBox::-webkit-input-placeholder {
  color: #999;
  font-size: 0.426666rem;
  line-height: 0.48rem;
}

.textarea_box > .total {
  font-size: 0.4rem;
  color: #999;
  right: 0.666666rem;
  bottom: 0.186666rem;
}

.pictures {
  height: 3.813333rem;
  background: #fff;
  padding-left: 0.533333rem;
  overflow: hidden;
}

.pictures .txt {
  line-height: 0.613333rem;
  margin: 0.346666rem 0 0.32rem;
  font-size: 0.426666rem;
}

.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.item img {
  width: 100%;
  height: 100%;
}

.del {
  width: 0.8rem;
  height: 0.8rem;
  top: -0.16rem;
  right: -0.16rem;
  z-index: 2;
  cursor: pointer;
}

.del > img {
  width: 0.426666rem;
  height: 0.426666rem;
  margin: 0.16rem 0 0 0.213333rem;
}

.pictures .item {
  width: 2.106666rem;
  height: 2.106666rem;
  margin-right: 0.186666rem;
}

.pictures .item:first-of-type {
  margin-left: 0;
}

.mr_null {
  margin-right: 0 !important;
}

.pictures .add {
  border: 1px solid #d9d9d9;
}

.pictures .add::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 1.52rem;
  height: 0.053333rem;
  background: #d8d8d8;
}

.pictures .add::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 0.053333rem;
  height: 1.52rem;
  background: #d8d8d8;
}

.phone {
  height: 1.12rem;
  line-height: 1.12rem;
  padding: 0 0.533333rem;
  background: #fff;
}

.phone > input {
  width: 100%;
  height: 1.12rem;
  line-height: 1.12rem;
  font-size: 0.426666rem;
}

.inputBox::input-placeholder {
  color: #999;
  font-size: 0.426666rem;
  line-height: 1.12rem;
}
.inputBox::-webkit-input-placeholder {
  color: #999;
  font-size: 0.426666rem;
  line-height: 1.12rem;
}

.btn {
  width: 6.933333rem;
  height: 1.173333rem;
  line-height: 1.173333rem;
  font-size: 0.426666rem;
  text-align: center;
  color: #fff;
  margin: 1.146666rem auto 0.533333rem;
  background: #2acc85;
  border-radius: 0.693333rem;
  cursor: pointer;
}

.shade {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  z-index: 10;
}

.success {
  width: 5.066666rem;
  height: 6.8rem;
  position: fixed;
  left: 2.48rem;
  top: 4.506666rem;
  background: #fff;
  border-radius: 0.106666rem;
  z-index: 10;
}

.success img {
  display: block;
  margin: 1.013333rem auto 0;
  width: 2.533333rem;
  height: 2.533333rem;
}

.success .tip {
  font-size: 0.4rem;
  text-align: center;
  margin: 0.213333rem 0;
  line-height: 0.56rem;
}

.success .title {
  width: 3.52rem;
  font-size: 0.32rem;
  color: #2acc85;
  text-align: center;
  margin: 0.186666rem auto 0.4rem;
  line-height: 0.4rem;
  padding-left: 0;
}

.success button {
  margin: 0 auto;
  margin-top: 0.373333rem;
  width: 2.8rem;
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.4rem;
  color: #2acc85;
  background: none;
  border: 1px solid #2acc85;
  border-radius: 0.4rem;
  -webkit-border-radius: 0.4rem;
}

.history {
  height: 0.8rem;
  line-height: 0.8rem;
  margin: 0.453333rem auto;
  text-align: center;
}

.history > span {
  font-size: 0.373333rem;
  color: #999;
  line-height: 0.8rem;
  border-bottom: 1px solid #999;
}

.success {
  width: 5.066666rem;
  height: 6.8rem;
  position: fixed;
  left: 2.48rem;
  top: 4.506666rem;
  background: #fff;
  border-radius: 0.106666rem;
  z-index: 10;
}

.success image {
  display: block;
  margin: 1.013333rem auto 0;
  width: 2.533333rem;
  height: 2.533333rem;
}

.success .tip {
  font-size: 0.4rem;
  text-align: center;
  margin: 0.213333rem 0;
  line-height: 0.56rem;
}

.success .title {
  width: 3.52rem;
  font-size: 0.32rem;
  color: #2acc85;
  text-align: center;
  margin: 0.186666rem auto 0.4rem;
  line-height: 0.4rem;
  padding-left: 0;
}

.success button {
  margin: 0 auto;
  margin-top: 0.373333rem;
  width: 2.8rem;
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.4rem;
  color: #2acc85;
  background: none;
  border: 1px solid #2acc85;
  border-radius: 0.4rem;
  -webkit-border-radius: 0.4rem;
}
</style>
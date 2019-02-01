<template>
  <div>
    <navbar>{{$route.meta.title}}</navbar>
    <div class="content">
      <div class="list f_pr" v-for="(item,index) in goodsList" :key="index">
        <div class="goodsInfo f_pr">
          <div class="img f_pa">
            <img :src="item.imageUrl">
          </div>
          <div class="txt">
            <span class="title ellipsis">{{item.prodName}}</span>
            <span class="size">{{item.remain}}g</span>
          </div>
        </div>
        <div class="sale_detail f_pr">
          <div class="price">
            <span>出售单价</span>
            <input
              type="text"
              maxlength="7"
              @input="getPrice(item.uspdId)"
              @change="checkPrice(item.uspdId)"
              v-model="item.sellPrice"
            >
            <span>元/500g</span>
          </div>
          <div class="suggest">建议零售价{{item.sugPrice}}元/500g</div>
          <div class="weight">
            <span>出售重量</span>
            <input
              type="text"
              @input="getWeight(item.uspdId)"
              @change="checkWeight(item.uspdId)"
              v-model="item.weight"
            >
            <span>g/份</span>
          </div>
          <div class="copies">
            <span>出售份数</span>
            <input
              type="text"
              @input="getCount(item.uspdId)"
              @change="checkCount(item.uspdId)"
              v-model="item.storeNums"
            >
            <span>份</span>
          </div>
          <div class="sale">
            <div class="saleing ellipsis">出售产物：{{item.saleing}}g</div>
            <div class="odd ellipsis">剩余产物：{{item.odd}}g</div>
          </div>
        </div>
        <div class="earnings">
          <div class="count left">
            <span class="amount f_dib">总计收益:</span>
            <span class="money f_dib ellipsis">
              <span class="icon">￥</span>{{item.earnings}}
            </span>
          </div>
          <div class="time right">
            可出售时限
            <span>{{item.exptime}}</span>天
          </div>
        </div>
        <div class="msg_tip f_pa" @click.stop="showTip">
          <img class="f_db tip_icon" src="../../assets/mySale_icon.png">
        </div>
      </div>
    </div>
    <div class="btn" @click.stop="putaway">确认上架</div>
    <div class="shade" v-if="isSuccess"></div>
    <div class="success" v-if="isSuccess" @click.stop="toMyProduct">
      <img src="../../assets/success.png">
      <div class="title">上架成功</div>
      <div class="tip">您的商品已经上架到商城,快去看看吧</div>
    </div>
  </div>
</template>
<script>
import navbar from "../../components/common/navbar";
import { toSaleGoodsData, toPutaway } from "../../service/getData";
import { isNum, isParseint } from "../../config/formCheck";

export default {
  data() {
    return {
      isSell: true, //展示出售按钮
      isChoose: false, //勾选框显示
      isHome: true, //显示寄回家按钮
      isSuccess: false, //显示上架成功弹框
      uspdId: "", //存储上架商品的id
      goodsList: [], //上架商品列表
      flag: false, //判断是否可以上架
      total: "",
      value: "",
      tokenId: this.$route.query.tokenId,
    };
  },
  created() {
    this.uspdId = this.$route.query.uspdId;
    //转换数组
    if (!Array.isArray(this.uspdId)) {
      this.uspdId = this.uspdId.split(',')
    }
    this.getGoodsList();
  },
  distroyed() {},
  methods: {
    //获取要上架的商品
    async getGoodsList() {
      let res = await toSaleGoodsData(this.uspdId, this.tokenId);
      if (res.code == 0) {
        res.list.forEach(data => {
          data.sellPrice = ""; //单价
          data.weight = ""; //重量
          data.storeNums = ""; //份数
          data.earnings = 0.0; //收益
          data.saleing = 0.0; //出售产物
          data.odd = 0.0; //剩余产物
        });
        this.goodsList = res.list;
      } else {
        this.$toast(res.msg, 1500);
      }
    },
    //获取单价
    getPrice(id) {
      this.goodsList.forEach(data => {
        if (data.uspdId == id) {
          if (data.sellPrice == " ") {
            data.sellPrice = "";
          }
          if (isNum(data.sellPrice) && data.weight && data.storeNums) {
            data.earnings = (
              (data.weight * data.sellPrice * data.storeNums) /
              500
            ).toFixed(2); //计算总收益
          } else {
            data.earnings = 0.0;
          }
        }
      });
    },
    //校验单价格式是否正确
    checkPrice(id) {
      this.goodsList.forEach(data => {
        if (data.uspdId == id) {
          if (!isNum(data.sellPrice)) {
            this.$toast("请输入正确的出售单价", 1000);
            data.sellPrice = "";
          }
        }
      });
    },
    //获取重量
    getWeight(id) {
      this.goodsList.forEach(data => {
        if (data.uspdId == id) {
          if (data.weight == " ") {
            data.weight = "";
          }
          //计算总收益
          if (isNum(data.weight) && data.sellPrice && data.storeNums) {
            data.earnings = (
              (data.weight * data.sellPrice * data.storeNums) /
              500
            ).toFixed(2);
          } else {
            data.earnings = 0.0;
            data.saleing = 0.0;
            data.odd = 0.0;
          }
          //计算出售重量是否大于总重量
          if (data.weight > data.remain) {
            this.$toast("出售重量不能超过总重量！");
            data.weight = "";
            data.saleing = 0.0;
            data.odd = 0.0;
            data.earnings = 0.0;
          }
          //计算出售产物以及剩余产物
          if (isNum(data.weight) && data.storeNums) {
            let weight = data.remain - data.weight * data.storeNums;
            //计算剩余产物重量是否小于总重量
            if (weight >= 0) {
              data.saleing = data.weight * data.storeNums;
              data.odd = weight;
            } else {
              this.$toast("出售重量不能超过商品总重量！");
              data.saleing = 0.0;
              data.odd = 0.0;
              data.weight = "";
              data.earnings = 0.0;
            }
          }
        }
      });
    },
    //校验重量格式是否正确
    checkWeight(id) {
      this.goodsList.forEach(data => {
        if (data.uspdId == id) {
          if (!isNum(data.weight)) {
            this.$toast("请输入正确的出售重量", 1000);
            data.weight = "";
            data.saleing = 0.0;
            data.odd = 0.0;
            data.earnings = 0.0;
          }
        }
      });
    },
    //获取份数
    getCount(id) {
      this.goodsList.forEach(data => {
        //计算总收益
        if (data.uspdId == id) {
          if (data.storeNums == " ") {
            data.storeNums = "";
          }
          if (isParseint(data.storeNums) && data.sellPrice && data.weight) {
            data.earnings = (
              (data.weight * data.sellPrice * data.storeNums) /
              500
            ).toFixed(2);
          } else {
            data.earnings = 0.0;
            data.saleing = 0.0;
            data.odd = 0.0;
          }
        }
        //计算出售产物以及剩余产物
        if (isParseint(data.storeNums) && data.weight) {
          let weight = data.remain - data.weight * data.storeNums;
          //计算剩余产物重量是否小于总重量
          if (weight >= 0) {
            data.saleing = data.weight * data.storeNums;
            data.odd = weight;
          } else {
            this.$toast("出售重量不能超过商品总重量！");
            data.saleing = 0.0;
            data.odd = 0.0;
            data.storeNums = "";
            data.earnings = 0.0;
          }
        }
      });
    },
    //校验份数格式是否正确
    checkCount(id) {
      this.goodsList.forEach(data => {
        if (data.uspdId == id) {
          if (!isParseint(data.storeNums)) {
            this.$toast("请输入正确的出售份数", 1000);
            data.storeNums = "";
            data.saleing = 0.0;
            data.odd = 0.0;
            data.earnings = 0.0;
          }
        }
      });
    },
    //显示提示信息
    showTip() {
      this.$toast("出售限时与存放时间相同", 1500);
    },
    //确认上架
    async putaway() {
      let flag = false; //判断上架商品是否填写正确
      let temp = [];
      this.goodsList.forEach(data => {
        //格式化数据
        // console.log(data)
        if (data.sellPrice == "" || data.weight == "" || data.storeNums == "") {
          flag = true;
        }
        let obj = {};
        obj.refId = data.uspdId;
        obj.name = data.prodName;
        obj.sellPrice = data.sellPrice;
        obj.mainImage = data.imageUrl;
        obj.unit = "g";
        obj.spec = data.weight;
        obj.weight = data.weight;
        obj.storeNums = data.storeNums;
        temp.push(obj);
      });
      if (flag) {
        this.$toast("请输入正确的单价/重量/份数", 1500);
      } else {
        let res = await toPutaway(temp, this.tokenId);
        if (res.code == 0) {
          this.isSuccess = true;
        } else {
          this.$toast(res.msg, 1500);
        }
      }
    },
    //去到在售产品
    toMyProduct() {
      this.$router.push({path:"myShop",query:{isWeb:true}});
    }
  },
  components: {
    navbar
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";

.content {
  padding: 0 0.133333rem;
  overflow: hidden;
  width: 100%;
}
.list {
  width: 9.733333rem;
  overflow: hidden;
  background: #fff;
  border-radius: 0.266666rem;
  margin-top: 0.266666rem;
  padding: 0.266666rem;
}
/* .list > view:after {
  content: "";
  height: 2;
  background: #f8f8f8;
  width: 682;
  left: 4;
  bottom:0;
  position: absolute;
} */
/* .list > view:last-of-type:after{
  content:"";
  height: 0;
  width: 0;
  display: block;
} */

.goodsInfo {
  width: 100%;
  height: 2.026666rem;
  padding: 0.506666rem 0 0 2.32rem;
  font-size: 0;
}

.txt {
  height: 0.586666rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title {
  width: 5.333333rem;
  font-size: 0.426666rem;
  line-height: 0.586666rem;
  color: #333;
  font-weight: 600;
  /* overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; */
}

.img {
  top: 0;
  left: 0;
  width: 1.6rem;
  height: 1.6rem;
  overflow: hidden;
}
.img img {
  width: auto;
  height: 100%;
  display: block;
}
.size {
  font-size: 0.373333rem;
  line-height: 0.533333rem;
  color: #666;
}

.btn {
  text-align: center;
  height: 1.173333rem;
  width: 6.933333rem;
  border-radius: 0.693333rem;
  background: #2acc85;
  line-height: 1.173333rem;
  box-shadow: 0 0 0.133333rem 0;
  font-size: 0.426666rem;
  //position: fixed;
  //bottom: 0.533333rem;
  //left: 50%;
  //transform: translateX(-50%);
  color: #fff;
  margin:0.533333rem auto 0.533333rem;
  cursor: pointer;
}
.sale_detail {
  width: 100%;
  padding: 0.266666rem 0;
  border-bottom: 0.08rem solid #f1f1f1;
  border-top: 0.08rem solid #f1f1f1;
}
.sale_detail input {
  width: 5.6rem;
  height: 0.906666rem;
  border: 1px solid #c0c0c0;
  border-radius: 0.106666rem;
  display: inline-block;
  font-size: 0.373333rem;
  padding-left: 0.266666rem;
}
.price,
.weight,
.copies {
  height: 0.906666rem;
  width: 100%;
  font-size: 0;
  display: flex;
  justify-content: left;
  align-items: center;
}
.sale {
  height: 0.906666rem;
  width: 100%;
  margin-top: 0.266666rem;
  display: flex;
  justify-content: space-between;
}
.sale div {
  flex: 1;
}
.weight {
  margin: 0.266666rem 0;
}
.price span:nth-of-type(1),
.weight span:nth-of-type(1),
.copies span:nth-of-type(1) {
  margin-right: 0.133333rem;
  margin-top: 0.133333rem;
  line-height: 0.906666rem;
  font-weight: 600;
  font-size: 0.373333rem;
  color: #333;
}
.price span:nth-of-type(2),
.weight span:nth-of-type(2),
.copies span:nth-of-type(2) {
  line-height: 0.906666rem;
  font-weight: 600;
  font-size: 0.373333rem;
  color: #666;
  margin-left: 0.506666rem;
}
.suggest {
  padding: 0.053333rem 0 0 1.466666rem;
  font-size: 0.32rem;
  line-height: 0.453333rem;
  color: #ebc246;
  margin-bottom: 0.373333rem;
}
.saleing,
.odd {
  height: 100%;
  line-height: 0.906666rem;
  font-size: 0.373333rem;
  color: #999;
}
.odd {
  text-align: right;
}
.earnings {
  height: 0.906666rem;
}
.count {
  overflow: hidden;
  font-size: 0;
}
.amount {
  margin-top: 0.373333rem;
  line-height: 0.533333rem;
  font-size: 0.373333rem;
  font-weight: 600;
  color: #333;
  width: 1.866666rem;
}
.money {
  font-size: 0.48rem;
  margin-top: 0.24rem;
  line-height: 0.453333rem;
  max-width: 4.4rem;
  vertical-align: bottom;
}
.icon {
  font-size: 0.32rem;
}

.time {
  margin-top: 0.453333rem;
  font-size: 0.32rem;
  line-height: 0.453333rem;
  color: #999;
  padding-right: 0.4rem;
}
.time span {
  color: #ebc246;
  padding: 0 0.08rem;
}
.shade {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  z-index: 11;
}
.success {
  width: 5.066666rem;
  height: 6.8rem;
  position: fixed;
  left: 2.48rem;
  top: 4.506666rem;
  background: #fff;
  border-radius: 0.106666rem;
  z-index: 11;
  cursor: pointer;
}
.success img {
  display: block;
  margin: 1.013333rem auto 0;
  width: 2.533333rem;
  height: 2.533333rem;
}
.success .title {
  margin-top: 0.96rem;
  font-size: 0.4rem;
  text-align: center;
  line-height: 0.56rem;
  font-weight: 600;
  width: 100%;
}
.success .tip {
  font-size: 0.373333rem;
  line-height: 0.533333rem;
  margin: 0.24rem auto 0;
  width: 3.36rem;
  color: #999;
  text-align: center;
  word-break: break-all;
}

.msg_tip {
  right: 0.066666rem;
  bottom: 0.16rem;
  width: 0.8rem;
  height: 0.8rem;
  cursor: pointer;
}
.tip_icon {
  width: 0.24rem;
  height: 0.24rem;
  margin: 0.28rem;
}
</style>

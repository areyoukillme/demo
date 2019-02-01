<template>
  <div class="defaultpage_content">
    <div class="order box" v-if="defaultType=='order'">
      <img :src="imgBaseUrl+'default_order.png'" class="order_img img">
      <p class="tip">还没有订单哦，去买卖商城看看</p>
    </div>
    <!--<div class="collect box" v-if="defaultType == 'collect'">
      <img :src="imgBaseUrl+'default_collect.png'" class="collect_img img">
      <p class="tip">还没有收藏任何东西，去买卖商城看看</p>
    </div>-->
    <div class="collect box" v-if="defaultType == 'mail'">
      <img :src="imgBaseUrl+'default_collect.png'" class="collect_img img">
      <p class="tip">还没有收到信件</p>
    </div>
    <div class="harvest box" v-if="defaultType == 'harvest'">
      <img src="../../assets/defaultHarvest@2x.png" class="img">
      <p class="tip">还没有收获，去我的农庄看看</p>
    </div>
    <div class="harvest box" v-if="defaultType == 'fans'">
      <img src="../../assets/fans.png" class="img">
      <p class="tip">还没农友关注您， 多发有趣的农友圈吧</p>
    </div>
    <div class="harvest box" v-if="defaultType == 'praise'">
      <img src="../../assets/praise.png" class="img">
      <p class="tip">暂无获赞记录</p>
    </div>
    <div class="harvest box" v-if="defaultType == 'goods'">
      <img :src="imgBaseUrl+'default_harvest.png'" class="harvest_img img">
      <p class="tip">还没有相关商品哦</p>
    </div>
    <div class="seed box" v-if="defaultType == 'mySeed'">
      <img :src="imgBaseUrl+'default_seed.png'" class="seed_img img">
      <p class="tip">还没有种子，快去购买吧</p>
    </div>
    <div class="seed box" v-if="defaultType == 'farmSeed'">
      <img :src="imgBaseUrl+'default_seed.png'" class="seed_img img">
      <p class="txt tip">还没有种子，快去购买吧</p>
    </div>
    <div class="farmland box" v-if="defaultType == 'farmland'">
      <img :src="imgBaseUrl+'default_farmland.png'" class="farmland_img img">
      <p class="txt tip">还没租田哦，快去租田吧</p>
    </div>
    <div class="address box" v-if="defaultType == 'address'">
      <img :src="imgBaseUrl+'default_address.png'" class="address_img img">
      <p class="tip">还没地址信息，快添加</p>
    </div>
    <div class="harvest box" v-if="defaultType == 'sale'">
      <img :src="imgBaseUrl+'default_harvest.png'" class="harvest_img img">
      <p class="tip">还没有上架商品哦，去农庄看看</p>
    </div>
    <div class="order box" v-if="defaultType == 'saleOrder'">
      <img :src="imgBaseUrl+'default_order.png'" class="order_img img">
      <p class="tip">还没有订单哦，去农庄看看</p>
    </div>
    <div class="cart box" v-if="defaultType == 'cart'">
      <img :src="imgBaseUrl+'default_cart.png'" class="order_img img">
      <p class="tip">还没有商品哦，快去购买吧</p>
    </div>
    <div class="cart box" v-if="defaultType == 'letterbox'">
      <!-- <img src='imgBaseUrlpicturesblank.png' class='order_img img'/> -->
      <p class="tip" style="margin-top: 200px;">还没有收到信件</p>
    </div>
    <div class="cart box" v-if="defaultType == 'pictures'">
      <img :src="imgBaseUrl+'picturesblank.png'" class="order_img img">
      <p class="tip">农民伯伯每天都会为您更新图片，再等下吧</p>
    </div>
    <div class="default_friend box" v-if="defaultType == 'friend'"></div>
    <div class="servicePopup" v-if="defaultType == 'tapService'" catchtap="hidePopUp">
      <div class="serviceBody">
        <p class="phoneNum">客服电话：0768-8888808</p>
        <div class="phoneBtn" catchtap="callService">呼叫客服</div>
      </div>
    </div>
    <div class="box" v-if="defaultType == 'collect'">
    	<img src="../../assets/defaultCollect@2x.png" class="img">
    	<p class="tip">暂无收藏内容</p>
    </div>
    <div class="box" v-if="defaultType == 'hidePerson'">
    	<img src="../../assets/defaultHide@2x.png" class="img">
    	<p class="tip">暂无屏蔽的人</p>
    </div>
    <div class="box" v-if="defaultType == 'suggest'">
    	<img src="../../assets/defaultSuggest@2x.png" class="img">
    	<p class="tip">暂无反馈记录</p>
    </div>
		<div class="box" v-if="defaultType == 'nohonor'">
			<img src="../../assets/nohonor.png" class="img">
			<p class="tip">暂无反馈记录</p>
		</div>
  </div>
</template>

<script>
import { imgBaseUrl } from "../../config/env.js";
export default {
  data() {
    return {
      imgBaseUrl: imgBaseUrl
    };
  },
  created() {
    console.log(this.imgBaseUrl);
  },
  props: {
    defaultType: ""
  }
};
</script>

<style scoped>
.defaultpage_content {
  overflow: hidden;
	div{height: 17rem;}
}

.box {
  overflow: hidden;
}

.box > .img {
  display: block;
  width: 3.6rem;
  height: 2.666666rem;
  margin: 0.933333rem auto;
}

.box > .tip {
  font-size: 0.32rem;
  line-height: 0.426666rem;
  color: #666;
  font-weight: 600;
  text-align: center;
  display: block;
}

.txt {
  color: #c0c0c0;
}
/*
.order_img {
  margin: 1.253333rem auto 0.586666rem;
}

.collect_img {
  margin: 1.04rem auto 0.8rem;
}

.harvest_img {
  margin: 1.226666rem auto 0.613333rem;
}

.seed_img {
  margin: 1.333333rem auto 0.506666rem;
}

.farmland_img {
  margin: 0.88rem auto 0.453333rem;
}

.address_img {
  margin: 1.2rem auto 0.64rem;
}*/

.default_friend {
  width: 0.106666rem;
  height: 0.106666rem;
  background: #d8d8d8;
  border-radius: 50%;
  margin: 0.266666rem auto;
  overflow: visible;
  position: relative;
}

.default_friend::after {
  content: "";
  position: absolute;
  width: 3.733333rem;
  height: 0.026666rem;
  background: #d8d8d8;
  top: 50%;
  transform: translateY(-50%);
  left: 0.266666rem;
}

.default_friend::before {
  content: "";
  position: absolute;
  width: 3.733333rem;
  height: 0.026666rem;
  background: #d8d8d8;
  top: 50%;
  transform: translateY(-50%);
  right: 0.266666rem;
}

/* 客服弹框 */
.servicePopup {
  width: 10rem;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.serviceBody {
  width: 6.666666rem;
  height: 2.933333rem;
  background: #fff;
  text-align: center;
  margin: 0 auto;
  border-radius: 0.186666rem;
  z-index: 999;
}

.serviceBody .phoneNum {
  display: block;
  width: 100%;
  height: 1.733333rem;
  line-height: 1.733333rem;
  color: #333;
  font-size: 0.4rem;
  border-bottom: 1px solid #ddd;
}

.serviceBody .phoneBtn {
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #4885f5;
  font-size: 0.453333rem;
}

.defaultText {
  font-size: 0.373333rem;
  line-height: 0.533333rem;
  color: #999;
  margin: 1.6rem auto;
  text-align: center;
}
</style>

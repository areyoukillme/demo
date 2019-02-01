<template>
  <div>
    <navbar>
      {{title}}
      <div class="rightIcon f_pa" v-if="showBtn" @click.stop="toSaveDel">完成</div>
    </navbar>
    <div class="content">
      <div class="zuida">
        <div
          class="list left f_pr"
          v-for="(item,index) in friendList"
          :key="index"
          @click.stop="toDelFriend(item.friendUserId)"
        >
          <img src="../../assets/reduce.png" class="f_pa" v-if="isDel">
          <div
            class="img f_pr"
            :style="{'background':'url('+item.avatar+') no-repeat center center'}"
          >
          </div>
          <span class="txt ellipsis f_db">{{item.userName}}</span>
        </div>
        <div class="list add left f_pr" @click.stop="toAdd" v-if="!isDel"></div>
        <div class="list reduce left f_pr" @click.stop="toDel" v-if="!isDel&&friendList.length>0"></div>
      </div>
      <!-- <div class="btn" v-if="showBtn" @click.stop="toSaveDel">完成</div> -->
    </div>
  </div>
</template>
<script>
import navbar from "../../components/common/navbar";
import { getFriendData, delFriend } from "../../service/getData.js";

export default {
  data() {
    return {
      isDel: false, //是否展示删除Icon
      friendList: [], //农友列表数据
      showBtn: false, //展示完成按钮
      title: "农友圈权限设置", //标题
      friendIds: "", //选中的农友id
      showBtn: false, //展示完成按钮
      param: 0, //1（不让他(她)看我的朋友圈）,2(不看他(她)的朋友圈)
      seedFrdCircle: "", //不看他(她)的朋友圈
      seeMyCircle: "", //不让他(她)看我的朋友圈
      tokenId: String(this.$route.query.tokenId)
    };
  },
  created() {
    this.param = String(this.$route.query.type);
    this.title =
      this.param == 1 ? "不让他(她)看我的农友圈" : "不看他(她)的农友圈";
    if (this.param == 1) {
      this.seeMyCircle = "0";
      this.seedFrdCircle = "";
    } else {
      this.seeMyCircle = "";
      this.seedFrdCircle = "0";
    }
    this.getFriendList();
  },
  methods: {
    //获取农友数据
    async getFriendList() {
      let res = await getFriendData(this.param, this.tokenId);
      if (res.code == 0) {
        this.friendList = res.friendMsg;
        // console.log(this.friendList);
        
      } else {
        this.$toast(res.msg, 1500);
      }
    },
    //添加农友
    toAdd() {
      this.$router.push({ path: "addFriend", query: { param: this.param } });
    },
    //展示删除按钮
    toDel() {
      this.isDel = true;
    },
    //删除农友
    toDelFriend(id) {
      if (!this.isDel) {
        return;
      }
      if (!this.friendIds) {
        this.friendIds += id;
      } else {
        this.friendIds += "," + id;
      }
      this.friendList.forEach((data, index) => {
        if (data.friendUserId == id) {
          this.friendList.splice(index, 1);
        }
      });
      // console.log(this.friendIds)
      if (this.friendIds) {
        this.showBtn = true;
      }
    },
    //确认删除农友
    async toSaveDel() {
      let data = {
        param: this.param,
        friendUserId: this.friendIds,
        frdShowDays: "",
        seedFrdCircle: this.seedFrdCircle,
        seeMyCircle: this.seeMyCircle
      };
      let res = await delFriend(
        this.param,
        this.friendIds,
        "",
        this.seedFrdCircle,
        this.seeMyCircle,
        this.tokenId
      );
      if (res.code == 0) {
        this.$router.go(-1);
        // this.$router.push('friendSetting')
      } else {
        this.$toast(res.msg, 1500);
      }
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
  width: 100%;
  height: 100%;
  background: #f2f4f8;
  padding-top: 0.48rem;
}
.zuida {
  width: 100%;
}

.list {
  width: 1.333333rem;
  margin: 0 0.533333rem 0.533333rem 0;
  cursor: pointer;
}

.list > img {
  width: 0.666666rem;
  height: 0.666666rem;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.list:nth-of-type(5n) {
  margin-right: 0;
}

.list:nth-of-type(5n + 1) {
  margin-left: 0.6rem;
}
.add,
.reduce {
  width: 1.333333rem;
  height: 1.333333rem;
  border: 1px solid #c0c0c0;
  border-radius: 0.133333rem;
  margin-bottom: 1.12rem;
}

.add::after,
.reduce::after {
  content: "";
  position: absolute;
  width: 0.64rem;
  height: 0.053333rem;
  background: #c0c0c0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.add::before {
  content: "";
  position: absolute;
  width: 0.053333rem;
  height: 0.64rem;
  background: #c0c0c0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.img {
  width: 1.333333rem;
  height: 1.333333rem;
  border-radius: 100%;
  overflow: hidden;
  margin-bottom: 0.133333rem;
  background-size: cover !important;
}

.txt {
  text-align: center;
  line-height: 0.453333rem;
  font-size: 0.32rem;
  color: #666;
  word-break: break-all;
}

.btn {
  height: 1.173333rem;
  background: #2acc85;
  font-size: 0.426666rem;
  line-height: 1.173333rem;
  text-align: center;
  color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  cursor: pointer;
}

.rightIcon{
  top: 0;
  right: -2.4rem;
  width: 0.8rem;
  height: 100%;
  font-size: 0.4rem;
  color: #2ACC85;
}
</style>

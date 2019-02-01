<template>
  <div>
    <navbar>
      {{$route.meta.title}}
      <div class="rightIcon f_pa" v-if="showBtn" @click.stop="toAdd">完成</div>
    </navbar>
    <mt-index-list class="addPerson_list">
      <mt-index-section
        class="item"
        v-for="(item,eq) in finalFriendList"
        :key="item.title"
        :index="item.title"
      >
        <div class="listC f_pr">
          <div
            class="itemC f_pr clear ellipsis"
            v-for="(x,index) in item.list"
            :key="index"
            @click.stop="selectFriend(x)"
          >
            <img class="choose f_pa" src="../../assets/frd_choose_no.png" v-if="x.isSee==1">
            <img class="choose f_pa" src="../../assets/choose.png" v-else-if="x.isSelected">
            <img class="choose f_pa" src="../../assets/no_choose.png" v-else>
            <div
              class="img f_pa"
              :style="{'background':'url('+x.friendHeadImg+') no-repeat center center','background-size':'cover'}"
            ></div>
            {{x.friendName}}
          </div>
        </div>
        <div class="amount" v-if="eq==finalFriendList.length-1">{{friendList.length}}位联系人</div>
      </mt-index-section>
    </mt-index-list>
    <!-- <div class="btn" v-if="showBtn" @click.stop="toAdd">完成</div> -->
  </div>
</template>
<script>
import navbar from "../../components/common/navbar";
import { getAllFriendData, addFriend } from "../../service/getData.js";
import {
  convertToPinyinUpper,
  isEnglish,
  uniqueArray,
  isInArray
} from "../../config/getPy.js";

export default {
  data() {
    return {
      rightNavList: [], //导航栏
      jumpId: "", //滑到对应的索引位置
      friendList: [], //好友列表
      finalFriendList: [], //解析后的好友列表
      friendIds: [], //选中的农友id
      showBtn: false, //展示完成按钮
      param: 0, //1（不让他(她)看我的朋友圈）,2(不看他(她)的朋友圈)
      seedFrdCircle: "", //不看他(她)的朋友圈
      seeMyCircle: "", //不让他(她)看我的朋友圈
      tokenId: this.$route.query.tokenId
    };
  },
  created() {
    this.param = this.$route.query.param;
    if (this.param == 1) {
      this.seeMyCircle = 1;
      this.seedFrdCircle = "";
    } else {
      this.seeMyCircle = "";
      this.seedFrdCircle = 1;
    }
    this.getFriendList();
  },
  methods: {
    //获取农友列表数据
    async getFriendList() {
      let res = await getAllFriendData(this.tokenId);
      if (res.code == 0) {
        // console.log(res)
        res.data.forEach(data => {
          let tempObj = {};
          tempObj.title = convertToPinyinUpper(data.username.trim());
          tempObj.title = isEnglish(tempObj.title) ? tempObj.title : "#";
          tempObj.friendId = data.userId;
          tempObj.friendHeadImg = data.avatar;
          tempObj.friendName = data.username;
          if (this.param == 1) {
            tempObj.isSee = data.seeMyCircle; //是否可以查看我的农友圈
          }
          if (this.param == 2) {
            tempObj.isSee = data.seeFrdCircle; //是否可以看农友的农友圈
          }
          this.friendList.push(tempObj);
          this.rightNavList.push(tempObj.title);
        });
        this.rightNavList = uniqueArray(this.rightNavList);
        this.rightNavList.sort();
        if (isInArray(this.rightNavList, "#")) {
          this.rightNavList.splice(0, 1);
          this.rightNavList.push("#");
        }
        this.anlysicFriendListSort(this.rightNavList);
      } else {
        this.$toast(res.msg, 1500);
      }
    },
    //解析朋友列表并进行排序
    anlysicFriendListSort(list) {
      list.forEach(v1 => {
        let tempObj = {};
        tempObj.title = v1;
        tempObj.list = [];
        this.friendList.forEach(v2 => {
          if (v2.title == v1) {
            v2.isSelected = false; //选择状态
            tempObj.list.push(v2);
          }
        });
        this.finalFriendList.push(tempObj);
      });
      // console.log(this.finalFriendList);
    },
    //滑到对应的索引位置
    scrollIndexId(e) {
      this.jumpId = e == "#" ? "last" : e;
    },
    //选择农友
    async selectFriend(e) {
      //判断是否可以选择
      if (e.isSee == 1) {
        return;
      }
      let userId = e.friendId;
      let title = e.title;
      this.finalFriendList.forEach((item, index) => {
        if (title == item.title) {
          item.list.forEach((data, eq) => {
            if (userId == data.friendId) {
              data.isSelected = !data.isSelected;
              // this.$set(this.finalFriendList[index].list[eq],'isSelected',!data.isSelected);
              // console.log(this.finalFriendList[index].list[eq].isSelected);
              // 添加或删除农友id
              if (data.isSelected) {
                this.friendIds.push(userId);
              } else {
                this.friendIds.forEach((data, index) => {
                  if (data == userId) {
                    this.friendIds.splice(index, 1);
                  }
                });
              }
            }
          });
        }
        let tempArr = item;
        this.finalFriendList.splice(index, 1, tempArr);
      });
      this.showBtn = this.friendIds.length < 1 ? false : true;
    },
    //完成添加
    async toAdd() {
      let ids = this.friendIds.join(",");
      let res = await addFriend(
        String(this.param),
        ids,
        "",
        String(this.seedFrdCircle),
        String(this.seeMyCircle)
      );
      if (res.code == 0) {
        this.$router.go(-1);
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

.addPerson_content {
  width: 100%;
  height: 100%;
}

.addPerson_scroll {
  width: 100%;
  height: 100%;
}
.addPerson_list {
  width: 100%;
}
.addPerson_list .item {
  width: 100%;
}
.addPerson_list .item span {
  width: 100%;
  height: 0.773333rem;
  line-height: 0.773333rem;
  padding-left: 0.533333rem;
  font-size: 0.426666rem;
  color: #ababab;
}
.addPerson_list .item .listC {
  width: 100%;
  /* padding-right:30; */
  /* background: #fff; */
}
.addPerson_list .item .listC .itemC {
  width: 100%;
  height: 1.44rem;
  z-index: 100;
  padding-left: 2.906666rem;
  line-height: 1.44rem;
  font-size: 0.426666rem;
  font-weight: bold;
  word-break: break-all;
  overflow: hidden;
  /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; */
  background: #fff;
  margin-bottom: 0.133333rem;
  cursor: pointer;
}

.addPerson_list .item .listC .itemC .choose {
  width: 0.64rem;
  height: 0.64rem;
  top: 50%;
  left: 0.4rem;
  transform: translateY(-50%);
}
.addPerson_list .item .listC .itemC .img {
  width: 0.96rem;
  height: 0.96rem;
  left: 1.813333rem;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 100%;
  overflow: hidden;
}
.addPerson_list .item .listC .itemC:last-of-type {
  border: none;
  margin-bottom: 0;
}

.addPerson_index {
  width: 0.533333rem;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 101;
}

.amount {
  height: 1.413333rem;
  line-height: 1.413333rem;
  text-align: center;
  color: #999;
  font-size: 0.453333rem;
  background: #fff;
  border-top: 0.08rem solid #f1f1f1;
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
  z-index: 999;
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

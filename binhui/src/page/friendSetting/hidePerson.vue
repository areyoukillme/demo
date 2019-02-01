<template>
  <div>
    <navbar>{{$route.meta.title}}</navbar>
    <mt-index-list class="attention_list" v-if="finalFriendList.length>0">
      <mt-index-section
        class="item"
        v-for="(item) in finalFriendList"
        :key="item.title"
        :index="item.title"
      >
        <div class="listC f_pr">
          <div
            class="itemC f_pr clear ellipsis"
            v-for="(item,index) in item.list"
            :key="index"
            @click.stop="cancelHide(item.friendId)"
          >
            <div
              class="img f_pa"
              :style="{'background':'url('+item.friendHeadImg+') no-repeat center center','background-size':'cover'}"
            ></div>
            {{item.friendName}}
            <div class="cancel f_pa">取消屏蔽</div>
          </div>
        </div>
      </mt-index-section>
    </mt-index-list>
    <defaultpage defaultType="hidePerson" v-if="finalFriendList.length==0"></defaultpage>
  </div>
</template>
<script>
import navbar from "../../components/common/navbar";
import { getHidePerson, cancelHidePerson } from "../../service/getData.js";
import defaultpage from "../../components/common/defaultpage";
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
      page: "1",
      limit: "2000",
      isLoad: false,
      tokenId:this.$route.query.tokenId,
    };
  },
  created() {
    this.getFriendList();
  },
  methods: {
    //获取屏蔽的人列表数据
    async getFriendList() {
      let res = await getHidePerson(this.page, this.limit, this.tokenId);
      if (res.code == 0) {
        let arr = [];
        res.shieldList.list.forEach(data => {
          let tempObj = {};
          tempObj.title = convertToPinyinUpper(data.userName.trim());
          tempObj.title = isEnglish(tempObj.title) ? tempObj.title : "#";
          tempObj.friendId = data.unwatchUserId;
          tempObj.friendHeadImg = data.avatar;
          tempObj.friendName = data.userName;
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
            tempObj.list.push(v2);
          }
        });
        this.finalFriendList.push(tempObj);
      });
      // console.log(this.finalFriendList)
    },
    //滑到对应的索引位置
    scrollIndexId(e) {
      this.jumpId = e == "#" ? "last" : e;
    },
    //取消屏蔽
    async cancelHide(id) {
     this.$messagebox.confirm("确定要取消屏蔽吗?", { title: "" })
        .then(async action => {
          let res = await cancelHidePerson(String(id), "0", this.tokenId);
          if (res.code == 0) {
            this.$toast("取消屏蔽成功!", 1500);
          } else {
            this.$toast(res.msg, 1500);
          }
          //手动更新视图
          this.finalFriendList.forEach((data, sub) => {
            data.list.forEach((item, index) => {
              if (item.friendId == id) {
                data.list.splice(index, 1);
                if (data.list.length == 0) {
                  this.rightNavList.forEach((target, eq) => {
                    if (target == data.title) {
                      this.rightNavList.splice(eq, 1);
                    }
                  });
                  this.finalFriendList.splice(sub, 1);
                }
              }
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {
    navbar,
    defaultpage
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";

.attention_content {
  width: 100%;
  height: 100%;
}

.attention_scroll {
  width: 100%;
  height: 100%;
}

.attention_list {
  width: 100%;
}

.attention_list .item {
  width: 100%;
}

.attention_list .item span {
  width: 100%;
  height: 0.773333rem;
  line-height: 0.773333rem;
  padding-left: 0.533333rem;
  font-size: 0.426666rem;
  color: #ababab;
}

.attention_list .item .listC {
  width: 100%;
  /* padding: 0 30; */
  /* background: #fff; */
}

.attention_list .item .listC .itemC {
  width: 100%;
  height: 1.44rem;
  z-index: 100;
  padding-left: 1.893333rem;
  padding-right: 2rem;
  line-height: 1.44rem;
  font-size: 0.426666rem;
  font-weight: bold;
  word-break: break-all;
  overflow: hidden;
  margin-bottom: 0.133333rem;
  background: #fff;
  cursor: pointer;
}

.attention_list .item .listC .itemC .img {
  width: 0.96rem;
  height: 0.96rem;
  left: 0.4rem;
  top: 0;
  bottom: 0;
  margin: auto;
  border-radius: 100%;
  overflow: hidden;
}

.attention_list .item .listC .itemC:last-of-type {
  border: none;
  margin-bottom: 0;
}

.item .listC .itemC .cancel {
  height: 100%;
  line-height: 1.44rem;
  font-size: 0.373333rem;
  color: #4a9371;
  right: 0.506666rem;
  top: 0;
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
}
</style>

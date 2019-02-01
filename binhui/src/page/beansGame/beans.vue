<template>
    <div class="container ">
        <!-- 导航栏部分 -->
        <navbar>{{message}}</navbar>
        <div class="content">
            <div class="nav">
                <div class="header_name">{{friendName}}</div>
                <div class="header_img"><img :src="friendImg" alt="" /></div></div>
            <div class="tree_img">
                <div class="tree_bg"></div>
                <ul class="ball_box" ref="ul">
                    <li v-for="(item,index) in list" ref="lis" :style="{left:item.left+'rem',top:item.top+'rem'}" @click="pickFriend(item.ubeanId)">
                        <div><img :src="imgBaseUrl+'/abeans.png'" alt="" /></div>
                        <p>{{item.beanMoney}}</p>
                    </li>
                </ul>
            </div>
            <!-- 好友列表 -->
            <div class="friends">
                <p class="friend">好友</p>
                <ul>
                    <li v-for="(item) in friendList" @click="pickHandle(item)">
                        <div class="friend_name">
                            <div class="img"><img :src="item.handerImage" alt="" /></div>
                            <p>{{item.friendName}}</p>
                        </div>
                        <div class="pick"  v-if="item.beanStatus == 0" >
                            <div class="img"><img :src="imgBaseUrl+'pick.png'" alt="" /></div>
                            <p>可摘取</p>
                        </div>
                        <div class="pick pick99" v-else>
                            <p>已摘完</p>
                        </div>
                    </li>
                </ul>
                <p class="more" @click="loadMore">{{loadmore}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import { Toast} from 'mint-ui';
	import navbar from '../../components/common/navbar.vue'
    import {imgBaseUrl} from '../../config/env.js';
    import {
        beansList,
        friendsList,
        friendBeans,
        pickzjbeans
    } from '../../service/getData.js';
    export default {
        components:{
            navbar
        },
        data(){
            return {
                message:'摘豆游戏',
                imgBaseUrl: imgBaseUrl, //图片地址前缀
                friendUserId:'',//用于接收好友id
                friendName:'',
                friendImg:'',
                list:[],//豆豆列表数据
                friendList:[],//好友列表
                page:"1",
                limit:"10",
                loadmore:'查看更多好友',

                pWidth:0,//屏幕宽度
                pHeight:0,//屏幕高度
                divWidth:90,//div宽度
                divHeight:100,//div高度
                maxWidth:0,//最大宽度
                maxHeight:0,//最大高度
                dataArray:new Array(),
                flag:false,
				tokenId:'',
            }
        },
        created(){
			this.tokenId=this.$route.query.tokenId;
            this.friendUserId = this.$route.query.friendUserId;
            this.getData();
            this.getFriendsData();
        },
        methods:{
            //初始化
            init(){
            	this.dataArray=[];
                this.pWidth = 750;
                this.pHeight = 800;
                this.computer();
            },
            //开始
            start(){
                let _this = this;
                _this.init();
                _this.random()
                _this.list.forEach((item,index)=>{
                    this.$set(item,'left',_this.dataArray[index].left/75);
                	this.$set(item,'top',_this.dataArray[index].top/75);
                })
            },
            //随机生成left,top值
            random() {
            	let _this=this;
            	while(_this.dataArray.length<_this.list.length){
            		var left = Math.ceil(Math.random() * this.maxWidth);
            		var height = Math.ceil(Math.random() * this.maxHeight);
            		var jsonStr = {};
            		jsonStr['left'] = left;
            		jsonStr['top'] = height;
               		var rs = _this.check(jsonStr)
               		if(rs){
               			_this.dataArray.push(jsonStr)
               		}
            	} 
            },
            //计算最大高度和宽度
            computer(){
                this.maxWidth = this.pWidth - this.divWidth;
                this.maxHeight = this.pHeight  - this.divHeight;
                console.log(this.pWidth+','+this.pHeight)
                console.log(this.divWidth+','+this.divHeight)
                console.log(this.maxWidth+','+this.maxHeight)
            },
            //对li标签进行定位
            done(item,jsonStr){
                this.$set(item,'left',jsonStr.left);
                this.$set(item,'top',jsonStr.top);
            },
            //检查
            check(jsonStr){
                var _this = this;
                if (_this.dataArray.length == 0) {
                    return true;
                }
                var flag = true;
                //循环
                _this.dataArray.forEach((item)=>{
                    var maxWidthRight = Number(item.left) + Number(_this.divWidth);//x  右边最大延伸范围
                    var maxHeightBottom = Number(item.top) + Number(_this.divHeight);//y 下边最大延伸范围
                    var widthLeft = Number(item.left) - Number(_this.divWidth);//x 左边最大延伸范围
                    var heighttop = Number(item.top) - Number(_this.divHeight);//y 上边最大的延伸范围
                    //先判断x
                    if ((jsonStr.left > widthLeft && jsonStr.left < maxWidthRight) && (jsonStr.top > heighttop && jsonStr.top < maxHeightBottom)) {
                        flag=false;
                    }
                })
                return flag;
            },
            //获取豆豆列表
            async  getData(){
                let res = await friendBeans(String(this.friendUserId),this.tokenId);
                console.log(res)
                if(res.code == 0){
                    this.list = res.beans;
                    this.start();
                }
           },
           //获取好友列表
           async getFriendsData(){
                let res = await friendsList(1,this.limit,this.tokenId);
                if(res.code == 0){
                    if(res.page.list.length == 0)   _this.loadmore = '暂无好友,请添加';
                    if(res.page.totalCount > 0 && res.page.list.length < 10){
                        this.loadmore = '没有更多数据了~';
                    }
                    this.friendList = res.page.list;
                    this.friendName = res.page.list[0].friendName;
                    this.friendImg = res.page.list[0].handerImage;
                }
           },
           //偷取
           async pickFriend(ubeanId){
                let _this = this;
                let res = await pickzjbeans(String(ubeanId),'1');
                if(res.code == 0){
                    var newArr = this.list.filter(item => item.ubeanId != ubeanId )
                    this.list = newArr;
                    if(_this.list.length == 0){
                        _this.getFriendsData();
                    }
                }else if(res.code == 403){
                    Toast('收取次数已上限');
                    return false;
                }else{
                    Toast(res.msg);
                    return false;
                }
           },
           //点击好友显示对应的数据
           async pickHandle(obj){
                this.friendName = obj.friendName;
                this.friendImg = obj.handerImage;
                this.friendUserId = obj.friendUserId;
                this.getData();
           },
           //更多
           async loadMore(){
                let _this = this;
                _this.page ++;
                let res = await friendsList(this.page,this.limit,this.tokenId);
                if(res.code == 0){
                    let arr = [..._this.friendList,...res.page.list];
                    this.friendList = arr;
                    if(_this.page == res.page.totalPage){
                        _this.loadmore = '没有更多数据了~';
                        return false;
                    }
                }
           }
        },
        mounted(){
            this.init();
        }
    }
</script>
<style scoped>
    @import "beans.css";
</style>
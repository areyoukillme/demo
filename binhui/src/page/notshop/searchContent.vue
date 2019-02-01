<template>
	<div class="wrap">
		<navbar>滨惠智慧农场知识库</navbar>
		<div class="view_box" >

			<div class="search_view" :class="isIphoneX?'isipx':''">
				<div class='in'>
					<input placeholder='请输入关键字' @blur="changecancel" @focus="changecancel" v-model="searchkey" @keyup.enter="gosearch"></input>
					<div class='seek_icon'>
						<img class='fitimg' :src='imgBaseUrl+"seek_icon.png"'></img>
					</div>
					<div class='cancel' @click.stop='eliminate' v-if='issearch'>
						<img class='fitimg' :src='imgBaseUrl+"repcancel.png"'></img>
					</div>
					<span class='search_class' @click.stop='gosearch'>搜索</span>
				</div>
				<div class='classification' @click.stop='goClass'>
					<div class='img_class'>
						<img class='fitimg' :src='imgBaseUrl+"zsk_classification.png"'></img>
					</div>
					<span class='text_class'>分类</span>
				</div>
			</div>
			<!-- 列表 -->
			<div class='class_ul' v-if='!isshownull' >
				<div class='class_li' v-for='(x,index) in datalist' @click.stop='goDetails(x)'>
					<div class='title_t' v-html='x.item_title'>
					</div>
					<div class='jianjie'>
						<div class='img_s f_pr'>
							<img class='fitimg' :src='x.item_img_url'></img>
						</div>
						<div class='text_t'>
							<div class="richtext" v-html='x.item_intro'>
							</div>
						</div>
					</div>
					<div class='biaoqian'>
						<span>{{x.item_name}}</span>
					</div>
				</div>
				<div class="null_list" v-if="isShow">没有更多数据</div>
			</div>
			<div class='null_class_ul' v-if="isshownull" :class="isIphoneX?'isipx':''">
				<div class='null_img'>
					<img class='fitimg' :src='imgBaseUrl+"nullrepository.png"'></img>
				</div>
				<span>没有找到符合条件的产品</span>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import navbar from '../../components/common/navbar.vue'
	import {
		searchContent
	} from '../../service/getData.js'
	export default {
		components: {
			navbar
		},
		created() {
			this.tokenId=this.$route.query.tokenId
			this.name = this.$route.query.name || this.name;
			this.judgeIphoneX()
			this.catId = this.$route.query.catId || this.catId;
			this.search();
		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				name: '', //输入的名称
				limit: "20",
				catId: '', //带过来的id
				datalist: [],
				page: "1",
				isShow: false, //显示没有更多
				isLoad: false, //防止重复加载
				isshownull: false, //没有数据
				isIphoneX: false,
				issearch: false,
				searchkey: '',
				tokenId:''
			}
		},
		methods: {
			judgeIphoneX() {
				if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
					this.isIphoneX = true;
				} else if (/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)) {
					this.isSE = true
				}
			},
			changecancel() {
				this.issearch = !this.issearch;
			},
			eliminate() {
				this.searchkey = ''
			},
			async search() {
				let res = await searchContent(this.name, this.page, this.limit, this.catId,this.tokenId);
				if (res.code == 0) {
					this.datalist= res.PlantWikiList.pageUtil1.list
					
				 if (res.PlantWikiList.pageUtil1.list.length == 0) {
						this.isShow = false //显示没有更多
						this.isLoad = false //防止重复加载
						this.isshownull = true //没有数据
					} else {
						this.isShow = false //显示没有更多
						this.isLoad = false //防止重复加载
						this.isshownull = false //没有数据
					}
					
				} else {

				}
			},
			gosearch() {
				this.name=this.searchkey;
				this.search()
			},
			goDetails(x){
				this.$router.push({
					path:'/searchDetail',
					query:{
						id:x.id+''
					}
				})
			},
			goClass(){
				this.$router.push({
					path:'knowcategory'
				})
			}
		}
	}
</script>

<style scoped>
	
	.view_box{height: inherit;}
	.wrap{min-height: 100%;}
	.view_box {
		/* margin-top: 128px; */
		width: 100%;
		height: inherit;
	}

	/* 搜索 */

	.search_view {
		width: 100%;
		height: 1.386666rem;
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-bottom: 0.013333rem solid #f1f1f1;
		position: fixed;
		top: 1.706666rem;
		left: 0;
		z-index: 99;
	}
	.search_view.isipx{
		top:2.32rem;
	}
	.search_view .in {
		width: 8.4rem;
		height: 0.906666rem;
		position: relative;
	}

	.search_view .search_class {
		display: inline-block;
		border-radius: 0.266666rem;
		padding: 0.133333rem;
		position: absolute;
		right: -0.4rem;
		top: 50%;
		z-index: 100;
		transform: translate(-50%, -50%);
		font-size: 0.373333rem;
		color: #0c0c0c;
	}

	.search_view .cancel {
		width: 0.533333rem;
		height: 0.533333rem;
		padding: 0.133333rem;
		position: absolute;
		right: 0.933333rem;
		top: 50%;
		z-index: 100;
		transform: translate(-50%, -50%);
		font-size: 0.373333rem;
		color: #0c0c0c;
	}

	.search_view input {
		width: 8.4rem;
		height: 100%;
		border-radius: 1.333333rem;
		padding-left: 1.146666rem;
		padding-right: 1.866666rem;
		font-size: 0.373333rem;
		background: #f8f8f8;
	}

	.search_view .seek_icon {
		width: 0.48rem;
		height: 0.48rem;
		position: absolute;
		left: 0.4rem;
		top: 50%;
		margin-top: -0.2rem;
	}

	/* 分类按钮 */

	.classification {
		width: 1.28rem;
		height: 1.306666rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.classification .img_class {
		width: 0.493333rem;
		height: 0.493333rem;
		position: relative;
	}

	.classification .text_class {
		font-size: 0.266666rem;
		color: #5b5b5b;
	}

	/* 列表 */

	.class_ul {
		width: 100%;
		margin-top: 1.54rem;
	}

	.class_li {
		width: 9.733333rem;
		/* height: 300px; */
		margin: 0 auto;
		border-radius: 0.133333rem;
		margin-bottom: 0.266666rem;
		padding-left: 0.32rem;
		padding-right: 0.32rem;
		background: #fff;
		padding-bottom: 0.266666rem;
	}

	.title_t {
		display: block;
		/* line-height: 90px; */
		padding: 0.266666rem 0;
		font-size: 0.453333rem;
		color: #262626;
		font-weight: bold;
	}

	.jianjie {
		width: 100%;
		height: 1.813333rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}

	.jianjie .img_s {
		width: 2.8rem;
		height: 1.76rem;
		border-radius: 0.16rem;
		overflow: hidden;
	}

	.jianjie .text_t {
		width: 6.28rem;
		height: 1.813333rem;
		overflow: hidden;
	}

	.jianjie .text_t div {
		height: 1.775rem;
		font-size: 0.32rem;
		color: #6a6a6a;
		word-wrap:break-word;
		text-overflow: ellipsis;
		display: -webkit-box;
		/* autoprefixer:off */
		-webkit-box-orient: vertical;
		/* autoprefixer:on */
		-webkit-line-clamp: 4;
		overflow: hidden;
	}

	.biaoqian {
		width: 100%;
		height: 0.48rem;
		margin-top: 0.24rem;
		margin-bottom: 0.24rem;
	}

	.biaoqian span {
		display: inline-block;
		border: 1px solid #2acc85;
		border-radius: 1.333333rem;
		padding: 0.053333rem 0.266666rem;
		font-size: 0.266666rem;
		color: #2acc85;
		text-align: center;
	}

	.null_list {
		width: 100%;
		height: 1.053333rem;
		text-align: center;
		color: #999;
		font-size: 0.32rem;
		/* position: absolute;
    bottom: 0;
    left: 0; */
		line-height: 1.053333rem;
		margin-top: 0.4rem;
	}

	/* .null_list::after {
    width: 225px;
    height: 1px;
    background: #999;
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
}

.null_list::before {
    width: 225px;
    height: 1px;
    background: #999;
    content: '';
    display: block;
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
} */

	.null_class_ul {
		width: 100%;
		/* height: 100%; */
		padding-top: 3.066666rem;
		display: flex;
		align-items: center;
		flex-direction: column;
		background: #FFF;
		padding-bottom: 7.733333rem;
	}
	.null_class_ul.isipx{padding-bottom: 11.1rem;}
	.null_img {
		width: 5.28rem;
		height: 4.293333rem;
		margin-bottom: 0.333333rem;
		position: relative;
		overflow: hidden;
	}

	.null_class_ul span {
		font-size: 0.453333rem;
		color: #b0b0b0;
	}

	/* iPhone X适配 */
	.iphoneX .search_view {
		top: 2.346666rem;
	}

	/* .iphoneX */
</style>

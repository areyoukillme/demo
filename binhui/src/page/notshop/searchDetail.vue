<template>
	<div class="wrap">
		<navbar>知识库详情</navbar>
		<div class="view_box">
			<div class="index_swiper f_pr">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(img,index) in imgarr" :key="index">
						<div class="imgbox">
							<img class='fitimg3' :src="img.imgUrl" preview="img.imgUrl" />
						</div>
					</div>
				</div>
			</div>
			<div class='class_name'>
				<span class='crop_name'>{{Detailsdata.title}}</span><span class='biaoqian'>{{Detailsdata.name}}</span>
			</div>
			<span class='biecheng'>别称：{{Detailsdata.tag}}</span>
			<div class='neirong'>
				<div class='rich-text' v-html='goodsDesc' id='mjltest' :style='{zoom:richW}'></div>
			</div>
		</div>
	</div>
</template>
<script>
	import Swiper from 'swiper'
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import navbar from '../../components/common/navbar.vue'
	import {
		searchDetail
	} from '../../service/getData.js'
	export default {
		components: {
			navbar
		},
		created() {
			this.judgeIphoneX()
			this.id = this.$route.query.id;
		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl, //图片地址前缀
				name: '', //输入的名称
				limit: 1,
				catId: '', //带过来的id
				datalist: [],
				page: 1,
				isShow: false, //显示没有更多
				isLoad: false, //防止重复加载
				isshownull: false, //没有数据
				isIphoneX: false,
				issearch: false,
				searchkey: '',
				id: '', //传过来的id
				Detailsdata: {}, //商品详情对象
				imgarr: [], //轮播图
				name: '', //搜索名称
				goodsDesc: '', //简介
				richW: '', //详情比例

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
			async searchDetail() {
				let res = await searchDetail(this.id);
				if (res.code == 0) {
					this.Detailsdata = res.page;
					this.imgarr = res.pltWikiImg;
					this.goodsDesc = res.page.content;
				}
			},
			gosearch() {
				this.$router.push({
					path: './searchContent',
					query: {
						name: this.searchkey
					}
				})
			},
			goClass() {
				this.$router.push({
					path: 'knowcategory',

				})
			}

		},
		mounted() {
			let that = this
			this.searchDetail().then(function() {
				that.$nextTick(function(){
					setTimeout(function(){
						var swiperShow = new Swiper('.index_swiper', {
							slidesPerView: 'auto',
							watchSlidesProgress: true,
							spaceBetween: 0,
							//20
							resistanceRatio: 1,
							initialSlide:0,
							obserVer:true,
							obserVeParents:true
						})
					},10)
					
				})
			})
			let dpr = document.getElementsByTagName('html')[0].getAttribute('data-dpr')
			this.richW = dpr / 2;
		}
	}
</script>

<style scoped lang="scss">
	//富文本
	.richtext {
		width: 100%;
	}

	.fitimg3 {
		object-fit: cover;
	}

	.mint-swipe-item {
		margin-right: 0.266666rem;
	}

	.wrap {
		background: #fff;
	}

	.view_box {
		/* margin-top: 128px; */
		width: 100%;
		height: 100%;
		background: #fff;
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
		background: #fff;
		-webkit-overflow-scroll:touch;
	}

	.search_view.isipx {
		top: 2.32rem !important;
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



	.index_swiper {
		margin-bottom: 0.533333rem;
		padding-left: 0.32rem;
		margin-top: 0.266666rem;
	}

	.index_swiper,
	.index_swiper swiper,
	.index_swiper {
		width: 100%;
		height: 4.613333rem;
		overflow: hidden;

		.swiper-slide {
			width: 85%;
			margin-right: 5%;

			.imgbox {
				overflow: hidden;
				height: 4.613333rem;
			}

			img {
				width: 100%;
				max-height: 100%;
				border-radius: 0.266666rem;
			}
		}
	}


	/* 规格 */

	.class_name {
		width: 100%;
		padding: 0.053333rem 0.32rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.class_name .crop_name {
		display: inline-block;
		font-size: 0.586666rem;
		color: #1e1e1e;
		font-weight: bold;
	}

	.class_name .biaoqian {
		margin-left: 0.32rem;
		display: inline-block;
		padding: 0.013333rem 0.266666rem;
		background: #f55;
		border-radius: 1.333333rem;
		font-size: 0.266666rem;
		color: #fff;
	}

	.biecheng {
		display: block;
		width: 100%;
		/* height: 34px; */
		margin-top: 0.213333rem;
		font-size: 0.32rem;
		color: #9f9f9f;
		padding: 0.053333rem 0.32rem;
	}

	/* 内容 */

	.neirong {
		border-top: 0.013333rem solid #f1f1f1;
		margin-top: 0.666666rem;
		/* font-size: 28px; */
		/* color: #666; */
		width: 9.466666rem;
		max-height: 1333.32rem;
		padding-bottom: 1.333333rem;
		overflow: hidden;
		background: #fff;
		margin: 0.266666rem;
		z-index: 99999;
	}

	.neirong_box {
		width: 100%;
		/* display: table; */
		overflow: hidden;
	}

	.rich-text {

		width: 100%;
		max-height: 99999px;

		/deep/ img {
			max-width: 100% !important;
		}
	}

	.swiper-container {
		margin: 0 auto;
		position: relative;
		overflow: hidden;
		list-style: none;
		padding: 0;
		z-index: 1
	}

	.swiper-container-no-flexbox .swiper-slide {
		float: left
	}

	.swiper-container-vertical>.swiper-wrapper {
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column
	}

	.swiper-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 1;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-transition-property: -webkit-transform;
		transition-property: -webkit-transform;
		-o-transition-property: transform;
		transition-property: transform;
		transition-property: transform, -webkit-transform;
		-webkit-box-sizing: content-box;
		box-sizing: content-box
	}

	.swiper-container-android .swiper-slide,
	.swiper-wrapper {
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0)
	}

	.swiper-container-multirow>.swiper-wrapper {
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap
	}

	.swiper-container-free-mode>.swiper-wrapper {
		-webkit-transition-timing-function: ease-out;
		-o-transition-timing-function: ease-out;
		transition-timing-function: ease-out;
		margin: 0 auto
	}

	.swiper-slide {
		-webkit-flex-shrink: 0;
		-ms-flex-negative: 0;
		flex-shrink: 0;
		width: 100%;
		height: 100%;
		position: relative;
		-webkit-transition-property: -webkit-transform;
		transition-property: -webkit-transform;
		-o-transition-property: transform;
		transition-property: transform;
		transition-property: transform, -webkit-transform
	}

	.swiper-slide-invisible-blank {
		visibility: hidden
	}

	.swiper-container-autoheight,
	.swiper-container-autoheight .swiper-slide {
		height: auto
	}

	.swiper-container-autoheight .swiper-wrapper {
		-webkit-box-align: start;
		-webkit-align-items: flex-start;
		-ms-flex-align: start;
		align-items: flex-start;
		-webkit-transition-property: height, -webkit-transform;
		transition-property: height, -webkit-transform;
		-o-transition-property: transform, height;
		transition-property: transform, height;
		transition-property: transform, height, -webkit-transform
	}

	.swiper-container-3d {
		-webkit-perspective: 1200px;
		perspective: 1200px
	}

	.swiper-container-3d .swiper-cube-shadow,
	.swiper-container-3d .swiper-slide,
	.swiper-container-3d .swiper-slide-shadow-bottom,
	.swiper-container-3d .swiper-slide-shadow-left,
	.swiper-container-3d .swiper-slide-shadow-right,
	.swiper-container-3d .swiper-slide-shadow-top,
	.swiper-container-3d .swiper-wrapper {
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d
	}

	.swiper-container-3d .swiper-slide-shadow-bottom,
	.swiper-container-3d .swiper-slide-shadow-left,
	.swiper-container-3d .swiper-slide-shadow-right,
	.swiper-container-3d .swiper-slide-shadow-top {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 10
	}

	.swiper-container-3d .swiper-slide-shadow-left {
		background-image: -webkit-gradient(linear, right top, left top, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, 0)));
		background-image: -webkit-linear-gradient(right, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: -o-linear-gradient(right, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: linear-gradient(to left, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0))
	}

	.swiper-container-3d .swiper-slide-shadow-right {
		background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, 0)));
		background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: -o-linear-gradient(left, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: linear-gradient(to right, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0))
	}

	.swiper-container-3d .swiper-slide-shadow-top {
		background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, 0)));
		background-image: -webkit-linear-gradient(bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: -o-linear-gradient(bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: linear-gradient(to top, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0))
	}

	.swiper-container-3d .swiper-slide-shadow-bottom {
		background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, 0)));
		background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: -o-linear-gradient(top, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0))
	}

	.swiper-container-wp8-horizontal,
	.swiper-container-wp8-horizontal>.swiper-wrapper {
		-ms-touch-action: pan-y;
		touch-action: pan-y
	}

	.swiper-container-wp8-vertical,
	.swiper-container-wp8-vertical>.swiper-wrapper {
		-ms-touch-action: pan-x;
		touch-action: pan-x
	}

	.swiper-button-next,
	.swiper-button-prev {
		position: absolute;
		top: 50%;
		width: 27px;
		height: 44px;
		margin-top: -22px;
		z-index: 10;
		cursor: pointer;
		background-size: 27px 44px;
		background-position: center;
		background-repeat: no-repeat
	}

	.swiper-button-next.swiper-button-disabled,
	.swiper-button-prev.swiper-button-disabled {
		opacity: .35;
		cursor: auto;
		pointer-events: none
	}

	.swiper-button-prev,
	.swiper-container-rtl .swiper-button-next {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E");
		left: 10px;
		right: auto
	}

	.swiper-button-next,
	.swiper-container-rtl .swiper-button-prev {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E");
		right: 10px;
		left: auto
	}

	.swiper-button-prev.swiper-button-white,
	.swiper-container-rtl .swiper-button-next.swiper-button-white {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E")
	}

	.swiper-button-next.swiper-button-white,
	.swiper-container-rtl .swiper-button-prev.swiper-button-white {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E")
	}

	.swiper-button-prev.swiper-button-black,
	.swiper-container-rtl .swiper-button-next.swiper-button-black {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E")
	}

	.swiper-button-next.swiper-button-black,
	.swiper-container-rtl .swiper-button-prev.swiper-button-black {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E")
	}

	.swiper-button-lock {
		display: none
	}

	.swiper-pagination {
		position: absolute;
		text-align: center;
		-webkit-transition: .3s opacity;
		-o-transition: .3s opacity;
		transition: .3s opacity;
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
		z-index: 10
	}

	.swiper-pagination.swiper-pagination-hidden {
		opacity: 0
	}

	.swiper-container-horizontal>.swiper-pagination-bullets,
	.swiper-pagination-custom,
	.swiper-pagination-fraction {
		bottom: 10px;
		left: 0;
		width: 100%
	}

	.swiper-pagination-bullets-dynamic {
		overflow: hidden;
		font-size: 0
	}

	.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
		-webkit-transform: scale(.33);
		-ms-transform: scale(.33);
		transform: scale(.33);
		position: relative
	}

	.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active {
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1)
	}

	.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main {
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1)
	}

	.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev {
		-webkit-transform: scale(.66);
		-ms-transform: scale(.66);
		transform: scale(.66)
	}

	.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev {
		-webkit-transform: scale(.33);
		-ms-transform: scale(.33);
		transform: scale(.33)
	}

	.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next {
		-webkit-transform: scale(.66);
		-ms-transform: scale(.66);
		transform: scale(.66)
	}

	.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next {
		-webkit-transform: scale(.33);
		-ms-transform: scale(.33);
		transform: scale(.33)
	}

	.swiper-pagination-bullet {
		width: 8px;
		height: 8px;
		display: inline-block;
		border-radius: 100%;
		background: #000;
		opacity: .2
	}

	button.swiper-pagination-bullet {
		border: none;
		margin: 0;
		padding: 0;
		-webkit-box-shadow: none;
		box-shadow: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none
	}

	.swiper-pagination-clickable .swiper-pagination-bullet {
		cursor: pointer
	}

	.swiper-pagination-bullet-active {
		opacity: 1;
		background: #007aff
	}

	.swiper-container-vertical>.swiper-pagination-bullets {
		right: 10px;
		top: 50%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0)
	}

	.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet {
		margin: 6px 0;
		display: block
	}

	.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
		top: 50%;
		-webkit-transform: translateY(-50%);
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
		width: 8px
	}

	.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
		display: inline-block;
		-webkit-transition: .2s top, .2s -webkit-transform;
		transition: .2s top, .2s -webkit-transform;
		-o-transition: .2s transform, .2s top;
		transition: .2s transform, .2s top;
		transition: .2s transform, .2s top, .2s -webkit-transform
	}

	.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet {
		margin: 0 4px
	}

	.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
		left: 50%;
		-webkit-transform: translateX(-50%);
		-ms-transform: translateX(-50%);
		transform: translateX(-50%);
		white-space: nowrap
	}

	.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
		-webkit-transition: .2s left, .2s -webkit-transform;
		transition: .2s left, .2s -webkit-transform;
		-o-transition: .2s transform, .2s left;
		transition: .2s transform, .2s left;
		transition: .2s transform, .2s left, .2s -webkit-transform
	}

	.swiper-container-horizontal.swiper-container-rtl>.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
		-webkit-transition: .2s right, .2s -webkit-transform;
		transition: .2s right, .2s -webkit-transform;
		-o-transition: .2s transform, .2s right;
		transition: .2s transform, .2s right;
		transition: .2s transform, .2s right, .2s -webkit-transform
	}

	.swiper-pagination-progressbar {
		background: rgba(0, 0, 0, .25);
		position: absolute
	}

	.swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
		background: #007aff;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		-webkit-transform: scale(0);
		-ms-transform: scale(0);
		transform: scale(0);
		-webkit-transform-origin: left top;
		-ms-transform-origin: left top;
		transform-origin: left top
	}

	.swiper-container-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
		-webkit-transform-origin: right top;
		-ms-transform-origin: right top;
		transform-origin: right top
	}

	.swiper-container-horizontal>.swiper-pagination-progressbar,
	.swiper-container-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite {
		width: 100%;
		height: 4px;
		left: 0;
		top: 0
	}

	.swiper-container-horizontal>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,
	.swiper-container-vertical>.swiper-pagination-progressbar {
		width: 4px;
		height: 100%;
		left: 0;
		top: 0
	}

	.swiper-pagination-white .swiper-pagination-bullet-active {
		background: #fff
	}

	.swiper-pagination-progressbar.swiper-pagination-white {
		background: rgba(255, 255, 255, .25)
	}

	.swiper-pagination-progressbar.swiper-pagination-white .swiper-pagination-progressbar-fill {
		background: #fff
	}

	.swiper-pagination-black .swiper-pagination-bullet-active {
		background: #000
	}

	.swiper-pagination-progressbar.swiper-pagination-black {
		background: rgba(0, 0, 0, .25)
	}

	.swiper-pagination-progressbar.swiper-pagination-black .swiper-pagination-progressbar-fill {
		background: #000
	}

	.swiper-pagination-lock {
		display: none
	}

	.swiper-scrollbar {
		border-radius: 10px;
		position: relative;
		-ms-touch-action: none;
		background: rgba(0, 0, 0, .1)
	}

	.swiper-container-horizontal>.swiper-scrollbar {
		position: absolute;
		left: 1%;
		bottom: 3px;
		z-index: 50;
		height: 5px;
		width: 98%
	}

	.swiper-container-vertical>.swiper-scrollbar {
		position: absolute;
		right: 3px;
		top: 1%;
		z-index: 50;
		width: 5px;
		height: 98%
	}

	.swiper-scrollbar-drag {
		height: 100%;
		width: 100%;
		position: relative;
		background: rgba(0, 0, 0, .5);
		border-radius: 10px;
		left: 0;
		top: 0
	}

	.swiper-scrollbar-cursor-drag {
		cursor: move
	}

	.swiper-scrollbar-lock {
		display: none
	}

	.swiper-zoom-container {
		width: 100%;
		height: 100%;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		text-align: center
	}

	.swiper-zoom-container>canvas,
	.swiper-zoom-container>img,
	.swiper-zoom-container>svg {
		max-width: 100%;
		max-height: 100%;
		-o-object-fit: contain;
		object-fit: contain
	}

	.swiper-slide-zoomed {
		cursor: move
	}

	.swiper-lazy-preloader {
		width: 42px;
		height: 42px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -21px;
		margin-top: -21px;
		z-index: 10;
		-webkit-transform-origin: 50%;
		-ms-transform-origin: 50%;
		transform-origin: 50%;
		-webkit-animation: swiper-preloader-spin 1s steps(12, end) infinite;
		animation: swiper-preloader-spin 1s steps(12, end) infinite
	}

	.swiper-lazy-preloader:after {
		display: block;
		content: '';
		width: 100%;
		height: 100%;
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
		background-position: 50%;
		background-size: 100%;
		background-repeat: no-repeat
	}

	.swiper-lazy-preloader-white:after {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
	}

	@-webkit-keyframes swiper-preloader-spin {
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg)
		}
	}

	@keyframes swiper-preloader-spin {
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg)
		}
	}

	.swiper-container .swiper-notification {
		position: absolute;
		left: 0;
		top: 0;
		pointer-events: none;
		opacity: 0;
		z-index: -1000
	}

	.swiper-container-fade.swiper-container-free-mode .swiper-slide {
		-webkit-transition-timing-function: ease-out;
		-o-transition-timing-function: ease-out;
		transition-timing-function: ease-out
	}

	.swiper-container-fade .swiper-slide {
		pointer-events: none;
		-webkit-transition-property: opacity;
		-o-transition-property: opacity;
		transition-property: opacity
	}

	.swiper-container-fade .swiper-slide .swiper-slide {
		pointer-events: none
	}

	.swiper-container-fade .swiper-slide-active,
	.swiper-container-fade .swiper-slide-active .swiper-slide-active {
		pointer-events: auto
	}

	.swiper-container-cube {
		overflow: visible
	}

	.swiper-container-cube .swiper-slide {
		pointer-events: none;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		z-index: 1;
		visibility: hidden;
		-webkit-transform-origin: 0 0;
		-ms-transform-origin: 0 0;
		transform-origin: 0 0;
		width: 100%;
		height: 100%
	}

	.swiper-container-cube .swiper-slide .swiper-slide {
		pointer-events: none
	}

	.swiper-container-cube.swiper-container-rtl .swiper-slide {
		-webkit-transform-origin: 100% 0;
		-ms-transform-origin: 100% 0;
		transform-origin: 100% 0
	}

	.swiper-container-cube .swiper-slide-active,
	.swiper-container-cube .swiper-slide-active .swiper-slide-active {
		pointer-events: auto
	}

	.swiper-container-cube .swiper-slide-active,
	.swiper-container-cube .swiper-slide-next,
	.swiper-container-cube .swiper-slide-next+.swiper-slide,
	.swiper-container-cube .swiper-slide-prev {
		pointer-events: auto;
		visibility: visible
	}

	.swiper-container-cube .swiper-slide-shadow-bottom,
	.swiper-container-cube .swiper-slide-shadow-left,
	.swiper-container-cube .swiper-slide-shadow-right,
	.swiper-container-cube .swiper-slide-shadow-top {
		z-index: 0;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden
	}

	.swiper-container-cube .swiper-cube-shadow {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: #000;
		opacity: .6;
		-webkit-filter: blur(50px);
		filter: blur(50px);
		z-index: 0
	}

	.swiper-container-flip {
		overflow: visible
	}

	.swiper-container-flip .swiper-slide {
		pointer-events: none;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		z-index: 1
	}

	.swiper-container-flip .swiper-slide .swiper-slide {
		pointer-events: none
	}

	.swiper-container-flip .swiper-slide-active,
	.swiper-container-flip .swiper-slide-active .swiper-slide-active {
		pointer-events: auto
	}

	.swiper-container-flip .swiper-slide-shadow-bottom,
	.swiper-container-flip .swiper-slide-shadow-left,
	.swiper-container-flip .swiper-slide-shadow-right,
	.swiper-container-flip .swiper-slide-shadow-top {
		z-index: 0;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden
	}

	.swiper-container-coverflow .swiper-wrapper {
		-ms-perspective: 1200px
	}
</style>

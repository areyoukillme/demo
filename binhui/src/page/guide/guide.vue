<template>
	<div>
		<navbar>新手指导</navbar>
	<div class=" guide_content" >
		<img :src='imgBaseUrl+"guide_01.png"' mode='widthFix'></img>
		<img :src='imgBaseUrl+"guide_02.png"' mode='widthFix'></img>
		<img :src='imgBaseUrl+"guide_03.png"' mode='widthFix'></img>
	</div>
	</div>
</template>

<script>
	import {
		imgBaseUrl
	} from '../../config/env.js'
	import navbar from '../../components/common/navbar.vue'
	export default {
		components:{
			navbar
		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				isIphoneX:''
			};
		},
		created(){this.judgeIphoneX()},
		methods:{
			judgeIphoneX() {
				if(/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)){
					this.isIphoneX=true;
				}else if(/iphone/gi.test(navigator.userAgent) && (screen.height == 568 && screen.width == 320)){
					this.isSE=true
				}
			},
		}
	}
</script>

<style scoped>
	.guide_content {
		width: 10rem;
		overflow: hidden;
	}

	img {
		width: 100%;
		display: block;
	}
</style>

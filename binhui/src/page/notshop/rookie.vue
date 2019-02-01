<template>
	<div>
		<navbar>新手指导</navbar>
		<div class="guide_content mgnav">
			<img :src='imgBaseUrl+"guide_01.png"'  class='widthFix'>
			<img :src="imgBaseUrl+'/guide_02.png'" class='widthFix'>
			<img :src="imgBaseUrl+'/guide_03.png'" class='widthFix'>
		</div>
	</div>
</template>

<script>
	import {imgBaseUrl} from '../../config/env.js'
	import navbar from '../../components/common/navbar.vue'
	export default {
		components:{navbar},
		data() {
			return {
				imgBaseUrl:imgBaseUrl
			};
		}
	}
</script>

<style scoped>
	.guide_content {
		width: 100%;
		overflow: hidden;
	}

	img{
		width: 100%;
		display: block;
	}
</style>

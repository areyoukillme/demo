<template>
	<div class="adbox">
		<navbar>外部链接</navbar>
		<iframe :src="webUrl" frameborder="0" class="ad" scrolling="yes"></iframe>
	</div>
</template>

<script>
	import navbar from "../../components/common/navbar.vue"
	export default {
		components:{navbar},
		data() {
			return {
				webUrl:this.$route.query.webUrl
			};
		}
	}
</script>

<style scoped>
	.adbox{
		display: flex;
		height: 100%;
		flex-direction: column;
		overflow: hidden;
	}
	.ad{width:102%;flex:1;overflow: hidden;}
</style>

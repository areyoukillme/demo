<template>
	<div v-infinite-scroll="infinite" infinite-scroll-disabled="disabled" infinite-scroll-distance="1500">
		<slot name="content"></slot>
		<span class="note_msg f_db f_tac f_pr" v-if="disabled">没有更多数据</span>
	</div>
</template>

<script>
	
	export default {
		data(){
			return {
				
			}
		},
		
		methods: {
			
		},
		props:['infinite','disabled']
	}
</script>

<style lang="scss" scoped>
	@import '../../style/mixin';
	
	.note_msg{
		width: 100%;
		line-height: 1.066666rem;
		font-size:0.346666rem;
		color:#999;
	}
	
	// .note_msg:after{
	// 	content: "";
	// 	position: absolute;
	// 	width: 30%;
	// 	height: 1px;
	// 	background: #999;
	// 	margin: auto;
	// 	top: 0;
	// 	bottom: 0;
	// 	left: 0.4rem;
	// }
	
	// .note_msg:before{
	// 	content: "";
	// 	position: absolute;
	// 	width: 30%;
	// 	height: 1px;
	// 	background: #999;
	// 	margin: auto;
	// 	top: 0;
	// 	bottom: 0;
	// 	right: 0.4rem;
	// }
	
</style>

<template>
	<div class="com-widget-goTop" @click.stop="_gotop" v-if="showTop">
		<div class="icon-gotop">
			<img :src="imgBaseUrl+'returnTop.png'" />
		</div>
	</div>
</template>

<script>
	import {
		smoothScrollTop
	} from '../../config/mUtils'
	import {imgBaseUrl} from '../../config/env.js'
	export default {
		props: {
			showTop: {
				default: false
			},
			duration: {
				default: 0
			}

		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl
			}
		},
		methods: {
			_gotop() {
				smoothScrollTop()
			}
		},
	}
</script>

<style scoped>
	.com-widget-goTop {
		width: 1.093333rem;
		height: 1.093333rem;
		position: fixed;
		bottom: 1.413333rem;
		left: 0.266666rem;
		border-radius: 50%;
		overflow: hidden;
		z-index: 50000;
	}

	.com-widget-goTop .icon-gotop {
		display: inline-block;
		width: 1.04rem;
		height: 1.04rem;
		text-align: center;
		border-radius: 50%;
	}

	.com-widget-goTop .icon-gotop img {
		width: 100%;
		height: 100%;
	}
</style>

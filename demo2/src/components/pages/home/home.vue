<template>
	<div class="blockchain">
		<div class="blockchain-banner"></div>
		<newest></newest>	
		<recommend></recommend>
		<stylist></stylist>
	</div>
</template>
<script>
import {getStorage,setStorage} from "../../../assets/cookie.js"
import Particle from "./particle.vue"
import newest from "./newest.vue"
import recommend from "./recommend.vue"
import stylist from "./stylist.vue"
export default {
  	data(){
  		return{

  		}
  	},
  	components:{
	  	newest,
	  	recommend,
	  	stylist
	  },
};
</script>

<style scoped lang="scss">
	.blockchain{
		background:#eee;
	}
	.blockchain-banner{
		
		height: 530px;
		width: 100%;
		background: url(/static/images/qkl_banner.jpg) no-repeat;
		background-position: center;
		position: relative;
	}
</style>

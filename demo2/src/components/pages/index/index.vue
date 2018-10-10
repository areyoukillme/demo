<template>
	<div>
    	<CommonNav></CommonNav>
    	<router-view></router-view>
    	<CommonFoot />
	</div>
</template>



<script>
    import CommonNav from '../../commons/CommonNav.vue'
    import CommonFoot from '../../commons/CommonFoot.vue'

	export default{  
        components:{CommonNav,CommonFoot},
        data(){
            return{
                
            }
        },
        computed:{
        
        },
        methods:{

        }
  
   
    }
</script>

<style>
</style>
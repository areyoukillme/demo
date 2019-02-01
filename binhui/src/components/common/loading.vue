 <template >
 	<div class="loading_bg" @touchmove.prevent>
		<div class="loading_container">
			<mt-spinner :type="3" :size="40" color="green"></mt-spinner>
		</div>	
	</div>
</template>

<script>
    export default {
    	data(){
            return{
                positionY: 0,
                timer: null,
            }
        },
        mounted(){
        	this.timer = setInterval(() => {
        		this.positionY ++;
        	}, 600)
        },
        beforeDestroy(){
        	clearInterval(this.timer);
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .loading_container{
    	position: absolute;
    	margin: auto;
    	left: 0;
    	right: 0;
    	top: 0;
    	bottom: 0;
		  width: 0.666666rem;
		  height: 0.666666rem;
    }
   
	.loading_bg{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 999;

	}
</style>

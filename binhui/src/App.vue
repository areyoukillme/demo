<template>
  <div class="wrap">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
		<router-view v-if="!$route.meta.keepAlive" class="Router"></router-view>
		<div v-wechat-title="$route.meta.title"></div>
    <transition name="loading">
      <loading v-if="fetchLoading"></loading>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import loading from "./components/common/loading";
import store from "./store/";

export default {
  data: function() {
    return {
		};
  },
  store,
  computed: {
    ...mapGetters(["fetchLoading"]),
		...mapGetters(["transitionName"])
  },
  components: {
    loading
  },
  created() {
	},
  mounted() {},


};
</script>
<style lang="scss">
.wrap {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  position: relative;
  background: #f2f4f8;
  .site-main {
    flex: 1;
  }
}


</style>

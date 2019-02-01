import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	fetchLoading: false,//加载动画
  	isAdmin:false,
	havetop:true, //是否有头部
	transitionName: 'slide-left'
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations
})

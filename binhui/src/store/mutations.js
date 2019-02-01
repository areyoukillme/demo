import { FETCH_LOADING,IS_ADMIN} from './mutation-types.js' //用常量代替方法名

export default { //导出方法
	[FETCH_LOADING](state, res) {
		state.fetchLoading = res
	},
  [IS_ADMIN](state, type) {
    state.isAdmin= type===0;
  },

}

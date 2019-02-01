import {FETCH_LOADING, IS_ADMIN} from './mutation-types.js'

export default {
  FETCH_LOADING({
                  commit
                }, res) {
    commit(FETCH_LOADING, res)
  },
  IS_ADMIN({
                 commit
               }, res) {
    commit(IS_ADMIN, res)
  },
	
}




import Vue from 'vue'
import Vuex from 'vuex'
import {getStorage,setStorage} from "../assets/cookie.js"
Vue.use(Vuex)

 const state = {
 	islogin:false,
 	token:"",
 	userInfo:{}
 }
 const mutations = {
 	LOGIN (state,token){
 		state.islogin  = true;
 		state.token = token;
 	},
 	LOGOUT(state){
 		state.islogin = false;
 	},
 	SETUSER(state,face){
 		state.userInfo.face = face
 	}
 }
 const actions = {
 	login (context,token){
 		context.commit("LOGIN",token)
 	},
 	logout (context){
 		context.commit("LOGOUT")
 		// window.localStorage.clear()
 	},
 	setuser(context,face){
 		context.commit("SETUSER",face)
 	}
 }


export default new Vuex.Store({
	state,
	mutations,
	actions,
})
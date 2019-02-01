import Vue from 'vue'
import {
	returnLogin
} from './mixin'
import store from '../store/'
import {
	axios
} from './env'
import bridge from './bridge.js'
import {Toast} from 'mint-ui'
var Component = Vue.extend({
	mixins: [returnLogin]
})

let component = new Component();
// 超时时间
axios.defaults.timeout = 10000;
// http请求拦截器
axios.interceptors.request.use(config => {
	store.dispatch('FETCH_LOADING', true);
	return config
}, error => {
	store.dispatch('FETCH_LOADING', false);
	component.loadTimeOut();
	return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
	store.dispatch('FETCH_LOADING', false);
		if(data.data.code==401){
			Toast({
				message:'要先去登录哦'
			})
			setTimeout(function(){
				bridge.callhandler('gologin')
			},1000)	
		};
	return data
}, error => {
	store.dispatch('FETCH_LOADING', false);
	component.loadFail();
	return Promise.reject(error)
})

//默认携带cookie
axios.defaults.withCredentials = true;

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['apiAccesskey'] = '888888zy20180316apiAccesskey'


if (process.env.NODE_ENV == 'development') {
	// axios.defaults.headers['Cookie'] = 'DTL_SESSION_ID=97578fc6-1dbc-48f7-8bd4-52935c97ec2c';
}




export default async (url = '', data = {}, type = 'get',tokenId, ContentType = '') => {
	let params = {};

	if (type === 'get') {
		Object.keys(data).forEach(key => {
			params[key] = data[key];
		})
	}

	if (type === 'post' && ContentType === '') {
		//		data = JSON.stringify(data);
		data = data;
	}

	if (ContentType !== '') {
		axios.defaults.headers.post['Content-Type'] = ContentType;
		
	}
	if(tokenId){
		axios.defaults.headers['token'] = tokenId;
	}
	let requestConfig = {
		url: url,
		method: type,
		params: params,
		data: data,
		responseType: 'json'
	}
	try {
		const response = await axios(url, requestConfig);
		return response.data;
	} catch (error) {
		throw new Error(error)
	}
}

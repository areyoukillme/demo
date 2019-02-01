import axios from 'axios'
/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = ''; 
let loginUrl='';
let routerMode = 'history';
let imgBaseUrl = 'https://bhmall.zhiyesoft.cn/mp_images/farm/';
// let firstUrl='https://bhmall.zhiyesoft.cn/';
let firstUrl='https://bushop.zhiyesoft.cn/';
//服务端接口前缀
// let serviceUrl='https://bh2015.com';
let serviceUrl= window.location.origin;
//消息推送地址
// let websocketUrl=`wss://bh2015.com/bh-webserver/init/`;
let websocketUrl=`wss://${ window.location.host}/bh-webserver/init/`;

if (process.env.NODE_ENV == 'development') {
	axios.defaults.baseURL = '/api';
//	loginUrl='http://192.168.0.119:8060/login';

}else if(process.env.NODE_ENV == 'production'){
	axios.defaults.baseURL = serviceUrl;
//	loginUrl='http://192.168.0.29:8080/binhuiApp/#/login';
}

export {
	firstUrl,
	baseUrl,
	routerMode,
	imgBaseUrl,
	loginUrl,
	axios,
	serviceUrl,
	websocketUrl,
}
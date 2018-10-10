import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/pages/index/index.vue'
import home from '@/components/pages/home/home.vue'



Vue.use(Router)

export default new Router({
	// mode: 'history',
	// base:'/hot/',
  routes: [
    {
      path: '/',
      name: 'index',
      component:index,
      redirect:'home',
      children:[
      	{
      		path:'home',
      		name:'',
      		component:home
      	},
	    {
				path: 'personal',
				name:'个人中心',
	      component:resolve => require(['../components/pages/personal/personal.vue'],resolve)
	    },
	    {
				path: 'rightsCenter',
				name:'维权中心',
	      component:resolve => require(['../components/pages/rightsCenter/rightsCenter.vue'],resolve)
	    },
	    {
				path: 'help',
				name:'帮助中心',
	      component: resolve => require(["../components/pages/help/help.vue"],resolve)
	      
	    },
	     {
				path: 'tradingCenter',
				name:'交易中心',
	      component : resolve => require(['../components/pages/trading-center/tradingCenter.vue'],resolve)
	    },
	 
	    {
	    	path:'design',
	    	component: resolve => require(["../components/pages/design/design.vue"],resolve)
	    },
	    {
	    	path:"identity",
	    	component: resolve => require(["../components/pages/register/identity.vue"],resolve)
	    },
	    {
			path:'upload',
			name:'上传作品',
			component: resolve => require(["../components/pages/upload/upload.vue"],resolve)
		},
		{
			path:"protect",
			component: resolve => require(["../components/pages/rightsCenter/protect.vue"],resolve)
		},
		{
			path:"discover",
			name:'发现',
			component: resolve => require(["../components/pages/discover/discover.vue"],resolve)
		},
		{
			path:"designer",
			component: resolve => require(["../components/pages/designer/designer.vue"],resolve)
		},
		{
			path:"uploading",
			component: resolve => require(["../components/pages/upload/uploading.vue"],resolve)
		},
		{
			path:"block",
			name:'交易大厅',
			component: resolve => require(["../components/pages/block/block.vue"],resolve)
		}
      ]
		},
  ]
})

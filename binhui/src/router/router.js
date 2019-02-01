import App from '../App'

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const newHot = r => require.ensure([], () => r(require('../page/newHot/newHot')), 'newHot')
const guide = r => require.ensure([], () => r(require('../page/guide/guide')), 'guide')
const seeds = r => require.ensure([], () => r(require('../page/seeds/seeds')), 'seeds')
const wupin = r => require.ensure([], () => r(require('../page/wupin/wupin')), 'wupin')
const cartlist = r => require.ensure([], () => r(require('../page/cartlist/cartlist')), 'cartlist')
const goodsdetail = r => require.ensure([], () => r(require('../page/goodsdetail/goodsdetail')), 'goodsdetail')
const moregoods = r => require.ensure([], () => r(require('../page/moregoods/moregoods')), 'moregoods')
const rookie = r => require.ensure([], () => r(require('../page/notshop/rookie')), 'rookie')
const knowledge = r => require.ensure([], () => r(require('../page/notshop/knowledge')), 'knowledge')
const knowCategory = r => require.ensure([], () => r(require('../page/notshop/knowledgeClass')), 'knowCategory')
const searchContent = r => require.ensure([], () => r(require('../page/notshop/searchContent')), 'searchContent')
const searchDetail = r => require.ensure([], () => r(require('../page/notshop/searchDetail')), 'searchDetail')
const myadd = r => require.ensure([], () => r(require('../page/address/myadd')), 'myadd')
const addAdd = r => require.ensure([], () => r(require('../page/address/addAdd')), 'addAdd')
const orderList = r => require.ensure([], () => r(require('../page/orderList/orderList')), 'orderList')
const friendShop= r => require.ensure([], () => r(require('../page/friendShop/friendShop')), 'friendShop')

const shoporderDetail = r => require.ensure([], () => r(require('../page/orderList/orderDetail')), 'shoporderDetail')
const myCollect = r => require.ensure([], () => r(require('../page/myCollect/myCollect')), 'myCollect')
const suggestSubmit = r => require.ensure([], () => r(require('../page/suggest/suggestSubmit')), 'suggestSubmit')
const suggestHistory = r => require.ensure([], () => r(require('../page/suggest/suggestHistory')), 'suggestHistory')
const myShop = r => require.ensure([], () => r(require('../page/myShop/myShop')), 'myShop')
const mySeed = r => require.ensure([], () => r(require('../page/mySeed/mySeed')), 'mySeed')
const mailbox = r => require.ensure([], () => r(require('../page/mailbox/mailbox')), 'mailbox')
const myHarvest = r => require.ensure([], () => r(require('../page/myHarvest/myHarvest')), 'myHarvest')
const mySale = r => require.ensure([], () => r(require('../page/myHarvest/mySale')), 'mySale')

const seeting = r => require.ensure([], () => r(require('../page/seeting/seeting')), 'seeting')
const mycode = r => require.ensure([], () => r(require('../page/seeting/mycode')), 'mycode')
const ioshome = r => require.ensure([], () => r(require('../page/home/ioshome')), 'ioshome')
const category = r => require.ensure([], () => r(require('../page/category/category')), 'category')
const categoryList = r => require.ensure([], () => r(require('../page/category/categoryList')), 'categoryList')

const logisticsDetails = r => require.ensure([], () => r(require('../page/orderList/logisticsDetails')), 'logisticsDetails')
const friendSetting = r => require.ensure([], () => r(require('../page/friendSetting/friendSetting')), 'friendSetting')
const timeHorizon = r => require.ensure([], () => r(require('../page/friendSetting/timeHorizon')), 'timeHorizon')
const setPerson = r => require.ensure([], () => r(require('../page/friendSetting/setPerson')), 'setPerson')
const hidePerson = r => require.ensure([], () => r(require('../page/friendSetting/hidePerson')), 'hidePerson')
const addFriend = r => require.ensure([], () => r(require('../page/friendSetting/addFriend')), 'addFriend')
const farmWeather = r => require.ensure([], () => r(require('../page/weather/farmWeather')), 'farmWeather')
const advertisement = r => require.ensure([], () => r(require('../page/advertisement/advertisement')), 'advertisement')

/******************************************* 以下是答题&&摘豆游戏 ***********************************/
const answerGame = r => require.ensure([], () => r(require('../page/answerGame/game')), 'answerGame')
// const Collect = r => require.ensure([], () => r(require('../page/collect/collect')), 'Collect')
const Share = r => require.ensure([], () => r(require('../page/share/share')), 'Share')
const orderDetail = r => require.ensure([], () => r(require('../page/orderDetail/orderDetail')), 'orderDetail')
const logistics = r => require.ensure([], () => r(require('../page/logistics/logistics')), 'logistics')
const Receive = r => require.ensure([], () => r(require('../page/receive/receive')), 'Receive')
const chestPrize = r => require.ensure([], () => r(require('../page/chestprize/chestprize')), 'chestPrize')
const addAddress = r => require.ensure([], () => r(require('../page/addAddress/addAddress')), 'addAddress')
const addressList = r => require.ensure([], () => r(require('../page/addressList/addressList')), 'addressList')
const pickbeansGame = r => require.ensure([], () => r(require('../page/beansGame/beans')), 'pickbeansGame')
const FriendTodo = r => require.ensure([], () => r(require('../page/beansFriendTodo/FriendTodo')), 'friendTodo')
const pickbeansList = r => require.ensure([], () => r(require('../page/beansList/beansList')), 'pickbeansList')
const beansConversion = r => require.ensure([], () => r(require('../page/conversion/conversion')), 'beansConversion')
const bootLoad = r => require.ensure([], () => r(require('../page/bootLoad/bootLoad')), 'bootLoad')
const fans = r => require.ensure([], () => r(require('../page/fans/fans')), 'fans')
const myHonor = r => require.ensure([], () => r(require('../page/myHonor/myHonor')), 'myHonor')
export default [{
	path: '',
	component: App, //顶层路由，对应index.html
	children: [ //二级路由。对应App.vue
		//地址为空时跳转home页面
		{
			path: '',
			redirect: 'home',
			meta: {
				title: '商城后台',
				keepAlive: false
			}
		},
		//首页
		{
			path: 'home',
			component: home,
			meta: {
				title: '商城',
				keepAlive: false
			}
		},
		{
			path: 'newHot',
			component: newHot,
			meta: {
				title: '新品',
				keepAlive: false
			}
		},
		{
			path: 'guide',
			component: guide,
			meta: {
				title: '指引',
				keepAlive: false
			}
		},
		{
			path: 'seeds',
			component: seeds,
			meta: {
				title: '种子商店',
				keepAlive: false
			}
		},
		{
			path: 'wupin',
			component: wupin,
			meta: {
				title: '物品商店',
				keepAlive: false
			}
		},
		{
			path: 'cartlist',
			component: cartlist,
			meta: {
				title: '购物车',
				keepAlive: false
			}
		},
		{
			path: 'goodsdetail',
			component: goodsdetail,
			meta: {
				title: '商品详情',
				keepAlive: false
			}
		},
		{
			path: 'moregoods',
			component: moregoods,
			meta: {
				title: '更多商品',
				keepAlive: false
			}
		},
		{
			path: 'rookie',
			component: rookie,
			meta: {
				title: '新手指导',
				keepAlive: false
			}
		},
		{
			path: 'knowledge',
			component: knowledge,
			meta: {
				title: '知识库',
				keepAlive: false
			}
		},
		{
			path: 'knowCategory',
			component: knowCategory,
			meta: {
				title: '知识库分类',
				keepAlive: false
			}
		},
		{
			path: 'searchContent',
			component: searchContent,
			meta: {
				title: '搜索列表',
				keepAlive: false
			}
		},
		{
			path: 'searchDetail',
			component: searchDetail,
			meta: {
				title: '知识库详情',
				keepAlive: false
			}
		},
		{
			path: 'myadd',
			component: myadd,
			meta: {
				title: '我的地址',
				keepAlive: false
			}
		},
		{
			path: 'addAdd',
			component: addAdd,
			meta: {
				title: '增加地址',
				keepAlive: false
			}
		},
		{
			path: 'orderList',
			component: orderList,
			meta: {
				title: '我的订单',
				keepAlive: false
			}
		},
		{
			path: 'shoporderDetail',
			component: shoporderDetail,
			meta: {
				title: '订单详情',
				keepAlive: false
			}
		},
		/*--我的模块--B */
		{
			path: 'myCollect',
			component: myCollect,
			meta: {
				title: '我的收藏',
				keepAlive: false
			}
		},
		{
			path: 'suggestSubmit',
			component: suggestSubmit,
			meta: {
				title: '意见反馈',
				keepAlive: false
			}
		},
		{
			path: 'suggestHistory',
			component: suggestHistory,
			meta: {
				title: '反馈记录',
				keepAlive: false
			}
		},
		{
			path: 'seeting',
			component: seeting,
			meta: {
				title: '设置',
				keepAlive: false
			}
		},
		{
			path: 'mycode',
			component: mycode,
			meta: {
				title: '我的二维码',
				keepAlive: false
			}
		},
		
		{
			path: 'farmWeather',
			component: farmWeather,
			meta: {
				title: '天气',
				keepAlive: false
			}
		},
		{
			path: 'myShop',
			component: myShop,
			meta: {
				title: '在售商品',
				keepAlive: false,
				// scrollY:0,
			}
		},
		{
			path: 'mySeed',
			component: mySeed,
			meta: {
				title: '我的种子',
				keepAlive: false,
			}
		},
		{
			path: 'homeios',
			component: ioshome,
			meta: {
				title: 'ios首页',
				keepAlive: false
			}
		},
		{
			path: 'category',
			component: category,
			meta: {
				title: '分类',
				keepAlive: false
			}
		},
		{
			path: 'mailbox',
			component: mailbox,
			meta: {
				title: '信箱',
				keepAlive: false
			}
		},
		{
			path: 'myHarvest',
			component: myHarvest,
			meta: {
				title: '我的收获',
				keepAlive: false
			}
		},
		{
			path: 'myHonor',
			component: myHonor,
			meta: {
				title: '我的获赞',
				keepAlive: false
			}
		},
		{
			path: 'mySale',
			component: mySale,
			meta: {
				title: '上架商品',
				keepAlive: false
			}
		},
		{
			path: 'logisticsDetails',
			component: logisticsDetails,  
			meta: {
				title: '物流详情',
				keepAlive: false
			}
		},
		{
			path: 'friendSetting',
			component: friendSetting,
			meta: {
				title: '农友圈设置',
				keepAlive:false,
				
			}
		},
		
		{
			path: 'timeHorizon',
			component: timeHorizon,
			meta: {
				title: '允许农友查看农友圈的范围',
				keepAlive: false
			}
		},
		{
			path: 'setPerson',
			component: setPerson,
			meta: {
				title: '农友圈设置',
				keepAlive: false
			}
		},
		{
			path: 'categoryList',
			component: categoryList,
			meta: {
				title: '分类列表',
				keepAlive: false
			}
		},
		{
			path: 'hidePerson',
			component: hidePerson,
			meta: {
				title: '屏蔽的人',
				keepAlive: false
			}
		},
		{
			path: 'addFriend',
			component: addFriend,
			meta: {
				title: '选择联系人',
				keepAlive: false
			}
		},
		{
			path: 'friendShop',
			component: friendShop,
			meta: {
				title: '朋友商店',
				keepAlive: false
			}
		},
		{
			path: 'advertisement',
			component: advertisement,
			meta: {
				title: '外部链接网页',
				keepAlive: false
			}
		},
		
		
		//答题游戏
		{
			path:'/beans',
			component: pickbeansGame,
			meta: {
				title: '摘豆游戏',
				keepAlive: false
			}
		},
		{
			path:'/FriendTodo',
			component: FriendTodo,
			meta: {
				title: '摘豆游戏',
				keepAlive: false
			}
		},
		{
			path:'/beansList',
			component: pickbeansList,
			meta: {
				title: '摘豆游戏',
				keepAlive: false
			}
		},
		{
			path:'/conversion',
			component: beansConversion,
			meta: {
				title: '摘豆游戏',
				keepAlive: false
			}
		},
		{
			path: '/game',
			component: answerGame,
			meta: {
				title: '答题偷菜',
				keepAlive: false
			}
		},
		{
			path: '/bootLoad',
			component: bootLoad,
			meta: {
				title: '下载',
				keepAlive: false
			}
		},
		{
			path: '/share',
			component: Share,
			meta: {
				title: '答题偷菜',
				keepAlive: false
			}
		},
		{
			path: '/orderDetail',
			component: orderDetail,
			meta: {
				title: '订单详情',
				keepAlive: false
			}
		},
		{
			path: '/logistics',
			component: logistics,
			meta: {
				title: '物流信息',
				keepAlive: false
			}
		},
		{
			path: '/receive',
			component: Receive,
			meta: {
				title: '领取记录',
				keepAlive: false
			}
		},
		{
			path:'/chestprize',
			component:chestPrize,
			meta:{
				title:'宝箱奖品',
				keepAlive:false
			}
		},
		{
			path: '/addAddress',
			component: addAddress,
			meta: {
				title: '编辑地址',
				keepAlive: false
			}
		},
		{
			path: '/addressList',
			component: addressList,
			meta: {
				title: '选择地址',
				keepAlive: false
			}
		},
		{
			path: '/fans',
			component: fans,
			meta: {
				title: '粉丝',
				keepAlive: false
			}
		},
	],

}]

import fetch from '../config/fetch'

const preUser = '/farm-shop' //商城用户接口前缀
const farmUser = '/farm-user'
const farmIm = '/farm-im'
const game = '/farm-activity' //答题模块

//用户数据接口区-begin


//获取商品列表
export const getgoodslist = (catId, limit, order, page, sidx, name) => fetch(preUser + '/biz/product/fruit.json', {
	catId,
	limit,
	order,
	page,
	sidx,
	name
}, 'post');

//获取轮播图
export const swiperlist = (adsType) => fetch(preUser + '/biz/ads/list.json', {
	adsType
}, 'post');

//获取商品详细信息
export const goodsdetail = (goodsId, type) => fetch(preUser + '/biz/product/productdetail.json', {
	goodsId,
	type
}, 'post');
//获取搜索列表
export const categorylist = () => fetch(preUser + '/biz/product/fruitcategory.json', {}, 'post');

//获取购物车数量
export const getcartnum = (tokenId) => fetch(preUser + '/biz/cart/accountCartNum.json', {}, 'post', tokenId);

//加入购物车
export const addcart = (cartItemId, amount, cartType, tokenId) => fetch(preUser + '/biz/cart/addCart.json', {
	cartItemId,
	amount,
	cartType
}, 'post', tokenId);
//更新购物车
export const updatacart = ( amount, catId) => fetch(preUser + '/cart/update.json', {
	amount, catId
}, 'post');
//获取购物车详细数据
export const cartlist = (tokenId) => fetch(preUser + '/biz/cart/cartList.json', {}, 'post', tokenId);

//增减购物车数量
export const updatecart = (amount, cartId, tokenId) => fetch(preUser + '/cart/update.json', {
	amount,
	cartId
}, 'post', tokenId);

//删除商品
export const deletecart = (cartIds, tokenId) => fetch(preUser + '/cart/delete.json', {
	cartIds
}, 'post', tokenId);

//种子分类
export const categoryseeds = (catType,tokenId) => fetch(preUser + '/biz/goods/selectCategory.json', {
	catType
}, 'post',tokenId);

//种子列表
export const seedslist = (page, limit, catId, sidx, order,tokenId) => fetch(preUser + '/biz/product/seedList', {
	page,
	limit,
	catId,
	sidx,
	order
}, 'post',tokenId);

//物品分类
export const gdscategory = (catType) => fetch(preUser + '/biz/goods/selectCategory.json', {catType}, 'post');

//物品列表
export const gdslist = (page, limit, catId, sidx, order) => fetch(preUser + '/biz/product/gdsRailings.json', {
	page,
	limit,
	catId,
	sidx,
	order
}, 'post');

//判断是否收藏
export const isfav = (itemId, favType, tokenId) => fetch(preUser + '/biz/fav/isFavorite.json', {
	itemId,
	favType
}, 'post', tokenId);

//增加或取消收藏
export const addfav = (itemId, favType, isAddFavorite, tokenId) => fetch(preUser + '/biz/fav/isAddFavorite.json', {
	itemId,
	favType,
	isAddFavorite
}, 'post', tokenId);

//清除失效商品
export const clear = (tokenId) => fetch(preUser + '/biz/cart/cleanEffectCart.json', {}, 'get', tokenId);

//判断是否存在购物车
export const isExist = (cartItemId,type, tokenId) => fetch(preUser + '/biz/cart/isVegExistCart.json', {
	cartItemId,type
}, 'post', tokenId);

//获取搜索热门列表
export const searchhot = () => fetch(farmUser + '/api/botany/getCateGorySales', {}, 'post');

//获取搜索内容
export const searchContent = (title, page, limit, catId,tokenId) => fetch(farmUser + '/api/botany/get', {
	title, page, limit, catId
}, 'post',tokenId);

//搜索详情
export const searchDetail = (pltwkId) => fetch(farmUser + '/api/botany/getPltwkId.json', {
	pltwkId
}, 'post');

//获取库存是否充足
export const isEnough = (goodsId,type,num,cartIds) => fetch(preUser + '/biz/cart/isSettlePage.json', {
	goodsId,type,num,cartIds
}, 'post');

//获取地址列表
export const myadd = (tokenId) => fetch(farmUser+'/my/address/list.json', {}, 'post', tokenId);

//获取地址省市区数据
export const province = (tokenId) => fetch(farmUser+'/getProvince.json', {}, 'post',tokenId);
export const city = (id,tokenId) => fetch(farmUser+'/getCity.json', {
	id
}, 'post',tokenId);
export const country = (id,tokenId) => fetch(farmUser+'/getCounty.json', {
	id
}, 'post',tokenId);

//地址详情
export const addInfo = (addrId, tokenId) => fetch(farmUser+'/my/address/info.json', {
	addrId
}, 'post', tokenId);
//删除保存地址
export const deleteadd = (addrId, tokenId) => fetch(farmUser+'/my/address/delete.json', {
	addrId
}, 'post', tokenId);
export const saveadd = (addrId, address, cityId, cityName, distId, distName, isDefault, mobile, provId, provName, userName, tokenId) =>
	fetch(farmUser+'/my/address/save.json', {
		addrId,
		address,
		cityId,
		cityName,
		distId,
		distName,
		isDefault,
		mobile,
		provId,
		provName,
		userName
	}, 'post', tokenId);

//获取订单列表
export const orderList = (limit, page, status, tokenId) => fetch(preUser + '/biz/order/userOrderList.json', {
	limit, page, status, tokenId
}, 'post', tokenId);

//获取订单详情
export const shoporderDetail = (orderId) => fetch(preUser + '/biz/order/orderDetails.json', {
	orderId
}, 'post');	
	
export const cancelorder = (orderId) => fetch(preUser + '/biz/order/cancelOrder.json', {
	orderId
}, 'post');
//确认收货
export const suregoods = (orderId) => fetch(preUser + '/biz/order/confirmTakeOrder.json', {
	orderId
}, 'post');

//惠斌豆
export const beanslist = (tokenId) => fetch('farm-activity/game/bean/beans/random.json', {

}, 'post', tokenId);
//收豆
export const getbeans = (money) => fetch('farm-activity/game/bean/beans/search.json', {
	money
}, 'post');

//农友圈收藏接口
export const getFriendCircleData = (page, limit, tokenId) => fetch(farmIm+'/biz/moment/userArticleFavList', {
	page, limit
}, 'post', tokenId);

//农友圈收藏取消接口
export const cancelFriendCollect = (articleId, tokenId) => fetch(farmIm+'/biz/moment/collectArticle', {
	articleId
}, 'post', tokenId);

//获取天气
export const weather = (farmId,tokenId) => fetch('farm-frm/farm/farm/weather', {
	farmId
}, 'post', tokenId);
//气象站
export const station = (tokenId) => fetch('farm-frm/farm/weather/station/data', {
}, 'post', tokenId);
//获取反馈记录数据接口
export const getSuggestHistoryData = (page, limit, tokenId) => fetch(farmUser+'/api/feedback/list', {
	page, limit, tokenId
}, 'post', tokenId);

//提交意见反馈接口
export const submitSuggestData = (content, imgUrl, mobile, tokenId) => fetch(farmUser+'/api/feedback/add', {
	content, imgUrl, mobile
}, 'post', tokenId);

//获取在售商品数据接口
export const getSaleGoodsData = (page, limit, tokenId) => fetch(farmUser+'/good/produce/goodlist', {
	page, limit,
}, 'post', tokenId);

//获取已售订单数据接口
export const getSaleOrderData = (page, limit, tokenId) => fetch(farmUser+'/good/produce/orderlist', {
	page, limit,
}, 'post', tokenId);

//获取我的种子数据
export const getMySeedData = (page, limit, tokenId) => fetch(farmUser+'/my/seed/list', {
	page, limit,
}, 'post', tokenId)

//userinfo
export const userInfo = (tokenId) => fetch(farmUser+'/api/usermsg.json', {

}, 'post', tokenId);
//mycode
export const mycode = (tokenId) => fetch(farmUser+'/api/qrcode/info.json', {

}, 'post', tokenId);
//changename
export const changeUserName = (userName) => fetch(farmIm+'/api/updateusername.json', {
	userName
}, 'post');

//ioshome
export const  dafenlei= () => fetch(preUser + '/biz/goods/bigZone', {
	
}, 'post');
export const  ads= (adsType) => fetch(preUser + '/biz/ads/list', {
	adsType
}, 'post');
export const  xiaofenlei= (catId) => fetch(preUser + '/biz/goods/selectZoneCategory', {
	catId
}, 'post');
export const  categorygoods= (zoneId,limit) => fetch(preUser + '/biz/goods/selectZoneGoods', {
	zoneId,limit
}, 'post');

//获取商品收藏界面
export const getGoodsListData = (page, limit, tokenId) => fetch(preUser+'/biz/fav/favoriteList', {
	page, limit,
}, 'post',tokenId);

//删除商品收藏接口
export const delGoodsData = (goodsFavId,tokenId) => fetch(preUser+'/biz/fav/deleteBatch', {
	goodsFavId
}, 'post',tokenId);

//获取信箱列表数据
export const getMailListData = (page, limit, tokenId) => fetch(farmUser+'/sys/msg/list', {
	page, limit,
}, 'post',tokenId);

//获取我的收获列表数据
export const getMyHarvestData = (tokenId) => fetch(farmUser+'/my/produce', {
	
}, 'post',tokenId);

//获取收获提醒商品数据
export const getHarvestMSGData = (tokenId) => fetch(farmUser+'/my/new/produce', {
	
}, 'post',tokenId);

//获取要上架的商品
export const toSaleGoodsData = (uspdId,tokenId) => fetch(farmUser+'/good/produce/detail', {
	uspdId
}, 'post',tokenId);

//确认上架接口
export const toPutaway = (list,tokenId) => fetch(farmUser+'/good/produce/release', {
	list
}, 'post',tokenId);

//分类
export const getcategory = (list,tokenId) => fetch(preUser +'/biz/goods/selectCategory', {

}, 'post',tokenId);
//搜索
export const getcategoryList = (page,limit,name,catId,sidx,order) => fetch('farm-shop/search/searchGoods', {
	page,limit,name,catId,sidx,order
}, 'post');
//明星店铺
export const famousShop = () => fetch(preUser+'/biz/sale/count.json', {
}, 'post');
//知识库首页
export const knowImg = () => fetch('farm-user/api/botany/planWikiPageImg', {
}, 'get');
//知识库分类
export const knowCategory = (page,limit,tokenId) => fetch('farm-user/api/category/list', {
	page,limit
}, 'post',tokenId);
//修改农友号
export const modifyaccount = (account,tokenId) => fetch('farm-user/api/update/account', {
	account
}, 'post',tokenId);

export const modifyqm = (signature,tokenId) => fetch('farm-im/biz/user/updateSignature', {
	signature
}, 'post',tokenId);
//修改头像
export const modifytx = (avatar,tokenId) => fetch('farm-im/api/updateavatar.json', {
	avatar
}, 'post',tokenId);
//是否有新信息
export const havenotice = (msgId,tokenId) => fetch('farm-user/sys/msg/haveNewMsg', {
	msgId
}, 'post',tokenId);
//好友商店
export const friendShop = (page,limit,sidx,order,userId,tokenId) => fetch( preUser+'/biz/product/fruit.json', {
	page,limit,sidx,order,userId
}, 'post',tokenId);


//获取物流详情
export const getLogisticsDetail = (orderId,tokenId) => fetch(preUser+'/biz/order/orderExpressDetails', {
	orderId
}, 'post',tokenId);

//获取查看范围数据
export const getScopeData = (param,tokenId) => fetch(farmIm+'/biz/moment/myFrdAuthority', {
	param
}, 'post',tokenId);

//选择查看范围
export const chooseScopeData = (frdShowDays,param,tokenId) => fetch(farmIm+'/biz/moment/updateFrdAuthority', {
	frdShowDays,param
}, 'post',tokenId);

//获取设置查看范围的农友数据
export const getFriendData = (param,tokenId) => fetch(farmIm+'/biz/moment/myFrdAuthority', {
	param
}, 'post',tokenId);

//删除农友
export const delFriend = (param,friendUserId,frdShowDays,seedFrdCircle,seeMyCircle,tokenId) => fetch(farmIm+'/biz/moment/updateFrdAuthority', {
	param,friendUserId,frdShowDays,seedFrdCircle,seeMyCircle
}, 'post',tokenId);

//获取屏蔽的人列表
export const getHidePerson = (page,limit,tokenId) => fetch(farmIm+'/fan/shield/shieldList', {
	page,limit,
}, 'post',tokenId);

//取消屏蔽
export const cancelHidePerson = (unWatchUserId,doShieldParam,tokenId) => fetch(farmIm+'/fan/shield/doShield', {
	unWatchUserId,doShieldParam
}, 'post',tokenId);

//获取所有的农友数据
export const getAllFriendData = (tokenId) => fetch(farmIm+'/biz/friend/list', {
	
}, 'post',tokenId);

//添加农友
export const addFriend = (param,friendUserId,frdShowDays,seedFrdCircle,seeMyCircle,tokenId) => fetch(farmIm+'/biz/moment/updateFrdAuthority', {
	param,friendUserId,frdShowDays,seedFrdCircle,seeMyCircle
}, 'post',tokenId);
//关注取消粉丝
export const freshfans = (attentionUserId,doAttentionParam,tokenId) => fetch(farmIm+'/fan/attention/doAttention.json', {
	attentionUserId,doAttentionParam
}, 'post',tokenId);


/*********************************************** 以下是答题游戏 ***************************************************/
//游戏列表
export const gameList = (tokenId) => fetch(game +'/game/answer/box/list', {}, 'post',tokenId);

//开始答题数据
export const beginAnswer = (queTreId,tokenId) => fetch(game +'/game/answer/begin', {queTreId}, 'post',tokenId);
//提交答案
export const submitKey = (queTreId,queId,answer,tokenId) => fetch(game +'/game/answer/check', {
	queTreId,queId,answer
}, 'post',tokenId);
//下一题
export const nextAnswer = (queTreId) => fetch(game +'/game/answer/next', {
	queTreId
}, 'post');
//刷新豆豆
export const newbeans = (tokenId) => fetch('/farm-activity/game/bean/share/app', {
}, 'post',tokenId);
//分享到朋友圈或好友
export const shareFriends = (queTreId,tokenId) => fetch('/farm-activity/game/share/forwardToGroupOrFriend', {
	queTreId
}, 'post',tokenId);
//宝箱奖品列表
export const chestList = (page, limit) =>fetch(game +'/game/answer/box/prize', {page, limit}, 'post');
//寄回家
export const goHome = (addressId) =>fetch(game +'/game/prize/order ', {addressId}, 'post');
//领取记录
export const receiveList = (page, limit) =>fetch(game +'/game/prize/order/list', {page, limit}, 'post');
//详情
export const orderDetail = (orderId) =>fetch(preUser +'/biz/order/orderDetails', {orderId}, 'post');
//物流信息
export const logisticsDetail = (orderId) =>fetch(preUser +'/biz/order/orderExpressDetails.json', {orderId}, 'post');
//收集
export const collect = () =>fetch(game +'/game/share/updateGameShareStatus', {}, 'post');
//是否复活
export const isRevival = (queTreId) =>fetch(game +'/game/share/isRevival', {queTreId}, 'post');
//复活后创一个新的宝箱
export const revivalNew = () =>fetch(game +'/game/share/createAndDropBox', {}, 'post');
//点击分享进入
export const sharePage = (queTreId,unionid,headImgUrl) =>fetch(game +'/game/share/selectShareList', {queTreId,unionid,headImgUrl}, 'post');
//帮Ta助力
export const helpT = (queTreId,unionid,headImgUrl) =>fetch(game +'/game/share/updateGameShareStatus', {queTreId,unionid,headImgUrl}, 'post');
//获取地址列表
export const getAddrList=()=>fetch('/farm-user/my/address/list',{},'post');
//获取地址信息
export const getAddrInfo=(addrId)=>fetch('/farm-user/my/address/info',{addrId},'post');
//再分享接口
export const getShare=(url)=>fetch(game +'/wechat/wxInfo',{url},'post');
//添加收货地址
export const saveAddr=(data)=>fetch('/farm-user/my/address/save',data,'post')
//获取一级地址
export const getProvince = ()=>fetch('/farm-user/getProvince', {}, 'post');

//获取二级地址
export const getCity = (id)=>fetch('/farm-user/getCity', {id}, 'post');

//获取三级地址
export const getCountry = (id)=>fetch('/farm-user/getCounty', {id}, 'post');

//获取四级地址
export const getTown = (id)=>fetch('/farm-user/getTown', {id}, 'post');

/*********************************************** 以下是摘豆游戏 ***************************************************/

//zj滨惠豆
export const beansList = (tokenId) => fetch(game +'/game/bean/beans/beanList', {}, 'post',tokenId);

//滨豆金额
export const beansMoney = (tokenId) => fetch(game +'/game/bean/good/selectUserMoney', {}, 'post',tokenId);


//动态
export const trendsList = (page,limit,tokenId) => fetch(game +'/game/bean/beans/queryStealRecords', {page,limit}, 'post',tokenId);

//每日任务
export const everyDayTask = (tokenId) => fetch(game +'/game/bean/beans/daily/task/status', {}, 'get',tokenId);

//friend
export const friendBeans = (userId,tokenId) => fetch(game +'/game/bean/beans/jumpToFriend', {userId}, 'post',tokenId);

//好友列表
export const friendsList = (page,limit,tokenId) => fetch(game +'/game/bean/beans/friend', {page,limit}, 'post',tokenId);

//偷取豆豆
export const pickzjbeans = (ubeanId,generateWay) => fetch(game +'/game/bean/beans/harvest', {ubeanId,generateWay}, 'post');

//兑换列表
export const exChangeList = (page,limit) => fetch(game +'/game/bean/good/goods', {page,limit}, 'post');

//马上兑换
export const gochange = (bgdId) => fetch(game +'/game/bean/good/goodChange', {bgdId}, 'post');

//兑换记录
export const ChangeList = (page,limit) => fetch(game +'/game/bean/good/RedemptionRecord', {page,limit}, 'post');

//寄回家生成订单 
export const creatOrder = (brdmId,addressId) => fetch(game +'/game/bean/good/generateOrder', {brdmId,addressId}, 'post');


//获取粉丝列表
export const getFansList = (page,limit,tokenId) => fetch('/farm-im/fan/fan/fanList.json', {page,limit}, 'post',tokenId);
//获取获赞数
export const gethonor = (page,limit,tokenId) => fetch('/farm-im/fan/moment/selectLikeList.json', {page,limit}, 'post',tokenId);



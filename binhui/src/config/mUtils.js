/**
 * 存储localStorage
 */
export const saveStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') { 
        target = element.scrollTop;
    }else if(element.currentStyle){
        target = element.currentStyle[attr]; 
    }else{ 
        target = document.defaultView.getComputedStyle(element,null)[attr]; 
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
} 

/**
 * 页面到达底部，加载更多
 */
export const loadMore = (element, callback) => {
	let windowHeight = window.screen.height;
	let height;
	let setTop;
	let paddingBottom;
	let marginBottom;
    let requestFram;
    let oldScrollTop;

    document.body.addEventListener('scroll',() => {
       loadMore();
    }, false)
    //运动开始时获取元素 高度 和 offseTop, pading, margin
	element.addEventListener('touchstart',() => {
        height = element.offsetHeight;
        setTop = element.offsetTop;
        paddingBottom = getStyle(element,'paddingBottom');
        marginBottom = getStyle(element,'marginBottom');
    },{passive: true})

    //运动过程中保持监听 scrollTop 的值判断是否到达底部
    element.addEventListener('touchmove',() => {
       loadMore();
    },{passive: true})

    //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
    element.addEventListener('touchend',() => {
       	oldScrollTop = document.body.scrollTop;
       	moveEnd();
    },{passive: true})
    
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                loadMore();
                moveEnd();
            }else{
            	cancelAnimationFrame(requestFram);
            	//为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
            	height = element.offsetHeight;
                loadMore();
            }
        })
    }

    const loadMore = () => {
        if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
            callback();
        }
    }
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = callback => {
    let requestFram;
    let oldScrollTop;

    document.addEventListener('scroll',() => {
       showBackFun();
    }, false)
    document.addEventListener('touchstart',() => {
       showBackFun();
    },{passive: true})

    document.addEventListener('touchmove',() => {
       showBackFun();
    },{passive: true})

    document.addEventListener('touchend',() => {
    	let scrollDistance= document.body.scrollTop ||  document.documentElement.scrollTop  ||window.pageYoffset
        oldScrollTop = scrollDistance;
        moveEnd();
    },{passive: true})
    
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
        	let scrollDistance= document.body.scrollTop ||  document.documentElement.scrollTop  ||window.pageYoffset
            if (scrollDistance != oldScrollTop) {
                oldScrollTop = scrollDistance;
                moveEnd();
            }else{
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        })
    }

    //判断是否达到目标点
    const showBackFun = () => {
    	let scrollDistance= document.body.scrollTop ||  document.documentElement.scrollTop  ||window.pageYoffset
        if (scrollDistance > 500) {
            callback(true);
        }else{
            callback(false);
        }
    }
};

/**
 * 获取类
 */
export const getElementsByClassName = (cl)=> {
    var retnode = [];
    var myclass = new RegExp('\\b'+cl+'\\b');
    var elem = document.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
        var classes = elem[i].className;
        if (myclass.test(classes)) retnode.push(elem[i]);
    }
    return retnode;
};


/**
 * 显示返回div顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const boxShowBack = (callback,boxId) => {
    let requestFram;
    let oldScrollTop;

    getElementsByClassName(boxId)[0].firstChild.addEventListener('scroll',() => {
       showBackFun();
    }, false)
    getElementsByClassName(boxId)[0].addEventListener('touchstart',() => {
       showBackFun();
    },{passive: true})

    getElementsByClassName(boxId)[0].addEventListener('touchmove',() => {
       showBackFun();
    },{passive: true})

    getElementsByClassName(boxId)[0].addEventListener('touchend',() => {
    	let str=String(getElementsByClassName(boxId)[0].firstChild.style.transform).substr(12).split(',')[1];
    	str=String(str).slice(0,str.length-2);
        oldScrollTop = str;
        moveEnd();
    },{passive: true})
    
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
        	if(!getElementsByClassName(boxId)[0]){return;}
        	let str=String(getElementsByClassName(boxId)[0].firstChild.style.transform).substr(12).split(',')[1];
        	if(str==undefined){return;}
    		str=String(str).slice(0,str.length-2);
            if (str != oldScrollTop) {
                oldScrollTop = str;
                moveEnd();
            }else{
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        })
    }

    //判断是否达到目标点
    const showBackFun = () => {
//  	console.log(getElementsByClassName(boxId)[0].firstChild);
    	let str=String(getElementsByClassName(boxId)[0].firstChild.style.transform).substr(12).split(',')[1];
    	str=String(str).slice(0,str.length-2);
//  	console.log(str);
//  	console.log((-Number(str)).toFixed(0))
        if ((-Number(str)).toFixed(0)> 800) {
            callback(true);
        }else{
            callback(false);
        }
    }
};

//监听div内工具栏到顶部的距离
export const boxListenTop = (callback,boxId,divTop) => {
    let requestFram;
    let oldScrollTop;

    getElementsByClassName(boxId)[0].firstChild.addEventListener('scroll',() => {
       showBackFun();
    }, false)
    getElementsByClassName(boxId)[0].addEventListener('touchstart',() => {
       showBackFun();
    },{passive: true})

    getElementsByClassName(boxId)[0].addEventListener('touchmove',() => {
       showBackFun();
    },{passive: true})

    getElementsByClassName(boxId)[0].addEventListener('touchend',() => {
    	let str=String(getElementsByClassName(boxId)[0].firstChild.style.transform).substr(12).split(',')[1];
    	str=String(str).slice(0,str.length-2);
        oldScrollTop = str;
        moveEnd();
    },{passive: true})
    
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
        	if(!getElementsByClassName(boxId)[0]){return;}
        	let str=String(getElementsByClassName(boxId)[0].firstChild.style.transform).substr(12).split(',')[1];
        	if(str==undefined){return;}
    		str=String(str).slice(0,str.length-2);
            if (str != oldScrollTop) {
                oldScrollTop = str;
                moveEnd();
            }else{
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        })
    }

    //判断是否达到目标点
    const showBackFun = () => {
//  	console.log(getElementsByClassName(boxId)[0].firstChild);
    	let str=String(getElementsByClassName(boxId)[0].firstChild.style.transform).substr(12).split(',')[1];
    	str=String(str).slice(0,str.length-2);
//  	console.log(str);
//  	console.log((-Number(str)).toFixed(0))
        if ((-Number(str)).toFixed(0)> divTop) {
            callback(true);
        }else{
            callback(false);
        }
    }
};

//监听工具栏到顶部距离
export const listenTop = (callback,top) => {
    let requestFram;
    let oldScrollTop;

    document.addEventListener('scroll',() => {
       showBackFun();
    }, false)
    document.addEventListener('touchstart',() => {
       showBackFun();
    },{passive: true})

    document.addEventListener('touchmove',() => {
       showBackFun();
    },{passive: true})

    document.addEventListener('touchend',() => {
    	let scrollDistance= document.body.scrollTop ||  document.documentElement.scrollTop  ||window.pageYoffset
        oldScrollTop = scrollDistance;
        moveEnd();
    },{passive: true})
    
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
        	let scrollDistance= document.body.scrollTop ||  document.documentElement.scrollTop  ||window.pageYoffset
            if (scrollDistance != oldScrollTop) {
                oldScrollTop = scrollDistance;
                moveEnd();
            }else{
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        })
    }

    //判断是否达到目标点
    const showBackFun = () => {
    	let scrollDistance= document.body.scrollTop ||  document.documentElement.scrollTop  ||window.pageYoffset
        if (scrollDistance > top) {
            callback(true);
        }else{
            callback(false);
        }
    }
}

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
        callback = duration;
        duration = 400;
    }else if(duration instanceof String){
        mode = duration;
        duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
        callback = mode;
        mode = 'ease-out';
    }

    //获取dom样式
    const attrStyle = attr => {
        if (attr === "opacity") { 
            return Math.round(getStyle(element, attr, 'float') * 100);
        } else {
            return getStyle(element, attr);
        }
    }
    //根字体大小，需要从此将 rem 改成 px 进行运算
    const rootSize = parseFloat(document.documentElement.style.fontSize);

    const unit = {};
    const initState = {};

    //获取目标属性单位和初始样式值
    Object.keys(target).forEach(attr => {
        if (/[^\d^\.]+/gi.test(target[attr])) {
            unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
        }else{
            unit[attr] = 'px';
        }
        initState[attr] = attrStyle(attr);
    });

    //去掉传入的后缀单位
    Object.keys(target).forEach(attr => {
        if (unit[attr] == 'rem') {
            target[attr] = Math.ceil(parseInt(target[attr])*rootSize);
        }else{
            target[attr] = parseInt(target[attr]);
        }
    });


    let flag = true; //假设所有运动到达终点
    const remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(() => {
        Object.keys(target).forEach(attr => {
            let iSpeed = 0;  //步长
            let status = false; //是否仍需运动
            let iCurrent = attrStyle(attr) || 0; //当前元素属性址
            let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
            let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
            switch(mode){
                case 'ease-out': 
                    speedBase = iCurrent;
                    intervalTime = duration*5/400;
                    break;
                case 'linear':
                    speedBase = initState[attr];
                    intervalTime = duration*20/400;
                    break;
                case 'ease-in':
                    let oldspeed = remberSpeed[attr] || 0;
                    iSpeed = oldspeed + (target[attr] - initState[attr])/duration;
                    remberSpeed[attr] = iSpeed
                    break;
                default:
                    speedBase = iCurrent;
                    intervalTime = duration*5/400; 
            }
            if (mode !== 'ease-in') {
                iSpeed = (target[attr] - speedBase) / intervalTime;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            }
            //判断是否达步长之内的误差距离，如果到达说明到达目标点
            switch(mode){
                case 'ease-out': 
                    status = iCurrent != target[attr]; 
                    break;
                case 'linear':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                case 'ease-in':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                default:
                    status = iCurrent != target[attr]; 
            }

            if (status) {
                flag = false; 
                //opacity 和 scrollTop 需要特殊处理
                if (attr === "opacity") {
                    element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                    element.style.opacity = (iCurrent + iSpeed) / 100;
                } else if (attr === 'scrollTop') {
                    element.scrollTop = iCurrent + iSpeed;
                }else{
                    element.style[attr] = iCurrent + iSpeed + 'px';
                }
            } else {
                flag = true;
            }

            if (flag) {
                clearInterval(element.timer);
                if (callback) {
                    callback();
                }
            }
        })
    }, 20);
}

export const ajaxHttp = (options) => {
	options = options || {};
	options.type = (options.type || "GET").toUpperCase();
	options.dataType = options.dataType || "json";
	var params = options.data;

	//创建 - 非IE6 - 第一步
	if(window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else { //IE6及其以下版本浏览器
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	//接收 - 第三步
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			var status = xhr.status;
			if(status >= 200 && status < 300) {
				options.success && options.success(xhr.responseText, xhr.responseXML);
			} else {
				options.fail && options.fail(status);
			}
		}
	}

	//连接 和 发送 - 第二步
	if(options.type == "GET") {
		params = formatParams(options.data);
		xhr.open("GET", options.url + "?" + params, true);
		xhr.send(null);
	} else if(options.type == "POST") {
		xhr.open("POST", options.url, true);
		//设置表单提交时的内容类型
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("apiAccesskey", "888888zy20180316apiAccesskey");
		xhr.send(params);
	}
}

//格式化参数
export const formatParams=(data)=>{
	var arr = [];
	for(var name in data) {
		arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
	}
	arr.push(("v=" + Math.random()).replace(".", ""));
	return arr.join("&");
}

//时间格式转化
export const formatTime=(str)=>{
	if(parseInt(str) < 10) {
		return "0" + str;
	}
	return str;
}
//将秒转化为时分秒
export const formatSecondsTime=(time)=>{
	let theTime = parseInt(time); // 秒
	let theTime1 = 0; // 分
	let theTime2 = 0; // 小时
	// alert(theTime);
	if(theTime > 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		// alert(theTime1+"-"+theTime);
		if(theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
		}
	};
	let str1=String(formatTime(theTime2));
	let str2=String(formatTime(theTime1));
	let str3=String(formatTime(theTime));
	let arr=new Array();
	arr.push(str1,str2,str3);
	return arr;
}

//处理ios返回空白
export const removeIOSwhite=(self)=>{
	self.$nextTick(() => {
	    window.scrollTo(0, 1);
	    window.scrollTo(0, 0);
	})
};

//获取滚动条到顶端距离
export const getPositionY = () => {
	var scrollPos;
	if(window.pageYOffset) {
		scrollPos = window.pageYOffset;
	} else if(document.compatMode && document.compatMode != 'BackCompat') {
		scrollPos = document.documentElement.scrollTop;
	} else if(document.body) {
		scrollPos = document.body.scrollTop;
	}
	return scrollPos;
};

//数组去重
export const uniqueArray=(array)=>{
    var n = {}, r = [], len = array.length, val, type;
    for (var i = 0; i < array.length; i++) {
        val = array[i];
        type = typeof val;
        if (!n[val]) {
            n[val] = [type];
            r.push(val);
        } else if (n[val].indexOf(type) < 0) {
            n[val].push(type);
            r.push(val);
        }
    }
    return r;
};

//多个数组进行排列组合
export const doExchange=(arr)=>{
    var len = arr.length;
    // 当数组大于等于2个的时候
    if(len >= 2){
        // 第一个数组的长度
        var len1 = arr[0].length;
        // 第二个数组的长度
        var len2 = arr[1].length;
        // 2个数组产生的组合数
        var lenBoth = len1 * len2;
        //  申明一个新数组,做数据暂存
        var items = new Array(lenBoth);
        // 申明新数组的索引
        var index = 0;
        // 2层嵌套循环,将组合放到新数组中
        for(var i=0; i<len1; i++){
            for(var j=0; j<len2; j++){
                items[index] = arr[0][i]+","+ arr[1][j];
                index++;
            }
        }
        // 将新组合的数组并到原数组中
        var newArr = new Array(len -1);
        for(var i=2;i<arr.length;i++){
            newArr[i-1] = arr[i];
        }
        newArr[0] = items;
        // 执行回调
        return doExchange(newArr);
    }else{
        return arr[0];
    }
}

//返回顶部功能
export const smoothScrollTop=()=>{
    (function smoothscroll(){
	    let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
	    if (currentScroll > 0) {
	         window.requestAnimationFrame(smoothscroll);
	         window.scrollTo (0,currentScroll - (currentScroll/5));
	    }
	})();
}
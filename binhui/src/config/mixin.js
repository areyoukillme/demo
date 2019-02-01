import { getStyle } from '../config/mUtils'
import { imgBaseUrl } from '../config/env'

export const loadMore = {
	directives: {
		'load-more': {
			bind: (el, binding) => {
				let windowHeight = window.screen.height;
				let height;
				let setTop;
				let paddingBottom;
				let marginBottom;
				let requestFram;
				let oldScrollTop;
				let scrollEl;
				let heightEl;
				let scrollType = el.attributes.type && el.attributes.type.value;
				let scrollReduce = 2;
				if (scrollType == 2) {
					scrollEl = el;
					heightEl = el.children[0];
				} else {
					scrollEl = document.body;
					heightEl = el;
				}

				el.addEventListener('touchstart', () => {
					height = heightEl.clientHeight;
					if (scrollType == 2) {
						height = height
					}
					setTop = el.offsetTop;
					paddingBottom = getStyle(el, 'paddingBottom');
					marginBottom = getStyle(el, 'marginBottom');
				}, false)

				el.addEventListener('touchmove', () => {
					loadMore();
				}, false)

				el.addEventListener('touchend', () => {
					oldScrollTop = scrollEl.scrollTop;
					moveEnd();
				}, false)

				const moveEnd = () => {
					requestFram = requestAnimationFrame(() => {
						if (scrollEl.scrollTop != oldScrollTop) {
							oldScrollTop = scrollEl.scrollTop;
							moveEnd()
						} else {
							cancelAnimationFrame(requestFram);
							height = heightEl.clientHeight;
							loadMore();
						}
					})
				}

				const loadMore = () => {
//					console.log(scrollEl.scrollTop + windowHeight);
////					console.log(height + setTop + paddingBottom + marginBottom - scrollReduce);
//					console.log(height + paddingBottom + marginBottom - scrollReduce);
//					console.log(windowHeight);
//					console.log(setTop);
//					console.log(height);
					if (scrollEl.scrollTop + windowHeight >= height + paddingBottom + marginBottom - scrollReduce) {
						binding.value();
					}
				}
			}
		}
	}
};

export const getImgPath = {
	methods: {
		//传递过来的图片地址需要处理后才能正常使用
		getImgPath(path) {
			let suffix;
			if (!path) {
				return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
			}
			if (path.indexOf('jpeg') !== -1) {
				suffix = '.jpeg'
			} else {
				suffix = '.png'
			}
			let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
			return 'https://fuss10.elemecdn.com' + url
		},
	}

};

//跳转到登陆页
export const returnLogin = {
	methods: {
		returnLogin() {
//			this.$confirm('您还未登录，去登陆？', {
//				title: '',
//				style: {}, // 同时应用在 yes, no 两个按钮上面的样式
//				yes: {
//					text: '确定',
//					style: {}
//				},
//				no: {
//					text: '取消',
//					style: {}
//				}
//			}).then(()=>{
//				window.location.href=loginUrl;
//			});
			this.$toast({
				message: "您还未登录！",
				position:'bottom',
				duration: 2000
			});
		},
		loadTimeOut() {
			this.$toast({
				message: "加载超时！",
				position:'bottom',
				duration: 2000
			});
		},
		loadFail() {
			this.$toast({
				message: "加载失败！",
				position:'bottom',
				duration: 2000
			});
		},
	}
};

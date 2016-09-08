import tap from '../event/tap.js';

// 页面头部容器
// 处理绑定事件,状态切换,渲染布局
class Header {

	constructor() {
		this.isInit = false;
		this.init();
	}

	// 初始化
	init() {
		this.bindEvent();
	}

	// 绑定header dom区域的所有事件
	bindEvent() {
		let $doc = $(document),
			_this = this;

		$doc.on(tap, '#headerCategory', ev => {
			_this.handleCategoryToggle();
		});

		$doc.on('click', '#headerMenu .swiper-slide', function() {
			$(this).addClass('slide-cur').siblings().removeClass('slide-cur');
		});
	}

	// 直播分类菜单点击
	handleCategoryToggle() {
		$('#headerCategory').toggleClass('header-category-default').toggleClass('header-category-active');
		$('#headerMenu').toggle();
		$('#shadowContainer').toggle();
		$('body').toggleClass('ov-hidden');

		if (!this.isInit) {
			this.isInit = true;
			this.initSwiper();
		}
	}

	// 初始化swiper dom
	initSwiper() {
		new Swiper('.menu-swiper', {
			slidesPerView: 4,
			centeredSlides: false,
			spaceBetween: 0,
			grabCursor: true,
			freeMode: true
		});
	}

}

export default Header;
// 首页轮播
class Carousel {

	constructor () {
		this.init();
	}

	// 初始化轮播swiper
	init () {
		new Swiper('.carousel-container', {
			autoplay: 3000,
			loop: true,
			spaceBetween: 0,
			preloadImages: false,
			lazyLoading: true,
			pagination: '.carousel-container .swiper-pagination',
			paginationClickable: true,
			onSlideChangeStart: function (swiper) {
				$('.carousel-summary span').html($('.carousel-slide').eq(swiper.activeIndex).data('summary'));
			}
		});
	}
}

export default Carousel;

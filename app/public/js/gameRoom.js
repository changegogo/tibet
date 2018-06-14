var swiper = new Swiper('.gameRoom-swiper-container', {
    watchSlidesProgress: true,
    spaceBetween: 8,
    slidesPerView: 'auto',
    loop: false,
    lazyLoading : true,
    observer: true,//修改swiper自己或子元素时，自动初始化swiper
    observeParents: true//修改swiper的父元素时，自动初始化swiper
});
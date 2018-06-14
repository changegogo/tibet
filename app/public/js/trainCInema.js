var swiper = new Swiper('.topbanner-swiper-container', {
    watchSlidesProgress: true,
    pagination: {
        el: '.topbanner-pagination',
        clickable :true
    },
    lazyLoading : true,
    slidesPerView: 'auto',
    observer: true,//修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, //修改swiper的父元素时，自动初始化swiper,
    mousewheel: true
});
// 根据score change startstyle 
var movieScoreDoms = $('.dark_start_wrapper') ;
$(movieScoreDoms).each(function(index,ele) {
	var parseSCORE = parseInt ($(ele).attr('value')) ;
	switch (parseSCORE) {
   	case 1: {
   		$(ele).css({backgroundPositionX: '-76px'});
   	}
   	break;
   	case 2: {
   		$(ele).css({backgroundPositionX: '-57px'});
   	}
   	break;
   	case 3: {
   		$(ele).css({backgroundPositionX: '-38px'});
   	}
   	break;
   	case 4: {
   		$(".dark_start_wrapper").eq(i).css({backgroundPositionX: '-19px'})
   	}
   	break;
   	case 5: {
   		$(ele).css({backgroundPositionX: 0});
   	}
   	break;
   	default: {
   		$(ele).css({backgroundPositionX: 0});
   	}

   }
});
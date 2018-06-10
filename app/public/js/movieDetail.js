// 根据score change startstyle 
var movieScoreDoms = $('.dark_start_wrapper') ;
$(movieScoreDoms).each(function(index,ele) {
	var parseSCORE = parseInt ($(ele).attr('value')) ;
	switch (parseSCORE) {
   	case 1: {
   		$(ele).css({backgroundPositionX: '-83px'});
   	}
   	break;
   	case 2: {
   		$(ele).css({backgroundPositionX: '-62px'});
   	}
   	break;
   	case 3: {
   		$(ele).css({backgroundPositionX: '-41px'});
   	}
   	break;
   	case 4: {
   		$(".dark_start_wrapper").eq(i).css({backgroundPositionX: '-20px'})
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
})

var swiper = new Swiper('.game-swiper-container', {
    watchSlidesProgress: true,
    spaceBetween: 8,
    slidesPerView: 'auto',
    loop: true,
});
// ---------------------------------------------index 文字横向滚动------------------------------------
var s,s2,s3,timer;
function init(){
    s=getid("news_notice_adverst");
    s2=getid("adversit_one");
    s3=getid("adversit_two");
    s3.innerHTML=s2.innerHTML;
    timer=setInterval(mar,30) ;
}
function mar(){
    if(s.scrollLeft >= s2.offsetWidth){
        s.scrollLeft-=s2.offsetWidth;
    }else{s.scrollLeft++;}
}
function getid(id){
    return document.getElementById(id);
}
init();

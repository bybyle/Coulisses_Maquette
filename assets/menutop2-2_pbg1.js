var url = window.location.href;
var initialSlide = 0
if (url.indexOf('/news') > -1) {initialSlide = 0;}
if (url.indexOf('/contast') > -1) {initialSlide = 1;}
if (url.indexOf('/forums') > -1) {initialSlide = 2;}
if (url.indexOf('/collectors') > -1) {initialSlide = 3;}
if (url.indexOf('/videos') > -1) {initialSlide = 4;}
if (url.indexOf('/library') > -1) {initialSlide = 5;}
if (url.indexOf('/syld') > -1) {initialSlide = 6;}
console.log(initialSlide);
var swip = new Swiper('.swiper-container-menuTop', {
    grabCursor: true,
    slidesPerView: 'auto',
    freeMode: true,
    slidesOffsetBefore: getMargin(),
    slidesOffsetAfter: getMargin(),
    initialSlide: initialSlide,
    mousewheel: {
        invert: true,
        forceToAxis: true,
    },
    on: {
        init: function() {
            document.querySelector('.menuTopContainer2').style.opacity = 1;
        },
        resize: function() {
            this.params.slidesOffsetBefore = getMargin();
            this.params.slidesOffsetAfter = getMargin();
        }
    },
    spaceBetween: 10,
    centerInsufficientSlides: true,
    noSwiping: false,
    breakpoints: {
        1045: {
            noSwiping: true,
        },
    },
});
function getMargin() {
    return 0;
    var pageWidth = document.querySelector('.app-content .container').offsetWidth;
    var m = (window.innerWidth - pageWidth) / 2;
    return window.innerWidth < 768 ? 0 : m;
}
var prevScrollpos = window.pageYOffset;
var prevState = "";
var slider = document.querySelector('.swiper-container-menuTop');
var stopclick = false;
window.addEventListener('scroll', function() {
    var currentScrollPos = window.pageYOffset;
    if (currentScrollPos<=0) return;
    if (prevScrollpos > currentScrollPos) {
        if (prevState == 'small') {
            slider.classList.remove('hide');
            stopclick = false;
        }
        prevState = "";
    } else if (currentScrollPos > 150) {
        if (prevState != 'small') { 
            slider.classList.add('hide');
            stopclick = true;
        }
        prevState = "small";
    }
    prevScrollpos = currentScrollPos;
});
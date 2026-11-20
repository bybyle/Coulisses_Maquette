new Swiper('.swiper-container-multiple', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    watchOverflow: true,
    mousewheel: {
        invert: false,
        forceToAxis: true,
    },
    pagination: {
        el: '.swiper-pagination',
    },
    preloadImages: false,
    lazy: {
        loadPrevNext: true,
    },
    breakpoints: {
        763: { slidesPerView: 2, slidesPerGroup: 2 },
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
new Swiper('.swiper-container', {
    slidesPerView: 1,
    watchOverflow: true,
    mousewheel: {
        invert: false,
        forceToAxis: true,
    },
    pagination: {
        el: '.swiper-pagination',
    },
    preloadImages: false,
    lazy: {
        loadPrevNext: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
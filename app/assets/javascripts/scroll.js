$(window).scroll(function () {
  scroll_top = $(window).scrollTop();
  if (scroll_top >= 100) {
    $('.sidebar').css({top: 0, height: '100vh'});
  } else if (scroll_top <= 100) {
    $('.sidebar').css({top: (100 - scroll_top)});
  }
});

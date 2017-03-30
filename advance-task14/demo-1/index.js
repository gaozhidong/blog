$('.ct > li').on('mouseenter',function(){
    $(this).children().addClass("show");
});

$('.ct > li').on('mouseleave',function(){
    $(this).children().removeClass("show");
});
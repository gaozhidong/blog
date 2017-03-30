
$('.ct-head .ct-head-item').on('click', function () {
    $(this).siblings('.ct-head-item').removeClass('active');
    $(this).addClass('active');
    $(this).children().css({ color: 'red' });
    $(this).siblings('.ct-head-item').children().css({ color: 'initial' });
    var $item = $(this).parent().children('.ct-head-item');
    var index = $item.index(this);
    $(this).parent().siblings().children().removeClass('show');
    $(this).parent().siblings().children().eq(index).addClass('show');
});

$('.ct-content-item').on('mouseenter', function () {

    $(this).children().addClass('show');
});
$('.ct-content-item').on('mouseleave', function () {

    $(this).children().removeClass('show');
});



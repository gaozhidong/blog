

$('.btn').on('click', function () {
    $(this).animate({ backgroundColor: "#FF0000" }, 1000, null, function () {
        $('.btn').css("backgroundColor", "#FF0000");
    });
    $(this).animate({ backgroundColor: "#FF0000" }, 1000, null, function () {
        $('.btn').css("backgroundColor", "#0000FF");
    });
});


$('.btn1').on('click', function () {
    var $scrollTop = $(window).scrollTop();

    $(this).next().html(" 当前滚动高度为:" + $scrollTop).css('color', "#FF0000");
});


$('#cc').on('mouseenter', function () {
    $(this).css('background-color', "#FF0000");
});
$('#cc').on('mouseleave', function () {
    $(this).css('background-color', "#0000ff");
});

$('.in').on('focus', function () {
    $(this).css('border-color', '#0000ff');
    var u = $(this).val().toUpperCase();
    $(this).val(u);
});

$('.in').on('blur', function () {
    $(this).css('border-color', '#000');
    console.log($(this).val());
});

$('select').on('change', function () {
    console.log($(this).val());
});












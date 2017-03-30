$('.ct-content').on('mouseenter', '.ct-content-item', function () {
    console.log(this);
    $(this).children().addClass('show');

});
$('.ct-content').on('mouseleave', '.ct-content-item', function () {

    $(this).children().removeClass('show');
});

var products = [
    {
        img: 'http://img10.360buyimg.com/N3/jfs/t2242/92/1446546284/374195/9196ac66/56af0958N1a723458.jpg',
        name: '珂兰 黄金手 猴哥款',
        price: '￥405.00'
    }, {
        img: 'http://img10.360buyimg.com/N3/jfs/t2242/92/1446546284/374195/9196ac66/56af0958N1a723458.jpg',
        name: '珂兰 黄金转运珠 猴哥款',
        price: '￥100.00'
    }, {
        img: 'http://img10.360buyimg.com/N3/jfs/t2242/92/1446546284/374195/9196ac66/56af0958N1a723458.jpg',
        name: '珂兰 黄金手链 3D猴哥款',
        price: '￥45.00'
    }
];

var $ct = $('.ct-content');

$(".add").on("click", function () {
    console.log('-');
    var str = '';
    for (var i = 0; i < products.length; i++) {
        str += '<li class="ct-content-item">' +
            '<div class="ct-content-item-cover">' +
            '<a href="#">立即抢购</a>' +
            '</div>' +
            '<a href="#">' +
            '<img src=' + '\"' + products[i].img + '\"' + '>' +
            '<h4 class="prod-name">' + products[i].name + '</h4>' +
            '<p class="pro-price"><span>' + products[i].price + '</span></p>' +
            '</a>' +
            '</li>';

    }
    $ct.append(str);
});


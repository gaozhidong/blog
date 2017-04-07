var $container = $('.container');
var columnLength = [];
var isLoading = false;

waterfall();
$('.column').eq(shortestColumn()).append('<div id="more"></div>');
// $(window).on('resize',waterfall);
$(window).on('scroll', function () {
    let id = setInterval(function () {
        if (!isVisible($('#more'))) {
            clearInterval(id);
        }
        else {
            columnAdd();
        }
    }, 10);

});


//初始化列，以及记录列高的数组
function waterfall() {
    var n = Math.floor($container.width() / 250);
    console.log(n);
    for (var i = 0; i < n; i++) {
        columnLength[i] = 0;
        $container.append('<ul class="column"></ul>');
    }
    let id = setInterval(function () {
        if (!isVisible($('#more'))) {
            clearInterval(id);
        }
        else {
            columnAdd();
        }
    }, 10);

}

//添加图片
//图片高度为[150,650]范围内的随机数
function addImg(columnIndex) {
    isLoading = true;
    var imgHeigh = parseInt(Math.random() * 400 + 150);
    var imgSrc = 'https://unsplash.it/240/' + imgHeigh + '/?random';
    var $currentColumn = $('.column').eq(columnIndex);
    $currentColumn.append('<li><img src=' + imgSrc + '></li>')
    columnLength[columnIndex] += imgHeigh + 10;
    console.log($currentColumn.find('img').last()[0]);
    $currentColumn.find('img').last().on('load', function () {
        isLoading = false;
        console.log('1111');
    });
    // return $currentColumn.find('img').last();
}

//选择最短列
function shortestColumn() {
    var minVal = columnLength[0];
    var resIndex = 0;
    $.each(columnLength, function (index, value) {
        if (minVal > value) {
            resIndex = index;
            minVal = value;
        }
    });
    return resIndex;
}

//选择往列后面添加图片
function columnAdd() {
    if (!isLoading) {
        $('#more').remove();
        addImg(shortestColumn());
        $('.column').eq(shortestColumn()).append('<div id="more"></div>');
    }
}

//判断元素是否是出现在窗口可视范围
function isVisible($node) {
    var windowHeight = $(window).height();
    var scrollTop = $(window).scrollTop();
    var offsetTop = $node.offset().top;
    var nodeHeight = $node.outerHeight(true);
    if (scrollTop >= offsetTop - windowHeight && scrollTop <= offsetTop + nodeHeight) {
        return true;
    }
    else {
        return false;
    }
}
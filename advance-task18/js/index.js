/*$(window).on('resize', function () {
    render();
});
function render() {
    var ctWidth = $(window).width()
        , itemWidth = $('.item').outerWidth(true)
        , colNum = Math.floor(ctWidth / itemWidth);
    var colSumHeight = [];
    for (var i = 0; i < colNum; i++) {
        colSumHeight.push(0);
    }
    $('.item').each(function () {
        var $node = $(this);
        var idx = 0,
            minSumHeight = colSumHeight[0];
        for (var i = 0; i < colSumHeight.length; i++) {
            if (colSumHeight[i] < minSumHeight) {
                idx = i;
                minSumHeight = colSumHeight[i];
            }
        }
        $node.css({
            left: itemWidth * idx,
            top: minSumHeight
        });
        colSumHeight[idx] = $node.outerHeight(true) + colSumHeight[idx];
    })
}
render();


*/

/*
$(window).on('resize', function () {
    waterfull();
});

function waterfull() {
    var colLength = parseInt($('.content').width() / $('.item').width())
    var itemArr = []
    for (var i = 0; i < colLength; i++) {
        itemArr[i] = 0
    }

    $('.item').each(function () {
        var minValue = Math.min.apply(null, itemArr)
        var minIndex = itemArr.indexOf(minValue)

        $(this).css({
            top: itemArr[minIndex],
            left: $(this).outerWidth(true) * minIndex
        })
        itemArr[minIndex] += $(this).outerHeight(true)
    })
    waterfull();*/


var waterfull = (function () {


    function init() {
        waterfull();
        $(window).on('resize', function () {
            waterfull();
        });
    }

    function waterfull() {
        var colLength = parseInt($('.content').width() / $('.item').width())
        var itemArr = []
        for (var i = 0; i < colLength; i++) {
            itemArr[i] = 0
        }

        $('.item').each(function () {
            var minValue = Math.min.apply(null, itemArr)
            var minIndex = itemArr.indexOf(minValue)

            $(this).css({
                top: itemArr[minIndex],
                left: $(this).outerWidth(true) * minIndex
            })
            itemArr[minIndex] += $(this).outerHeight(true)
        })
    }

    return {
        init: init
    }
})()

waterfull.init()




































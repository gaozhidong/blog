$('.ct').on('click', 'li', function () {
    $(this).addClass('hover')
});
$('.ct').on('mouseleave', 'li', function () {
    $(this).removeClass('hover')
})

$(function () {
    var lock = false;
    var btn = $('.btn');
    btn.on('click', function () {
        var start = $('.ct li').length + 1;
        var len = 3;
        btn.text('加载中……');
        if (!lock) {
            lock = true;
            $.ajax({
                url: '/getMore',
                type: 'get',
                dataType: 'json',
                data: {
                    start: start,
                    len: len
                },
                success: function (result) {
                    append(result.data);
                    btn.text('加载更多');
                    lock = false;
                },
                error: function () {
                    btn.text('加载失败');
                    lock = false;
                }
            })
        }
    })
    function append(data) {
        for (var i = 0; i < data.length; i++) {
            $('.ct').append('<li>' + data[i] + '</li>');
        }
    }

})
var page = 0;
$('.btn').on('click', function (e) {
    var news;
    var html = '';
    $list = $('.list');
    e.preventDefault();
    $.ajax({
        url: '/getMore',
        method: 'GET',
        data: {
            page: page
        }
    }).done(function (data) {
        page++;
        news = (data.msg);
        $(news).each(function () {
            html += '<li class="list-item">' + this + '</li>';
        })
        $list.append(html);

    }).fail(function (jqXHR, textStatus) {

    });

});
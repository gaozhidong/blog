var $container = $('.container');
var columnLength = [];
var isLoading = false;
var newsNum = 3;
var currentPage = 1;

/*
API:
url:http://platform.sina.com.cn/slide/
type:album_tech
data:{
    jsoncallback=func,
    app_key=1271687855,
    num=3,
    page=4
}
result data:
func({
    "status":{"code":"0"},
    "total":"8610",
    "count":"1",
    "data":[{
        "id":"75986",
        "sid":"453",
        "name":"\u70c8\u3002\u6253",
        "short_name":"\u70c8\u3002\u6253",
        "url":"http:\/\/slide.com.cn\/d\/slide_5_453_75986.html",
        "img_url":"47175.jpg",
        "createtime":"2017-03-31 07:48:00",
        "img_count":"8",
        "short_intro":"\u70c8\u3002",
        "uni_intro":"",
        "sub_ch":"\u79d1\u666e",
        "click":"15157",
        "click_this_week":"15157",
        "click_last_week":"0",
        "click_this_month":"4588",
        "click_last_month":"10569",
        "click_this_day":"1245",
        "click_last_day":"3351",
        "source":"\u65b0\u6d6a",
        "cmnt_url":"http:\/\/comment5.news.sina.com.cn",
        "category_2":""
    }]
})
*/
waterfall();

$(window).on('scroll', function () {
    if (isVisible($('#more')) && !isLoading) {
        getNews(6);
    }
});

//请求新闻
function getNews(Num) {
    isLoading = true;
    $.ajax({
        url: 'http://platform.sina.com.cn/slide/album_tech',
        type: 'get',
        data: {
            app_key: '1271687855',
            num: Num,
            page: currentPage
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'func',
        success: onSuccess,
        error: onError
    });
}
function onSuccess(res) {
    currentPage++;
    $.each(res.data, function (index, value) {
        appendNews(value);
    })
    if (isVisible($('#more'))) {
        getNews(newsNum);
    }
    isLoading = false;
}
function onError() {
    console.log('ajax error~!');
    isLoading = false;
}


//初始化列，以及记录列高的数组
function waterfall() {
    for (var i = 0; i < 3; i++) {
        columnLength[i] = 0;
        $container.append('<ul class="column"></ul>');
    }
    getNews(newsNum);
}

//拼装新闻，并插入高度最小的列
function appendNews(data) {
    var date = data.createtime.substr(0, 10);
    var html = `<li><a href="${data.url}">
				<img src="${data.img_url}">
				<h2>${data.name}</h2>
				<p><span>${date}  </span>${data.short_intro}</p>
			</a></li>`;
    var desColumnIndex = shortestColumn();
    columnLength[desColumnIndex] += $('.column').eq(desColumnIndex).append(html).outerHeight(true);
    isLoading = false;
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
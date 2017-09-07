


var defaultBoxHTML = "",

default_box = document.getElementById("default_box").innerHTML,

    scroll_box = document.getElementById("scroll_box").innerHTML;


var pidArr = new Array();

var indexPid = "";

var parseId = "";


//判断是否登录
function getCurrentUserInforAjax(){
            var option={
                url:MoonduDomain+'/UserCenter/GetUserInfo',
                callback:function(res){
                    if (res.Result == "nologin") {
                          unloginIndex(0);
                        unloginScroll(0);
                    }else{
                        index_list(0);
                        index_scroll(0);
                    }
                    
                }
            }
            $.md.ajaxurl(option);
        }
getCurrentUserInforAjax();

//================默认渲染模板====================

function index_list(page) {

    var index_html = "";

    var template1 = new EJS({ "text": default_box });

    var option = {

        url: MoonduDomain + '/MNews/IndexNews',

        data: { cmsid: 6 },

        callback: function (data) {

            if (data.Result == true) {

                var data = data.Data.Rows;

                for (var i = 0; i < data.length; i++) {

                    if (data[i] == null) {

                    } else {

                        defaultBoxHTML += template1.render(data[i]);

                    }

                }

                $(".index .default").html(defaultBoxHTML);

                var item = $(".index .default").find('li');

                for (var i = 0; i < item.length; i++) {

                    if (item.length > 3) {

                        $(".index .default li:gt(2)").addClass('hidden');

                    }

                };

                //分享图片

                $('#infoList').on('click', 'a.u_share', shareNewsLink);

            }

        }

    }

    $.md.ajaxurl(option);

}

//=================未登录默认渲染模板====================

function unloginIndex(page) {

    var index_html = "";

    var template1 = new EJS({ "text": default_box });

    var option = {

        url: MoonduDomain + '/MNewsB/IndexNews',

        data: { cmsid: 6 },

        callback: function (data) {

            if (data.Result == true) {

                var data = data.Data.Rows;

                for (var i = 0; i < data.length; i++) {

                    if (data[i] == null) {

                    } else {

                        defaultBoxHTML += template1.render(data[i]);

                    }

                }

                $(".index .default").html(defaultBoxHTML);

                var item = $(".index .default").find('li');

                for (var i = 0; i < item.length; i++) {

                    if (item.length > 3) {

                        $(".index .default li:gt(2)").addClass('hidden');

                    }

                };

                //分享图片

                $('#infoList').on('click', 'a.u_share', shareNewsLink);

            }

        }

    }

    $.md.ajaxurl(option);

}


//=================未登录循环渲染模板====================

function unloginScroll(page) {

    var scrollBoxHTML = "";

    var option = {

        url: MoonduDomain + '/photoB/GetPhotoIndex',

        data: { page: page },

        callback: function (data) {

            if (data.Result == true) {

                var data = data.Data.Rows;

                if (data.length > 0) {

                    for (var i = 0; i < data.length; i++) {

                        var template = new EJS({ "text": scroll_box });

                        scrollBoxHTML += template.render(data[i]);

                        pidArr.push(data[i].Pid);

                    }

                    indexPid = pidArr.toString();

                    indexInfo();

                    $("ul.index_scroll").append(scrollBoxHTML);

                    var item = $(".index_scroll").find(".u_head");

                    for (var i = 0; i < item.length; i++) {

                        var aa = $(item[i]).find("img").attr("src");

                        if (aa == "") {

                            $(item[i]).find('img').attr('src', 'images/user.jpg');

                        }

                    }


                    $('#ListScroll').on('click', 'a.u_share', shareActivity);


                }

                else {

                    $('ul.index_scroll').attr("data-page", "0");

                }

                $('ul.index_scroll').attr("data-loading", "0");


            }

        }

    }

    $.md.ajaxurl(option);

}


//=================循环渲染模板====================

function index_scroll(page) {

    var scrollBoxHTML = "";

    var option = {

        url: MoonduDomain + '/photo/GetPhotoIndex',

        data: { page: page },

        callback: function (data) {
            if (data.Data == null || data.Result == "nologin") {

            }

            else {

                var data = data.Data.Rows;

                if (data.length > 0) {

                    for (var i = 0; i < data.length; i++) {

                        var template = new EJS({ "text": scroll_box });

                        scrollBoxHTML += template.render(data[i]);

                        pidArr.push(data[i].Pid);

                    }

                    indexPid = pidArr.toString();

                    indexInfo();

                    $("ul.index_scroll").append(scrollBoxHTML);

                    var item = $(".index_scroll").find(".u_head");

                    for (var i = 0; i < item.length; i++) {

                        var aa = $(item[i]).find("img").attr("src");

                        if (aa == "") {

                            $(item[i]).find('img').attr('src', 'images/user.jpg');

                        }

                    }


                    $('#ListScroll').on('click', 'a.u_share', shareActivity);


                }

                else {

                    $('ul.index_scroll').attr("data-page", "0");

                }

                $('ul.index_scroll').attr("data-loading", "0");


            }

        }

    }

    $.md.ajaxurl(option);

}

function shareLink() {

    var u = navigator.userAgent;

    //安卓手机

    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {

        window.location.href = "http://www.moonbasa.com/";

        //苹果手机

    }

    else if (u.indexOf('iPhone') > -1) {

        window.location.href = "http://www.zoon.moonbasa.com/";

    }

    //winphone手机

    else if (u.indexOf('Windows Phone') > -1) {

        //$.alert("winphone手机");

        //window.location.href = "http://www.zoon.moonbasa.com/";

    }

}

//分享资讯

function shareNewsLink(e) {

    var target = e.target;

    var id = $(target).parents('li').attr('data-pid');

    var title = $(target).parents('li').find('div[data-type=title]').html();

    var content = $(target).parents('li').find('[data-type=content]').attr('data-content');

    if (content == '') {

        content = title;

    };

    TakePhoto.prototype.takePhoto(

'share',

function (r) {


},

function (e) { console.log(e); },

[{ "sharetitle": title, "sharecontent": content, "shareurl": MZoneDomain + "T_massage.html?id=" + id + ""}]);

}

//分享活动

function shareActivity(e) {

    var target = e.target;

    var pid = $(target).parents('li').attr('data-pid');

    var title = $(target).parents('li').find('div[data-fn=title]').html();

    //var content = $(target).parents('li').find('div[data-fn=content]').html();

    TakePhoto.prototype.takePhoto(

'share',

function (r) {


},

function (e) { console.log(e); },

[{ "sharetitle": title, "sharecontent": title, "shareurl": MZoneDomain + "T_viewPhptos.html?pid=" + pid + ""}]);


}

function indexInfo() {

    var option = {

        url: MoonduDomain + '/photo/GetLikedPhoto',

        data: { pid: indexPid },

        callback: function (res) {

            if (res.Result == true) {

                data = res.Data;

                for (i = 0; i < data.length; i++) {

                    parseId = data[i].Pid;

                    $(".u_like[data-type='" + parseId + "']").removeClass("u_like").addClass("u_like_red");

                }

            } else {


            }

        },

        error: function () {

        }

    }

    $.md.ajaxurl(option);

}







//==============点赞和取消点赞===================


var ListScroll = $("#ListScroll");

var infoList = $("#infoList");


ListScroll.on("click", "a.u_like", function () {

    var _this = this;

    praiseAjax(_this);

});

infoList.on("click", "a.u_like", function () {

    var _this = this;

    InfoAjax(_this);

});

ListScroll.on("click", "a.u_like_red", function () {

    $.alert("已经点过赞");

});

infoList.on("click", "a.u_like_red", function () {

    $.alert("已经点过赞");

});


//首页推荐列表点赞

function InfoAjax(obj) {

    var pitureId = $(obj).attr("data-type");

    var option = {

        url: MoonduDomain + '/Mnews/LikeList',

        data: { newid: pitureId },

        callback: function (res) {

            if (res.Result == "nologin") {

                $.login("是否登录");

            }

            if (res.Result == true) {

                var xcount = parseInt($(obj).parent().find("em").text());

                $(obj).removeClass("u_like").addClass("u_like_red");

                xcount++;

                $(obj).parent().find("em").text(xcount);

            };

        },

        error: function () {

        }

    }

    $.md.ajaxurl(option);

}




//循环列表点赞

function praiseAjax(obj) {

    var pitureId = $(obj).attr("data-type");

    var option = {

        url: MoonduDomain + '/photo/OptLike',

        data: { otype: 0, pid: pitureId },

        callback: function (res) {

            if (res.Result == "nologin") {

                $.login("是否登录");

            }

            if (res.Result == true) {

                var xcount = parseInt($(obj).parent().find("em").text());

                $(obj).removeClass("u_like").addClass("u_like_red");

                xcount++;

                $(obj).parent().find("em").text(xcount);

            };

        },

        error: function () {

        }

    }

    $.md.ajaxurl(option);

}









//=========================瀑布流======================================


$(window).scroll(function () {


    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());


    if ($(document).height() <= totalheight) {


        page = parseInt($('ul.index_scroll').attr("data-page"));

        loading = parseInt($('ul.index_scroll').attr("data-loading"));


        if (page > 0 && loading == 0) {

            $("ul.index_scroll").attr("data-page", page + 1);

            $('ul.index_scroll').attr("data-loading", "1");

            index_scroll($("ul.index_scroll").attr("data-page"));
            unloginScroll($("ul.index_scroll").attr("data-page"));

        }


    }

});




//======================点击标签进入标签页===================

$(".newList").on("click", ".indexTag", function () {

    photoTag();

})


function photoTag() {


    var id = $.getUrlVar('id');

    var option = {

        url: MoonduDomain + '/photo/GetPhotoByTag',

        data: { tag: id, page: 1, pagesize: 10 },

        callback: function (data) {

            if (data.Result == true) {


            }

        }

    }

    $.md.ajaxurl(option);

}
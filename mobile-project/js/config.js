
//接口地址
MshowDomain="http://mgirl.moonbasa.com/api/"

ImgDomain="http://zoneimages.moonbasa.com/";
MZoneDomain = 'http://mzone.moonbasa.com/';
//MoonduDomain ="http://mzoneapi.moonbasa.com";
//MoonduDomain ="http://app.moonbasagroup.com:8099";
phoneType="Android";
PhoneCode="1.0.1";


/*MoonduDomain="http://moondumobiletest.moonbasa.web.moonbasagroup.com"*/
MoonduDomain="http://mobile.moonbasagroup.com:8099"


//test
/*MoonduDomain ="http://app.moonbasagroup.com:8099"
MshowDomain="http://moonduwptest.moonbasa.web.moonbasagroup.com/api/"*/

//导航
var foot_nav={
	 index:"index.html",//首页
	 found:"find-activity.html",// 发现
	 circle:"circle.html",//圈子
	 user:"user.html",//用户中心
	 add:"javascript:;"//发布
	};
//判断用户是否登陆
	$.md = $.extend({
        ajaxurl: function (options) {
            options = $.extend({
				url:"",
				type:"GET",
				data:{},
				jsonp:'jsonp',
				callback:null
            }, options || {});
            
			$.ajax({
				dataType:"jsonp",
				url:options.url,
				type:options.type,
				data:options.data,
                timeout:30000,
				success: function(data){
					calback(data);
				}
			});
			function calback(_data){
				if(options.callback !== null){
					options.callback.call(this, _data); 
				 }
			}
        }
    }, $.md || {});
	
    
//个人中心——首页

var user_nav={
	show:"my_show.html",//我的星秀场
	photo:"my_photo.html",//我的相册
	active:"my_active.html",//我的活动
	like:"my_like.html",//我喜欢的
	integral:"#",//我的积分
	set:"personal_set.html"//设置
	};
	
//发现--首页
var find_nav={
		index_show:"my_show.html",//星秀场
		index_match:"my_show.html",//搭配帮
		index_design:"my_show.html",//设计档
		hot_people:"my_show.html",//热门人物
		hot_act:"my_show.html",//热门活动
		hot_tag:"my_show.html",//热门标签相册
		hot_news:"my_show.html",//热门内容
	};

var MZConfig={
	comment:
		"<div id='comment-page' class='hidden'>\
			<div class='find-activity-top'>评论<a href='find-detail.html' class='arrow'></a></div>\
			<div class='find-message'>\
				用户留言<a href='javascript:;'>\
					(<span class='num'>28</span>条)\
				</a>\
			</div>\
			<ul class='find-user-massage' id='userComment'>\
				<script type='text/template' id='userCommentTemp'>\
					<li>\
						<img class='user-icon fl' src='<%=portrait%>'/>\
						<span class='user'><%=name%></span>\
						<span class='issue-time'>今天<span class='time'><%=date%></span></span>\
						<span class='replay'><span class='content'>回复<a href='javascript:;'><%=replyTo%></a><%=conn%></span>\
						</span>\
					</li>\
				</script>\
			</ul>\
		</div>",
	comment2:
		"<div id='comment-page' class='hidden'>\
			<div class='find-activity-top'>评论<a href='find-detail.html' class='arrow'></a></div>\
			<div class='find-message'>\
				用户留言<a href='javascript:;'>\
					(<span class='num'>28</span>条)\
				</a>\
			</div>\
			<ul class='find-user-massage' id='userComment'>\
				<script type='text/template' id='userCommentTemp'>\
					<li>\
						<img class='user-icon fl' src='<%=UserInfo.Image%>'/>\
						<span class='user'><%=UserInfo.UserNick%></span>\
						<span class='issue-time'>今天<span class='time'><%=Time%></span></span>\
						<span class='replay'><span class='content'>回复<a href='javascript:;'>花花</a><%=Comment%></span>\
						</span>\
					</li>\
				</script>\
			</ul>\
		</div>",
	layer:
		'<div id="layer" class="hidden">\
			<div class="laymshade"></div>\
			<div class="main clearfix">\
				<div class="tips">您确定要删除吗？</div>\
				<a href="javascript:;" class="cancel fl">取消</a>\
				<a href="javasctipt:;" class="ensure fl">确定</a>\
			</div>\
		</div>'
		},
	liItem = "<li>\
				<div class='brank'></div>\
				<a href='public_home.html' class='portrait'><img src='<%=IMAGE%>' width='100%'></a>\
				<div class='introduction'>\
				<a href='public_home.html' class='name'><%=UserNick%></a>\
				<p></p>\
				<a href='JavaScript;:' class='attention-num'>0人关注</a></div>\
				<a href='javascript:;' class='payattention attention fr'>+关注</a>\
			</li>"
		
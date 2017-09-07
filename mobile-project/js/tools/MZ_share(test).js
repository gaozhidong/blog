
	$(function(){
		//照片落地页
		var View = {
			init:function(){
				var self = this;
				this.$top = $("body");
				this.wrap=$("#photoMessage");
				this.userMsg=$("#userMessage");
				this.publishField = $("#photoMessage");
				this.commentPage = $("#comment-wrap");
				this.praiseWarp = $("#praise-block");
				this.userInfor = {};//存储当前用户的信息
				this.page = 0;
				this.currentActivity = [];  //当前活动
				this.commentList = [];  //当前活动评论列表
				this.praiseList = []; //点赞列表
				//弹出层
				this.layer=$(MZConfig.layer);
				this.publishField.after(this.layer);

				this.ensureBtn = this.layer.find("a.ensure");
				this.cancelBtn = this.layer.find("a.cancel");

				this._bindEvent();
				
			},
			_bindEvent:function(){
				var self = this;
				this.commentAjaxManager(self.page);
				this.getPhotoDetailAjax();
				window.onload = function(){
					self.getDeliverPraiseAjax();
				}
				
				//发表评论,判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_view') {
					this.publishField.find("a[data-type=comment]").bind("click",self.shareLink);
				}
				//点赞,判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_view') {
					this.publishField.on("click","a[data-type=love]",self.shareLink);
				}else{
					this.publishField.on("click","a[data-type=love]",self.tooltipPraiseAjax);
				}
				// 关注，判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_view'){
					this.wrap.on('click','a[data-type=focus]',self.shareLink);
				}
				
				//分享下载链接
				$("#m-bottom-banner").find("a").bind("click",self.shareLink.bind(this));

				//下载app
				this.publishField.on('click','textarea',self.shareLink);
				// this.publishField.on('click','a[data-type=comment]',self.shareLink);
				// this.publishField.on('click','a[data-type=love]',self.shareLink);
				this.commentPage.on('click','span.text',self.shareLink);
			},
			//点赞的用户过多则出现省略号
			praiseEllipsis:function(){

				var self = this;

				var xcount=this.praiseWarp.find("li").size();

				var postID = parseInt(this.wrap.find("input[type=hidden]").val());

				this.praiseWarp.find("span.num").text(xcount);
				//如果用户太多，则用省略号表示，点击省略号可跳转页面
				var xSize=this.praiseWarp.find("li").size(); //总个数

				//var xli = $("<li class='ellipsis fl'><a href='praise_list.html?pid="+postID+"'>...</a></li>");//创建带有省略号的li

				var xli = $("<li class='ellipsis fl'><a href='javascript:;'>...</a></li>");//创建带有省略号的li

				var xWidth = parseInt(this.praiseWarp.find("li").not(".ellipsis").width()) + parseInt(this.praiseWarp.find("li").css("marginRight")); //每个的长度+margin值

				var xcount = Math.floor(parseInt(this.praiseWarp.find("ul").width())/xWidth);//一行可容纳多少个li

				if (xSize*xWidth > parseInt(this.wrap.find("ul").width())) {

					$("#praise-block ul li:gt(" + (xcount-1) + ")").addClass("hidden");

					//第xcount-1个后面插入带省略号的li
					this.praiseWarp.find("li").eq(xcount-1).after(xli);
				}
			},
			messageRender:function(data){
				var self=this,
					html = "",
					d = new Date(),
					authorTemp = document.getElementById("authorTemp").innerHTML,
					temp = new EJS({"text": authorTemp});
				this.title = data.Declare;
				this.content = data.Photo;
				this.pid = data.Pid;
				//////////////////////
				$("title").text(this.title);
				$("#hidddenPhoto").find('img').attr("src",data.Photo);
				html = temp.render(data);
				this.currentActivity.push(data);
				$("title").text(data.Title)
				this.wrap.prepend(html);
				//回复时间判断与显示
				/*var timeReply = Date.parse(data.Time.replace(/年/,"/").replace(/月/,"/").replace(/日/,"")),
					currentTime = d.getTime(),
					minusTime = (currentTime - timeReply)/1000,
					minusTimeSec = Math.floor(minusTime%60),
					minusTimeMin = Math.floor((minusTime-minusTimeSec)%360/60),
					minusTimeHor = Math.floor(minusTime/360);
					minusTimeDay = Math.floor(minusTimeHor/24);
					if (minusTimeHor == 0 && minusTimeMin < 30){
						this.wrap.find('.author-time').text('刚刚');
					} else if (minusTimeHor == 0 && !minusTimeMin < 30){
						this.wrap.find('.author-time').text('半小时前');
					} else if (minusTimeHor < 24){
						this.wrap.find('.author-time').text(minusTimeHor + '小时前');
					} else {
						this.wrap.find('.author-time').text(minusTimeDay + '天前');
					}*/




				//初始状态点赞的数量为li的总数，往后每添加一条评论，长度增加1
				var praiseCount=this.wrap.find("ul").find("li").size();
				this.wrap.find(".zan").find("span.num").text(praiseCount);

				//评论总数
				var commentNum = data.Comment_Count;
				commentNum == 0 ? hidden() : commentNum ;
				this.commentPage.find('span.num').text(commentNum);
				function hidden(){
					$('.comment-more').addClass('hidden');
				}
			},
			shareLink:function(){
				var browser = {
					versions: function() {
						var u = navigator.userAgent, app = navigator.appVersion;
							return {//移动终端浏览器版本信息
								trident: u.indexOf('Trident') > -1, //IE内核
								presto: u.indexOf('Presto') > -1, //opera内核
								webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
								gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
								mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
								ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
								android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
								iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
								iPad: u.indexOf('iPad') > -1, //是否iPad
								webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
						};
					}(),
					language: (navigator.browserLanguage || navigator.language).toLowerCase()
				}
				var img = $("#img");
				var imgs = $("#imgs");
				var ua = window.navigator.userAgent.toLowerCase(); 
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						$(".app").removeClass("hidden");
						img.className = "ios";
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						$(".app").removeClass("hidden");
						img.className = "android";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}		
				}
			},
			photoPraiseRender:function(data){
				var self = this,
					html = "",
					photoPraiseTemp = document.getElementById("photoPraiseTemp"),
					temp = new EJS({"text": photoPraiseTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.praiseList.push(data[i]);
				}
				this.praiseWarp.find("ul").html(html);
				//如果用户头像为空，则显示默认头像
				/*var li = this.praiseWarp.find("ul").find("li"); 
				for (var i = 0; i < li.length; i++) {
					if ($(li[i]).find('img').attr('src') == '') {
						$(li[i]).find('img').attr('src','images/user.jpg');
					};
				};*/
				this.praiseWarp.find("span.num").text(this.praiseWarp.find("ul").find("li").size());
				//省略号
				this.praiseEllipsis();
			},
			//===================评论模块渲染===============
			commentRender:function(data){
				var self=this,
					html="",
					count = 0,
					commentTemp=document.getElementById("userCommentTemp"),
					temp = new EJS({"text": commentTemp});
				//控制显示3条评论，点击查看更多评论时，会跳转下载APP
				if(data.length < 4){
					count = data.length;
				} else {
					count = 3;
				}
				for (var i = 0; i < count; i++) {
					html += temp.render(data[i]);
					this.commentList.push(data[i]);
				};
				
				var oul = this.commentPage.find('.comment-list').append(html);
				var wrap = this.commentPage.find(".find-message").after(oul);
				//判断用户头像是否为空
				var item = this.commentPage.find('ul').find('li');
				for (var i = 0; i < item.length; i++) {
					if ($(item[i]).find('img.user-icon').attr('src') == '') {
						$(item[i]).find('img.user-icon').attr('src','images/user.jpg');
					}
				};
			},
			//============ajax获取相片数据===========
			getPhotoDetailAjax:function(){
				var self = this;
				var pid = parseInt($.getUrlVar('pid'));
				$.ajax({
					url:MoonduDomain+'/home/GetPhotoByPid',
					type:"GET",
					dataType:"jsonp",
					data:{pid:pid},
					success:function(res){
						if (res.Result) {
							self.messageRender(res.Data);
						};
					}
				});
			},
			//===========获取点赞用户的信息=========
			getDeliverPraiseAjax:function(){
				var self = this;
				var pid = parseInt($.getUrlVar('pid'));
				$.ajax({
					url:MoonduDomain+'/home/GetLikeUserByPid',
					type:"GET",
					dataType:"jsonp",
					data:{pid:pid},
					success:function(res){
						if (res.Result) {
							self.photoPraiseRender(res.Data.Rows);
						};
					}
				});
			},
			//=========获取评论=============
			commentAjaxManager:function(page){
				var self = this;
				var pid = parseInt($.getUrlVar('pid'));
				$.ajax({
					url:MoonduDomain+'/home/GetCommentByPid',
					type:"GET",
					dataType:"jsonp",
					data:{pid:pid,page:1,pagesize:10},
					success:function(res){
						if (res.Result) {
							self.commentRender(res.Data.Rows);
						}
					}
				});
			}
		}
		//M-资讯
		var MZMessage={

			init:function(){
				var self = this;
				this.$top = $("#top");
				this.$wrap= $("#detaiMessage");
				this.publishField = $(".issue");
				this.praiseWarp = $("#praise");
				this.publishField = $("#releaseCommentPanel");
				this.commentPage = $("#comment-page");
				this.userInfor = {};//存储用户信息
				this.commentArr = []; //存储评论用户的id
				this.page = 0;
				this.meassageArr = []; //存储当前的资讯信息
				this.meassageCommentList = []; //存储当前资讯评论
				this.messagePraiseList = []; //存储当前资讯点赞人物列表
				this.praiseIdArr = [];//存储点赞用户的id
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;
				this.getMessageAjax();
				this.commentAjaxManager();
				window.onload = function(){
					self.getDeliverPraiseAjax();
				}
				//点赞
				if (this.$top.attr('data-type') == 'T_message') {
					this.publishField.on("click","a.love",self.shareLink);
				}
				//取消赞
				//this.publishField.on("click","a.love-after",self.cancelPraise);
				//发表评论,判断是不是T站
				if (this.$top.attr('data-type') == 'T_message') {
					this.publishField.on('click','a.publish',self.shareLink);
				}
				//分享下载链接
				$("#massage_share_link").find("a").bind('click',self.shareLink.bind(this));
				//下载app
				this.publishField.on('click','input',self.shareLink)
				this.publishField.on('click','a.publish',self.shareLink)
				this.publishField.on('click','a.love',self.shareLink)
			},
			//================点赞的用户过多则出现省略号=========================
			praiseEllipsis:function(){
				var self = this;
				var postID = parseInt(this.$wrap.find("input[type=hidden]").val());
				var xcount=this.praiseWarp.find("li").size();
				this.praiseWarp.find("span.num").text(xcount);
				//如果用户太多，则用省略号表示，点击省略号可跳转页面
				var xSize=this.praiseWarp.find("li").size(); //总个数
				var xli = $("<li class='ellipsis fl'><a href='javascript:;'>...</a></li>");//创建带有省略号的li
				var liW = parseInt(this.praiseWarp.find("li").eq(1).width()) + parseInt(this.praiseWarp.find("li").eq(1).css("marginLeft")); //每个的长度+margin值
				var deviceW = parseInt(this.$wrap.find("ul").width());
				var xcount = Math.floor(deviceW/liW);//一行可容纳多少个li
				if (xSize*liW > parseInt(this.praiseWarp.find("ul").width())) {
					$("#praise ul li:gt(" + (xcount-1) + ")").addClass("hidden");
					//第xcount-1个后面插入带省略号的li
					this.praiseWarp.find("li").eq(xcount).after(xli);
				}
			},
			//资讯渲染
			messageRender:function(data){
				var html = "",
					authorTemp = document.getElementById("messageTemp"),
					temp = new EJS({"text": authorTemp});
				//this.title = data.title;
				//this.content = data.conn;
				//this.newsId = data.id;
				html = temp.render(data);
				this.meassageArr.push(data);
				this.$wrap.html(html);
				//判断悬浮框的点赞状态
				if (data.IsLike == 1) {
					this.publishField.find('a[data-type=love]').addClass('love-after').removeClass('love');
				}else{
					this.publishField.find('a[data-type=love]').addClass('love').removeClass('love-after');
				}
				this.$wrap.find('.content').find('img').css({"width":"100%","height":"auto"});
			},
			//=============点赞模块渲染================
			photoPraiseRender:function(data){
				var self = this;
				var	html = "";
				var	photoPraiseTemp = document.getElementById("photoPraiseTemp").innerHTML;
				var	temp = new EJS({"text": photoPraiseTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.messagePraiseList.push(data[i]);
				};
				this.praiseWarp.find("ul").html(html);
				this.praiseWarp.find("span.num").text(this.praiseWarp.find("ul").find("li").size());
				//判断当前用户的头像是否为空，若是为空，则显示默认头像
				var li = this.praiseWarp.find("ul").find("li"); 
				for (var i = 0; i < li.length; i++) {
					if ($(li[i]).find('img').attr('src') == '') {
						$(li[i]).find('img').attr('src','images/user.jpg');
					};
				};
				//省略号
				this.praiseEllipsis();
			},
			shareLink:function(){
				var browser = {
				versions: function() {
					var u = navigator.userAgent, app = navigator.appVersion;
					return {//移动终端浏览器版本信息
						trident: u.indexOf('Trident') > -1, //IE内核
						presto: u.indexOf('Presto') > -1, //opera内核
						webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
						gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
						mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
						ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
						android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
						iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
						iPad: u.indexOf('iPad') > -1, //是否iPad
						webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
					};
				}(),
					language: (navigator.browserLanguage || navigator.language).toLowerCase()
			}
				var img = $("#img");
				var imgs = $("#imgs");
				var ua = window.navigator.userAgent.toLowerCase(); 
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						$(".app").removeClass("hidden");
						img.className = "ios";
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						$(".app").removeClass("hidden");
						img.className = "android";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}		
				}
			},
			commentRender:function(data){
				var self=this;
				var	html="";
				var	commentTemp=document.getElementById("userCommentTemp");
				var	temp = new EJS({"text": commentTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.meassageCommentList.push(data[i]);
				};
				var oul = this.commentPage.find('ul').html(html);
				var wrap = this.commentPage.find(".find-message").after(oul);
				//判断用户头像是否为空，若是为空，则显示默认头像
				var item = this.commentPage.find('ul').find('li');
				for (var i = 0; i < item.length; i++) {
					if ($(item[i]).find('img.user-icon').attr('src') == '') {
						$(item[i]).find('img.user-icon').attr('src','images/user.jpg');
					}
				};
			},
			//============获取资讯详情=========
			getMessageAjax:function(){
				var self = this;
				var id = parseInt($.getUrlVar('id'));
				var option={
		            url:MoonduDomain+'/home/NewDetail',
		            data:{newid:id},
		            callback:function(res){
		            	if (res.Result) {
							self.messageRender(res.Data);
							$('title').text(res.Data.Title);
							$("#hidddenPhoto").find("img").attr("src",res.Data.ImgUrl);
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//==================获取点赞用户的信息=============
			getDeliverPraiseAjax:function(){
				var self = this;
				var id = parseInt($("#postID").val());
		       	var option={
		            url:MoonduDomain+'/home/LikeList',
		            data:{newid:id,pageindex:1},
		            callback:function(res){
		            	if (res.Result) {
		            		self.photoPraiseRender(res.Data.Rows);
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},
			//获取评论列表
			commentAjaxManager:function(page){
				var self = this,
					id = $.getUrlVar('id')
		       	var option={
		            url:MoonduDomain+'/home/CommList',
		            data:{action:'list_news',newid:id,pageindex:page,pagesize:20},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
		            			self.commentRender(res.Data.Rows);
		            			self.commentCallAjax = true;
		            		}else{
		            			self.cpage = -1;
		            		}
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			}
		}
		//程序主入口
		var MainEntrance={

			init:function(){

				var flag = $("body").attr("data-fn");
				if (flag == "message") { MZMessage.init() }
				if (flag == "view")    { View.init()}
			}
		}
		MainEntrance.init();
	});
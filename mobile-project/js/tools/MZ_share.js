
	$(function(){
		//活动详情
		var Activity = {
			init : function(){
				var self = this;
				this.$top = $("body");
				this.activityWrap = $("#activity_detail");
				this.$list = $("#issueWork");
				this.activityCommentList = []; //存储对当前活动的评论列表
				this.personList = [];//存储参加活动的人物列表
				this.listScrollTop = 0;
				this.page = 1; 
				this.cpage = 1;
				this.activityData = [];  //存储活动数据
				this.activityTags = [];
				this.callAjax = true;//是否接受ajax请求
				this.commentCallAjax = true; //评论页是否接受ajax请求
				this.isFold = false; //判断内容是展开还是收起，默认是收起
				this.currentActivityID = 0; //当前活动ID

				this._bindEvent();
			},
			_bindEvent : function(){
				var self = this;
				var id = parseInt($.getUrlVar('id'));
				//获取活动详情
				this.getActivityAjax(id);
				//获取图片列表
				this.activityPhotoListAjax(this.page);
				//展开更多内容(分享链接)
				this.activityWrap.on("click","a.more-show",self.shareLink);
				//发表评论,判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_activity') {
					this.activityWrap.on("click","a.comment",self.shareLink);
					this.$list.on("click","a.comment",self.shareLink);
				}
				//点赞,判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_activity') {
					this.activityWrap.on("click","a[data-type=like]",self.shareLink);
					this.$list.on("click","a[data-type=like]",self.shareLink);
				}else{
					this.activityWrap.on("click","a[data-type=like]",self.tooltipPraiseAjax);
				}
				//分享下载链接
				$(".a-bottom-banner").find("a").bind("click",self.shareLink.bind(this));
				//点击参加活动的人的头像分享链接进入App下载页面
				this.$list.on("click","a.author-pic",self.shareLink);



				//下载app
				// this.publishField.on('click','textarea',self.shareLink);
				// this.publishField.on('click','a[data-type=comment]',self.shareLink);
				// this.publishField.on('click','a[data-type=love]',self.shareLink);
				// this.commentPage.on('click','span.text',self.shareLink);

			},
			//分享
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
				/*var img = $("#img");
				var imgs = $("#imgs");*/
				var ua = window.navigator.userAgent.toLowerCase();
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						/*$(".app").removeClass("hidden");
						img.className = "ios";*/
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						/*$(".app").removeClass("hidden");
						img.className = "android";*/
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}
				}
			},
			//活动详情模块渲染
			activityInformationRener:function(data){
				var self = this,
					html="",
					activityTemp=document.getElementById("activityTemp").innerHTML,
					temp = new EJS({"text": activityTemp});
				this.title = data.Title;
				this.activityTags = data.Labels;
				this.content = data.Content;

				html = temp.render(data);
				$('title').text(data.Title);
				this.activityData.push(data);
				this.activityWrap.html(html);
				//如果活动状态stat为已经结束 1-已结束，0-没结束
				/*if (data.IsEnd == '1') {
					this.$joinWrap.find('a.btn').css('backgroundColor','#d8d8d8');
					this.$joinWrap.find('a.btn').text('活动已经结束');
					this.$joinWrap.find('a.btn').unbind('click');

					this.suspensionBoxWrap.find('button').css('backgroundColor','#d8d8d8');
					this.suspensionBoxWrap.find('button').text('已经结束');
					this.suspensionBoxWrap.find('button').unbind('click');
				}*/
				//活动评论的数量
				// this.suspensionBoxWrap.find('span.comment').text('评论（' + data.ComCount + '）');
				// this.commentWrap.find('span.num').text(data.ComCount);
				// this.$joinWrap.find('[data-type=join]').text(data.VoteCount + '人');
				//图片宽度自适应
				// this.activityWrap.find('.more').find('img').css({"width":'100%',"height":'auto','display':'block'});
			},
			//参加活动人列表
			personJoinActivityRender:function(data){
				var self = this,
					html="",
					sceneryPublishTemp=document.getElementById("listTemp").innerHTML,
					temp = new EJS({"text": sceneryPublishTemp});
				for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.personList.push(data[i]);
					//评论时间显示
				// var currentTime = new Date(),
				// 	commentTime = data[i].Time;		
				// 	// timeD = currentTime.getTime() - commentTime.getTime();
				// 	console.log(commentTime);
				// 
				};

				this.$list.append(html);
				//标签为undefiend或者图片为空，则隐藏。
				this.$list.find('li').each(function(index,item){
					//index为指针的索引值，item为对应的索引值的对象
					if ($(item).find('.introduction').text() == '#undefined#' || $(item).find('.work').find('img').attr('src') == '') {
						$(item).remove();
					};
				});
			},
			//获取活动信息
			getActivityAjax:function(id){
				var self = this;
		       	var option={
		            url:MoonduDomain+'/MNewsB/NewDetail',
		            data:{newid:id},
		            callback:function(res){
		            	if (res.Result) {
		            		//判断是活动还是资讯 1-活动  2-资讯
		            		// CurrentType.detailType = parseInt(res.Data.Type);
							self.activityInformationRener(res.Data); //活动详情渲染
							self.currentActivityID = res.Data.Id;  //当前活动ID
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			},	
			//获取参加活动人信息	
			activityPhotoListAjax:function(page){
				var self = this,activityId = $.getUrlVar('id');
				var option = {
		            url:MoonduDomain+'/MNewsB/NewPhotoLs',
		            data:{newid:activityId,pageindex:page},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
		            			self.personJoinActivityRender(res.Data.Rows);  //图片列表渲染
		            			self.callAjax = true
		            		}else{
		            			self.page = -1;
		            		}
						}
		            }
		        }
		       	$.md.ajaxurl(option);
			},
		}
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

				this.eJson = {
					"miantian":"[腼腆]",
					"dai":"[呆]",
					"danyan":"[单眼]",
					"gaoxing":"[高兴]",
					"haixiu":"[害羞]",
					"heng":"[哼]",
					"kaixin":"[开心]",
					"keai":"[可爱]",
					"lengmo":"[冷漠]",
					"nanguo":"[难过]",
					"qinqin":"[亲亲]",
					"shengqi":"[生气]",
					"tiaopi":"[调皮]",
					"xinwei":"[欣慰]",
					"yun":"[晕]"
				};
				this.imgJson = {
					'[腼腆]':'<span alt="miantian" class="ecom e_miantian"></span>',
					'[呆]':'<span alt="dai" class="ecom e_dai"></span>',
					'[单眼]':'<span alt="danyan" class="ecom e_danyan"></span>',
					'[高兴]':'<span alt="gaoxing" class="ecom e_gaoxing"></span>',
					'[害羞]':'<span alt="haixiu" class="ecom e_haixiu"></span>',
					'[哼]':'<span alt="heng" class="ecom e_heng"></span>',
					'[开心]':'<span alt="kaixin" class="ecom e_kaixin"></span>',
					'[可爱]':'<span alt="keai" class="ecom e_keai"></span>',
					'[冷漠]':'<span alt="lengmo" class="ecom e_lengmo"></span>',
					'[难过]':'<span alt="nanguo" class="ecom e_nanguo"></span>',
					'[亲亲]':'<span alt="qinqin" class="ecom e_qinqin"></span>',
					'[生气]':'<span alt="shengqi" class="ecom e_shengqi"></span>',
					'[调皮]':'<span alt="tiaopi" class="ecom e_tiaopi"></span>',
					'[欣慰]':'<span alt="xinwei" class="ecom e_xinwei"></span>',
					'[晕]':'<span alt="yun" class="ecom e_yun"></span>'
				};//存储图片表情

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
				//点击作者、点赞、评论头像进入App下载页面
				$("body").on("click","a.portrait",self.shareLink);
				$(".zan-list").on("click","a.user_love",self.shareLink);
				$(".comment-list").on("click","a.user_comment",self.shareLink);

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
				/*var img = $("#img");
				var imgs = $("#imgs");*/
				var ua = window.navigator.userAgent.toLowerCase(); 

				// 检查平台IOS或者安卓

				// IOS
				// 版本是否高于IOS9？(检测后台传过来的数据)

				//   是-采用universal Link 打开APP或下载。
				//   否-检查是否在微信中打开？
				//       是-采用应用宝打开APP下载链接（暂时无法直接打开APP）。
				//       否-采用Scheme URL 唤醒APP，如未安装则转至下载链接。

				// 安卓
				// 检查是否在微信中打开？

				//   是-采用应用宝打开APP下载链接（暂时无法直接打开APP）。
				//   否-采用Scheme URL 唤醒APP，如未安装则转至下载链接。
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
						// var pid = $.getUrlVar('pid');
						// (function() {
						//     setTimeout(function() {
						//         window.location.href = 'T_viewPhptos.html?pid=' + pid;
						//     }, 1000);
						// })();
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}
				}

				//原版
				/*if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}
				}*/
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
					var patt = /\\ud83d\\ude04|\\ud83d\\ude03|\\ud83d\\ude00|\\ud83d\\ude0a|\\u263a\\ufe0f|\\ud83d\\ude09|\\ud83d\\ude0d|\\ud83d\\ude18|\\ud83d\\ude1a|\\ud83d\\ude17|\\ud83d\\ude19|\\ud83d\\ude1c|\\ud83d\\ude1d|\\ud83d\\ude1b|\\ud83d\\ude33|\\ud83d\\ude01|\\ud83d\\ude14|\\ud83d\\ude0c|\\ud83d\\ude12|\\ud83d\\ude1e|\\ud83d\\ude23|\\ud83d\\ude22|\\ud83d\\ude02|\\ud83d\\ude2d|\\ud83d\\ude2a|\\ud83d\\ude25|\\ud83d\\ude30|\\ud83d\\ude05|\\ud83d\\ude13|\\ud83d\\ude29|\\ud83d\\ude2b|\\ud83d\\ude28|\\ud83d\\ude31|\\ud83d\\ude20|\\ud83d\\ude21|\\ud83d\\ude24|\\ud83d\\ude16|\\ud83d\\ude06|\\ud83d\\ude0b|\\ud83d\\ude37|\\ud83d\\ude0e|\\ud83d\\ude34|\\ud83d\\ude35|\\ud83d\\ude32|\\ud83d\\ude1f|\\ud83d\\ude26|\\ud83d\\ude27|\\ud83d\\ude08|\\ud83d\\udc7f|\\ud83d\\ude2e|\\ud83d\\ude2c|\\ud83d\\ude10|\\ud83d\\ude15|\\ud83d\\ude2f|\\ud83d\\ude36|\\ud83d\\ude07|\\ud83d\\ude0f|\\ud83d\\ude11|\\ud83d\\udc72|\\ud83d\\udc73|\\ud83d\\udc6e|\\ud83d\\udc77|\\ud83d\\udc82|\\ud83d\\udc76|\\ud83d\\udc66|\\ud83d\\udc67|\\ud83d\\udc68|\\ud83d\\udc69|\\ud83d\\udc74|\\ud83d\\udc75|\\ud83d\\udc71|\\ud83d\\udc7c|\\ud83d\\udc78|\\ud83d\\ude3a|\\ud83d\\ude38|\\ud83d\\ude3b|\\ud83d\\ude3d|\\ud83d\\ude3c|\\ud83d\\ude40|\\ud83d\\ude3f|\\ud83d\\ude39|\\ud83d\\ude3e|\\ud83d\\udc79|\\ud83d\\udc7a|\\ud83d\\ude48|\\ud83d\\ude49|\\ud83d\\ude4a|\\ud83d\\udc80|\\ud83d\\udc7d|\\ud83d\\udca9|\\ud83d\\udd25|\\u2728|\\ud83c\\udf1f|\\ud83d\\udcab|\\ud83d\\udca5|\\ud83d\\udca2|\\ud83d\\udca6|\\ud83d\\udca7|\\ud83d\\udca4|\\ud83d\\udca8|\\ud83d\\udc42|\\ud83d\\udc40|\\ud83d\\udc43|\\ud83d\\udc45|\\ud83d\\udc44|\\ud83d\\udc4d|\\ud83d\\udc4e|\\ud83d\\udc4c|\\ud83d\\udc4a|\\u270a|\\u270c\\ufe0f|\\ud83d\\udc4b|\\u270b|\\ud83d\\udc50|\\ud83d\\udc46|\\ud83d\\udc47|\\ud83d\\udc49|\\ud83d\\udc48|\\ud83d\\ude4c|\\ud83d\\ude4f|\\u261d\\ufe0f|\\ud83d\\udc4f|\\ud83d\\udcaa|\\ud83d\\udeb6|\\ud83c\\udfc3|\\ud83d\\udc83|\\ud83d\\udc6b|\\ud83d\\udc6a|\\ud83d\\udc6c|\\ud83d\\udc6d|\\ud83d\\udc8f|\\ud83d\\udc91|\\ud83d\\udc6f|\\ud83d\\ude46|\\ud83d\\ude45|\\ud83d\\udc81|\\ud83d\\ude4b|\\ud83d\\udc86|\\ud83d\\udc87|\\ud83d\\udc85|\\ud83d\\udc70|\\ud83d\\ude4e|\\ud83d\\ude4d|\\ud83d\\ude47|\\ud83c\\udfa9|\\ud83d\\udc51|\\ud83d\\udc52|\\ud83d\\udc5f|\\ud83d\\udc5e|\\ud83d\\udc61|\\ud83d\\udc60|\\ud83d\\udc62|\\ud83d\\udc55|\\ud83d\\udc54|\\ud83d\\udc5a|\\ud83d\\udc57|\\ud83c\\udfbd|\\ud83d\\udc56|\\ud83d\\udc58|\\ud83d\\udc59|\\ud83d\\udcbc|\\ud83d\\udc5c|\\ud83d\\udc5d|\\ud83d\\udc5b|\\ud83d\\udc53|\\ud83c\\udf80|\\ud83c\\udf02|\\ud83d\\udc84|\\ud83d\\udc9b|\\ud83d\\udc99|\\ud83d\\udc9c|\\ud83d\\udc9a|\\u2764\\ufe0f|\\ud83d\\udc94|\\ud83d\\udc97|\\ud83d\\udc93|\\ud83d\\udc95|\\ud83d\\udc96|\\ud83d\\udc9e|\\ud83d\\udc98|\\ud83d\\udc8c|\\ud83d\\udc8b|\\ud83d\\udc8d|\\ud83d\\udc8e|\\ud83d\\udc64|\\ud83d\\udc65|\\ud83d\\udcac|\\ud83d\\udc63|\\ud83d\\udcad|\\ud83d\\udc36|\\ud83d\\udc3a|\\ud83d\\udc31|\\ud83d\\udc2d|\\ud83d\\udc39|\\ud83d\\udc30|\\ud83d\\udc38|\\ud83d\\udc2f|\\ud83d\\udc28|\\ud83d\\udc3b|\\ud83d\\udc37|\\ud83d\\udc3d|\\ud83d\\udc2e|\\ud83d\\udc17|\\ud83d\\udc35|\\ud83d\\udc12|\\ud83d\\udc34|\\ud83d\\udc11|\\ud83d\\udc18|\\ud83d\\udc3c|\\ud83d\\udc27|\\ud83d\\udc26|\\ud83d\\udc24|\\ud83d\\udc25|\\ud83d\\udc23|\\ud83d\\udc14|\\ud83d\\udc0d|\\ud83d\\udc22|\\ud83d\\udc1b|\\ud83d\\udc1d|\\ud83d\\udc1c|\\ud83d\\udc1e|\\ud83d\\udc0c|\\ud83d\\udc19|\\ud83d\\udc1a|\\ud83d\\udc20|\\ud83d\\udc1f|\\ud83d\\udc2c|\\ud83d\\udc33|\\ud83d\\udc0b|\\ud83d\\udc04|\\ud83d\\udc0f|\\ud83d\\udc00|\\ud83d\\udc03|\\ud83d\\udc05|\\ud83d\\udc07|\\ud83d\\udc09|\\ud83d\\udc0e|\\ud83d\\udc10|\\ud83d\\udc13|\\ud83d\\udc15|\\ud83d\\udc16|\\ud83d\\udc01|\\ud83d\\udc02|\\ud83d\\udc32|\\ud83d\\udc21|\\ud83d\\udc0a|\\ud83d\\udc2b|\\ud83d\\udc2a|\\ud83d\\udc06|\\ud83d\\udc08|\\ud83d\\udc29|\\ud83d\\udc3e|\\ud83d\\udc90|\\ud83c\\udf38|\\ud83c\\udf37|\\ud83c\\udf40|\\ud83c\\udf39|\\ud83c\\udf3b|\\ud83c\\udf3a|\\ud83c\\udf41|\\ud83c\\udf43|\\ud83c\\udf42|\\ud83c\\udf3f|\\ud83c\\udf3e|\\ud83c\\udf44|\\ud83c\\udf35|\\ud83c\\udf34|\\ud83c\\udf32|\\ud83c\\udf33|\\ud83c\\udf30|\\ud83c\\udf31|\\ud83c\\udf3c|\\ud83c\\udf10|\\ud83c\\udf1e|\\ud83c\\udf1d|\\ud83c\\udf1a|\\ud83c\\udf11|\\ud83c\\udf12|\\ud83c\\udf13|\\ud83c\\udf14|\\ud83c\\udf15|\\ud83c\\udf16|\\ud83c\\udf17|\\ud83c\\udf18|\\ud83c\\udf1c|\\ud83c\\udf1b|\\ud83c\\udf19|\\ud83c\\udf0d|\\ud83c\\udf0e|\\ud83c\\udf0f|\\ud83c\\udf0b|\\ud83c\\udf0c|\\ud83c\\udf20|\\u2b50\\ufe0f|\\u2600\\ufe0f|\\u26c5\\ufe0f|\\u2601\\ufe0f|\\u26a1\\ufe0f|\\u2614\\ufe0f|\\u2744\\ufe0f|\\u26c4\\ufe0f|\\ud83c\\udf00|\\ud83c\\udf01|\\ud83c\\udf08|\\ud83c\\udf0a|\\ud83c\\udf8d|\\ud83d\\udc9d|\\ud83c\\udf8e|\\ud83c\\udf92|\\ud83c\\udf93|\\ud83c\\udf8f|\\ud83c\\udf86|\\ud83c\\udf87|\\ud83c\\udf90|\\ud83c\\udf91|\\ud83c\\udf83|\\ud83d\\udc7b|\\ud83c\\udf85|\\ud83c\\udf84|\\ud83c\\udf81|\\ud83c\\udf8b|\\ud83c\\udf89|\\ud83c\\udf8a|\\ud83c\\udf88|\\ud83c\\udf8c|\\ud83d\\udd2e|\\ud83c\\udfa5|\\ud83d\\udcf7|\\ud83d\\udcf9|\\ud83d\\udcfc|\\ud83d\\udcbf|\\ud83d\\udcc0|\\ud83d\\udcbd|\\ud83d\\udcbe|\\ud83d\\udcbb|\\ud83d\\udcf1|\\u260e\\ufe0f|\\ud83d\\udcde|\\ud83d\\udcdf|\\ud83d\\udce0|\\ud83d\\udce1|\\ud83d\\udcfa|\\ud83d\\udcfb|\\ud83d\\udd0a|\\ud83d\\udd09|\\ud83d\\udd08|\\ud83d\\udd07|\\ud83d\\udd14|\\ud83d\\udd15|\\ud83d\\udce2|\\ud83d\\udce3|\\u23f3|\\u231b\\ufe0f|\\u23f0|\\u231a\\ufe0f|\\ud83d\\udd13|\\ud83d\\udd12|\\ud83d\\udd0f|\\ud83d\\udd10|\\ud83d\\udd11|\\ud83d\\udd0e|\\ud83d\\udca1|\\ud83d\\udd26|\\ud83d\\udd06|\\ud83d\\udd05|\\ud83d\\udd0c|\\ud83d\\udd0b|\\ud83d\\udd0d|\\ud83d\\udec1|\\ud83d\\udec0|\\ud83d\\udebf|\\ud83d\\udebd|\\ud83d\\udd27|\\ud83d\\udd29|\\ud83d\\udd28|\\ud83d\\udeaa|\\ud83d\\udeac|\\ud83d\\udca3|\\ud83d\\udd2b|\\ud83d\\udd2a|\\ud83d\\udc8a|\\ud83d\\udc89|\\ud83d\\udcb0|\\ud83d\\udcb4|\\ud83d\\udcb5|\\ud83d\\udcb7|\\ud83d\\udcb6|\\ud83d\\udcb3|\\ud83d\\udcb8|\\ud83d\\udcf2|\\ud83d\\udce7|\\ud83d\\udce5|\\ud83d\\udce4|\\u2709\\ufe0f|\\ud83d\\udce9|\\ud83d\\udce8|\\ud83d\\udcef|\\ud83d\\udceb|\\ud83d\\udcea|\\ud83d\\udcec|\\ud83d\\udced|\\ud83d\\udcee|\\ud83d\\udce6|\\ud83d\\udcdd|\\ud83d\\udcc4|\\ud83d\\udcc3|\\ud83d\\udcd1|\\ud83d\\udcca|\\ud83d\\udcc8|\\ud83d\\udcc9|\\ud83d\\udcdc|\\ud83d\\udccb|\\ud83d\\udcc5|\\ud83d\\udcc6|\\ud83d\\udcc7|\\ud83d\\udcc1|\\ud83d\\udcc2|\\u2702\\ufe0f|\\ud83d\\udccc|\\ud83d\\udcce|\\u2712\\ufe0f|\\u270f\\ufe0f|\\ud83d\\udccf|\\ud83d\\udcd0|\\ud83d\\udcd5|\\ud83d\\udcd7|\\ud83d\\udcd8|\\ud83d\\udcd9|\\ud83d\\udcd3|\\ud83d\\udcd4|\\ud83d\\udcd2|\\ud83d\\udcda|\\ud83d\\udcd6|\\ud83d\\udd16|\\ud83d\\udcdb|\\ud83d\\udd2c|\\ud83d\\udd2d|\\ud83d\\udcf0|\\ud83c\\udfa8|\\ud83c\\udfac|\\ud83c\\udfa4|\\ud83c\\udfa7|\\ud83c\\udfbc|\\ud83c\\udfb5|\\ud83c\\udfb6|\\ud83c\\udfb9|\\ud83c\\udfbb|\\ud83c\\udfba|\\ud83c\\udfb7|\\ud83c\\udfb8|\\ud83d\\udc7e|\\ud83c\\udfae|\\ud83c\\udccf|\\ud83c\\udfb4|\\ud83c\\udc04\\ufe0f|\\ud83c\\udfb2|\\ud83c\\udfaf|\\ud83c\\udfc8|\\ud83c\\udfc0|\\u26bd\\ufe0f|\\u26be\\ufe0f|\\ud83c\\udfbe|\\ud83c\\udfb1|\\ud83c\\udfc9|\\ud83c\\udfb3|\\u26f3\\ufe0f|\\ud83d\\udeb5|\\ud83d\\udeb4|\\ud83c\\udfc1|\\ud83c\\udfc7|\\ud83c\\udfc6|\\ud83c\\udfbf|\\ud83c\\udfc2|\\ud83c\\udfca|\\ud83c\\udfc4|\\ud83c\\udfa3|\\u2615\\ufe0f|\\ud83c\\udf75|\\ud83c\\udf76|\\ud83c\\udf7c|\\ud83c\\udf7a|\\ud83c\\udf7b|\\ud83c\\udf78|\\ud83c\\udf79|\\ud83c\\udf77|\\ud83c\\udf74|\\ud83c\\udf55|\\ud83c\\udf54|\\ud83c\\udf5f|\\ud83c\\udf57|\\ud83c\\udf56|\\ud83c\\udf5d|\\ud83c\\udf5b|\\ud83c\\udf64|\\ud83c\\udf71|\\ud83c\\udf63|\\ud83c\\udf65|\\ud83c\\udf59|\\ud83c\\udf58|\\ud83c\\udf5a|\\ud83c\\udf5c|\\ud83c\\udf72|\\ud83c\\udf62|\\ud83c\\udf61|\\ud83c\\udf73|\\ud83c\\udf5e|\\ud83c\\udf69|\\ud83c\\udf6e|\\ud83c\\udf66|\\ud83c\\udf68|\\ud83c\\udf67|\\ud83c\\udf82|\\ud83c\\udf70|\\ud83c\\udf6a|\\ud83c\\udf6b|\\ud83c\\udf6c|\\ud83c\\udf6d|\\ud83c\\udf6f|\\ud83c\\udf4e|\\ud83c\\udf4f|\\ud83c\\udf4a|\\ud83c\\udf4b|\\ud83c\\udf52|\\ud83c\\udf47|\\ud83c\\udf49|\\ud83c\\udf53|\\ud83c\\udf51|\\ud83c\\udf48|\\ud83c\\udf4c|\\ud83c\\udf50|\\ud83c\\udf4d|\\ud83c\\udf60|\\ud83c\\udf46|\\ud83c\\udf45|\\ud83c\\udf3d|\\ud83c\\udfe0|\\ud83c\\udfe1|\\ud83c\\udfeb|\\ud83c\\udfe2|\\ud83c\\udfe3|\\ud83c\\udfe5|\\ud83c\\udfe6|\\ud83c\\udfea|\\ud83c\\udfe9|\\ud83c\\udfe8|\\ud83d\\udc92|\\u26ea\\ufe0f|\\ud83c\\udfec|\\ud83c\\udfe4|\\ud83c\\udf07|\\ud83c\\udf06|\\ud83c\\udfef|\\ud83c\\udff0|\\u26fa\\ufe0f|\\ud83c\\udfed|\\ud83d\\uddfc|\\ud83d\\uddfe|\\ud83d\\uddfb|\\ud83c\\udf04|\\ud83c\\udf05|\\ud83c\\udf03|\\ud83d\\uddfd|\\ud83c\\udf09|\\ud83c\\udfa0|\\ud83c\\udfa1|\\u26f2\\ufe0f|\\ud83c\\udfa2|\\ud83d\\udea2|\\u26f5\\ufe0f|\\ud83d\\udea4|\\ud83d\\udea3|\\u2693\\ufe0f|\\ud83d\\ude80|\\u2708\\ufe0f|\\ud83d\\udcba|\\ud83d\\ude81|\\ud83d\\ude82|\\ud83d\\ude8a|\\ud83d\\ude89|\\ud83d\\ude9e|\\ud83d\\ude86|\\ud83d\\ude84|\\ud83d\\ude85|\\ud83d\\ude88|\\ud83d\\ude87|\\ud83d\\ude9d|\\ud83d\\ude8b|\\ud83d\\ude83|\\ud83d\\ude8e|\\ud83d\\ude8c|\\ud83d\\ude8d|\\ud83d\\ude99|\\ud83d\\ude98|\\ud83d\\ude97|\\ud83d\\ude95|\\ud83d\\ude96|\\ud83d\\ude9b|\\ud83d\\ude9a|\\ud83d\\udea8|\\ud83d\\ude93|\\ud83d\\ude94|\\ud83d\\ude92|\\ud83d\\ude91|\\ud83d\\ude90|\\ud83d\\udeb2|\\ud83d\\udea1|\\ud83d\\ude9f|\\ud83d\\udea0|\\ud83d\\ude9c|\\ud83d\\udc88|\\ud83d\\ude8f|\\ud83c\\udfab|\\ud83d\\udea6|\\ud83d\\udea5|\\u26a0\\ufe0f|\\ud83d\\udea7|\\ud83d\\udd30|\\u26fd\\ufe0f|\\ud83c\\udfee|\\ud83c\\udfb0|\\u2668\\ufe0f|\\ud83d\\uddff|\\ud83c\\udfaa|\\ud83c\\udfad|\\ud83d\\udccd|\\ud83d\\udea9|\\ud83c\\uddef\\ud83c\\uddf5|\\ud83c\\uddf0\\ud83c\\uddf7|\\ud83c\\udde9\\ud83c\\uddea|\\ud83c\\udde8\\ud83c\\uddf3|\\ud83c\\uddfa\\ud83c\\uddf8|\\ud83c\\uddeb\\ud83c\\uddf7|\\ud83c\\uddea\\ud83c\\uddf8|\\ud83c\\uddee\\ud83c\\uddf9|\\ud83c\\uddf7\\ud83c\\uddfa|\\ud83c\\uddec\\ud83c\\udde7|\\u0031\\ufe0f\\u20e3|\\u0032\\ufe0f\\u20e3|\\u0033\\ufe0f\\u20e3|\\u0034\\ufe0f\\u20e3|\\u0035\\ufe0f\\u20e3|\\u0036\\ufe0f\\u20e3|\\u0037\\ufe0f\\u20e3|\\u0038\\ufe0f\\u20e3|\\u0039\\ufe0f\\u20e3|\\u0030\\ufe0f\\u20e3|\\ud83d\\udd1f|\\ud83d\\udd22|\\u0023\\ufe0f\\u20e3|\\ud83d\\udd23|\\u2b06\\ufe0f|\\u2b07\\ufe0f|\\u2b05\\ufe0f|\\u27a1\\ufe0f|\\ud83d\\udd20|\\ud83d\\udd21|\\ud83d\\udd24|\\u2197\\ufe0f|\\u2196\\ufe0f|\\u2198\\ufe0f|\\u2199\\ufe0f|\\u2194\\ufe0f|\\u2195\\ufe0f|\\ud83d\\udd04|\\u25c0\\ufe0f|\\u25b6\\ufe0f|\\ud83d\\udd3c|\\ud83d\\udd3d|\\u21a9\\ufe0f|\\u21aa\\ufe0f|\\u2139\\ufe0f|\\u23ea|\\u23e9|\\u23eb|\\u23ec|\\u2935\\ufe0f|\\u2934\\ufe0f|\\ud83c\\udd97|\\ud83d\\udd00|\\ud83d\\udd01|\\ud83d\\udd02|\\ud83c\\udd95|\\ud83c\\udd99|\\ud83c\\udd92|\\ud83c\\udd93|\\ud83c\\udd96|\\ud83d\\udcf6|\\ud83c\\udfa6|\\ud83c\\ude01|\\ud83c\\ude2f\\ufe0f|\\ud83c\\ude33|\\ud83c\\ude35|\\ud83c\\ude34|\\ud83c\\ude32|\\ud83c\\ude50|\\ud83c\\ude39|\\ud83c\\ude3a|\\ud83c\\ude36|\\ud83c\\ude1a\\ufe0f|\\ud83d\\udebb|\\ud83d\\udeb9|\\ud83d\\udeba|\\ud83d\\udebc|\\ud83d\\udebe|\\ud83d\\udeb0|\\ud83d\\udeae|\\ud83c\\udd7f\\ufe0f|\\u267f\\ufe0f|\\ud83d\\udead|\\ud83c\\ude37|\\ud83c\\ude38|\\ud83c\\ude02|\\u24c2\\ufe0f|\\ud83d\\udec2|\\ud83d\\udec4|\\ud83d\\udec5|\\ud83d\\udec3|\\ud83c\\ude51|\\u3299\\ufe0f|\\u3297\\ufe0f|\\ud83c\\udd91|\\ud83c\\udd98|\\ud83c\\udd94|\\ud83d\\udeab|\\ud83d\\udd1e|\\ud83d\\udcf5|\\ud83d\\udeaf|\\ud83d\\udeb1|\\ud83d\\udeb3|\\ud83d\\udeb7|\\ud83d\\udeb8|\\u26d4\\ufe0f|\\u2733\\ufe0f|\\u2747\\ufe0f|\\u274e|\\u2705|\\u2734\\ufe0f|\\ud83d\\udc9f|\\ud83c\\udd9a|\\ud83d\\udcf3|\\ud83d\\udcf4|\\ud83c\\udd70|\\ud83c\\udd71|\\ud83c\\udd8e|\\ud83c\\udd7e|\\ud83d\\udca0|\\u27bf|\\u267b\\ufe0f|\\u2648\\ufe0f|\\u2649\\ufe0f|\\u264a\\ufe0f|\\u264b\\ufe0f|\\u264c\\ufe0f|\\u264d\\ufe0f|\\u264e\\ufe0f|\\u264f\\ufe0f|\\u2650\\ufe0f|\\u2651\\ufe0f|\\u2652\\ufe0f|\\u2653\\ufe0f|\\u26ce|\\ud83d\\udd2f|\\ud83c\\udfe7|\\ud83d\\udcb9|\\ud83d\\udcb2|\\ud83d\\udcb1|\\u00a9|\\u00ae|\\u2122|\\u274c|\\u203c\\ufe0f|\\u2049\\ufe0f|\\u2757\\ufe0f|\\u2753|\\u2755|\\u2754|\\u2b55\\ufe0f|\\ud83d\\udd1d|\\ud83d\\udd1a|\\ud83d\\udd19|\\ud83d\\udd1b|\\ud83d\\udd1c|\\ud83d\\udd03|\\ud83d\\udd5b|\\ud83d\\udd67|\\ud83d\\udd50|\\ud83d\\udd5c|\\ud83d\\udd51|\\ud83d\\udd5d|\\ud83d\\udd52|\\ud83d\\udd5e|\\ud83d\\udd53|\\ud83d\\udd5f|\\ud83d\\udd54|\\ud83d\\udd60|\\ud83d\\udd55|\\ud83d\\udd56|\\ud83d\\udd57|\\ud83d\\udd58|\\ud83d\\udd59|\\ud83d\\udd5a|\\ud83d\\udd61|\\ud83d\\udd62|\\ud83d\\udd63|\\ud83d\\udd64|\\ud83d\\udd65|\\ud83d\\udd66|\\u2716\\ufe0f|\\u2795|\\u2796|\\u2797|\\u2660\\ufe0f|\\u2665\\ufe0f|\\u2663\\ufe0f|\\u2666\\ufe0f|\\ud83d\\udcae|\\ud83d\\udcaf|\\u2714\\ufe0f|\\u2611\\ufe0f|\\ud83d\\udd18|\\ud83d\\udd17|\\u27b0|\\u3030|\\u303d\\ufe0f|\\ud83d\\udd31|\\u25fc\\ufe0f|\\u25fb\\ufe0f|\\u25fe\\ufe0f|\\u25fd\\ufe0f|\\u25aa\\ufe0f|\\u25ab\\ufe0f|\\ud83d\\udd3a|\\ud83d\\udd32|\\ud83d\\udd33|\\u26ab\\ufe0f|\\u26aa\\ufe0f|\\ud83d\\udd34|\\ud83d\\udd35|\\ud83d\\udd3b|\\u2b1c\\ufe0f|\\u2b1b\\ufe0f|\\ud83d\\udd36|\\ud83d\\udd37|\\ud83d\\udd38|\\ud83d\\udd39/g; // 检测utf16字符正则
					var aEmoji = temp.render(data[i]).match(/\[.{1,2}\]/g);
					var aEmojiSystem = temp.render(data[i]).match(/\\u[a-z0-9A-Z]{4}\\u[a-z0-9A-Z]{4}/g);
					var	oHtml = temp.render(data[i]);
					if( aEmoji ){
						for(var j = 0; j < aEmoji.length; j++){
							oHtml = oHtml.replace(aEmoji[j],this.imgJson[aEmoji[j]]);
						};
						for(var j = 0; j < aEmojiSystem.length; j++){
							if(!aEmojiSystem[j].match(patt)){
								 var strs = aEmojiSystem[j].match(/\\u[a-z0-9A-Z]{4}/g);
								 for(var x = 0; x < strs.length; x++){
								 	oHtml = oHtml.replace(strs[x],unescape(strs[x].replace(/\\/g,"%")));
								 }
							} else {
								var oImg = "<img src='emoji/2x/" + toUnicode(aEmojiSystem[j]) + ".png' style='width:40px; height:40px; transform:scale(0.7); margin:0;'>";
								oHtml = oHtml.replace(aEmojiSystem[j],oImg);
							}
						};
					}

					html += oHtml;
					this.commentList.push(data[i]);
				};

				var oul = this.commentPage.find('.comment-list').append(html);
				var wrap = this.commentPage.find(".find-message").after(oul);
				// this.commentPage.find("div.comment-list").find("p")[1].emoji();
				//转换系统自带表情

				function toUnicode(str){
					var h = "0x" + str.substr(str.indexOf("u")+1,4);
					var l = "0x" +  str.substr(str.lastIndexOf("u")+1,4);
					var code = (Number(h) - 0xD800) * 0x400 + 0x10000 + Number(l) - 0xDC00;
					return code.toString(16);
				}

				//判断2字节还是4字节 并转码
				// function toCodePoint(unicodeSurrogates, sep) {
			 //      	var r = [],
			 //          c = 0,
			 //          p = 0,
			 //          i = 0;
				//     while (i < unicodeSurrogates.length) {
				//        	c = unicodeSurrogates.charCodeAt(i++);//返回位置的字符的 Unicode 编码

				//        if (p) {
				// 	        r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16)); //计算4字节的unicode
				// 	        p = 0;
				// 	    } else if (0xD800 <= c && c <= 0xDBFF) {
				// 	        p = c; //如果unicode编码在oxD800-0xDBff之间，则需要与后一个字符放在一起
				// 	    } else {
				// 	        r.push(c.toString(16)); //如果是2字节，直接将码点转为对应的十六进制形式
				// 	    }
				// 	}
				//     return r.join(sep || '-');
				// }

				//查看更多评论
				this.commentPage.on('click','span.text',function(){
					for (var i = 3; i < data.length; i++) {
						var aEmoji = temp.render(data[i]).match(/\[.{1,2}\]/g);
						var	oHtml = temp.render(data[i]);
						if( aEmoji ){
							for(var j = 0; j < aEmoji.length; j++){
								oHtml = oHtml.replace(aEmoji[j],self.imgJson[aEmoji[j]]);
							}
						}
						html += oHtml;
						// self.meassageCommentList.push(data[i]);
					};
					self.commentPage.find('.comment-list').html(html);
					hidden();
				});

				//评论总数
				var commentNum = data.length;
				commentNum == 0 ? hidden() : commentNum ;
				this.commentPage.find('span.commentNum').text(commentNum);
				function hidden(){
					$('.comment-more').addClass('hidden');
				}

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
				this.$top = $("body");
				this.$wrap= $("#detaiMessage");
				this.publishField = $(".issue");
				this.praiseWarp = $(".zan-wrap");
				this.messageComment = $("#messageComment");
				this.publishField = $("#releaseCommentPanel");
				this.commentPage = $("#comment-wrap");
				this.userInfor = {};//存储用户信息
				this.commentArr = []; //存储评论用户的id
				this.page = 0;
				this.meassageArr = []; //存储当前的资讯信息
				this.meassageCommentList = []; //存储当前资讯评论
				this.messagePraiseList = []; //存储当前资讯点赞人物列表
				this.praiseCount = 0;
				this.praiseIdArr = [];//存储点赞用户的id
				this.eJson = {
					"miantian":"[腼腆]",
					"dai":"[呆]",
					"danyan":"[单眼]",
					"gaoxing":"[高兴]",
					"haixiu":"[害羞]",
					"heng":"[哼]",
					"kaixin":"[开心]",
					"keai":"[可爱]",
					"lengmo":"[冷漠]",
					"nanguo":"[难过]",
					"qinqin":"[亲亲]",
					"shengqi":"[生气]",
					"tiaopi":"[调皮]",
					"xinwei":"[欣慰]",
					"yun":"[晕]"
				};
				this.imgJson = {
					'[腼腆]':'<span alt="miantian" class="ecom e_miantian"></span>',
					'[呆]':'<span alt="dai" class="ecom e_dai"></span>',
					'[单眼]':'<span alt="danyan" class="ecom e_danyan"></span>',
					'[高兴]':'<span alt="gaoxing" class="ecom e_gaoxing"></span>',
					'[害羞]':'<span alt="haixiu" class="ecom e_haixiu"></span>',
					'[哼]':'<span alt="heng" class="ecom e_heng"></span>',
					'[开心]':'<span alt="kaixin" class="ecom e_kaixin"></span>',
					'[可爱]':'<span alt="keai" class="ecom e_keai"></span>',
					'[冷漠]':'<span alt="lengmo" class="ecom e_lengmo"></span>',
					'[难过]':'<span alt="nanguo" class="ecom e_nanguo"></span>',
					'[亲亲]':'<span alt="qinqin" class="ecom e_qinqin"></span>',
					'[生气]':'<span alt="shengqi" class="ecom e_shengqi"></span>',
					'[调皮]':'<span alt="tiaopi" class="ecom e_tiaopi"></span>',
					'[欣慰]':'<span alt="xinwei" class="ecom e_xinwei"></span>',
					'[晕]':'<span alt="yun" class="ecom e_yun"></span>'
				};//存储图片表情
				this._bindEvent();
			},
			_bindEvent:function(){
				var self = this;

				this.getDeliverPraiseAjax();
				this.getMessageAjax();
				this.commentAjaxManager();


				//点击梦族zone下载
				this.$wrap.find("span.tag_title").find("a").on("click",self.shareLink);
				//点击阅读原文下载
				this.$wrap.find("span.orginal").on("click","a",self.shareLink);
				//点击投诉下载
				this.$wrap.find("span.suggestion").on("click","a",self.shareLink);
				//点赞
				if (this.$top.attr('data-type') == 'T_message') {
					this.$wrap.find('div.btn-list').on("click","a.btn-zan",self.shareLink);
				}
				//取消赞
				//this.publishField.on("click","a.love-after",self.cancelPraise);
				//发表评论,判断是不是T站
				if (this.$top.attr('data-type') == 'T_message') {
					this.$wrap.find('div.btn-list').on('click','a.btn-comment',self.shareLink);
				}
				// 关注，判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_message'){
					this.$wrap.find('div.author').on('click','a.author-follow',self.shareLink);
				}
				
				//点击官方头像进入App下载页面
				this.$wrap.find(".author-img").on("click",self.shareLink);
				//点击用户头像进入App下载页面
				this.messageComment.on("click","a.user_love",self.shareLink);
				this.messageComment.on("click","a.user_comment",self.shareLink);

				//分享下载链接
				$("#m-bottom-banner").find("a").bind('click',self.shareLink.bind(this));
				//下载app
				this.$wrap.on('click','textarea',self.shareLink);
				// this.$wrap.find('div.btn-list').on('click','a.btn-comment',self.shareLink);
				// this.$wrap.find('div.btn-list').on("click","a.btn-zan",self.shareLink);
			},
			//================点赞的用户过多则出现省略号=========================
			praiseEllipsis:function(){
				var self = this;
				var postID = parseInt(this.$wrap.find("input[type=hidden]").val());
				var xcount=this.praiseWarp.find("li").size();
				this.praiseWarp.find("span.zanNum").text(xcount);
				//如果用户太多，则用省略号表示，点击省略号可跳转页面
				var xSize=this.praiseWarp.find("li").size(); //总个数
				var xli = $("<li class='ellipsis fl'><a href='javascript:;'>...</a></li>");//创建带有省略号的li
				var liW = parseInt(this.praiseWarp.find("li").eq(1).width()) + parseInt(this.praiseWarp.find("li").eq(1).css("marginRight")); //每个的长度+margin值
				var deviceW = parseInt(this.praiseWarp.find("ul").width());
				var xcount = Math.floor(deviceW/liW);//一行可容纳多少个li
				if (xSize*liW > parseInt(this.praiseWarp.find("ul").width())) {
					$(".zan-wrap ul li:gt(" + (xcount-1) + ")").addClass("hidden");
					//第xcount-1个后面插入带省略号的li
					this.praiseWarp.find("li").eq(xcount-1).after(xli);
				}
			},
			//资讯渲染
			messageRender:function(data){
				var html = "",
					self = this,
					authorTemp = document.getElementById("messageTemp"),
					temp = new EJS({"text": authorTemp});
				//this.title = data.title;
				//this.content = data.conn;
				//this.newsId = data.id;
				html = temp.render(data);
				this.meassageArr.push(data);
				this.$wrap.prepend(html);
				this.$wrap.find("span#tag_time").html(data.CreateTime.replace(/[年月]/g,"-").replace(/[日]/g,""));
				this.$wrap.find(".author-time").text(data.CreateTime);
				this.$wrap.find("span.read_count").html("阅读" + (5684 + data.ViewCount));
				this.$wrap.find("span.preise_count").html('<a href="javascript:;"><img src="images/dianzan.png"></a> ' + (563 + self.praiseCount));
				//判断悬浮框的点赞状态
				/*if (data.IsLike == 1) {
					this.publishField.find('a[data-type=love]').addClass('love-after').removeClass('love');
				}else{
					this.publishField.find('a[data-type=love]').addClass('love').removeClass('love-after');
				}
				this.$wrap.find('.content').find('img').css({"width":"100%","height":"auto"});*/
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
				this.praiseCount = data.length;
				this.praiseWarp.find("ul").html(html);
				this.messageComment.find("span.zanNum").text(this.praiseWarp.find("ul").find("li").size());
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
				/*var img = $("#img");
				var imgs = $("#imgs");*/
				var ua = window.navigator.userAgent.toLowerCase(); 
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						/*$(".app").removeClass("hidden");
						img.className = "ios";*/
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						/*$(".app").removeClass("hidden");
						img.className = "android";*/
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}
				}
			},
			//============评论模块渲染============
			commentRender:function(data){
				var self=this;
				var	html="";
				var count = 0;
				var	commentTemp=document.getElementById("userCommentTemp");
				var	temp = new EJS({"text": commentTemp});
				/*for (var i = 0; i < data.length; i++) {
					html += temp.render(data[i]);
					this.meassageCommentList.push(data[i]);
				};*/

				if(data.length < 4){
					count = data.length;
				} else {
					count = 3;
				}
				for (var i = 0; i < count; i++) {
					var aEmoji = temp.render(data[i]).match(/\[.{1,2}\]/g);
					var	oHtml = temp.render(data[i]);
					if( aEmoji ){
						for(var j = 0; j < aEmoji.length; j++){
							oHtml = oHtml.replace(aEmoji[j],this.imgJson[aEmoji[j]]);
						}
					}
					html += oHtml;
					this.meassageCommentList.push(data[i]);
				};

				var oul = this.commentPage.find('.comment-list').html(html);
				var wrap = this.commentPage.find(".find-message").after(oul);

				//评论总数
				var commentNum = data.length;
				commentNum < 4 ? hidden() : commentNum ;
				this.commentPage.find('span.commentNum').text(commentNum);
				function hidden(){
					$('a.comment-more').addClass('hidden');
				}

				//查看更多评论
				this.messageComment.on('click','span.text',function(){
					for (var i = 3; i < data.length; i++) {
						var patt = /\\ud83d\\ude04|\\ud83d\\ude03|\\ud83d\\ude00|\\ud83d\\ude0a|\\u263a\\ufe0f|\\ud83d\\ude09|\\ud83d\\ude0d|\\ud83d\\ude18|\\ud83d\\ude1a|\\ud83d\\ude17|\\ud83d\\ude19|\\ud83d\\ude1c|\\ud83d\\ude1d|\\ud83d\\ude1b|\\ud83d\\ude33|\\ud83d\\ude01|\\ud83d\\ude14|\\ud83d\\ude0c|\\ud83d\\ude12|\\ud83d\\ude1e|\\ud83d\\ude23|\\ud83d\\ude22|\\ud83d\\ude02|\\ud83d\\ude2d|\\ud83d\\ude2a|\\ud83d\\ude25|\\ud83d\\ude30|\\ud83d\\ude05|\\ud83d\\ude13|\\ud83d\\ude29|\\ud83d\\ude2b|\\ud83d\\ude28|\\ud83d\\ude31|\\ud83d\\ude20|\\ud83d\\ude21|\\ud83d\\ude24|\\ud83d\\ude16|\\ud83d\\ude06|\\ud83d\\ude0b|\\ud83d\\ude37|\\ud83d\\ude0e|\\ud83d\\ude34|\\ud83d\\ude35|\\ud83d\\ude32|\\ud83d\\ude1f|\\ud83d\\ude26|\\ud83d\\ude27|\\ud83d\\ude08|\\ud83d\\udc7f|\\ud83d\\ude2e|\\ud83d\\ude2c|\\ud83d\\ude10|\\ud83d\\ude15|\\ud83d\\ude2f|\\ud83d\\ude36|\\ud83d\\ude07|\\ud83d\\ude0f|\\ud83d\\ude11|\\ud83d\\udc72|\\ud83d\\udc73|\\ud83d\\udc6e|\\ud83d\\udc77|\\ud83d\\udc82|\\ud83d\\udc76|\\ud83d\\udc66|\\ud83d\\udc67|\\ud83d\\udc68|\\ud83d\\udc69|\\ud83d\\udc74|\\ud83d\\udc75|\\ud83d\\udc71|\\ud83d\\udc7c|\\ud83d\\udc78|\\ud83d\\ude3a|\\ud83d\\ude38|\\ud83d\\ude3b|\\ud83d\\ude3d|\\ud83d\\ude3c|\\ud83d\\ude40|\\ud83d\\ude3f|\\ud83d\\ude39|\\ud83d\\ude3e|\\ud83d\\udc79|\\ud83d\\udc7a|\\ud83d\\ude48|\\ud83d\\ude49|\\ud83d\\ude4a|\\ud83d\\udc80|\\ud83d\\udc7d|\\ud83d\\udca9|\\ud83d\\udd25|\\u2728|\\ud83c\\udf1f|\\ud83d\\udcab|\\ud83d\\udca5|\\ud83d\\udca2|\\ud83d\\udca6|\\ud83d\\udca7|\\ud83d\\udca4|\\ud83d\\udca8|\\ud83d\\udc42|\\ud83d\\udc40|\\ud83d\\udc43|\\ud83d\\udc45|\\ud83d\\udc44|\\ud83d\\udc4d|\\ud83d\\udc4e|\\ud83d\\udc4c|\\ud83d\\udc4a|\\u270a|\\u270c\\ufe0f|\\ud83d\\udc4b|\\u270b|\\ud83d\\udc50|\\ud83d\\udc46|\\ud83d\\udc47|\\ud83d\\udc49|\\ud83d\\udc48|\\ud83d\\ude4c|\\ud83d\\ude4f|\\u261d\\ufe0f|\\ud83d\\udc4f|\\ud83d\\udcaa|\\ud83d\\udeb6|\\ud83c\\udfc3|\\ud83d\\udc83|\\ud83d\\udc6b|\\ud83d\\udc6a|\\ud83d\\udc6c|\\ud83d\\udc6d|\\ud83d\\udc8f|\\ud83d\\udc91|\\ud83d\\udc6f|\\ud83d\\ude46|\\ud83d\\ude45|\\ud83d\\udc81|\\ud83d\\ude4b|\\ud83d\\udc86|\\ud83d\\udc87|\\ud83d\\udc85|\\ud83d\\udc70|\\ud83d\\ude4e|\\ud83d\\ude4d|\\ud83d\\ude47|\\ud83c\\udfa9|\\ud83d\\udc51|\\ud83d\\udc52|\\ud83d\\udc5f|\\ud83d\\udc5e|\\ud83d\\udc61|\\ud83d\\udc60|\\ud83d\\udc62|\\ud83d\\udc55|\\ud83d\\udc54|\\ud83d\\udc5a|\\ud83d\\udc57|\\ud83c\\udfbd|\\ud83d\\udc56|\\ud83d\\udc58|\\ud83d\\udc59|\\ud83d\\udcbc|\\ud83d\\udc5c|\\ud83d\\udc5d|\\ud83d\\udc5b|\\ud83d\\udc53|\\ud83c\\udf80|\\ud83c\\udf02|\\ud83d\\udc84|\\ud83d\\udc9b|\\ud83d\\udc99|\\ud83d\\udc9c|\\ud83d\\udc9a|\\u2764\\ufe0f|\\ud83d\\udc94|\\ud83d\\udc97|\\ud83d\\udc93|\\ud83d\\udc95|\\ud83d\\udc96|\\ud83d\\udc9e|\\ud83d\\udc98|\\ud83d\\udc8c|\\ud83d\\udc8b|\\ud83d\\udc8d|\\ud83d\\udc8e|\\ud83d\\udc64|\\ud83d\\udc65|\\ud83d\\udcac|\\ud83d\\udc63|\\ud83d\\udcad|\\ud83d\\udc36|\\ud83d\\udc3a|\\ud83d\\udc31|\\ud83d\\udc2d|\\ud83d\\udc39|\\ud83d\\udc30|\\ud83d\\udc38|\\ud83d\\udc2f|\\ud83d\\udc28|\\ud83d\\udc3b|\\ud83d\\udc37|\\ud83d\\udc3d|\\ud83d\\udc2e|\\ud83d\\udc17|\\ud83d\\udc35|\\ud83d\\udc12|\\ud83d\\udc34|\\ud83d\\udc11|\\ud83d\\udc18|\\ud83d\\udc3c|\\ud83d\\udc27|\\ud83d\\udc26|\\ud83d\\udc24|\\ud83d\\udc25|\\ud83d\\udc23|\\ud83d\\udc14|\\ud83d\\udc0d|\\ud83d\\udc22|\\ud83d\\udc1b|\\ud83d\\udc1d|\\ud83d\\udc1c|\\ud83d\\udc1e|\\ud83d\\udc0c|\\ud83d\\udc19|\\ud83d\\udc1a|\\ud83d\\udc20|\\ud83d\\udc1f|\\ud83d\\udc2c|\\ud83d\\udc33|\\ud83d\\udc0b|\\ud83d\\udc04|\\ud83d\\udc0f|\\ud83d\\udc00|\\ud83d\\udc03|\\ud83d\\udc05|\\ud83d\\udc07|\\ud83d\\udc09|\\ud83d\\udc0e|\\ud83d\\udc10|\\ud83d\\udc13|\\ud83d\\udc15|\\ud83d\\udc16|\\ud83d\\udc01|\\ud83d\\udc02|\\ud83d\\udc32|\\ud83d\\udc21|\\ud83d\\udc0a|\\ud83d\\udc2b|\\ud83d\\udc2a|\\ud83d\\udc06|\\ud83d\\udc08|\\ud83d\\udc29|\\ud83d\\udc3e|\\ud83d\\udc90|\\ud83c\\udf38|\\ud83c\\udf37|\\ud83c\\udf40|\\ud83c\\udf39|\\ud83c\\udf3b|\\ud83c\\udf3a|\\ud83c\\udf41|\\ud83c\\udf43|\\ud83c\\udf42|\\ud83c\\udf3f|\\ud83c\\udf3e|\\ud83c\\udf44|\\ud83c\\udf35|\\ud83c\\udf34|\\ud83c\\udf32|\\ud83c\\udf33|\\ud83c\\udf30|\\ud83c\\udf31|\\ud83c\\udf3c|\\ud83c\\udf10|\\ud83c\\udf1e|\\ud83c\\udf1d|\\ud83c\\udf1a|\\ud83c\\udf11|\\ud83c\\udf12|\\ud83c\\udf13|\\ud83c\\udf14|\\ud83c\\udf15|\\ud83c\\udf16|\\ud83c\\udf17|\\ud83c\\udf18|\\ud83c\\udf1c|\\ud83c\\udf1b|\\ud83c\\udf19|\\ud83c\\udf0d|\\ud83c\\udf0e|\\ud83c\\udf0f|\\ud83c\\udf0b|\\ud83c\\udf0c|\\ud83c\\udf20|\\u2b50\\ufe0f|\\u2600\\ufe0f|\\u26c5\\ufe0f|\\u2601\\ufe0f|\\u26a1\\ufe0f|\\u2614\\ufe0f|\\u2744\\ufe0f|\\u26c4\\ufe0f|\\ud83c\\udf00|\\ud83c\\udf01|\\ud83c\\udf08|\\ud83c\\udf0a|\\ud83c\\udf8d|\\ud83d\\udc9d|\\ud83c\\udf8e|\\ud83c\\udf92|\\ud83c\\udf93|\\ud83c\\udf8f|\\ud83c\\udf86|\\ud83c\\udf87|\\ud83c\\udf90|\\ud83c\\udf91|\\ud83c\\udf83|\\ud83d\\udc7b|\\ud83c\\udf85|\\ud83c\\udf84|\\ud83c\\udf81|\\ud83c\\udf8b|\\ud83c\\udf89|\\ud83c\\udf8a|\\ud83c\\udf88|\\ud83c\\udf8c|\\ud83d\\udd2e|\\ud83c\\udfa5|\\ud83d\\udcf7|\\ud83d\\udcf9|\\ud83d\\udcfc|\\ud83d\\udcbf|\\ud83d\\udcc0|\\ud83d\\udcbd|\\ud83d\\udcbe|\\ud83d\\udcbb|\\ud83d\\udcf1|\\u260e\\ufe0f|\\ud83d\\udcde|\\ud83d\\udcdf|\\ud83d\\udce0|\\ud83d\\udce1|\\ud83d\\udcfa|\\ud83d\\udcfb|\\ud83d\\udd0a|\\ud83d\\udd09|\\ud83d\\udd08|\\ud83d\\udd07|\\ud83d\\udd14|\\ud83d\\udd15|\\ud83d\\udce2|\\ud83d\\udce3|\\u23f3|\\u231b\\ufe0f|\\u23f0|\\u231a\\ufe0f|\\ud83d\\udd13|\\ud83d\\udd12|\\ud83d\\udd0f|\\ud83d\\udd10|\\ud83d\\udd11|\\ud83d\\udd0e|\\ud83d\\udca1|\\ud83d\\udd26|\\ud83d\\udd06|\\ud83d\\udd05|\\ud83d\\udd0c|\\ud83d\\udd0b|\\ud83d\\udd0d|\\ud83d\\udec1|\\ud83d\\udec0|\\ud83d\\udebf|\\ud83d\\udebd|\\ud83d\\udd27|\\ud83d\\udd29|\\ud83d\\udd28|\\ud83d\\udeaa|\\ud83d\\udeac|\\ud83d\\udca3|\\ud83d\\udd2b|\\ud83d\\udd2a|\\ud83d\\udc8a|\\ud83d\\udc89|\\ud83d\\udcb0|\\ud83d\\udcb4|\\ud83d\\udcb5|\\ud83d\\udcb7|\\ud83d\\udcb6|\\ud83d\\udcb3|\\ud83d\\udcb8|\\ud83d\\udcf2|\\ud83d\\udce7|\\ud83d\\udce5|\\ud83d\\udce4|\\u2709\\ufe0f|\\ud83d\\udce9|\\ud83d\\udce8|\\ud83d\\udcef|\\ud83d\\udceb|\\ud83d\\udcea|\\ud83d\\udcec|\\ud83d\\udced|\\ud83d\\udcee|\\ud83d\\udce6|\\ud83d\\udcdd|\\ud83d\\udcc4|\\ud83d\\udcc3|\\ud83d\\udcd1|\\ud83d\\udcca|\\ud83d\\udcc8|\\ud83d\\udcc9|\\ud83d\\udcdc|\\ud83d\\udccb|\\ud83d\\udcc5|\\ud83d\\udcc6|\\ud83d\\udcc7|\\ud83d\\udcc1|\\ud83d\\udcc2|\\u2702\\ufe0f|\\ud83d\\udccc|\\ud83d\\udcce|\\u2712\\ufe0f|\\u270f\\ufe0f|\\ud83d\\udccf|\\ud83d\\udcd0|\\ud83d\\udcd5|\\ud83d\\udcd7|\\ud83d\\udcd8|\\ud83d\\udcd9|\\ud83d\\udcd3|\\ud83d\\udcd4|\\ud83d\\udcd2|\\ud83d\\udcda|\\ud83d\\udcd6|\\ud83d\\udd16|\\ud83d\\udcdb|\\ud83d\\udd2c|\\ud83d\\udd2d|\\ud83d\\udcf0|\\ud83c\\udfa8|\\ud83c\\udfac|\\ud83c\\udfa4|\\ud83c\\udfa7|\\ud83c\\udfbc|\\ud83c\\udfb5|\\ud83c\\udfb6|\\ud83c\\udfb9|\\ud83c\\udfbb|\\ud83c\\udfba|\\ud83c\\udfb7|\\ud83c\\udfb8|\\ud83d\\udc7e|\\ud83c\\udfae|\\ud83c\\udccf|\\ud83c\\udfb4|\\ud83c\\udc04\\ufe0f|\\ud83c\\udfb2|\\ud83c\\udfaf|\\ud83c\\udfc8|\\ud83c\\udfc0|\\u26bd\\ufe0f|\\u26be\\ufe0f|\\ud83c\\udfbe|\\ud83c\\udfb1|\\ud83c\\udfc9|\\ud83c\\udfb3|\\u26f3\\ufe0f|\\ud83d\\udeb5|\\ud83d\\udeb4|\\ud83c\\udfc1|\\ud83c\\udfc7|\\ud83c\\udfc6|\\ud83c\\udfbf|\\ud83c\\udfc2|\\ud83c\\udfca|\\ud83c\\udfc4|\\ud83c\\udfa3|\\u2615\\ufe0f|\\ud83c\\udf75|\\ud83c\\udf76|\\ud83c\\udf7c|\\ud83c\\udf7a|\\ud83c\\udf7b|\\ud83c\\udf78|\\ud83c\\udf79|\\ud83c\\udf77|\\ud83c\\udf74|\\ud83c\\udf55|\\ud83c\\udf54|\\ud83c\\udf5f|\\ud83c\\udf57|\\ud83c\\udf56|\\ud83c\\udf5d|\\ud83c\\udf5b|\\ud83c\\udf64|\\ud83c\\udf71|\\ud83c\\udf63|\\ud83c\\udf65|\\ud83c\\udf59|\\ud83c\\udf58|\\ud83c\\udf5a|\\ud83c\\udf5c|\\ud83c\\udf72|\\ud83c\\udf62|\\ud83c\\udf61|\\ud83c\\udf73|\\ud83c\\udf5e|\\ud83c\\udf69|\\ud83c\\udf6e|\\ud83c\\udf66|\\ud83c\\udf68|\\ud83c\\udf67|\\ud83c\\udf82|\\ud83c\\udf70|\\ud83c\\udf6a|\\ud83c\\udf6b|\\ud83c\\udf6c|\\ud83c\\udf6d|\\ud83c\\udf6f|\\ud83c\\udf4e|\\ud83c\\udf4f|\\ud83c\\udf4a|\\ud83c\\udf4b|\\ud83c\\udf52|\\ud83c\\udf47|\\ud83c\\udf49|\\ud83c\\udf53|\\ud83c\\udf51|\\ud83c\\udf48|\\ud83c\\udf4c|\\ud83c\\udf50|\\ud83c\\udf4d|\\ud83c\\udf60|\\ud83c\\udf46|\\ud83c\\udf45|\\ud83c\\udf3d|\\ud83c\\udfe0|\\ud83c\\udfe1|\\ud83c\\udfeb|\\ud83c\\udfe2|\\ud83c\\udfe3|\\ud83c\\udfe5|\\ud83c\\udfe6|\\ud83c\\udfea|\\ud83c\\udfe9|\\ud83c\\udfe8|\\ud83d\\udc92|\\u26ea\\ufe0f|\\ud83c\\udfec|\\ud83c\\udfe4|\\ud83c\\udf07|\\ud83c\\udf06|\\ud83c\\udfef|\\ud83c\\udff0|\\u26fa\\ufe0f|\\ud83c\\udfed|\\ud83d\\uddfc|\\ud83d\\uddfe|\\ud83d\\uddfb|\\ud83c\\udf04|\\ud83c\\udf05|\\ud83c\\udf03|\\ud83d\\uddfd|\\ud83c\\udf09|\\ud83c\\udfa0|\\ud83c\\udfa1|\\u26f2\\ufe0f|\\ud83c\\udfa2|\\ud83d\\udea2|\\u26f5\\ufe0f|\\ud83d\\udea4|\\ud83d\\udea3|\\u2693\\ufe0f|\\ud83d\\ude80|\\u2708\\ufe0f|\\ud83d\\udcba|\\ud83d\\ude81|\\ud83d\\ude82|\\ud83d\\ude8a|\\ud83d\\ude89|\\ud83d\\ude9e|\\ud83d\\ude86|\\ud83d\\ude84|\\ud83d\\ude85|\\ud83d\\ude88|\\ud83d\\ude87|\\ud83d\\ude9d|\\ud83d\\ude8b|\\ud83d\\ude83|\\ud83d\\ude8e|\\ud83d\\ude8c|\\ud83d\\ude8d|\\ud83d\\ude99|\\ud83d\\ude98|\\ud83d\\ude97|\\ud83d\\ude95|\\ud83d\\ude96|\\ud83d\\ude9b|\\ud83d\\ude9a|\\ud83d\\udea8|\\ud83d\\ude93|\\ud83d\\ude94|\\ud83d\\ude92|\\ud83d\\ude91|\\ud83d\\ude90|\\ud83d\\udeb2|\\ud83d\\udea1|\\ud83d\\ude9f|\\ud83d\\udea0|\\ud83d\\ude9c|\\ud83d\\udc88|\\ud83d\\ude8f|\\ud83c\\udfab|\\ud83d\\udea6|\\ud83d\\udea5|\\u26a0\\ufe0f|\\ud83d\\udea7|\\ud83d\\udd30|\\u26fd\\ufe0f|\\ud83c\\udfee|\\ud83c\\udfb0|\\u2668\\ufe0f|\\ud83d\\uddff|\\ud83c\\udfaa|\\ud83c\\udfad|\\ud83d\\udccd|\\ud83d\\udea9|\\ud83c\\uddef\\ud83c\\uddf5|\\ud83c\\uddf0\\ud83c\\uddf7|\\ud83c\\udde9\\ud83c\\uddea|\\ud83c\\udde8\\ud83c\\uddf3|\\ud83c\\uddfa\\ud83c\\uddf8|\\ud83c\\uddeb\\ud83c\\uddf7|\\ud83c\\uddea\\ud83c\\uddf8|\\ud83c\\uddee\\ud83c\\uddf9|\\ud83c\\uddf7\\ud83c\\uddfa|\\ud83c\\uddec\\ud83c\\udde7|\\u0031\\ufe0f\\u20e3|\\u0032\\ufe0f\\u20e3|\\u0033\\ufe0f\\u20e3|\\u0034\\ufe0f\\u20e3|\\u0035\\ufe0f\\u20e3|\\u0036\\ufe0f\\u20e3|\\u0037\\ufe0f\\u20e3|\\u0038\\ufe0f\\u20e3|\\u0039\\ufe0f\\u20e3|\\u0030\\ufe0f\\u20e3|\\ud83d\\udd1f|\\ud83d\\udd22|\\u0023\\ufe0f\\u20e3|\\ud83d\\udd23|\\u2b06\\ufe0f|\\u2b07\\ufe0f|\\u2b05\\ufe0f|\\u27a1\\ufe0f|\\ud83d\\udd20|\\ud83d\\udd21|\\ud83d\\udd24|\\u2197\\ufe0f|\\u2196\\ufe0f|\\u2198\\ufe0f|\\u2199\\ufe0f|\\u2194\\ufe0f|\\u2195\\ufe0f|\\ud83d\\udd04|\\u25c0\\ufe0f|\\u25b6\\ufe0f|\\ud83d\\udd3c|\\ud83d\\udd3d|\\u21a9\\ufe0f|\\u21aa\\ufe0f|\\u2139\\ufe0f|\\u23ea|\\u23e9|\\u23eb|\\u23ec|\\u2935\\ufe0f|\\u2934\\ufe0f|\\ud83c\\udd97|\\ud83d\\udd00|\\ud83d\\udd01|\\ud83d\\udd02|\\ud83c\\udd95|\\ud83c\\udd99|\\ud83c\\udd92|\\ud83c\\udd93|\\ud83c\\udd96|\\ud83d\\udcf6|\\ud83c\\udfa6|\\ud83c\\ude01|\\ud83c\\ude2f\\ufe0f|\\ud83c\\ude33|\\ud83c\\ude35|\\ud83c\\ude34|\\ud83c\\ude32|\\ud83c\\ude50|\\ud83c\\ude39|\\ud83c\\ude3a|\\ud83c\\ude36|\\ud83c\\ude1a\\ufe0f|\\ud83d\\udebb|\\ud83d\\udeb9|\\ud83d\\udeba|\\ud83d\\udebc|\\ud83d\\udebe|\\ud83d\\udeb0|\\ud83d\\udeae|\\ud83c\\udd7f\\ufe0f|\\u267f\\ufe0f|\\ud83d\\udead|\\ud83c\\ude37|\\ud83c\\ude38|\\ud83c\\ude02|\\u24c2\\ufe0f|\\ud83d\\udec2|\\ud83d\\udec4|\\ud83d\\udec5|\\ud83d\\udec3|\\ud83c\\ude51|\\u3299\\ufe0f|\\u3297\\ufe0f|\\ud83c\\udd91|\\ud83c\\udd98|\\ud83c\\udd94|\\ud83d\\udeab|\\ud83d\\udd1e|\\ud83d\\udcf5|\\ud83d\\udeaf|\\ud83d\\udeb1|\\ud83d\\udeb3|\\ud83d\\udeb7|\\ud83d\\udeb8|\\u26d4\\ufe0f|\\u2733\\ufe0f|\\u2747\\ufe0f|\\u274e|\\u2705|\\u2734\\ufe0f|\\ud83d\\udc9f|\\ud83c\\udd9a|\\ud83d\\udcf3|\\ud83d\\udcf4|\\ud83c\\udd70|\\ud83c\\udd71|\\ud83c\\udd8e|\\ud83c\\udd7e|\\ud83d\\udca0|\\u27bf|\\u267b\\ufe0f|\\u2648\\ufe0f|\\u2649\\ufe0f|\\u264a\\ufe0f|\\u264b\\ufe0f|\\u264c\\ufe0f|\\u264d\\ufe0f|\\u264e\\ufe0f|\\u264f\\ufe0f|\\u2650\\ufe0f|\\u2651\\ufe0f|\\u2652\\ufe0f|\\u2653\\ufe0f|\\u26ce|\\ud83d\\udd2f|\\ud83c\\udfe7|\\ud83d\\udcb9|\\ud83d\\udcb2|\\ud83d\\udcb1|\\u00a9|\\u00ae|\\u2122|\\u274c|\\u203c\\ufe0f|\\u2049\\ufe0f|\\u2757\\ufe0f|\\u2753|\\u2755|\\u2754|\\u2b55\\ufe0f|\\ud83d\\udd1d|\\ud83d\\udd1a|\\ud83d\\udd19|\\ud83d\\udd1b|\\ud83d\\udd1c|\\ud83d\\udd03|\\ud83d\\udd5b|\\ud83d\\udd67|\\ud83d\\udd50|\\ud83d\\udd5c|\\ud83d\\udd51|\\ud83d\\udd5d|\\ud83d\\udd52|\\ud83d\\udd5e|\\ud83d\\udd53|\\ud83d\\udd5f|\\ud83d\\udd54|\\ud83d\\udd60|\\ud83d\\udd55|\\ud83d\\udd56|\\ud83d\\udd57|\\ud83d\\udd58|\\ud83d\\udd59|\\ud83d\\udd5a|\\ud83d\\udd61|\\ud83d\\udd62|\\ud83d\\udd63|\\ud83d\\udd64|\\ud83d\\udd65|\\ud83d\\udd66|\\u2716\\ufe0f|\\u2795|\\u2796|\\u2797|\\u2660\\ufe0f|\\u2665\\ufe0f|\\u2663\\ufe0f|\\u2666\\ufe0f|\\ud83d\\udcae|\\ud83d\\udcaf|\\u2714\\ufe0f|\\u2611\\ufe0f|\\ud83d\\udd18|\\ud83d\\udd17|\\u27b0|\\u3030|\\u303d\\ufe0f|\\ud83d\\udd31|\\u25fc\\ufe0f|\\u25fb\\ufe0f|\\u25fe\\ufe0f|\\u25fd\\ufe0f|\\u25aa\\ufe0f|\\u25ab\\ufe0f|\\ud83d\\udd3a|\\ud83d\\udd32|\\ud83d\\udd33|\\u26ab\\ufe0f|\\u26aa\\ufe0f|\\ud83d\\udd34|\\ud83d\\udd35|\\ud83d\\udd3b|\\u2b1c\\ufe0f|\\u2b1b\\ufe0f|\\ud83d\\udd36|\\ud83d\\udd37|\\ud83d\\udd38|\\ud83d\\udd39/g; // 检测utf16字符正则
						var aEmoji = temp.render(data[i]).match(/\[.{1,2}\]/g);
						var aEmojiSystem = temp.render(data[i]).match(/\\u[a-z0-9A-Z]{4}\\u[a-z0-9A-Z]{4}/g);
						var	oHtml = temp.render(data[i]);
						if( aEmoji ){
							for(var j = 0; j < aEmoji.length; j++){
								oHtml = oHtml.replace(aEmoji[j],self.imgJson[aEmoji[j]]);
							};
						}
						if( aEmojiSystem ){
							for(var j = 0; j < aEmojiSystem.length; j++){
								if(!aEmojiSystem[j].match(patt)){
									 var strs = aEmojiSystem[j].match(/\\u[a-z0-9A-Z]{4}/g);
									 for(var x = 0; x < strs.length; x++){
									 	oHtml = oHtml.replace(strs[x],unescape(strs[x].replace(/\\/g,"%")));
									 }
								} else {
									var oImg = "<img src='emoji/2x/" + toUnicode(aEmojiSystem[j]) + ".png' style='width:40px; height:40px; transform:scale(0.7); margin:0;'>";
									oHtml = oHtml.replace(aEmojiSystem[j],oImg);
								}
							};
						}
							
						
						html += oHtml;
						self.meassageCommentList.push(data[i]);
					};
					self.commentPage.find('.comment-list').html(html);
					hidden();
				});
				
				function toUnicode(str){
					var h = "0x" + str.substr(str.indexOf("u")+1,4);
					var l = "0x" +  str.substr(str.lastIndexOf("u")+1,4);
					var code = (Number(h) - 0xD800) * 0x400 + 0x10000 + Number(l) - 0xDC00;
					return code.toString(16);
				}

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
		            url:MoonduDomain+'/MNewsB/NewDetail',
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
		            url:MoonduDomain+'/MNewsB/CommList',
		            data:{action:'list_news',newid:id,pageindex:page,pagesize:20},
		            callback:function(res){
		            	if (res.Result) {
		            		if (res.Data.Rows.length > 0) {
		            			self.commentRender(res.Data.Rows);
		            			self.commentCallAjax = true;
		            		}else{
		            			self.cpage = -1;
		            			var commentNum = res.Data.Rows.length;
								commentNum == 0 ? hidden() : commentNum ;
								self.commentPage.find('span.commentNum').text(commentNum);
								function hidden(){
									$('a.comment-more').addClass('hidden');
								}
		            		}
						};
		            }
		        }
		       	$.md.ajaxurl(option);
			}
		}
		//人物-分享
		var Public = {
			init : function(){
				this.html="",
				this.showHTML="",
				this.dreamHTML="",
				this.activeHTML="",
				this.photoListHTML="",
		    	    	this.photoList=document.getElementById("photoList").innerHTML,
				this.public_top=document.getElementById("public_top").innerHTML,
				this.show_box=document.getElementById("show_box").innerHTML,
				this.dreamTemp=document.getElementById("dreamTemp").innerHTML,
				this.active_box=document.getElementById("active_box").innerHTML,
				this.id =$.getUrlVar('id'),
				this.SignupID="",
				this.myDreamWrap = $('#myDream'),
				this.pidArr= [],
				this.parseId="",
				this.indexPid="";

				this.bindEvent();
			},
			bindEvent : function(){
				var self = this;
				//导航栏切换
				$('.public_nav_box a').click(function(){
					var cur=$(this).index();
					$(this).addClass('like_style').siblings('a').removeClass('like_style');
					$('.p_container').eq(cur).show().siblings('div').hide();
				});
				this.headInfoRender(1);
				this.showMessageRender(1);
				this.dreamMessageRender(1);
				this.albumMessageRender(1);
				this.activityMessageRender(1);

				//点击头像跳转APP下载链接
				$(".public_home_top").on("click","a .wrap",self.shareLink);
				//点击关注跳转APP下载链接
				$(".public_home_top").on("click","a .public_add_attention",self.shareLink);
				//点击投票跳转APP下载链接
				$(".public_wrap").on("click","a .p_btn_bottom",self.shareLink);
				//点击活动跳转APP下载链接
				$(".active_area").on("click","a .active_content",self.shareLink);

			},
			shareLink : function(){
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
				/*var img = $("#img");
				var imgs = $("#imgs");*/
				var ua = window.navigator.userAgent.toLowerCase(); 
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						/*$(".app").removeClass("hidden");
						img.className = "ios";*/
						//在微信中通过应用宝市场打开
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						/*$(".app").removeClass("hidden");
						img.className = "android";*/
						//在微信中通过应用宝市场打开
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}		
				}
			},
			//头部模板渲染
			headInfoRender : function(page){
				var self = this;
				var option={
					url:MoonduDomain+'/UserCenterB/GetUserInfo',
					data:{uid:this.id},
					callback:function(res){
						if(res.Msg=="没有找到该用户."){
							$.alert("没有找到该用户.")
						};
						if(res.Result==true){
							var data=res.Data;
							var template = new EJS({"text": self.public_top});
							self.html += template.render(data);
							$(".public_home_top").html(self.html);
							//==========判断用户有没有头像===========
							if(data.Image==""||data.Image=="http://zoneimages.moonbasa.com/images/user.jpg"){                
				                		$(".public_home_top").find(".wrap_user_head").attr("src","images/user.jpg");
				             		}

							//===========判断男女图标=============
							if(data.Sex==0){
								$(".public_home_top").find("a.wrap").append('<img class="sex_ico" src="images/femail.png">');
							}
							else{
								$(".public_home_top").find("a.wrap").append('<img class="sex_ico" src="images/man_03.png">');
							}
						}
						
					}
				}
				$.md.ajaxurl(option);
			},
			//星秀场模板渲染
			showMessageRender : function(page){
				var self = this;
				var option={
					url:MoonduDomain+'/MshowB/Details',
					data:{uid:this.id},
					callback: function(data){
						if(data.Result == false){
							 $(".showBox").addClass("hidden");
					         $("#noshow").removeClass("hidden");
					         $(".p_show").css("background","#ededed");
						}
						if(data.Result==true){             		
							var data=data.Data;
							var template2 = new EJS({"text": show_box});
							self.showHTML+=template2.render(data);
							$(".showBox").html(self.showHTML);
							self.SignupID=data.Id;
	          					}
					}		
				}
				$.md.ajaxurl(option);
			},
			//梦话模板渲染
			dreamMessageRender : function(page){
				var self = this;
				var option={
					url:MoonduDomain+'/PhotoB/GetUsePhotoByUid',
					data:{uid:this.id,page:page},
					callback: function(res){
						var data=res.Data.Rows;
						if(data=="" && page<=1){
						            $(".item-wrap").addClass("hidden");
						            $("#nodream").removeClass("hidden");
	          					}

						if(data.length>0){
							for(var i=0;i<data.length;i++){
								var template = new EJS({"text": self.dreamTemp});
								self.dreamHTML+= template.render(data[i]);
								/*
								this.pidArr.push(data[i].Pid);*/
							}
							// this.indexPid=this.pidArr.toString();
							
							//页面渲染时的点赞状态
							// isPraiseAjax();	
							$(".item-wrap").html(self.dreamHTML);
							//==========判断用户有没有头像===========
							var item=$("#myDream").find(".author-pic");
							for(var i=0;i<item.length;i++){
								if(data[i].UserInfo.Image==""||data[i].UserInfo.Image=="http://zoneimages.moonbasa.com/images/user.jpg"){                
				                			$(item[i]).find("img").attr("src","images/user.jpg");
				             			}
			             			}

						}
						else{
							$(".item-wrap").attr("data-page","0");
						}
						
						$(".item-wrap").attr("data-loading","0");
						// loading_hide();
					}	
				}
				$.md.ajaxurl(option);
			},
			//相册模板渲染
			albumMessageRender : function(page){
				var self = this;
				var option={
					url:MoonduDomain+'/photoB/GetUserTagByUid',
					data:{uid:this.id,page:page,pagesize:10},
					callback: function(data){ 
						if(data.Result==true){     
						        	data=data.Data.Rows;
						       	if(data==""&&page<=1){
							            $("#photoWrap").addClass("hidden");
							            $("#nophoto").removeClass("hidden");
				          			}
						        	if(data.length>0){
						            for(var i=0;i<data.length;i++){
						                    var template=new EJS({"text":self.photoList});
						                    self.photoListHTML += template.render(data[i]);
						             }
						                 	$(".like_photo_area ul").html(self.photoListHTML);						         
						        	}
						        	else{
						            		$("#photoWrap").attr("data_page","0");
						        	}
						           		$("#photoWrap").attr("data-loading","0");
						        	// loading_hide();
						        
						}
				    	}
				}
				$.md.ajaxurl(option);
			},
			//活动模板渲染
			activityMessageRender : function(page){
				var self = this;
				var option={
					url:MoonduDomain+'/MNewsB/MyActiv',
					data:{uid:this.id,pageindex:page},
					callback: function(data){
						if(data.Result=="nologin"){
							$.login("是否登录");
						}
						if(data.Result==true){
							var data=data.Data.Rows;
							if(data.length==0&&page<=1){
							            $(".active_content").addClass("hidden");
							            $("#noactive").removeClass("hidden");
		          					}
							if(data.length>0){
								for(var i=0; i<data.length;i++) 
								{
								  	var template= new EJS({"text": self.active_box});
				 					self.activeHTML+= template.render(data[i]);
								} 
							$(".active_area").html(self.activeHTML);
							}
							else{
								$(".active_area").attr("data-page","0");
							}
							$(".active_area").attr("data-loading","0");							
							 // loading_hide(); 
						}
					}
				}
				$.md.ajaxurl(option);
			}
		}
		//个人预选赛
		var PersonMatch = {
			init : function (){
				this.piaoShu = $('#piaoShu');
				this.fenSiShu = $('#fenSiShu');
				this.personWrap = $('#personTouPiao');
				this.oPlayer = 0; //存储参加人数
				this.content = $('#content');
				this.join = $('#join');

				this._bindEvent();
			},
			_bindEvent : function(){
				var self = this;
				this.getMessageAjax();
				this.getPlayerinfoAjax();

				this.piaoShu.on('click',self.shareLink);
				this.fenSiShu.on('click',self.shareLink);
				this.content.find('.actInfo').on('click','a',self.shareLink);
				this.content.on('click','a.vote',self.shareLink);
				this.join.find('a').on('click',self.shareLink);
				this.content.find('ul').on('click','img.play_btn',self.shareLink);

			},
			shareLink : function(){
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

				var ua = window.navigator.userAgent.toLowerCase();
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						//在微信中通过应用宝市场打开
						window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location.href = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						//在微信中通过应用宝市场打开
						window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location.href = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}
				}
			},
			messageRender : function(data){
				var self = this,
					html = "",
					infoContent = document.getElementById('infoContent'),
					iContent = new EJS({"text":infoContent});

					html = iContent.render(data);
				var contentShow = html.slice(0,Math.floor(html.length/3));
					this.content.find("div.actInfo").append(contentShow);
			},
			getMessageAjax : function(){
				var self = this,
					newid = parseInt($.getUrlVar("id"));
				$.ajax({
					url: MoonduDomain + "/MnewsB/ZhuanTiDetail",
					type:"GET",
					dataType: "jsonp",
					data:{newid:newid},
					success:function(res){
						if (res.Result) {
							self.messageRender(res.Data);
						}
					}
				});
			},
			playerRender : function(data){
				var self = this;
				for(var i =0; i < data.length; i++){
					if(data[i].Img_Url){
						var img = data[i].Img_Url;
					} else {
						var img = 'images/loadingDefImage.png';
					}

					var player = "<li>\
					 	<div class='img_container'><img class='paly_btn' src='images/viok.png'><img src=" + img + "></div>\
					 	<div>\
					 		<p class='vote_count'><span>" + data[i].Name + "</span><span class='vote_data'>" + data[i].ShwoCount + "票</span></p>\
					 		<p class='college'>" + data[i].University + "</p>\
					 	</div>\
					 	<div class='vote_label'>\
					 		<img src='images/touPiao.png'>\
					 		<a class='vote' href='javascript:;'>投票</a>\
					 	</div>\
					 </li>";
					this.content.find('ul').append(player);
				}
			},
			getPlayerinfoAjax : function(){
				var self = this,
					aid = parseInt($.getUrlVar("id"));
				$.ajax({
					url: MoonduDomain + "/MNewsB/PlayerLists",
					type: "GET",
					dataType: "jsonp",
					data: {aid:aid},
					success: function(res){
						if(res.Result){
							self.playerRender(res.Data.Rows);
						}
					}
				});
			}
		}
		//视频详情
		var Video = {
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
				// this.video = $("video");//视频元素
				// this.playBtn = $("#play_btn");//播放按钮
				// this.cover = $("#coverPic");//视频封面
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
				this.getDeliverPraiseAjax();

				//指定视频封面
				// (function poster(){
				// 	self.wrap.find("#myvideo").attr("poster",);
				// })();

				//视频播放
				this.wrap.on('click','#play_btn',self.videoPlay.bind(this));


				//发表评论,判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_video') {
					this.publishField.find("a[data-type=comment]").bind("click",self.shareLink);
				}
				//点赞,判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_video') {
					this.publishField.on("click","a[data-type=love]",self.shareLink);
				}else{
					this.publishField.on("click","a[data-type=love]",self.tooltipPraiseAjax);
				}
				// 关注，判断是不是T站分享出去的链接
				if (this.$top.attr('data-type') == 'T_video'){
					this.wrap.on('click','a[data-type=focus]',self.shareLink);
				}

				//分享下载链接
				$("#m-bottom-banner").find("a").on("click",self.shareLink);
				//点击作者、点赞、评论头像进入App下载页面
				$("body").on("click","a.portrait",self.shareLink);
				$(".zan-list").on("click","a.user_love",self.shareLink);
				$(".comment-list").on("click","a.user_comment",self.shareLink);

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
			videoPlay : function(){
				this.wrap.find("#play_btn").addClass("hidden");
				this.wrap.find("video")[0].play();
			},
			messageRender:function(data){
				var self=this,
					html = "",
					d = new Date(),
					authorTemp = document.getElementById("authorTemp").innerHTML,
					temp = new EJS({"text": authorTemp});
				// this.title = data.Declare;
				// this.content = data.Photo;
				this.pid = data.Pid;
				//////////////////////
				// $("title").text(this.title);
				$("#hidddenPhoto").find('img').attr("src",data.Photo);
				html = temp.render(data);
				this.currentActivity.push(data);
				// $("title").text(data.Title)
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
			shareLink : function(){
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
				/*var img = $("#img");
				var imgs = $("#imgs");*/
				var ua = window.navigator.userAgent.toLowerCase(); 
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						/*$(".app").removeClass("hidden");
						img.className = "ios";*/
						//在微信中通过应用宝市场打开
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						/*$(".app").removeClass("hidden");
						img.className = "android";*/
						//在微信中通过应用宝市场打开
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
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
					url: MoonduDomain+'/photoB/GetPhotoByPid',
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
					url:MoonduDomain+'/photoB/GetLikeUserByPid',
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
					url:MoonduDomain+'/photoB/GetCommentByPid',
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
		//直播页
		var Live = {
			init : function (){
				this.piaoShu = $('#piaoShu');
				this.fenSiShu = $('#fenSiShu');
				this.personWrap = $('#personTouPiao');
				this.oA = this.personWrap.find('.vote');
				this.content = $('#content');
				this.join = $('#join');

				this._bindEvent();
			},
			_bindEvent : function(){
				var self = this;
				this.getMessageAjax();
				this.getPalyerInfoAjax();

				this.content.find('.actInfo').on('click','a',self.shareLink);
				this.piaoShu.on('click',self.shareLink);
				this.fenSiShu.on('click',self.shareLink);
				this.content.on('click','a.vote',self.shareLink);
				this.join.find('a').on('click',self.shareLink);
			},
			shareLink : function(){
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
				/*var img = $("#img");
				var imgs = $("#imgs");*/
				var ua = window.navigator.userAgent.toLowerCase();
				if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
					if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
						/*$(".app").removeClass("hidden");
						img.className = "ios";*/
						//在微信中通过应用宝市场打开
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						/*$(".app").removeClass("hidden");
						img.className = "android";*/
						//在微信中通过应用宝市场打开
						window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.moonbasa.zone";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}
				}
			},
			messageRender : function(data){
				var self = this,
					html = '',
					infoAuthor = document.getElementById('infoAuthor'),
					author = new EJS({"text":infoAuthor});

					html = author.render(data);
					this.content.find('.actInfo').append(html);
			},
			getMessageAjax : function(){
				var self = this,
					newid = parseInt($.getUrlVar('newid'));
				$.ajax({
					url: MoonduDomain + '/MnewsB/ZhuanTiDetail',
					type: "GET",
					dataType: "jsonp",
					data: {newid:newid},
					success: function(res){
						if(res.Result){
							self.messageRender(res.Data);
						}
					}
				});
			},
			playerListsRender : function(data){
				var self = this;
				for(var i =0; i < data.length; i++){
					if(data[i].UserInfo.Image){
						var img = data[i].UserInfo.Image;
					} else {
						var img = data[i].Img_Url;
					}

					var player = "<li>\
					 	<div class='img_container'><img src=" + img  + "></div>\
					 	<div>\
					 		<p class='vote_count'><span>" + data[i].Name + "</span><span class='vote_data'>" + data[i].ShwoCount + "票</span></p>\
					 		<p class='college'>" + data[i].University + "</p>\
					 	</div>\
					 	<div class='vote_label'>\
					 		<img src='images/touPiao.png'>\
					 		<a class='vote' href='javascript:;'>投票</a>\
					 	</div>\
					 </li>";
					this.content.find('ul').append(player);
				}
			},
			getPalyerInfoAjax : function(){
				var self = this,
					aid = parseInt($.getUrlVar('newid'));
				$.ajax({
					url: MoonduDomain + '/MNewsB/PlayerLists',
					type: "GET",
					dataType: "jsonp",
					data: {aid:aid},
					success: function(res){
						if(res.Result){
							self.playerListsRender(res.Data.Rows);
						}
					}
				});
			}
		}
		// 公用模块
		// 1.微信分享
		// var wxShare = {
		// 	run : function(){
		// 			wx.config({
		// 		    debug: false,
		// 		    appId: "你的AppID",
		// 		    timestamp: '上一步生成的时间戳',
		// 		    nonceStr: '上一步中的字符串',
		// 		    signature: '上一步生成的签名',
		// 		    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 功能列表，我们要使用JS-SDK的什么功能
		// 		});
		// 	}
		// }
		//程序主入口
		var MainEntrance={

			init:function(){

				var flag = $("body").attr("data-fn");
				if (flag == "message") { MZMessage.init() }
				if (flag == "view")    { View.init()}
				if (flag == "Activity")  { Activity.init()}
				if (flag == "People") {Public.init()}
				if (flag == "PersonMatch") {PersonMatch.init()}
				if (flag == "video") {Video.init()}
				if (flag == "Live") {Live.init()}
			}
		}
		MainEntrance.init();
	});
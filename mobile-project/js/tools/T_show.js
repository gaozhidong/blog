	var	showInfoHTML="",
 		showInfo=document.getElementById("showInfo").innerHTML;
 		userInfoHTML="",
 		userInfo=document.getElementById("userInfo").innerHTML;
		userCommentHTML = "",
		userCommentTemp = document.getElementById("userCommentTemp").innerHTML;

	var showTag="";
	var showUid="";
	var showUrl="";
	var showPhoto=new Array();

		//====================星秀场选手详情模板渲染===================
		

		function show(){
			var uid =$.getUrlVar('uid');
			var option={
		   		url:MoonduDomain+'/home/Details',
		   		data:{uid:uid},
		   		callback:function(res){
		   			if(res.Result==true){
			   			var data=res.Data;
			   			showId = data.Id;
			   			showTitle = data.Name;
			   			showContent = data.Message;
			 			var template=new EJS({"text":showInfo});
			 			showInfoHTML += template.render(data);
						$(".show_info").html(showInfoHTML);
						//获取用户帖子图片
						var photoArray=data.Photols;
				        for(i=0;i<photoArray.length;i++){
				            showPhoto.push(photoArray[i].PHOTO);
				        }                      
				        var picList="";
				        var tagNum="";
				        var length=showPhoto.length;
				        for(i=0;i<1;i++){
				       		 picList+='<li><img src="'+showPhoto[0]+'"  width="100%"></li>'             
				        	$(".main_image").find("#imglist").html(picList);
				        	tagNum+='<span style="display:block;">'+(i+1)+'/'+length+'</span>'
				            $(".m-show-num").html(tagNum);
				    	}
				        if(showPhoto.length==1){
				        	$(".flicking_inner").find("span").css("display","block");
				        	$("#imglist").css("width","100%");
				        }
			   			}
		   			}
		   		}
		   		$.md.ajaxurl(option);
		}
		show();
		//==================星秀场用户个人信息模板渲染=======================
		function head(){
			var uid =$.getUrlVar('uid');
			 var option={
					url:MoonduDomain+'/Home/ShareUserInfos',
					data:{uid:uid},
					callback:function(res){
						if (res.Result) {
							var data=res.Data;
			 				var template=new EJS({"text":userInfo});
			 				userInfoHTML += template.render(data);
							$(".head_box").html(userInfoHTML);
						};
					}
				}
			$.md.ajaxurl(option);
		}
		head();
		//==============评论内容模板渲染==============================
			var commentPage = $("#comment-page");
			var deliverCommentWarp = $("#commentLayer");
			var userInfor = {};
			var commentList = [];
			var commentInfor = {};
			commentInfor.page = 1;
			//获取评论
			function getCommentListAjax(page){
				var id = parseInt($.getUrlVar('id')),
					temp = new EJS({"text":userCommentTemp}),
					html = "";
				var option={
					url:MoonduDomain+'/home/CommentList',
					data:{signupid:id,pageindex:page,pagesize:20},
					callback:function(res){
						if (!res.Result) return;
						if (res.Data.Rows.length > 0) {
							for(var i=0;i<res.Data.Rows.length;i++){
			 					html += temp.render(res.Data.Rows[i]);
			 					commentList.push(res.Data[i]);
			 				}
			 				commentPage.find('ul').append(html);
						}else{
							commentInfor.page = -1;
						}
					}
				}
				$.md.ajaxurl(option);
			}
			deliverCommentWarp.find('textarea').focus(function(){
				shareLink();
			});
			deliverCommentWarp.find('button').click(function(){
				shareLink();
			});
			getCommentListAjax();
		//分享下载链接
		$("#show_share_link").find('a').bind('click',function(){
			shareLink();
		});
		//判断是安卓手机还是苹果手机
		function shareLink(){
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
						//imgs.src = "images/browser.jpg";
						img.className = "ios";
						window.location = "https://itunes.apple.com/cn/app/meng-zu/id1034294050?mt=8";
					}else{
						window.location="http://mzone.moonbasa.com/index.html";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						$(".app").removeClass("hidden");
						//imgs.src = "images/browser.jpg";
						img.className = "android";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}		
				}
		}
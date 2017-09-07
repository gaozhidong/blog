	
	//获取当前用户的信息
	var userInfor = {};
	var dialog = $("#dialog");
	var bottomMenu = $('#bottomMenu');
	var mask = $("#mask");

	//底部导航
	var foot_html = new EJS({url: 'views/includes/footer.ejs'}).render(foot_nav);
						bottomMenu.html(foot_html);
						var c_url = window.location.href.split("/")
						_url=c_url[c_url.length-1];

						bottomMenu.find('a').each(function(i) {
							var _this=$(this);
							var _aurl=_this.attr("href");
							
							if( _this.attr("href").lastIndexOf(_url)>-1){
								if(_url!="")
								{	
								_this.addClass("on");
								}
							}
							else{
								_this.removeClass("on");
							}
						});
						$('#sign').before(" ");
						//签到
						$("body").on("click",".sign",function(){
							 $.ajax({
							 	url:MoonduDomain+'/UserCenter/GetUserInfo',
            					type: "GET",
            					dataType: "jsonp",
            					success: function (data) {
					                if (data.Result == true) {
					                    getExperienceBySignAjax();
					                }
					                else {
					                     $.login("是否登录");
					                }
					            }

							 })
						});
						//发布
						$("body").on("click",".content",function(){
							 $.ajax({
							 	url:MoonduDomain+'/UserCenter/GetUserInfo',
            					type: "GET",
            					dataType: "jsonp",
            					success: function (data) {
					                if (data.Result == true) {
					                	location.href="release.html";
					                }
					                else {
					                     $.login("是否登录");
					                }
					            }

							 })
						});
						$("body").on("click","#dialog footer",function(){
							dialog.addClass("hidden");
						})
						$("body").on("click",'.find-close',function(){
							$('#sign').remove();
							mask.addClass('hidden');
						});
						bottomMenu.find('li[data-type=add]').on("click", function(){
							mask.removeClass('hidden');
							$("body").append(pub_html);
						});

	function getCurrentUserInforAjax(){
		 var option={
				url:MoonduDomain+'/UserCenter/GetUserInfo',
				callback:function(res){
					if (res.Result == "nologin") {
						$.login("是否登录");
						// location.href = "login_after.html";
					};
					if (res.Result) {
						getExperienceBySignAjax();
						// userInfor.name = res.Data.UserNick;
						// userInfor.portrait = res.Data.IMAGE;
						// userInfor.id = res.Data.Uid;
						//底部导航
						// var foot_html = new EJS({url: 'views/includes/footer.ejs'}).render(foot_nav);
						// bottomMenu.html(foot_html);
						// var c_url = window.location.href.split("/")
						// _url=c_url[c_url.length-1];

						// bottomMenu.find('a').each(function(i) {
						// 	var _this=$(this);
						// 	var _aurl=_this.attr("href");
							
						// 	if( _this.attr("href").lastIndexOf(_url)>-1){
						// 		if(_url!="")
						// 		{	
						// 		_this.addClass("on");
						// 		}
						// 	}
						// 	else{
						// 		_this.removeClass("on");
						// 	}
						// });
						//$('#sign').before(" ");
						//签到
						// $("body").on("click",".sign",function(){
						// 	getExperienceBySignAjax();
						// });
						// $("body").on("click","#dialog footer",function(){
						// 	dialog.addClass("hidden");
						// })
						// $("body").on("click",'.find-close',function(){
						// 	$('#sign').remove();
						// 	mask.addClass('hidden');
						// });
						// bottomMenu.find('li[data-type=add]').on("click", function(){
						// 	mask.removeClass('hidden');
						// 	$("body").append(pub_html);
						// });
					};
				}
			}
		$.md.ajaxurl(option);
	}
	// getCurrentUserInforAjax();
  	var pub_html = '<header class="find-sign" id="sign">'+
		'<div class="wrap clearfix">'+
			'<a class="common content fl" href="javascript:;">'+
			'<img src="images/find-content-close.png" width="25px" style="display:inline-block;" />'+
			'<span>内容</span>'+
		'</a>'+
		'<a class="common sign fl" href="javascript:;">'+
			'<img src="images/find-sign.png" width="25px" style="display:inline-block;"/>'+
		'	<span>签到</span>'+
		'</a>'+
		'<a href="javascript:;"class="find-close"></a>'+
	'	</div>'+
	'</header>';

	//签到获取经验值
	function getExperienceBySignAjax(){
		var	html ="",
			signTemplate = document.getElementById("signTemplate");
		var option={
		 	url:MoonduDomain+'/Integral/SignIn',
			callback: function(res){
				if (res.Result) {
					var template = new EJS({"text": signTemplate});
					html = template.render(res.Data);
					dialog.html(html);
					dialog.removeClass('hidden');
				}else{
					$.alert("今天已经签到");
					$('#sign').addClass('hidden');		
					mask.addClass('hidden');	
				}	
			}
	 	}
	 	$.md.ajaxurl(option);
	}








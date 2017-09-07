
	   	var	activeHTML="",
	   		hotDiscussTempHTML="",
	   		photoHTML="",
	   		userCommentTemp=document.getElementById("userCommentTemp").innerHTML,
			hotDiscussTemp=document.getElementById("hotDiscussTemp").innerHTML,
			photo_box=document.getElementById("photo_box").innerHTML,
			active_box=document.getElementById("active_box").innerHTML;

		var id = $.getUrlVar('id');
		var uid = $.getUrlVar('uid');
		var userCommentId = []; //评论用户的id
		var Uid="";
		var userInfor = {};
		var postId="";
		
	 
	 
	//获取当前用户信息
		function getCurrentUserInforAjax(){
			var option={
				url:MoonduDomain+'/UserCenter/GetUserInfo',
				callback:function(res){
					if (res.Result == "nologin") {
						$.login("是否登录");
					};
					if (res.Result) {
						Uid=res.Data.Uid;
						like_active(1);
						like_info(1);
						like_photo(1);
						userInfor.name = res.Data.UserNick;
						userInfor.portrait = res.Data.Image;
						userInfor.id = res.Data.Uid;
						userInfor.commentFlag = res.Result;
						//判断用户头像是否为空
						if (userInfor.portrait == '' || userInfor.portrait == undefined || userInfor.portrait == null) {
							userInfor.portrait = 'images/user.jpg';
						};
						//评论页消失
						 $top.on('click','a.person_top_ico',commentPageHide);
						// $top.on('click','a.person_top_ico',function(){
						// 	location.href="my_like.html";
						// });
					};
					
				}
			}
			$.md.ajaxurl(option);
		}
	//=====================我喜欢的活动模板渲染============================   		
	   	function like_active(page){
	   		var option={
	   			url:MoonduDomain+'/MNews/LikeNew',
	   			data:{type:1,pageindex:page},
	   			callback:function(res){
	   			if(res.Data==""&&page<=1){
              		$(".activeWrap").addClass("hidden");
              		$("#noactive").removeClass("hidden");
          		}
	   			if(res.Result==true){
	   				var data=res.Data.Rows; 
	   				if(data.length>0)
	   				{
		   				for(var i=0;i<data.length;i++){
		   					var template = new EJS({"text": active_box});
							activeHTML+= template.render(data[i]);
		   				}
		   				$(".activeWrap").html(activeHTML);
	   				}
	   				else
	   				{
	   					$(".active_area").attr("data-page","0");

	   				}
	   				$(".active_area").attr("data-loading","0");
	   				loading_hide();
	   				//===============图片延时加载============
	   	 			//$img=$(".active_area").find("img.lazy");
	   	 			//$img.lazyload({ 
					// 	placeholder:"images/grey.gif",
					// 	effect: "fadeIn",
					// 	threshold : 200
					// }); 
	   			}
	   						   			
	   			}
	   		}
	   		$.md.ajaxurl(option);
	   	}

		//=====================资讯模板渲染=====================================  	

	   	function like_info(page){
	   		
	   		var template2 = new EJS({"text":hotDiscussTemp});
	   		var page = parseInt(page);
	   		var option={
	   			url:MoonduDomain+'/MNews/LikeNew',
	   			data:{type:2,pageindex:page},
	   			callback:function(res){
	   			if(res.Data==""&&page<=1){
              		$("#hotDiscuss").addClass("hidden");
              		$("#noinfo").removeClass("hidden");
          		}
	   			if(res.Result==true){
	   				var data=res.Data.Rows;
	   				if(data.length>0){
	   					for(var i=0;i<data.length;i++){
	   						var template = new EJS({"text": hotDiscussTemp});
	 						hotDiscussTempHTML += template2.render(data[i]);
	   					}
	   					$("#hotDiscuss").html(hotDiscussTempHTML);
	   				}
	   				else{
	   					$("#hotDiscuss").attr("data-page","0");
	   				}
	   				$("#hotDiscuss").attr("data-loading","0");
	   				loading_hide();
	   				//判断用户头像是否为空，若是为空，则显示默认头像
	   				var item = $("#hotDiscuss").find('.list-item');
	   				for (var i = 0; i < item.length; i++) {
	   					if ($(item[i]).find(".user").find('img').attr('src') == '') {
	   						$(item[i]).find(".user").find('img').attr('src','images/user.jpg');
	   					};
	   				};
	   				//===============图片延时加载============
	   	 			//$img=$("#infoWrap").find("img.lazy");
	   	 			//$img.lazyload({ 
					// 	placeholder:"images/grey.gif",
					// 	effect: "fadeIn",
					// 	threshold : 200
					// });
				} 
	   				
	   			}
	   		}
	   		$.md.ajaxurl(option);
	   	}

		   	
		
		//==========================相册模板渲染===============================
	   	function like_photo(page){
	   		
	   		var option={
	   			url:MoonduDomain+'/photo/GetLikePhoto',
				data:{page:page,pagesize:"10"},
	   			callback:function(res){
	   				
          			if(res.Result==true){
		   				var data=res.Data.Rows;
		   				if(data==""&&page<=1){
              				$(".like_photo_area ul").addClass("hidden");
              				$("#noimg").removeClass("hidden");
          				}
		   				if(data.length>0){
		   					for(var i=0;i<data.length;i++){

		   					var template4 = new EJS({"text":photo_box});
			 				photoHTML+= template4.render(data[i]);
		   					}
		   					$("ul.clearfix").html(photoHTML);
		   				}
		   				else{
		   					$('.like_photo_area').attr("data-page","0");
		   				
		   				}
		   				$('.like_photo_area').attr("data-loading","0");
		   				


		   				//===============图片延时加载============
		   	 			//$img=$(".like_photo_area").find("img.lazy");
		   	 			//$img.lazyload({ 
						// 	placeholder:"images/grey.gif",
						// 	effect: "fadeIn",
						// 	threshold : 200
						// }); 
	   				}
	   			}
	   		}
	   		$.md.ajaxurl(option);
	   	}



		
		//=============评论模块============
		var commentLayer = $("#commentLayer");
		var commentPage = $("#comment-page");
		var $wrap = $("#hotDiscuss");
		var $top = $("#ListTop");
		var count=0;
		var userCommentHTML="";
		var num="";
		getCurrentUserInforAjax();//获取当前用户信息

		//评论页出现
		$("#hotDiscuss").on("click","span[data-type=comment]",function(){
			postId=$(this).parents('.list-item').attr('data-postid');
			$(this).parents('.list-item').addClass('current').siblings('.list-item').removeClass('current');
			num=parseInt($(this).parents('.list-item').find("sup").text());
			if(isNaN(num)==true){
				num=0;
			}
			commentPage.find("span.num").html(num);
			$("#personTop").addClass("hidden");
			$(".like_nav").addClass("hidden");
			$("#hotDiscuss").addClass("hidden");
			$top.removeClass("hidden");
			$(".find-message").removeClass("hidden");
			commentPage.removeClass("hidden");
			commentLayer.removeClass("hidden");
			//fix bug
			if (parseInt(commentPage.find('.num').text()) == 0) {
				commentPage.find('ul').html('');
			};
			if(count==0){
				$(this).addClass("cur");
				like_infoComment(1);
			}
			else{
				$("#hotDiscuss").find(".comment-num").removeClass("cur");
				$(this).addClass("cur");
				userCommentHTML="";
				commentPage.find($("#userComment")).html("");
				$('#comment-page').attr("data-page","1");
				like_infoComment();
			}
			count=count+1;
		});

		$("#commentLayer").on("click","button",function(){
			var _this=this;
			isCommentSuccessAjax(_this);
		});
		
		//================获取评论列表============
		function like_infoComment(page){
			var messageId = $wrap.find('.list-item').filter('.current').attr('data-postid');
	   		 var option={
	   			url:MoonduDomain+'/MNews/CommList',
	   			data:{action:'list_news',newid:messageId,pageindex:page,pagesize:20},
	   			callback:function(res){
		   			if(res.Result==true){
		   				var data = res.Data.Rows;
		   				if(data.length > 0){
		   					for(var i=0;i<data.length;i++){
			   					var template = new EJS({"text": userCommentTemp});
								userCommentHTML+= template.render(data[i]);
							}
			   				$("#userComment").html(userCommentHTML);
		   				}else{
		   					$("#comment-page").attr("data-page","0");
		   				}
		   				$("#comment-page").attr("data-loading","0");
		   				}
		   			}
	   		}
	   		 $.md.ajaxurl(option);
	   	}
	   	like_infoComment(1);
		//评论页消失
		function commentPageHide(){
			if($("#hotDiscuss").find(".comment-num").hasClass("cur")){
				$("#hotDiscuss").find(".cur sup").html(num);
			}
			$("#personTop").removeClass("hidden");
			$(".like_nav").removeClass("hidden");
			$("#hotDiscuss").removeClass("hidden");
			$top.addClass("hidden");
			commentPage.addClass("hidden");
			$("#commentLayer").addClass("hidden");

		}
		//发表评论
		function deliverComment(){
			var replay = commentLayer.find("textarea").val();
			var postID = parseInt($("#postID").val());
			var parms={
					time: addZero(new Date().getHours()) +":"+ addZero(new Date().getMinutes()),
					day:new Date().getFullYear() +"年" + addZero(new Date().getMonth() + 1) + "月"+ addZero(new Date().getDate())+"日",
					}
			var reurl=window.location.href;  
	        var index = reurl.lastIndexOf('/') + 1;
	        var Reurl = reurl.substring(index);
	        Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');
			var oli="<li>\
				<a href='public_home.html?id="+self.userInfor.id+"&reurl="+Reurl+"' class='left-item fl'>\
					<img class='user-icon fl' src="+userInfor.portrait+">\
				</a>\
				<span class='user'>"+userInfor.name+"</span>\
				<span class='issue-time'>  " + parms.day + "<span class='time'>  " + parms.time + "</span></span>\
				<span class='replay'><span class='content'> " + replay + "</span></span>\
			</li>";
			commentPage.find("ul").prepend(oli);
			commentLayer.find("textarea").val("");
		}
		function promptDialog(msg){
			layer.open({
		          content: msg,
		          btn: ['OK']
		      });
		}
		//判断用户发表评论是否成功
		function isCommentSuccessAjax(obj){
			var parms={
					name:userInfor.name,
					uid:userInfor.id,
					comment:commentLayer.find('textarea').val(),
					id:$wrap.find('.list-item').filter('.current').attr('data-postid')
				}
			$.trim(parms.comment) == '' ? promptDialog('亲，你还没有输入内容哦！') : success();
			function success(){
				var option={
					url:MoonduDomain+'/MNews/CommPost',
					data:{newid:parms.id,content:parms.comment},
					callback: function(res){
						if (res.Result) {
							num=num+1;
							$("#comment-page").find("span.num").html(num);
							deliverComment(parms.comment);
						}
					},
					error:function(){
					}
				}
			$.md.ajaxurl(option);	
		}
		}
		function addZero(num){
			if (num < 10) {
					num = "0" + num;
				};
			return num;
		}


		//=========================瀑布流======================================
		
		$(window).scroll(function () {

			totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

			 if ($(document).height() <= totalheight){
					cur=$(".like_style").attr("data-id");
					active_page=parseInt($('.active_area').attr("data-page"));
					active_loading=parseInt($('.active_area').attr("data-loading"));

					discuss_page=parseInt($('#hotDiscuss').attr("data-page"));
					discuss_loading=parseInt($('#hotDiscuss').attr("data-loading"));

					photo_page=parseInt($('.like_photo_area').attr("data-page"));
					photo_loading=parseInt($('.like_photo_area').attr("data-loading"));

					comment_page=parseInt($('#comment-page').attr("data-page"));
					comment_loading=parseInt($('#comment-page').attr("data-loading"));

					if(cur==0){
						if(active_page>0 && active_loading==0){
							$(".active_area").attr("data-page",active_page+1);
							$('.active_area').attr("data-loading","1");
							like_active($(".active_area").attr("data-page"));
						}
					}
					else if(cur==1){
						if(discuss_page>0 && discuss_loading==0){
							$('#hotDiscuss').attr("data-page",discuss_page+1);
							$('#hotDiscuss').attr("data-loading","1");
							like_info($("#hotDiscuss").attr("data-page"));
						}
						if(comment_page>0 && comment_loading==0){
							$('#comment-page').attr("data-page",comment_page+1);
							$('#comment-page').attr("data-loading","1");
							like_infoComment($("#comment-page").attr("data-page"));
						}
					}
					else if(cur==2){
						if(photo_page>0 && photo_loading==0){
							$('.like_photo_area').attr("data-page",photo_page+1);
							$('.like_photo_area').attr("data-loading","1");
							like_photo($(".like_photo_area").attr("data-page"));
						}
					}
				}
			});

		//============================加载显示=========================
		

		function loading_show(){
			$("body").append('<div class="loading"></div>');
		}

		function loading_hide(){
			$(".loading").remove();
		}


		//===========================获取当前时间======================
		
		function CurentTime(data){ 
	        var now = new Date();
	       
	        var year = now.getFullYear();       //年
	        var month = now.getMonth() + 1;     //月
	        var day = now.getDate();            //日
	       
	        var hh = now.getHours();            //时
	        var mm = now.getMinutes();          //分
	       
	        var clock = year + "-";
	       
	        if(month < 10)
	            clock += "0";
	       
	        clock += month + "-";
	       
	        if(day < 10)
	            clock += "0";
	           
	        clock += day + " ";
	       
	        if(hh < 10)
	            clock += "0";
	           
	        clock += hh + ":";
	        if (mm < 10) clock += '0'; 
	        clock += mm; 
	        return(clock); 
    	}
		
		



	 

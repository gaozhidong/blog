var		showInfoHTML="",
 		showInfo=document.getElementById("showInfo").innerHTML;
 		userInfoHTML="",
 		userInfo=document.getElementById("userInfo").innerHTML;
		userCommentHTML = "",
		userCommentTemp = document.getElementById("userCommentTemp").innerHTML;

var showTag="";
var showUid="";
var showUrl="";
var showPhoto=new Array();


		


		//=========================获取用户帖子图片======================
		function getPic(){
			var tag=decodeURI(showTag);
	        $.ajax({
	        url:MoonduDomain+'/photo/GetPhotoByTag',
	        type:"GET",
	        dataType:"jsonp",
	        data:{tag:tag},
	        success: function(data){ 
	            data=data.Data.Rows;
	        for(i=0;i<data.length;i++){
	            showPhoto.push(data[i].Photo);
	        }                      
	        var picList="";
	        var tagNum="";
	        for(i=0;i<showPhoto.length;i++){
	            picList+='<li><img src="'+showPhoto[i]+'"  width="100%" height="360px"></li>'             
	            $(".main_image").find("#imglist").html(picList);
	            tagNum+='<span>'+(i+1)+'/'+showPhoto.length+'</span>'
	            $(".m-show-num").html(tagNum);
	            } 
	            Slide();
	        }
	       
	    })
	}

		


		//====================星秀场选手详情模板渲染===================
		function show(){
			var id =$.getUrlVar('id');
			$.ajax({
		   		url:MshowDomain+'m_api.php',
		   		type:"GET",
		   		dataType:"jsonp",
		   		data:{action:'details',id:id},
		   		success:function(res){
		   			var data=res.Data;
		   			showTag=data.tag;
            		showUid=data.uid;
		 			var template=new EJS({"text":showInfo});
		 			showInfoHTML += template.render(data);
					$(".show_info").html(showInfoHTML);
					getPic();
		   			}
		   		})
		}

		


		
		//==================星秀场用户个人信息模板渲染=======================
		function head(){
			 var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					data:{uid:showUid},
					callback:function(res){
						var data=res.Data;
			 			var template=new EJS({"text":userInfo});
			 			userInfoHTML += template.render(data);
						$(".head_box").html(userInfoHTML);

						
					}
				}
			$.md.ajaxurl(option);
		}


show();
head();

		//==============评论内容模板渲染==============================
			var commentPage = $("#comment-page");
			var deliverCommentWarp = $("#commentLayer");
			var userInfor = {};
			//判断用户评论是否成功
			deliverCommentWarp.on("click",'button',isCommentSuccessAjax);
			function getCommentListAjax(){
				//获取帖子id
				var id = parseInt($.getUrlVar('id'));//帖子id为6525有三条评论
				var temp = new EJS({"text":userCommentTemp});
				var html = "";
				$.ajax({
					url:MshowDomain+'m_api.php',
					type:"GET",
					dataType:"jsonp",
					data:{action:'comments_list',id:id},
					success:function(res){
						if (!res.Result) return;
						for(var i=0;i<res.Data.length;i++){
			 				html += temp.render(res.Data[i]);
			 			}
			 			$("#userComment").html(html);
			 			getCommentUserPortraitAjax();
					}
				});
			}
			//判断当前用户评论是否成功
			function isCommentSuccessAjax(){
				var parms={
					name:userInfor.name,
					uid:userInfor.id,
					comment:deliverCommentWarp.find('textarea').val(),
					postId:parseInt($.getUrlVar('id'))
				}
				$.ajax({
					url:MshowDomain+'mact_api.php',
					type:"GET",
					data:{action:'comment_post',id:parseInt(parms.postId),author:parms.name,url:parms.uid,comment:parms.comment},
					dataType:"jsonp",
					success: function(res){
						if (res.Result) {
							addComment(parms.comment);
						}
					},
					error:function(){
					}
				});
			}
			function addZero(num){
				if (num < 10) {
					num = "0" + num;
				};
				return num;
			}
			//添加评论
			// function addComment(content){
			// 	var parms={
			// 		time:addZero(new Date().getHours()) +":"+addZero(new Date().getMinutes()),
			// 		day:new Date().getFullYear() +"年" + addZero(new Date().getMonth() + 1) + "月"+addZero(new Date().getDate())+"日",
			// 	}
			// 	var oli="<li><img class='user-icon fl' src="+ userInfor.portrait+"><span class='user'>"+userInfor.name+"</span><span class='issue-time'>  " + parms.day + "<span class='time'>  " + parms.time + "</span></span><span class='replay'><span class='content'> " + content + "</span></span></li>";
			// 	commentPage.find("ul").prepend(oli);
			// }
			//获取用户头像
			function getCommentUserPortraitAjax(){
				$.ajax({
					url:MoonduDomain +'/Found/ListUsers',
					type:"GET",
					dataType:"jsonp",
					data:{uid:'32357456,32357432,32357490'},
					success:function(res){
						if (!res.Result) return;
						for (var i = 0; i < res.Data.length; i++) {
							commentPage.find("ul").find("li").find("img").attr("src",res.Data[0].Image);
						};
					}
				});
			}
			//获取当前用户信息
			function getCurrentUserInforAjax(){
				$.ajax({
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					type:"GET",
					dataType:"jsonp",
					success:function(res){
						if (res.Result) {
							userInfor.id = res.Data.Uid;
							userInfor.name = res.Data.UserNick;
							userInfor.portrait = res.Data.Image;
						};
					}
				});
			}
			getCurrentUserInforAjax();
			getCommentListAjax();
		//分享下载链接
		$("#show_share_link").find('a').bind('click',shareUserInformationAjax);
		//判断是安卓手机还是苹果手机
		function shareLink(){
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
		//获取当前用户的id
		function shareUserInformationAjax(){
			var uid = userInfor.id;
			$.ajax({
					url:MoonduDomain + '/Home/ShareUserInfos',
					type:"GET",
					dataType:"jsonp",
					data:{uid:uid},
					success: function(res){
						if (res.Result) {
							shareLink();
						};
					},
					error:function(){
					}
				});
		}
		//===========================获取当前时间======================
		
		function CurentTime(data)
    	{ 
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
		//=================星秀场单页落地滑动效果=============
	function Slide(){

			$(".main_visual").hover(function(){
			$("#btn_prev,#btn_next").fadeIn()
			},function(){
			$("#btn_prev,#btn_next").fadeOut()
			})
		$dragBln = false;
		$(".main_image").touchSlider({
			flexible : true,
			speed : 200,
			btn_prev : $("#btn_prev"),
			btn_next : $("#btn_next"),
			paging : $(".flicking_con span"),
			counter : function (e) {
				$(".flicking_con span").removeClass("on").eq(e.current-1).addClass("on");
			}
		});
		$(".main_image").bind("mousedown", function() {
			$dragBln = false;
		})
		$(".main_image").bind("dragstart", function() {
			$dragBln = true;
		})
		$(".main_image a").click(function() {
			if($dragBln) {
				return false;
			}
		})
		timer = setInterval(function() { $("#btn_next").click();}, 5000);
		$(".main_visual").hover(function() {
			clearInterval(timer);
		}, function() {
			timer = setInterval(function() { $("#btn_next").click();}, 5000);
		})
		$(".main_image").bind("touchstart", function() {
			clearInterval(timer);
		}).bind("touchend", function() {
			timer = setInterval(function() { $("#btn_next").click();}, 5000);
		})



	}

		
		
			

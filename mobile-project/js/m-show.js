	var	showInfoHTML="",
 		showInfo=document.getElementById("showInfo").innerHTML;
 		userInfoHTML="",
 		userInfo=document.getElementById("userInfo").innerHTML;
		userCommentHTML = "",
		userCommentTemp = document.getElementById("userCommentTemp").innerHTML;

	var showUrl="";
	var showPhoto=new Array();
	var id =$.getUrlVar('id');

	var showId = '',
		showTitle = '',
		showContent = '';
	var uid =$.getUrlVar('uid');
	var commentInfor = {};
	commentInfor.page = 1;
	commentInfor.commentCallAjax = true;

		//==================星秀场用户个人信息模板渲染=======================
		function head(){
			 var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					data:{uid:uid},
					callback:function(res){
						
						if (res.Result == "nologin") {
							$.alert("请您重新登录！");
							location.href = "login_after.html";
						};
						if(res.Data==null){
							$.alert("没有找到该用户.")
						};
						if(res.Result){
							var data=res.Data;
				 			var template=new EJS({"text":userInfo});
				 			userInfoHTML += template.render(data);
							$(".head_box").html(userInfoHTML);

							show();
							//=============投票=======
							$(".user_show_wrap").one("click",".voteWrap",function(){
								showVote();
							})

							//=========================返回上一级页面====================
							$(".main_visual").on("click","a.back_ico",function(){
								str2=$.getUrlVar('reurl');			
								str2 = str2.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');			
								window.location.href = str2;
							})
							
						}
						

						
					}
				}
			$.md.ajaxurl(option);
		}

		head();


		//====================星秀场选手详情模板渲染===================	

		function show(){
			
			var option={
		   		url:MoonduDomain+'/Mshow/Details',
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
						title();
						//获取用户帖子图片
						var photoArray=data.Photols;
				        for(i=0;i<photoArray.length;i++){
				            showPhoto.push(photoArray[i].PHOTO);
				        }                      
				        var picList="";
				        var tagNum="";
				        for(i=0;i<showPhoto.length;i++){
				            picList+='<li><img src="'+showPhoto[i]+'"  width="100%" height="360px"></li>'             
				            $(".main_image").find("#imglist").html(picList);
				            tagNum+='<span>'+(i+1)+'/'+showPhoto.length+'</span>'
				            $(".m-show-num").html(tagNum);
				        }
				        if(showPhoto.length==1){
				        	$(".flicking_inner").find("span").css("display","block");
				        	$("#imglist").css("width","100%");
				        }else{
				        	Slide();
				        } 

						//getPic();
			   			}
		   			}
		   		}
		   		$.md.ajaxurl(option);
		}
		
		
		
		function shareWebsiteLink(){
			TakePhoto.prototype.takePhoto(
    			'share',
    			function(r){
    				
    			},
    			function(e){console.log(e);},
    		[{"sharetitle":showTitle,"sharecontent":showContent,"shareurl":MZoneDomain + "T-show-choice.html?id="+showId+"&uid="+uid+""}]);
		}
		


		//==========投票ajax========
		function showVote(){
			var option={
				url:MoonduDomain+'/Mshow/MshowVote',
				data:{SignupID:id,ActivityType:1},	
				callback: function(data){
					if(data.Result==true){
						var $this=$(".user_show_wrap").find(".voteWrap");
						var x=$(".vote_num").html();
						x=parseInt(x)+1;
						$(".vote_num").html(x);
						$this.removeClass("voteWrap").addClass("hasvoteWrap");
						$this.find("p").html("已投票");
						$.alert("投票成功")
					}
					else{
						$.alert("投票失败")
					}
				}				
			}
			$.md.ajaxurl(option);
		}
		
		
		
	//========标题============
	function title(){
       $.ajax({
            url:MoonduDomain+'/Mshow/GetCurrMshow',
            type:"GET",
            dataType:"jsonp",
            success:function(data){
                var title=data.Data.Title; 
                $(".show_info h2").html(title);
            }
       })
    }



		//==============评论内容模板渲染==============================
			var commentPage = $("#comment-page"),
				deliverCommentWarp = $("#commentLayer"),
				userInfor = {},
				commentList = [];

			function getCommentListAjax(page){
				var id = parseInt($.getUrlVar('id')),
					temp = new EJS({"text":userCommentTemp}),
					html = "";
				var option={
					url:MoonduDomain+'/Mshow/CommentList',
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
			function promptDialog(msg){
				layer.open({
			          content: msg,
			          btn: ['OK']
			      });
			}
			//评论
			function isCommentSuccessAjax(){
				var parms={
					name:userInfor.name,
					uid:userInfor.id,
					id:parseInt($.getUrlVar('uid')),
					comment:deliverCommentWarp.find('textarea').val(),
					postId:parseInt($.getUrlVar('id')),
					height:$(".main_visual").height() + $('.user_show_wrap').height()
				}
				$.trim(parms.comment) == '' ? promptDialog('亲，你还没有输入内容哦！') : success();
				function success(){
					var option={
						url:MoonduDomain+'/Mshow/CommentPost',
						data:{id:id,comment:parms.comment,author:parms.name},
						callback: function(res){
							if (res.Result) {
								addComment(parms.comment);
								$(document).trigger("scroll");
			            		$(document).scrollTop(parms.height);
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
			//添加评论
			function addComment(content){
				var parms={
					time:addZero(new Date().getHours()) +":"+addZero(new Date().getMinutes()),
					day:new Date().getFullYear() +"年" + addZero(new Date().getMonth() + 1) + "月"+addZero(new Date().getDate())+"日",
				}
				var reurl=window.location.href;  
		        var index = reurl.lastIndexOf('/') + 1;
		        var Reurl = reurl.substring(index);
		        Reurl=Reurl.replaceAll('?','||').replaceAll('=','__').replaceAll('&','#');

				var oli="<li>\
						<a href='public_home.html?id="+self.userInfor.id+"&reurl="+Reurl+"' class='left-item fl'>\
							<img class='user-icon fl' src='"+userInfor.portrait+"'>\
						</a>\
						<div class='right-item'>\
					       <span class='user'>"+this.userInfor.name+"</span>\
					       <span class='time'>今天："+parms.time+"</span>\
					       <p class='replay'>"+content+"</p>\
					    </div>\
					</li>";
				commentPage.find("ul").prepend(oli);
				//评论数量增加
				var xcount = commentPage.find('ul').find('li').size();
			 	commentPage.find("span.num").text(xcount);
			 	$("#commentLayer").find("textarea").val("");
			}
			//获取当前用户信息
			function getCurrentUserInforAjax(){
				var option={
					url:MoonduDomain+'/UserCenter/GetUserInfo',
					callback:function(res){
						if (res.Result) {
							userInfor.id = res.Data.Uid;
							userInfor.name = res.Data.UserNick;
							userInfor.portrait = res.Data.Image;
							//判断用户头像是否为空，若是为空，显示默认头像
							if (userInfor.portrait == '' || userInfor.portrait == undefined || userInfor.portrait == null) {
								userInfor.portrait = 'images/user.jpg';
							};
							//点击分享链接
							$('.main_visual').find('a.share').bind('click',shareWebsiteLink);
							if ($('body').attr('data-type') == 'T_show') {
								deliverCommentWarp.on("click",'button',shareLink);
							}else{
								deliverCommentWarp.on("click",'button',isCommentSuccessAjax);
							}
						};
						if (!res.Result) {
							$.alert("请您登录再评论！");/////////////以后做修改
							return;
						};
					}
				}
				$.md.ajaxurl(option);
			}
			getCurrentUserInforAjax();

			getCommentListAjax(commentInfor.page);
			$(window).scroll(function(){
				if ($(document).scrollTop() + $(window).height() + 20 >= $(document).height()){
					 if (commentInfor.page == -1) return;
					 commentInfor.page ++;
					 if (commentInfor.page > 1) {
					 	if (!commentInfor.commentCallAjax) return;
					 		commentInfor.commentCallAjax = false;
					 		getCommentListAjax(commentInfor.page);
					 }
				}

			})
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
				//alert("winphone手机");
				 //window.location.href = "http://www.zoon.moonbasa.com/";
			}
		}
		//获取当前用户的id
		function shareUserInformationAjax(){
			var uid = userInfor.id;
			var option={
					url:MoonduDomain + '/Home/ShareUserInfos',
					data:{uid:uid},
					callback: function(res){
						if (res.Result) {
							shareLink();
						};
					},
					error:function(){
					}
				}
				$.md.ajaxurl(option);
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

		
		
			

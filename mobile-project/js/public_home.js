var
		     html="",
			 showHTML="",
		     dreamHTML="",
			 activeHTML="",
			 photoListHTML="",
    	     photoList=document.getElementById("photoList").innerHTML,
			 public_top=document.getElementById("public_top").innerHTML,
			 show_box=document.getElementById("show_box").innerHTML,
		     dreamTemp=document.getElementById("dreamTemp").innerHTML,
		     active_box=document.getElementById("active_box").innerHTML;

		var id =$.getUrlVar('id'); 
		var SignupID="";
		var myDreamWrap = $('#myDream');
		var pidArr=new Array();
		 var parseId="";
		 var indexPid="";


						public_home_top(1);
						public_home_show(1);
						public_home_dream(1);
						photo_list(1);
						public_home_active(1);
						//==========返回上一级页面==========

				        $(".public_home_top").on("click",".p_top_ico",function(){
				            str2=$.getUrlVar('reurl');		
							str2 = str2.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');		
							window.location.href = str2;
				        })

				        //===========TA主页加关注==========
						$(".public_home_top").on("click",".public_add_attention",function(){				
							focuAjax();
						})

						//===========TA主页取消关注========
						$(".public_home_top").on("click",".hasAtten",function(){	
							cancleAjax();
						})

						//===========TA主页加入黑名单==========
						$(".public_home_top").on("click",".public_add_black",function(){				
							addAjax();
						})

						//===========TA主页移除黑名单========
						$(".public_home_top").on("click",".hasadd",function(){	
							removeAjax();
						})

						//==============给TA投票===========

						$(".p_show").on("click",".p_btn_bottom",function(){				
							vote();
						})

						
						//点赞
						$('#myDream').on('click','a.love',praiseAjax);

						//再次点赞
						$("#myDream").on("click","a.love-after",function(){
							$.alert("已经点过赞");
						})




		//===========头部模板渲染=======================
		
		function public_home_top(page){
			var option={
				url:MoonduDomain+'/UserCenter/GetUserInfo',
				data:{uid:id},
				callback:function(res){
					if(res.Result=='nologin'){
						homeBtop(1);
					}
					else if(res.Result==true){
						var data=res.Data;
						var template = new EJS({"text": public_top});
						html += template.render(data);
						$(".public_home_top").html(html);
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
					else{
						$.alert("没有找到该用户.")
					}
					
				}
			}
			$.md.ajaxurl(option);
		}

		//=========未登录的主页========
		
		function homeBtop(page){
			var option={
				url:MoonduDomain+'/UserCenterB/GetUserInfo',
				data:{uid:id},
				callback:function(res){
					if(res.Result==true){
						var data=res.Data;
						var template = new EJS({"text": public_top});
						html += template.render(data);
						$(".public_home_top").html(html);
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
					else{
						$.alert("没有找到该用户.")
					}
					
				}
			}
			$.md.ajaxurl(option);
		}

		//=========关注ajax========
		function focuAjax(){
		    var option = {
		        url: MoonduDomain + '/Found/MFocus',
		        data: { fansid: id, flag: 0 },
		        callback: function (res) {
		        	if(res.Result !="nologin" && res.Result==false){
		        		 $.alert(res.Msg);			
						}
		            else if (res.Result == true) {
		                var $this = $(".public_home_top").find("#Focus").find("a");
		                $this.removeClass("public_add_attention").addClass("hasAtten");
		                $this.text("已关注");
		                var x = $("#att_num").html();
		                x = parseInt(x) + 1;
		                $("#att_num").html(x);
		            }
		            else{
		            	$.login("是否登录");
		            }
		        }
		    }
				$.md.ajaxurl(option);
		}

		//=======取消Ajax======
		function cancleAjax(){
			var option={
					url:MoonduDomain+'/Found/MFocus',
					data:{fansid:id,flag:1},
					callback: function(res){
						if(res.Result !="nologin" && res.Result==false){
		        		 $.alert(res.Msg);			
						}
						else if(res.Result==true){
							var $this=$(".public_home_top").find("#Focus").find("a");
							$this.removeClass("hasAtten").addClass("public_add_attention");
							$this.text("+关注");
						  	var x=$("#att_num").html();
							x=parseInt(x)-1;
							$("#att_num").html(x);
						}
						else{
							$.login("是否登录");
						}
					}					
				}
			$.md.ajaxurl(option);	
		}

		//==========加入黑名单ajax=======
		function addAjax(){
		    var option = {
		        url: MoonduDomain + '/Found/MBlacklist',
		        data: { ToID: id, flag: 0 },
		        callback: function (res) {
		        	if(res.Result !="nologin" && res.Result==false){
		        		 $.alert(res.Msg);			
						}
		            else if (res.Result == true) {
		                var $this = $(".public_home_top").find("#black").find("a");
		                $this.removeClass("public_add_black").addClass("hasadd");
		                $this.text("移除黑名单");
		            }
		            else {
		               $.login("是否登录");
		            }
		        }
		    }
				$.md.ajaxurl(option);
		}

		//============移除黑名单ajax============
		function removeAjax(){
		    var option = {
		        url: MoonduDomain + '/Found/MBlacklist',
		        data: { ToID: id, flag: 1 },
		        callback: function(res){
						if(res.Result !="nologin" && res.Result==false){
		        		 $.alert(res.Msg);			
						}
						else if(res.Result==true){
							var $this=$(".public_home_top").find("#black").find("a");
							$this.removeClass("hasadd").addClass("public_add_black");
							$this.text("加入黑名单");
						}
						else {
		                	$.login("是否登录");
		            	}
					}			
		    }
				$.md.ajaxurl(option);
		}


		//========投票ajax========
		function vote(){
			var option={
				url:MoonduDomain+'/Mshow/MshowVote',
				data:{SignupID:SignupID,ActivityType:1},	
				callback: function(data){
					if(data.Result=="nologin"){
							$.login("是否登录");
						}
					if(data.Result==true){
						var $this=$(".p_show").find(".show_tags").find("a");
						$this.removeClass("p_btn_bottom").addClass("hasVoted");
						$this.text("已投票");
						var x=$("#vote_num").html();
						x=parseInt(x)+1;
						$("#vote_num").html(x);
					}
					else{
						$.alert("投票失败")
					}
				}				
			}
			$.md.ajaxurl(option);	
		}
	


		//================星秀场模板渲染==================

		function public_home_show(page){
			var option={
				url:MoonduDomain+'/MshowB/Details',
				data:{uid:id},
				callback: function(data){
					if(data.Result==false){
						 $(".showBox").addClass("hidden");
				         $("#noshow").removeClass("hidden");
				         $(".p_show").css("background","#ededed");
					}
					if(data.Result==true){             		
						var data=data.Data;
						var template2 = new EJS({"text": show_box});
						showHTML+=template2.render(data);
						$(".showBox").html(showHTML);
						SignupID=data.Id;
          			}
				}		
			}
			$.md.ajaxurl(option);
		}


		

		//==============梦话模板渲染======================
		function public_home_dream(page){
			var option={
				url:MoonduDomain+'/PhotoB/GetUsePhotoByUid',
				data:{uid:id,page:page},
				callback: function(res){
					var data=res.Data.Rows;

					if(data==""&&page<=1){
			            $(".item-wrap").addClass("hidden");
			            $("#nodream").removeClass("hidden");
          			}

					if(data.length>0){
						for(var i=0;i<data.length;i++){
							var template = new EJS({"text": dreamTemp});
							dreamHTML+= template.render(data[i]);
							pidArr.push(data[i].Pid);
						}
						indexPid=pidArr.toString();
						
						//页面渲染时的点赞状态
						isPraiseAjax();	
						$(".item-wrap").html(dreamHTML);
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
					loading_hide();
				}	
			}
			$.md.ajaxurl(option);
		}
		//页面刚渲染的点赞状态
		
		function isPraiseAjax(){
			var option={
			 	 url:MoonduDomain+'/photo/GetLikedPhoto',
				 data:{pid:indexPid},
			     callback: function(res){ 
			     	if (res.Result==true) {
			     		for (var i = 0; i < res.Data.length; i++) {
			     			parseId=res.Data[i].Pid;
							$(".love[data-type='"+parseId+"']").removeClass("love").addClass("love-after");
			     		}
			     	};
			    }
			 }
			 $.md.ajaxurl(option);
		}
		

		function praiseAjax(e){
			var target = e.target;
			var pid = $(target).parents('.item').attr('data-pid');
			var option={
			 	 url:MoonduDomain+'/photo/OptLike',
			     data:{pid:pid,otype:0},
			     callback: function(res){ 
			     	if(res.Result=="nologin"){
							$.login("是否登录");
						}
			     	if (res.Result==true) {
			     		$(target).addClass('love-after').removeClass('love');
			     	}
			    }
			}
			$.md.ajaxurl(option);
		}

		//==============相册模板渲染=====================
		
		function photo_list(page){
		    var option={
			    url:MoonduDomain+'/photoB/GetUserTagByUid',
			    data:{uid:id,page:page,pagesize:10},
			    callback: function(data){ 
			    if(data.Result==true){     
			        data=data.Data.Rows;

			        if(data==""&&page<=1){
				            $("#photoWrap").addClass("hidden");
				            $("#nophoto").removeClass("hidden");
	          			}

			        if(data.length>0){
			            for(var i=0;i<data.length;i++){
			                    var template=new EJS({"text":photoList});
			                    photoListHTML += template.render(data[i]);
			                }
			                 $(".like_photo_area ul").html(photoListHTML);
			             
			        }
			        else{
			            $("#photoWrap").attr("data_page","0");
			        }
			           $("#photoWrap").attr("data-loading","0");
			        loading_hide();
			        
			    }
		    }
			}
			$.md.ajaxurl(option);
		}



		//===========活动模板渲染=====================

		function public_home_active(page){
			var option={
				url:MoonduDomain+'/MNewsB/MyActiv',
				data:{uid:id,pageindex:page},
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
						  	var template= new EJS({"text": active_box});
		 					activeHTML+= template.render(data[i]);
						} 
					$(".active_area").html(activeHTML);
					}
					else{
						$(".active_area").attr("data-page","0");
					}

					$(".active_area").attr("data-loading","0");
					
					 loading_hide(); 

					}
				}
			}
			$.md.ajaxurl(option);
		}

		

		//====================瀑布流======================
			$(window).scroll(function () {

			totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

			 if ($(document).height() <= totalheight){

				
				cur=$(".like_style").attr("data-id");
				dream_page=parseInt($('.item-wrap').attr("data-page"));
				dream_loading=parseInt($('.item-wrap').attr("data-loading"));

				photo_page=parseInt($('#photoWrap').attr("data-page"));
				photo_loading=parseInt($('#photoWrap').attr("data-loading"));

				active_page=parseInt($('.active_area').attr("data-page"));
				active_loading=parseInt($('.active_area').attr("data-loading"));

				if(cur==1){
					if(dream_page>0 && dream_loading==0){
						$(".item-wrap").attr("data-page",dream_page+1);
						$('.item-wrap').attr("data-loading","1");
						public_home_dream($(".item-wrap").attr("data-page"));
					}
				}
				else if(cur==2){

					if(photo_page>0 && photo_loading==0){
						$('#photoWrap').attr("data-page",photo_page+1);
						$('#photoWrap').attr("data-loading","1");
						photo_list($('#photoWrap').attr("data-page"));
					}
				}
				else if(cur==3){
					if(active_page>0 && active_loading==0){
						$('.active_area').attr("data-page",active_page+1);
						$('.active_area').attr("data-loading","1");
						public_home_active($('.active_area').attr("data-page"));
					}
				}
			}
		});


			function loading_show(){
				$("body").append('<div class="loading"></div>');
			}

			function loading_hide(){
				$(".loading").remove();
			}


			//个人中心导航栏tab切换
		$('.public_nav_box a').click(function(){
			var cur=$(this).index();
			$(this).addClass('like_style').siblings('a').removeClass('like_style');
			$('.p_container').eq(cur).show().siblings('div').hide();
		});
			



	

	var	defaultBoxHTML="",
		default_box= document.getElementById("default_box").innerHTML,
	    scroll_box= document.getElementById("scroll_box").innerHTML;

	 var pidArr=new Array();
	 var indexPid="";
	 var parseId="";
	top_html= new EJS({url: 'views/includes/top'}).render();
	$(".index").before(top_html);



//================默认渲染模板====================
	function index_list(page){
		var index_html="";
		var template1=new EJS({"text":default_box});
		var option={
			url:MoonduDomain+'/MNews/IndexNews',
			data:{cmsid:6},
			callback: function(data){
				var data=data.Data.Rows;
				for(var i=0;i<data.length;i++){
					if(data[i]==null){
					}else{
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
				$('#infoList').on('click','a.u_share',shareNewsLink);
			}
	}
	$.md.ajaxurl(option);
}

//=================循环渲染模板====================
	function index_scroll(page){
		var	scrollBoxHTML = "";
		var option={
			url:MoonduDomain+'/photo/GetPhotoIndex',
			data:{page:page},
			callback: function(data){
				if(data.Data==null){
				}
				else{
				var data=data.Data.Rows;
				if(data.length>0){
					for(var i=0;i<data.length;i++){
				 		var template=new EJS({"text":scroll_box});
				 		scrollBoxHTML += template.render(data[i]);
				 		pidArr.push(data[i].Pid);
			 		}
			 		indexPid=pidArr.toString();
			 		indexInfo();
					$("ul.index_scroll").append(scrollBoxHTML);
					var item=$(".index_scroll").find(".u_head");
					for(var i=0;i<item.length;i++){
						if(data[i].UserInfo.Image==""||data[i].UserInfo.Image=="http://zoneimages.moonbasa.com/images/user.jpg"){ 
							$(item[i]).find('img').attr('src','images/user.jpg');
						}
					}               

		            $('#ListScroll').on('click','a.u_share',shareActivity);

				}
				else{
					$('ul.index_scroll').attr("data-page","0");
				}
				$('ul.index_scroll').attr("data-loading","0");
				
			}
		}
		}
		$.md.ajaxurl(option);
	}
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
						img.className = "ios";
					}else{
						window.location="http://mzone.moonbasa.com/index.html";
					}
				}else if (browser.versions.android) {
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						$(".app").removeClass("hidden");
						img.className = "android";
					}else{
						window.location = "http://static.moonbasa.com/zone/moonbasa.zone_1.0.apk";
					}		
				}
	}
	//分享资讯
	function shareNewsLink(e){
		var target = e.target;
		var pid = $(target).parents('li').attr('data-pid');
		var title = $(target).parents('li').find('input[data-type=title]').val();
		var content = $(target).parents('li').find('input[data-type=content]').val();
		TakePhoto.prototype.takePhoto(
			'share',
			function(r){
				
			},
			function(e){console.log(e);},
		[{"sharetitle":title,"sharecontent":content,"shareurl":MZoneDomain+"T_massage.html?id="+pid+""}]);
	}
	//分享活动
	function shareActivity(e){
		var target = e.target;
		var pid = $(target).parents('li').attr('data-pid');
		var title = $(target).parents('li').find('input[data-fn=title]').val();
		var content = $(target).parents('li').find('input[data-fn=content]').val();
		TakePhoto.prototype.takePhoto(
			'share',
			function(r){
				
			},
			function(e){console.log(e);},
		[{"sharetitle":title,"sharecontent":content,"shareurl":MZoneDomain+"T_viewPhptos.html?pid="+pid+""}]);

	}
	function indexInfo(){
		$.ajax({
				url:MoonduDomain+'/photo/GetLikedPhoto',
				type:"GET",
				data:{pid:indexPid},
				dataType:"jsonp",
				success: function(res){
					if (res.Result) {
						data=res.Data;
						for(i=0;i<data.length;i++)
						{
							parseId=data[i].Pid;
							var havePid=$("#ListScroll").find("a.u_like").attr("data-type");
							var temp='<a class="u_like_red" data-type="<%=Pid%>"><em><%=Like_Count%></em></a>';
							$(".u_like[data-type='"+parseId+"']").removeClass("u_like").addClass("u_like_red");
						}
					};
				},
				error:function(){
				}
			});

	}

index_list(0);
index_scroll(1);


	$("#activity_share_link").find("a").bind("click",function(){
		shareLink();
	});

	//==============点赞和取消点赞===================

    var ListScroll = $("#ListScroll");
    var infoList= $("#infoList");

    ListScroll.on("click","a.u_like",function(){
    	var _this=this;
    	praiseAjax(_this);
    });
    infoList.on("click","a.u_like",function(){
    	var _this=this;
    	InfoAjax(_this);
    });
    ListScroll.on("click","a.u_like_red",function(){
    	$.alert("已经点过赞");
    });
    infoList.on("click","a.u_like_red",function(){
    	$.alert("已经点过赞");
    });

	 //首页推荐列表
	    function InfoAjax(obj){
	    	var pitureId = $(obj).attr("data-type");
	    	var option={
				url:MoonduDomain+'/MNews/MNewLike',
				data:{newid:pitureId},
				callback: function(res){
					if (res.Result) {
						var xcount = parseInt($(obj).parent().find("em").text());
				    	$(obj).removeClass("u_like").addClass("u_like_red");
				    	xcount ++;
				    	$(obj).parent().find("em").text(xcount);
					};
				},
				error:function(){
				}
			}
			$.md.ajaxurl(option);
	    }
   

	 //循环列表
    function praiseAjax(obj){
    	var pitureId = $(obj).attr("data-type");
    	var option={
			url:MoonduDomain+'/photo/OptLike',
			data:{otype:0,pid:pitureId},
			callback: function(res){
				if (res.Result) {
					var xcount = parseInt($(obj).parent().find("em").text());
			    	$(obj).removeClass("u_like").addClass("u_like_red");
			    	xcount ++;
			    	$(obj).parent().find("em").text(xcount);
				};
			},
			error:function(){
			}
		}
		$.md.ajaxurl(option);
    }




   


		//=========================瀑布流======================================
		
		$(window).scroll(function () {

			totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

			 if ($(document).height() <= totalheight){

				page=parseInt($('ul.index_scroll').attr("data-page"));
				loading=parseInt($('ul.index_scroll').attr("data-loading"));

				if(page>0 && loading==0){
					$("ul.index_scroll").attr("data-page",page+1);
					$('ul.index_scroll').attr("data-loading","1");
					index_scroll($("ul.index_scroll").attr("data-page"));
				}

			}
		});



		//======================点击便签进入标签页===================
		$(".newList").on("click",".indexTag",function(){			
			photoTag();
		})

		function photoTag(){

			var id =$.getUrlVar('id');
			console.log(id);
			$.ajax({
			    url:MoonduDomain+'/photo/GetPhotoByTag',
			    type:"GET",
			    dataType:"jsonp",
			    data:{tag:id,page:1,pagesize:10},
			    success: function(data){			       
			        if(data.Result==true){

			        }
			    }
			});
		}
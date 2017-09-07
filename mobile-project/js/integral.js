
var	couponHTML="",
	changeHTML="",
	interHTML="",
	integralTemp=document.getElementById("integralTemp").innerHTML,
	changeTemp=document.getElementById("changeTemp").innerHTML,
	couponTemp=document.getElementById("couponTemp").innerHTML;
var	uid="";
var Mb="";
var gid="";
var cid="";
var quantity="";
var count="";
	function integral(){

		var option={
				url:MoonduDomain+'/UserCenter/GetUserInfo',
				callback:function(res){
					if (res.Result == "nologin") {
						$.login("是否登录");
					};
					if(res.Result==true){
						var data=res.Data;
					   	uid=data.Uid;
					   	Mb=data.Mb;
					   	gid=data.Gids;
					   	var template = new EJS({"text": integralTemp});
						interHTML+= template.render(data);
						$("ul.interList").html(interHTML);


						//===========所在帮派==============
					  	if(gid.indexOf(40)>-1){
					  		$(".interList").find("#camp").find("span").append(" 星秀场 ");
					  	}
					  	if(gid.indexOf(41)>-1){
					  		$(".interList").find("#camp").find("span").append(" 搭配帮 ");
					  	}
					  	if(gid.indexOf(42)>-1){
					  		$(".interList").find("#camp").find("span").append(" 设计党 ");
					  	}
				  	
						exchange(1);

						$(".integral_nav").on("click","li",function(){
							var cur=$(this).index();
							$(".click").eq(cur).removeClass("hidden").siblings("div").addClass("hidden");
							if(cur==1){
								$(".arrow-down").css("left","48%");
								if(count==0){
									coupon(1);
								}else{
									couponHTML="";
									//$(".couponBox").html("");
									$(".couponBox").attr("data-page","1");
									coupon();
								}
								count=count+1;
							}
							else if(cur==2){
								$(".arrow-down").css("left","82%");
								$(".beanNum span").html(Mb);
							}
							else{
								$(".arrow-down").css("left","15%");
							}
						})

						$("#dialog").on("click","footer",function(){
							$("#dialog").addClass("hidden");
						})

						$(".nocoupon").on("click","#goExchange",function(){
							$(".arrow-down").css("left","82%");
							$(".beanNum span").html(Mb);
							$(".couponBox").addClass("hidden").siblings(".MbeanBox").removeClass("hidden");
						})

						$(".integralBox").on("click","#go",function(){
							$(".arrow-down").css("left","82%");
							$(".beanNum span").html(Mb);
							$(".integralBox").addClass("hidden").siblings(".MbeanBox").removeClass("hidden");
						})


					}
			   		
					
		 		}
		}
		$.md.ajaxurl(option);		
	}


	integral();		


	function coupon(page){
	    var option={
			   	url:MoonduDomain+'/UserCenter/GetMyCopan',
			   	data:{page:page,pagesize:10},
			   	callback:function(data){		   		
			   		var data=data.Data.Rows;
			   		if(data.length>0){
			   			for(var i=0;i<data.length;i++){
						   	var template = new EJS({"text": couponTemp});
							couponHTML+= template.render(data[i]);
						}
						$(".couponBox").html(couponHTML);
			   		}
			   		else{
			   			$(".couponBox").attr("data-page","0");
			   		}

			   		$(".couponBox").attr("data-loading","0");
			   		loading_hide();
				   	
				if(data.length==0){
					$(".nocoupon").removeClass("hidden");
				}

			 }
		}
		$.md.ajaxurl(option);
	}

	function exchange(page){
		var option={
		   	url:MoonduDomain+'/UserCenter/GetLsCoupan',
		   	data:{page:page,pagesize:20},
		   	callback:function(data){
		   		if(data.Result==true){
		   			var data=data.Data.Rows;
				   	for(var i=0;i<data.length;i++){
					   	var template = new EJS({"text": changeTemp});
						changeHTML+= template.render(data[i]);
					}
					$(".beanWrap").html(changeHTML);
		   		}
		   		
		 	}
		}
		$.md.ajaxurl(option);
	}

	function exMb(){
		var option={
		   	url:MoonduDomain+'/UserCenter/CoupanExChange',
		   	data:{uid:uid,cid:cid},
		   	callback:function(res){		   		
		   		if(res.Result==true){		
		   			var remain= $(".beanNum span").html();
		   			var num=remain-quantity;
		   			$("#dialog").removeClass("hidden").find("hgroup").html("兑换成功！");
		   			$(".beanNum span").html(num);
		   			$(".integralBox").find("#mb").html(num);

		   		}
		   		else{
		   			$("#dialog").removeClass("hidden").find("hgroup").html("兑换失败！");
		   		}
		 	}
		}
		$.md.ajaxurl(option);
	}

	$(".beanWrap").on("click",".exRight",function(){
		cid=$(this).attr("id");
		quantity=$(this).find(".msize span").html();		
		exMb();
	})







 //=========================瀑布流======================================
		
		$(window).scroll(function () {

			totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

			 if ($(document).height() <= totalheight){

				
				var page=parseInt($('.couponBox').attr("data-page"));
				var loading=parseInt($('.couponBox').attr("data-loading"));

				if(page>0 && loading==0){
					$(".couponBox").attr("data-page",page+1);
					$('.couponBox').attr("data-loading","1");
					coupon($(".couponBox").attr("data-page"));
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





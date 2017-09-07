
var html="",
	activeTemp=document.getElementById("activeTemp").innerHTML;
	//==================我的活动模板渲染=======================
function active_list(page){
	$.ajax({
	url:MshowDomain+'mact_api.php',
	type:"GET",
	dataType:"jsonp",
	data:{action:'myactiv',uid:'31928116',page:page},
	success: function(data){
		 data=data.Data;
		  if(data.length>0){
			  	for(var i=0; i<data.length;i++) 
			  	{
			  		var template = new EJS({"text": showTemp});
					html += template.render(data[i]);
			    } 
			    $(".active_area").append(html);

		  }
		  else{
		  	$(".active_area").attr("data-page","0");

		  }
		  $(".active_area").attr("data-loading","0");
		  loading_hide(); 
		   
		}
});
}

active_list(1);


//=====================我的活动瀑布流=============================
$(window).scroll(function(){
	totalheight= parseFloat($(window).height()) + parseFloat($(window).scrollTop());
	if($(document).height()<=totalheight){
		 page=parseInt($(".active_area").attr("data-page"));
		 loading=parseInt($(".active_area").attr("data-loading"));
		if(page>0 && loading==0){
			page++;
			$(".active_area").attr("data-loading","1");
			active_list(page);
		}
	}
});


//===================加载显示=====================================


function loading_show(){

	$('body').append('<div class="loading"></div>');
}

function loading_hide(){

	$('.loading').remove();
}


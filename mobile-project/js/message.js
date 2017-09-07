
var messageHTMl="",
	message= document.getElementById("message").innerHTML;

function Message(page){
	var option={
		url:MoonduDomain+'/MessageInfo/GetLsMsgInfo',
		data:{page:page,pagesize:20},
		callback: function(data){
			if(data.Result==true){
				var data=data.Data.Rows;
				if(data.length>0){
					for(var i=0;i<data.length;i++){
						if(data[i].Context!=null){
							var template=new EJS({"text":message});
			 				messageHTMl += template.render(data[i]);
						}	
			 		}
					$(".massage-detail ul").html(messageHTMl);
				}
				else{
					$(".noMessage").removeClass("hidden");
					$(".massage-detail").attr("data-page","0");
				}
				$(".massage-detail").attr("data-loading","0");
				
			}
			
		}
	}
	$.md.ajaxurl(option);
}

	Message(1);

//=========================瀑布流======================================
		
		$(window).scroll(function () {

			totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

			 if ($(document).height() <= totalheight){

				page=parseInt($(".massage-detail").attr("data-page"));
				loading=parseInt($(".massage-detail").attr("data-loading"));

				if(page>0 && loading==0){
					$(".massage-detail").attr("data-page",page+1);
					$(".massage-detail").attr("data-loading","1");
					Message($(".massage-detail").attr("data-page"));
				}

			}
		});


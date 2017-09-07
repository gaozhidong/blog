//底部导航

foot_html = new EJS({url: 'views/includes/footer.ejs'}).render(foot_nav);
$(".foot_bar").html(foot_html);
c_url=window.location.href.split("/")
			_url=c_url[c_url.length-1];
			$(".foot_bar a").each(function(i) {
			_this=$(this);
			_aurl=_this.attr("href");
			
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

$(".add").on("click", function(){
	 if($(".find-sign").size()==0){
		 $("body").append(pub_html);
	 }
	});
		$(".foot_bar").before(" ");
		var mask = $("#mask");
		//签到
		$("body").on("click",".sign",function(){
			$("#dialog").removeClass("hidden");
			getExperienceBySignAjax();
		});
		$("body").on("click","#dialog footer",function(){
			$("#dialog").addClass("hidden");
		})
		$("body").on("click",'.find-close',function(){

			$(".find-sign").remove();
		});

	  pub_html=	'<header class="find-sign ">'+
			'<div class="wrap clearfix">'+
				'<a class="common content fl" href="release.html">'+
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
	var dialogHTML ="<div class='cover'></div>"+
					"<section class='find-dialog'>"+
						"<hgroup>签到成功！</hgroup>"+
						"<script type='text/template' id='signTemplate'>"+
							"<p class='sign-ranking'>今天签到第<span>125</span>名</p>"+
							"<p class='experience-add'>经验+<span>6</span></p>"+
							"<p class='experience-value'>经验值<span>1253</span>/<span>2000</span><span class='grade'>6级</span></p>"+
						"</script>"+
						"<footer>确定</footer>"+
					"</section>";
	//获取当前用户的信息
	var userInfor = {};
	function getCurrentUserInforAjax(){
		 var option={
				url:MoonduDomain+'/Home/ShareUserInfos',
				callback:function(res){
					if (res.Result == "nologin") {
						//$.alert("请您重新登录！");
						location.href = "login_after.html";
					};
				/*	if (res.Result) {
						userInfor.name = res.Data.UserNick;
						userInfor.portrait = res.Data.IMAGE;
						userInfor.id = res.Data.Uid;
					};*/
				}
			}
		$.md.ajaxurl(option);
	}
	getCurrentUserInforAjax();

	//签到获取经验值
	function getExperienceBySignAjax(){
		var html = '';
		var sign = document.getElementById("signTemplate");
		var temp = new EJS({"text": sign});
		var userId = userInfor.id;
		$.ajax({
		 	url:MoonduDomain+'/Integral/SignIn',
			type:"GET",
			dataType:"jsonp",
			data:{uid:userId},
			success: function(res){
				//经验添加成功
				if (res.Result) {
					 $("#dialog").html(dialogHTML);
					 html = temp.render(res.Data);
				}else{
					$.alert(res.Msg);
				}
				
			},
			error:function(){
				console.log("fail");
			}
	 	});
	}









$(function(){

    var myHomeHTML="",
    myHome=document.getElementById("myHome").innerHTML;


    var option={
                url:MoonduDomain+'/UserCenter/GetUserInfo',
                callback:function(res){
                    var data=res.Data;
                    if (res.Result == "nologin") {
                        //$.alert("请您重新登录！");
                        $("#noimg").removeClass("hidden");
                        $(".p_my_top").on("click",".wrap_user_head",function(){
                            $.login("是否登录");
                        });
                        //location.href = "login_after.html";
                    };
                    if(data!=null){
                    var template = new EJS({"text":myHome});
                    myHomeHTML += template.render(data);
                    $(".p_my_top").html(myHomeHTML);
                    //===========判断男女图标=============
                    if(data.Sex==0){
                        $(".p_my_top").find("a.wrap").append('<img class="sex_ico" src="images/femail.png">');
                     }
                     else{
                         $(".p_my_top").find("a.wrap").append('<img class="sex_ico" src="images/man_03.png">');
                     }

                     if(data.Image==""||data.Image=="http://zoneimages.moonbasa.com/images/user.jpg"){
                    
                        $(".p_my_top").find(".wrap_user_head").attr("src","images/user.jpg");
                     }
                }
              
                }
        }
        $.md.ajaxurl(option);   

})



        
$(function(){
    var user_info=document.getElementById("user_info").innerHTML;
        infoHead=document.getElementById("infoHead").innerHTML;
        infoHTML="",
        headHTML="";
        var id = $.getUrlVar('id');
        var Ugids="";


    //================判断当前页面用户是否已经登录=============
    function getCurrentUserInforAjax(){
         var option={
                url:MoonduDomain+'/UserCenter/GetUserInfo',
                callback:function(res){
                    if (res.Result == "nologin") {
                        $.login("是否登录");
                    };
                    if(res.Result){
                        infoTa();
                        //=====================返回上一级==================

                         $(".person_top").on("click",".person_top_ico",function(){
                                str2=$.getUrlVar('reurl');          
                                str2 = str2.replaceAll('||','?').replaceAll('__','=').replaceAll('#','&');            
                                window.location.href = str2;
                        })

                    }
                }
            }
        $.md.ajaxurl(option);
    }
    getCurrentUserInforAjax();



    
//==========================基本信息模板渲染====================

    function infoTa() {
        var option={
            url:MoonduDomain+'/UserCenter/GetUserInfo',
            data:{uid:id},
            callback: function(data){   
                data=data.Data;
                Ugids=data.Gids;
                var template = new EJS({"text":user_info});
                infoHTML += template.render(data);

                var template1 = new EJS({"text": infoHead});
                headHTML += template1.render(data);

                $(".person_top").append(headHTML);
                $(".p_form_info form").html(infoHTML);

                //=============判断男女===============
                if (data.Sex==0) {
                    $("#s_sex").html("女")
                }
                else{
                    $("#s_sex").html("男")
                }

                //=============判断星座===============
                var horo=data.Cid;
                if(horo==0){
                    $("#s_horo").html("");
                }
                switch (horo){
                            case 1:
                                $("#s_horo").html("白羊座");
                                break;
                            case 2:
                                $("#s_horo").html("狮子座");
                                break;
                            case 3:
                                $("#s_horo").html("双子座");
                                break;
                            case 4:
                                $("#s_horo").html("天蝎座");
                                break;
                            case 5:
                                $("#s_horo").html("水瓶座");
                                break;
                            case 6:
                                $("#s_horo").html("金牛座");
                                break;
                            case 7:
                                $("#s_horo").html("巨蟹座");
                                break;
                            case 8:
                                $("#s_horo").html("天秤座");
                                break;
                            case 9:
                                $("#s_horo").html("双鱼座");
                                break;
                            case 10:
                                $("#s_horo").html("处女座");
                                break;
                            case 11:
                                $("#s_horo").html("摩羯座");
                                break;
                            case 12:
                                $("#s_horo").html("射手座");
                                break;

                            }



                    //===========所在帮派==============
                        if(Ugids.indexOf(40)>-1){
                            $(".p_form_info").find("#s_camp").append(" 星秀场 ");
                        }
                        if(Ugids.indexOf(41)>-1){
                            $(".p_form_info").find("#s_camp").append(" 搭配帮 ");
                        }
                        if(Ugids.indexOf(42)>-1){
                            $(".p_form_info").find("#s_camp").append(" 设计党 ");
                        }

                    //==========默认头像==============
                    if (data.Image == ""||data.Image=="http://zoneimages.moonbasa.com/images/user.jpg") {
                        $(".p_form_info").find(".p_user_head img").attr("src", "images/user.jpg");
                    }

                getAge();
                        
            }
        }
        $.md.ajaxurl(option);
    }

//========================根据出生日期计算年龄==================
    function getAge(){
                    var age;
                    var aDate=new Date();
                    var thisYear=aDate.getFullYear();
                    var thisMonth=aDate.getMonth()+1;
                    var thisDay=aDate.getDate();
                    var brith=document.getElementById("age").value;
                    brithy=brith.substr(0,4);
                    brithm=brith.substr(5,2);
                    brithd=brith.substr(7,2);
                    if(thisYear-brithy<0)
                    {
                           $.alert("输入错误!");
                           age="";
                    }
                    else
                    {
                        age = thisYear-brithy;

                    }
                    document.getElementById("age").value=age;
    }

}) 

// JavaScript Document

$(function(){
    var html="";
    var showTemp=document.getElementById("showTemp").innerHTML;
    var showTag="";
    var showUid="";
    var showPid="";
    var showId="";
    var showPhoto=new Array();
    var upShow="";
    var uid="";
    var aid="";
    var title="";

    //var id = $.getUrlVar('id');

//================判断当前页面用户是否已经登录=============
    function getCurrentUserInforAjax(){
         var option={
                url:MoonduDomain+'/UserCenter/GetUserInfo',
                callback:function(res){
                    if (res.Result == "nologin") {
                        $.login("是否登录");
                    };
                    if(res.Result){
                        uid=res.Data.Uid;
                        myShow(0);
                      
                        //========================更新封面================

                        $(".show_box").on("click",".updatePic",function(){
                                var cur=$(this).index();
                                $(this).parent(".picLsit").find(".updatePic").removeClass("borderStyle");
                                $(this).addClass("borderStyle");
                                upShow=$(this).find("img").attr("id");
                                
                        })

                        $(".show_edit").on("click",function(){
                            set();
                        })
        
                    }
                }
            }
        $.md.ajaxurl(option);
    }
    getCurrentUserInforAjax();
    




function myShow(){
    var option={
        url:MoonduDomain+'/Mshow/Details',
        callback: function(data){
            if (data.Result == false) {
                $(".p_show").addClass("hidden");
                $(".noShow").removeClass("hidden");
             }
            else{    
                data=data.Data;
                $(".p_show").removeClass("hidden");
                showTag=data.UserInfo.Tag;
                showUid=data.UserInfo.Uid;
                showId=data.Id;
                aid=data.AID;
                showPid=data.PID;
                showUrl=data.Img_Url;
                var template = new EJS({"text": showTemp});
                html += template.render(data);
                $(".show_box").html(html);
                Title();
                var photoArr=data.Photols;
                if(photoArr.length==0){
                    $(".show_box").find(".picLsit").append($('<div class="updatePic">'+'<img src="'+showUrl+'" id="'+showPid+'">'+'</div>'));
                }else{
                    for(i=0;i<photoArr.length;i++){
                        $(".show_box").find(".picLsit").append($('<div class="updatePic">'+'<img src="'+photoArr[i].PHOTO+'" id="'+photoArr[i].PhotoID+'">'+'</div>'));
                    } 
                }                     
            }  
            
        }
    }
    $.md.ajaxurl(option);
}



//==================上传照片=========================
$(".show_tags").on("click", "#datepicker1", function () {
    $.alert("请前去应用中心下载梦族官方应用");
//     if(uid!=" "){           
//          TakePhoto.prototype.takePhoto(
//                'date',
//                function(r){
//                    var r=$.parseJSON(r);
//                    if(r.Result==true){
//                        var photo=r.Data.PHOTO;
//                        pid=r.Data.PID;
//                        Photos=ImgDomain+photo;
//                        //===================添加图片=================
//                        //Photos="http://zoneimages.moonbasa.com/31919428/150721140342_88633.jpg";
//                        var temp='<div class="updatePic">'+'<img src="'+Photos+'" class="addimg" id="'+pid+'">'+'</div>';
//                       
//                        $(".show_box").find(".picLsit").append($(temp)); 
//                        $.ajax({
//                            url:MoonduDomain+'/photo/addphoto',
//                            data:{pid:pid,dec:title},
//                            type:"GET",
//                            dataType:"jsonp",                                               
//                            success:function(data){
//                               
//                            }
//                       })                                                   
//                    }
//                    else{
//                        $.alert("上传照片失败！");
//                    }
//                },
//                function(e){                      
//                },
//                 [{"key":"123","cuscode":uid,"scode":"789","hphoto":"2","aid":aid,"upurl":MoonduDomain}]
//            );
//         }
    });

    //=========更新封面ajax============
    function set(){
        var option={
            url:MoonduDomain+'/Mshow/SetCover',
            data:{signupid:showId,photoid:upShow},
            callback: function(data){   
                if(data.Result==true){
                    $.alert("封面设置成功！");
                    $(".show_box").find(".updatePic").removeClass("borderStyle");
                }
                else if(upShow==showPid){
                    $.alert("请选择新的封面图");
                    $(".show_box").find(".updatePic").removeClass("borderStyle");
                }
                else{
                    $.alert("请先选择图片");
                    $(".show_box").find(".updatePic").removeClass("borderStyle");
                }
              }
       }
       $.md.ajaxurl(option);
    }


    function Title(){
       $.ajax({
            url:MoonduDomain+'/Mshow/GetCurrMshow',
            type:"GET",
            dataType:"jsonp",
            success:function(data){
               title=data.Data.Title;
                $(".show_box").find("h2").html(title);
            }
       })
    }
    

})  



    






















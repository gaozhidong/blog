//================相册模板渲染=============================
var photoListHTML="",
    photoList=document.getElementById("photoList").innerHTML;

    //================判断当前页面用户是否已经登录=============
  function getCurrentUserInforAjax(){
     var option={
        url:MoonduDomain+'/UserCenter/GetUserInfo',
        callback:function(res){
          if (res.Result == "nologin") {
            $.login("是否登录");
          };
          if(res.Result){
              photo_list(1);
          }
        }
      }
    $.md.ajaxurl(option);
  }
  getCurrentUserInforAjax();

function photo_list(page){
    var option={
      url:MoonduDomain+'/photo/GetUserTagByUid',
      data:{page:page,pagesize:10},
      callback: function(data){       
          data=data.Data.Rows;
          if(data==""&&page<=1){
              $("#like_photo_area").addClass("hidden");
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
              $(".like_photo_area").attr("data-page","0");
          }
              $(".like_photo_area").attr("data-loading","0");
          loading_hide();
          
      }
    }
    $.md.ajaxurl(option);
}



//=========================瀑布流==============================

$(window).scroll(function () {

   totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
   page=parseInt($(".like_photo_area").attr("data-page"));
   loading=parseInt($(".like_photo_area").attr("data-loading"));
     if ($(document).height() <= totalheight) {
        //loading_show();
        if(page>0 && loading==0){
            $(".like_photo_area").attr("data-page",page+1);
            $(".like_photo_area").attr("data-loading","1");
            photo_list( $(".like_photo_area").attr("data-page"));
        }
    }
});


//加载时候显示


function loading_show(){

    $("body").append('<div class="loading"></div>');
}
function loading_hide(){
   $(".loading").remove();
}





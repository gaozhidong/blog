//================相册模板渲染=============================
var photoListHTML="",
    photoList=document.getElementById("photoList").innerHTML;
function photo_list(page)
{
    $.ajax({
    url:MoonduDomain+'/photo/GetUserTagByUid',
    type:"GET",
    dataType:"jsonp",
    Data:{uid:"110",page:"1"},
    success: function(data){       
        data=data.Data.Rows;
        console.log(data);
        if(data.length>0){
            for(var i=0;i<data.length;i++){
                    var template=new EJS({"text":photoList});
                    photoListHTML += template.render(data[i]);
                }
                 $(".like_photo_area ul").append(photoListHTML);
             
        }
        else{
            $(".like_photo_area").attr("data_page","0");
        }
            $(".like_photo_area").attr("data-loading","0");
        loading_hide();
        
    }
});
}

photo_list(1);

//=========================瀑布流==============================

$(window).scroll(function () {

   totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
   page=parseInt($(".like_photo_area").attr("data-page"));
   loading=parseInt($(".like_photo_area").attr("data-loading"));
     if ($(document).height() <= totalheight) {
        loading_show();
        if(page>0 && loading==0){
            $(".like_photo_area").attr("data-page",page+1);
            $(".like_photo_area").attr("data-loading","1");
            photo_list(page);
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




